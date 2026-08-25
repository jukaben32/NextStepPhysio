import type { AiAgent, Business, BusinessService, KnowledgeDocument, PlatformKnowledgeDocument, RealtimeTool } from '@/types'
import { formatKnowledgeForPrompt } from '@/services/knowledge'

// Tool definitions handed to the OpenAI Realtime session. Execution happens
// server-side in POST /api/ai/tools — the browser only ever holds an
// ephemeral client secret, never the service-role key, so every tool call
// the model makes is relayed there instead of hitting Supabase directly.
export const REALTIME_TOOLS: RealtimeTool[] = [
  {
    type: 'function',
    name: 'search_services',
    description:
      'Search this clinic\'s programs and treatments (physical therapy evaluations, post-surgery rehab, sports ' +
      'injury recovery, manual therapy, etc.) by name or maximum price. Use this whenever the caller asks what ' +
      'programs are offered, how much something costs, or how long a session takes.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Free-text match against the program name, e.g. "sports injury recovery"' },
        maxPrice: { type: 'number' },
      },
    },
  },
  {
    type: 'function',
    name: 'get_service_details',
    description: 'Get full details (price, duration, description) for one program or treatment by its exact name.',
    parameters: {
      type: 'object',
      properties: { serviceName: { type: 'string' } },
      required: ['serviceName'],
    },
  },
  {
    type: 'function',
    name: 'check_availability',
    description: 'Check the next available appointment slots for this clinic, optionally near a preferred date.',
    parameters: {
      type: 'object',
      properties: { preferredDate: { type: 'string', description: 'ISO date, optional' } },
    },
  },
  {
    type: 'function',
    name: 'book_appointment',
    description:
      'Book an appointment once the caller has picked a slot returned by check_availability, chosen a program, ' +
      'and you have their name and phone number.',
    parameters: {
      type: 'object',
      properties: {
        serviceName: { type: 'string' },
        datetime: { type: 'string', description: 'ISO 8601 datetime, must be a slot from check_availability' },
        clientName: { type: 'string' },
        clientPhone: { type: 'string' },
      },
      required: ['datetime', 'clientName', 'clientPhone'],
    },
  },
  {
    type: 'function',
    name: 'capture_lead',
    description:
      'Save the caller as a lead once you have their name and phone number, even if they do not book an appointment ' +
      'right away — e.g. they are asking about programs or availability first.',
    parameters: {
      type: 'object',
      properties: {
        clientName: { type: 'string' },
        clientPhone: { type: 'string' },
      },
      required: ['clientName', 'clientPhone'],
    },
  },
  {
    type: 'function',
    name: 'request_callback',
    description:
      'Use this when the caller asks to be called back by a human instead of continuing with you — e.g. they want ' +
      'to speak to a person, have a clinical question you cannot answer, or a booking issue you cannot resolve. ' +
      'Requires their name and phone number. This notifies the clinic immediately; it does not book an appointment.',
    parameters: {
      type: 'object',
      properties: {
        clientName: { type: 'string' },
        clientPhone: { type: 'string' },
        reason: { type: 'string', description: 'Brief reason for the callback, in the caller\'s own words' },
        preferredTime: { type: 'string', description: 'When they would like to be called back, if mentioned' },
      },
      required: ['clientName', 'clientPhone'],
    },
  },
]

function summarizeService(s: BusinessService): string {
  const price =
    s.price_type === 'call_for_price'
      ? 'call for price'
      : s.price_type === 'price_range' && s.price_max
        ? `$${s.price}–$${s.price_max}`
        : s.price_type === 'starting_at'
          ? `from $${s.price}`
          : s.price != null
            ? `$${s.price}`
            : 'price on request'
  return `- ${s.name}: ${price}, ~${s.duration_minutes} min${s.description ? ` — ${s.description}` : ''}`
}

export function buildSystemPrompt(opts: {
  business: Business
  agent: AiAgent
  services: BusinessService[]
  assignedServiceIds?: Set<string>
  knowledgeDocs?: KnowledgeDocument[]
  platformKnowledgeDocs?: PlatformKnowledgeDocument[]
  channel?: 'voice' | 'text'
}): string {
  const {
    business,
    agent,
    services,
    assignedServiceIds,
    knowledgeDocs = [],
    platformKnowledgeDocs = [],
    channel = 'voice',
  } = opts
  const knowledgeText = formatKnowledgeForPrompt(knowledgeDocs)
  const platformKnowledgeText = formatKnowledgeForPrompt(platformKnowledgeDocs)
  const mediumInstruction =
    channel === 'voice'
      ? 'Keep responses short and conversational — this is a phone call, not a chat.'
      : 'Keep responses short — this is a WhatsApp chat. Use plain text (no markdown), short paragraphs, ' +
        'and at most one relevant emoji per message, only when it fits naturally.'

  // assignedServiceIds is a ranking hint, never an access filter — every
  // program here is something this agent CAN and MUST discuss if asked.
  // Splitting into "your specialty" vs "also offered" lets the agent lead
  // with its specialty while browsing, without ever refusing a real program
  // this clinic actually offers.
  const active = services.filter((s) => s.is_active)
  const hasSplit = !!assignedServiceIds?.size && active.some((s) => assignedServiceIds.has(s.id))
  const primary = hasSplit ? active.filter((s) => assignedServiceIds!.has(s.id)) : active
  const secondary = hasSplit ? active.filter((s) => !assignedServiceIds!.has(s.id)) : []

  const serviceSummaries = !active.length
    ? 'No programs are currently marked active.'
    : hasSplit
      ? [
          'Your specialty programs — lead with these when the caller is browsing without something specific in mind:',
          primary.map(summarizeService).join('\n'),
          secondary.length
            ? [
                '',
                'Other programs this clinic offers — not your specialty, but still real offerings. If the caller asks',
                'about one of these by name, answer fully and help them book it exactly like your own — never say you',
                "don't have it or don't know about it:",
                secondary.map(summarizeService).join('\n'),
              ].join('\n')
            : '',
        ]
          .filter(Boolean)
          .join('\n')
      : active.map(summarizeService).join('\n')

  return [
    `You are ${agent.name}, the ${agent.specialty} for ${business.name}, a physical rehabilitation and sports medicine clinic.`,
    `Personality: ${agent.personality}. ${mediumInstruction}`,
    `Today's date is ${new Date().toISOString().slice(0, 10)}. When the caller says "tomorrow", "next Friday", etc.,`,
    'convert it to a real YYYY-MM-DD date yourself before passing it as preferredDate to check_availability — never',
    'pass the relative word itself, and never guess a date without doing this math.',
    agent.greeting_message ? `Open the conversation with: "${agent.greeting_message}"` : '',
    '',
    'You can discuss the following programs and treatments (use search_services / get_service_details for specifics instead of guessing):',
    serviceSummaries,
    '',
    'When the caller wants to book, use check_availability to find a real open slot before proposing a time, confirm',
    'which program they want, then confirm their name and phone number before calling book_appointment. If they are',
    'not ready to book, still call capture_lead once you have their name and phone number so the clinic can follow up.',
    'If the caller asks to speak with a human, or has a clinical question you cannot answer, call request_callback',
    'with their name and phone number instead of guessing or leaving the conversation unresolved.',
    'Never diagnose a condition, prescribe a treatment plan, or give specific medical advice yourself — you can',
    'describe what a program generally involves, but any assessment of the caller\'s own injury or condition needs',
    'a licensed clinician, so offer to book an evaluation or use request_callback instead.',
    "Never invent program names, prices, durations, or availability that the tools did not return. And never refuse",
    'to discuss or claim ignorance of a program that is actually offered above — a caller asking about a real',
    'program or describing a real injury is a patient in need, and losing them to a scripted "I don\'t have that',
    'information" is the one mistake this clinic cannot afford.',
    platformKnowledgeText
      ? [
          '',
          'General knowledge (applies to every clinic on this platform — not specific to this business):',
          platformKnowledgeText,
        ].join('\n')
      : '',
    knowledgeText
      ? ['', 'Clinic knowledge base (policies, process notes specific to this clinic):', knowledgeText].join('\n')
      : '',
    platformKnowledgeText || knowledgeText
      ? [
          '',
          'Only state policy or informational facts that appear verbatim in the sections above. If the caller asks',
          'something not covered there, say you are not sure and offer request_callback instead of guessing.',
        ].join('\n')
      : '',
  ]
    .filter(Boolean)
    .join('\n')
}
