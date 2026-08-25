import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { ExerciseVideo } from '@/types'
import type { ExerciseVideoInput } from '@/validations'

type DB = SupabaseClient<Database>

export async function listExerciseVideosForBusiness(
  supabase: DB,
  businessId: string
): Promise<ExerciseVideo[]> {
  const { data, error } = await supabase
    .from('exercise_videos')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createExerciseVideo(
  supabase: DB,
  businessId: string,
  input: ExerciseVideoInput
): Promise<ExerciseVideo> {
  const { data, error } = await supabase
    .from('exercise_videos')
    .insert({
      business_id: businessId,
      title: input.title,
      description: input.description || null,
      video_url: input.videoUrl,
      thumbnail_url: input.thumbnailUrl || null,
      category: input.category || null,
      duration_seconds: input.durationSeconds ?? null,
      is_active: input.isActive,
      sort_order: input.sortOrder,
    })
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function updateExerciseVideo(
  supabase: DB,
  businessId: string,
  videoId: string,
  patch: Partial<ExerciseVideo>
): Promise<ExerciseVideo> {
  const { data, error } = await supabase
    .from('exercise_videos')
    .update(patch)
    .eq('business_id', businessId)
    .eq('id', videoId)
    .select('*')
    .single()
  if (error) throw error
  return data
}

export async function deleteExerciseVideo(supabase: DB, businessId: string, videoId: string) {
  const { error } = await supabase
    .from('exercise_videos')
    .delete()
    .eq('business_id', businessId)
    .eq('id', videoId)
  if (error) throw error
}
