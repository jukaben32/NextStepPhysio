import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getAvailableSlots, createAppointment } from '@/services/appointments'
import { findOrCreateClientByPhone } from '@/services/clients'
import { getSubscription } from '@/services/businesses'
import { appendMessage, recordConversationOutcome } from '@/services/conversations'
import { sendAppointmentConfirmationEmail, sendNewAppointmentOwnerEmail } from '@/services/email'
import type { Client, PlanId } from '@/types'

type DB = SupabaseClient<Database>

// Shared by both transports the AI agent runs over: the OpenAI Realtime relay
// (POST /api/ai/tools, called by the browser widget/voice call) and the
// WhatsApp text-mode agent (src/ai/textAgent.ts, called in-process). Business
// logic — booking an appointment, capturing a lead, etc. — must behave
// identically regardless of which channel the caller used, so it lives here once.
export async function executeAiTool(
  supabase: DB,
  ctx: { conversationId: string; businessId: string; agentId?: string | null; clientSource?: Client['source'] },
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  const { conversationId, businessId, clientSource = 'ai_call' } = ctx

  switch (name) {
    case 'search_services': {
      let query = supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true)

      if (args.query) query = query.ilike('name', `%${args.query}%`)
      if (args.maxPrice) query = query.lte('price', args.maxPrice as number)

      const { data, error: searchError } = await query.order('sort_order', { ascending: true }).limit(10)
      if (searchError) throw searchError

      await appendMessage(
        supabase,
        businessId,
        conversationId,
        'system',
        `search_services(${JSON.stringify(args)}) -> ${(data ?? []).length} result(s)`
      )
      return { services: data ?? [] }
    }

    case 'get_service_details': {
      // A caller naming a specific program is a specific, real inquiry —
      // always answer it in full, regardless of which agent's specialty it
      // falls under. See buildSystemPrompt for why.
      const { data, error: serviceError } = await supabase
        .from('business_services')
        .select('*')
        .eq('business_id', businessId)
        .ilike('name', args.serviceName as string)
        .maybeSingle()
      if (serviceError) throw serviceError
      return { service: data ?? null }
    }

    case 'check_availability': {
      // The model is instructed to convert relative dates ("mañana") to
      // YYYY-MM-DD itself, but it's still free-text from a live voice/WhatsApp
      // conversation — an unparseable value (e.g. it passes "mañana" verbatim)
      // must not crash the whole request, just fall back to "starting now".
      const parsedDate = args.preferredDate ? new Date(args.preferredDate as string) : undefined
      const fromDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : undefined
      const slots = await getAvailableSlots(supabase, businessId, { fromDate })
      return { slots: slots.slice(0, 10) }
    }

    case 'book_appointment': {
      const subscription = await getSubscription(supabase, businessId)
      const plan: PlanId = (subscription?.plan as PlanId) ?? 'free'

      const client = await findOrCreateClientByPhone(supabase, businessId, {
        name: args.clientName as string,
        phone: args.clientPhone as string,
        source: clientSource,
      })

      let serviceId: string | undefined
      let serviceName: string | undefined
      if (args.serviceName) {
        const { data: service } = await supabase
          .from('business_services')
          .select('id, name')
          .eq('business_id', businessId)
          .ilike('name', args.serviceName as string)
          .maybeSingle()
        serviceId = service?.id
        serviceName = service?.name
      }

      const appointment = await createAppointment(supabase, businessId, plan, {
        serviceId,
        clientId: client.id,
        conversationId,
        scheduledAt: args.datetime as string,
      })

      await recordConversationOutcome(supabase, conversationId, { clientId: client.id, outcome: 'booked_viewing' })

      const { data: business } = await supabase
        .from('businesses')
        .select('name, contact_email')
        .eq('id', businessId)
        .maybeSingle()

      if (client.email && business?.name) {
        void sendAppointmentConfirmationEmail({
          to: client.email,
          clientName: client.name,
          businessName: business.name,
          scheduledAt: appointment.scheduled_at,
          serviceTitle: serviceName,
        }).catch(() => {})
      }

      if (business?.contact_email && business?.name) {
        void sendNewAppointmentOwnerEmail({
          to: business.contact_email,
          businessName: business.name,
          clientName: client.name,
          clientPhone: client.phone ?? undefined,
          clientEmail: client.email ?? undefined,
          serviceName,
          scheduledAt: appointment.scheduled_at,
        }).catch(() => {})
      }

      return { booked: true, appointment }
    }

    case 'capture_lead': {
      const client = await findOrCreateClientByPhone(supabase, businessId, {
        name: args.clientName as string,
        phone: args.clientPhone as string,
        source: clientSource,
      })

      await recordConversationOutcome(supabase, conversationId, { clientId: client.id, outcome: 'qualified_lead' })

      return { captured: true, clientId: client.id }
    }

    case 'request_callback': {
      const client = await findOrCreateClientByPhone(supabase, businessId, {
        name: args.clientName as string,
        phone: args.clientPhone as string,
        source: clientSource,
      })

      // 'escalated' is the outcome the dashboard's "Callbacks solicitados" stat
      // counts — see recordConversationOutcome / OUTCOME_RANK.
      await recordConversationOutcome(supabase, conversationId, { clientId: client.id, outcome: 'escalated' })

      const bodyParts = [
        client.phone ? `Tel: ${client.phone}` : null,
        (args.reason as string | undefined) ?? null,
        args.preferredTime ? `Prefiere: ${args.preferredTime}` : null,
      ]
      await supabase.from('notifications').insert({
        business_id: businessId,
        type: 'system',
        title: `Callback solicitado — ${client.name}`,
        body: bodyParts.filter(Boolean).join(' · ') || null,
      })

      return { requested: true, clientId: client.id }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}
