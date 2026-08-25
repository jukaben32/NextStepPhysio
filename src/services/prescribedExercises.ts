import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { PrescribedExerciseWithClient, PrescribedExerciseWithVideo } from '@/types'
import type { PrescribedExerciseInput } from '@/validations'

type DB = SupabaseClient<Database>

const PRESCRIBED_EXERCISE_SELECT =
  '*, exercise_videos(id, title, video_url, thumbnail_url, duration_seconds, category), clients(id, name, phone, email)'

export async function listPrescribedExercisesForBusiness(
  supabase: DB,
  businessId: string
): Promise<PrescribedExerciseWithClient[]> {
  const { data, error } = await supabase
    .from('prescribed_exercises')
    .select(PRESCRIBED_EXERCISE_SELECT)
    .eq('business_id', businessId)
    .order('assigned_at', { ascending: false })
  if (error) throw error
  return mapRows(data) as PrescribedExerciseWithClient[]
}

export async function listPrescribedExercisesForClient(
  supabase: DB,
  businessId: string,
  clientId: string
): Promise<PrescribedExerciseWithVideo[]> {
  const { data, error } = await supabase
    .from('prescribed_exercises')
    .select(PRESCRIBED_EXERCISE_SELECT)
    .eq('business_id', businessId)
    .eq('client_id', clientId)
    .order('assigned_at', { ascending: false })
  if (error) throw error
  return mapRows(data)
}

// select() returns the joined FK table under its own name (exercise_videos) —
// remapped to `video` here to match PrescribedExerciseWithVideo everywhere else.
function mapRows(rows: unknown): PrescribedExerciseWithClient[] {
  return ((rows ?? []) as Array<Record<string, unknown>>).map((row) => {
    const { exercise_videos, ...rest } = row
    return { ...rest, video: exercise_videos } as PrescribedExerciseWithClient
  })
}

export async function createPrescribedExercise(
  supabase: DB,
  businessId: string,
  input: PrescribedExerciseInput
) {
  const { data, error } = await supabase
    .from('prescribed_exercises')
    .insert({
      business_id: businessId,
      client_id: input.clientId,
      exercise_video_id: input.exerciseVideoId,
      sets: input.sets ?? null,
      reps: input.reps ?? null,
      frequency: input.frequency || null,
      notes: input.notes || null,
    })
    .select(PRESCRIBED_EXERCISE_SELECT)
    .single()
  if (error) throw error
  return mapRows([data])[0]
}

export async function deletePrescribedExercise(supabase: DB, businessId: string, id: string) {
  const { error } = await supabase
    .from('prescribed_exercises')
    .delete()
    .eq('business_id', businessId)
    .eq('id', id)
  if (error) throw error
}
