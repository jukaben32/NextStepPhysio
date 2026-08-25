import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { listRecoveryLogsForClientUser, listPrescribedExercisesForClientUser } from '@/services/clientPortal'
import { PortalNav } from '@/components/PortalNav'
import { PortalProgress } from '@/components/PortalProgress'

export default async function PortalProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const admin = createAdminClient()
  const [logs, exercises] = await Promise.all([
    listRecoveryLogsForClientUser(admin, user.id),
    listPrescribedExercisesForClientUser(admin, user.id),
  ])

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)]">
      <PortalNav />
      <PortalProgress initialLogs={logs} initialExercises={exercises} />
    </div>
  )
}
