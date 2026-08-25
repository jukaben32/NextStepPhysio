'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, PlaySquare, UserPlus } from 'lucide-react'
import type { Client, ExerciseVideo, PrescribedExerciseWithClient } from '@/types'
import { ExerciseVideoModal } from './ExerciseVideoModal'
import { AssignExerciseModal } from './AssignExerciseModal'

export function ExercisesManager({
  initialVideos,
  initialPrescriptions,
  clients,
}: {
  initialVideos: ExerciseVideo[]
  initialPrescriptions: PrescribedExerciseWithClient[]
  clients: Client[]
}) {
  const [videos, setVideos] = useState(initialVideos)
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions)
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<ExerciseVideo | undefined>(undefined)
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleVideoSaved(video: ExerciseVideo) {
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id)
      return exists ? prev.map((v) => (v.id === video.id ? video : v)) : [...prev, video]
    })
    setVideoModalOpen(false)
    setEditingVideo(undefined)
  }

  async function handleDeleteVideo(video: ExerciseVideo) {
    if (!window.confirm(`¿Eliminar "${video.title}"? Esto también quitará las asignaciones a pacientes.`)) return
    const res = await fetch(`/api/exercise-videos/${video.id}`, { method: 'DELETE' })
    if (res.ok) {
      setVideos((prev) => prev.filter((v) => v.id !== video.id))
      setPrescriptions((prev) => prev.filter((p) => p.exercise_video_id !== video.id))
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'No se pudo eliminar el video')
    }
  }

  function handleAssigned(exercise: PrescribedExerciseWithClient) {
    setPrescriptions((prev) => [exercise, ...prev])
    setAssignModalOpen(false)
  }

  async function handleUnassign(id: string) {
    const res = await fetch(`/api/prescribed-exercises/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPrescriptions((prev) => prev.filter((p) => p.id !== id))
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? 'No se pudo quitar la asignación')
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-[var(--text-1)]">Biblioteca de videos</h2>
          <button
            className="btn-primary !text-xs"
            onClick={() => {
              setEditingVideo(undefined)
              setVideoModalOpen(true)
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Nuevo video
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="card-surface p-6 text-center">
            <PlaySquare className="w-5 h-5 text-[var(--text-4)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-3)]">Todavía no has agregado videos de ejercicios.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videos.map((video) => (
              <div key={video.id} className="card-surface p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-1)] truncate">{video.title}</p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">
                      {[video.category, video.duration_seconds ? `${Math.round(video.duration_seconds / 60)} min` : null]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingVideo(video)
                        setVideoModalOpen(true)
                      }}
                      aria-label="Editar"
                      className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--teal-700)] hover:bg-[var(--teal-50)]"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video)}
                      aria-label="Eliminar"
                      className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {video.description && <p className="text-xs text-[var(--text-3)] mt-2 line-clamp-2">{video.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-[var(--text-1)]">Ejercicios asignados</h2>
          <button className="btn-secondary !text-xs" onClick={() => setAssignModalOpen(true)} disabled={videos.length === 0}>
            <UserPlus className="w-3.5 h-3.5" /> Asignar a paciente
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <div className="card-surface p-6 text-center">
            <p className="text-sm text-[var(--text-3)]">Todavía no has asignado ejercicios a ningún paciente.</p>
          </div>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-[var(--text-3)] border-b border-[var(--border)]">
                  <th className="text-left font-semibold px-3.5 py-2">Paciente</th>
                  <th className="text-left font-semibold px-3.5 py-2">Ejercicio</th>
                  <th className="text-left font-semibold px-3.5 py-2 hidden sm:table-cell">Series / Reps</th>
                  <th className="text-left font-semibold px-3.5 py-2 hidden sm:table-cell">Frecuencia</th>
                  <th className="text-right font-semibold px-3.5 py-2">Quitar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {prescriptions.map((p) => (
                  <tr key={p.id}>
                    <td className="px-3.5 py-2.5 text-[var(--text-1)]">{p.client?.name ?? '—'}</td>
                    <td className="px-3.5 py-2.5 text-[var(--text-2)]">{p.video?.title ?? '—'}</td>
                    <td className="px-3.5 py-2.5 text-[var(--text-2)] hidden sm:table-cell">
                      {p.sets ?? '—'} × {p.reps ?? '—'}
                    </td>
                    <td className="px-3.5 py-2.5 text-[var(--text-2)] hidden sm:table-cell">{p.frequency ?? '—'}</td>
                    <td className="px-3.5 py-2.5 text-right">
                      <button
                        onClick={() => handleUnassign(p.id)}
                        aria-label="Quitar asignación"
                        className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-red-600 hover:bg-red-50 inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {videoModalOpen && (
        <ExerciseVideoModal
          video={editingVideo}
          onClose={() => {
            setVideoModalOpen(false)
            setEditingVideo(undefined)
          }}
          onSaved={handleVideoSaved}
        />
      )}

      {assignModalOpen && (
        <AssignExerciseModal
          clients={clients}
          videos={videos}
          onClose={() => setAssignModalOpen(false)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  )
}
