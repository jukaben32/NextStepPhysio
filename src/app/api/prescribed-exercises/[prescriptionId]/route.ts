import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForOwner } from '@/services/businesses'
import { deletePrescribedExercise } from '@/services/prescribedExercises'

async function requireBusiness() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' as const }
  const business = await getBusinessForOwner(supabase, user.id)
  if (!business) return { error: 'No business for this user' as const }
  return { supabase, business }
}

export async function DELETE(_request: Request, props: { params: Promise<{ prescriptionId: string }> }) {
  const params = await props.params
  const ctx = await requireBusiness()
  if ('error' in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 })
  await deletePrescribedExercise(ctx.supabase, ctx.business.id, params.prescriptionId)
  return NextResponse.json({ ok: true })
}
