import { PlaySquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForOwner } from '@/services/businesses'
import { listExerciseVideosForBusiness } from '@/services/exerciseVideos'
import { listPrescribedExercisesForBusiness } from '@/services/prescribedExercises'
import { listClientsForBusiness } from '@/services/clients'
import { ExercisesManager } from '@/components/ExercisesManager'

export default async function ExercisesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const business = await getBusinessForOwner(supabase, user!.id)
  if (!business) return null

  const [videos, prescriptions, clients] = await Promise.all([
    listExerciseVideosForBusiness(supabase, business.id),
    listPrescribedExercisesForBusiness(supabase, business.id),
    listClientsForBusiness(supabase, business.id),
  ])

  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-[var(--teal-50)] text-[var(--teal-700)] grid place-items-center shrink-0">
          <PlaySquare className="w-4 h-4" />
        </span>
        <div>
          <h1 className="font-display font-semibold text-xl text-[var(--text-1)]">Videos de ejercicios</h1>
          <p className="text-sm text-[var(--text-3)]">
            Administra tu biblioteca de ejercicios y asígnalos a tus pacientes.
          </p>
        </div>
      </div>
      <ExercisesManager initialVideos={videos} initialPrescriptions={prescriptions} clients={clients} />
    </div>
  )
}
