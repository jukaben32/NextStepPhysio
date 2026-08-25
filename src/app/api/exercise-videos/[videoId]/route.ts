import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForOwner } from '@/services/businesses'
import { updateExerciseVideo, deleteExerciseVideo } from '@/services/exerciseVideos'

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

export async function PATCH(request: Request, props: { params: Promise<{ videoId: string }> }) {
  const params = await props.params
  const ctx = await requireBusiness()
  if ('error' in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 })
  const patch = await request.json()
  const video = await updateExerciseVideo(ctx.supabase, ctx.business.id, params.videoId, patch)
  return NextResponse.json({ video })
}

export async function DELETE(_request: Request, props: { params: Promise<{ videoId: string }> }) {
  const params = await props.params
  const ctx = await requireBusiness()
  if ('error' in ctx) return NextResponse.json({ error: ctx.error }, { status: 401 })
  await deleteExerciseVideo(ctx.supabase, ctx.business.id, params.videoId)
  return NextResponse.json({ ok: true })
}
