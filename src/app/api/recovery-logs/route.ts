import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForOwner } from '@/services/businesses'
import { listRecoveryLogsForClient, createRecoveryLog } from '@/services/recoveryLogs'
import { recoveryLogSchema } from '@/validations'

async function requireBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' as const }
  const business = await getBusinessForOwner(supabase, user.id)
  if (!business) return { error: 'No business for this user' as const }
  return { supabase, business, userId: user.id }
}

export async function GET(request: Request) {
  const ctx = await requireBusiness()
  if ('error' in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 })

  const clientId = new URL(request.url).searchParams.get('clientId')
  if (!clientId) return NextResponse.json({ error: 'clientId is required' }, { status: 400 })

  const logs = await listRecoveryLogsForClient(ctx.supabase, ctx.business.id, clientId)
  return NextResponse.json({ logs })
}

export async function POST(request: Request) {
  const ctx = await requireBusiness()
  if ('error' in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 })

  const body = await request.json()
  const parsed = recoveryLogSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const log = await createRecoveryLog(ctx.supabase, ctx.business.id, ctx.userId, parsed.data)
  return NextResponse.json({ log })
}
