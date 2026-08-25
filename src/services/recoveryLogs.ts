import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import type { RecoveryLogWithClient } from '@/types'
import type { RecoveryLogInput } from '@/validations'

type DB = SupabaseClient<Database>

const RECOVERY_LOG_SELECT = '*, clients(id, name, phone, email)'

export async function listRecoveryLogsForBusiness(
  supabase: DB,
  businessId: string
): Promise<RecoveryLogWithClient[]> {
  const { data, error } = await supabase
    .from('recovery_logs')
    .select(RECOVERY_LOG_SELECT)
    .eq('business_id', businessId)
    .order('logged_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as RecoveryLogWithClient[]
}

export async function listRecoveryLogsForClient(
  supabase: DB,
  businessId: string,
  clientId: string
): Promise<RecoveryLogWithClient[]> {
  const { data, error } = await supabase
    .from('recovery_logs')
    .select(RECOVERY_LOG_SELECT)
    .eq('business_id', businessId)
    .eq('client_id', clientId)
    .order('logged_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as unknown as RecoveryLogWithClient[]
}

export async function createRecoveryLog(
  supabase: DB,
  businessId: string,
  loggedBy: string,
  input: RecoveryLogInput
) {
  const { data, error } = await supabase
    .from('recovery_logs')
    .insert({
      business_id: businessId,
      client_id: input.clientId,
      appointment_id: input.appointmentId || null,
      pain_level: input.painLevel ?? null,
      mobility_score: input.mobilityScore ?? null,
      notes: input.notes || null,
      logged_by: loggedBy,
    })
    .select(RECOVERY_LOG_SELECT)
    .single()
  if (error) throw error
  return data as unknown as RecoveryLogWithClient
}
