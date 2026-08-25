'use client'

import { useState } from 'react'
import { HeartPulse, PlaySquare } from 'lucide-react'
import type { RecoveryLog, PrescribedExerciseWithVideo } from '@/types'
import { formatDateTime } from '@/lib/formatDate'

export function PortalProgress({
  initialLogs,
  initialExercises,
}: {
  initialLogs: RecoveryLog[]
  initialExercises: PrescribedExerciseWithVideo[]
}) {
  const [logs] = useState(initialLogs)
  const [exercises] = useState(initialExercises)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div>
        <h1 className="font-display text-xl font-semibold text-[var(--text-1)]">My Progress</h1>
        <p className="text-sm text-[var(--text-3)] mt-1">Your recovery check-ins and prescribed exercises.</p>
      </div>

      <section className="space-y-3">
        <p className="text-xs font-semibold tracking-wide text-[var(--text-3)]">RECOVERY LOG · {logs.length}</p>
        {logs.length === 0 ? (
          <div className="card-raised p-6 text-center">
            <HeartPulse className="w-5 h-5 text-[var(--text-4)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-3)]">Your clinic hasn't logged any progress check-ins yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id} className="card-raised p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-[var(--text-3)]">{formatDateTime(log.logged_at)}</p>
                  <div className="flex items-center gap-3 text-xs">
                    {log.pain_level != null && (
                      <span className="badge border-transparent bg-[var(--teal-50)] text-[var(--teal-800)]">
                        Pain {log.pain_level}/10
                      </span>
                    )}
                    {log.mobility_score != null && (
                      <span className="badge border-transparent bg-[var(--teal-50)] text-[var(--teal-800)]">
                        Mobility {log.mobility_score}/100
                      </span>
                    )}
                  </div>
                </div>
                {log.notes && <p className="text-sm text-[var(--text-2)] mt-2">{log.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold tracking-wide text-[var(--text-3)]">PRESCRIBED EXERCISES · {exercises.length}</p>
        {exercises.length === 0 ? (
          <div className="card-raised p-6 text-center">
            <PlaySquare className="w-5 h-5 text-[var(--text-4)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-3)]">No exercises have been assigned to you yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {exercises.map((ex) => (
              <a
                key={ex.id}
                href={ex.video?.video_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="card-raised p-4 flex items-center gap-3 hover:bg-[var(--bg-raised)] transition-colors"
              >
                <span className="grid place-items-center w-10 h-10 rounded-lg bg-[var(--teal-50)] text-[var(--teal-700)] shrink-0">
                  <PlaySquare className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--text-1)] truncate">{ex.video?.title ?? 'Exercise'}</p>
                  <p className="text-xs text-[var(--text-3)] mt-0.5">
                    {[ex.sets ? `${ex.sets} sets` : null, ex.reps ? `${ex.reps} reps` : null, ex.frequency]
                      .filter(Boolean)
                      .join(' · ') || '—'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
