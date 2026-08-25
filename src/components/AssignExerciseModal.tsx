'use client'

import { useState } from 'react'
import type { Client, ExerciseVideo, PrescribedExerciseWithClient } from '@/types'

export function AssignExerciseModal({
  clients,
  videos,
  onClose,
  onAssigned,
}: {
  clients: Client[]
  videos: ExerciseVideo[]
  onClose: () => void
  onAssigned: (exercise: PrescribedExerciseWithClient) => void
}) {
  const [clientId, setClientId] = useState('')
  const [exerciseVideoId, setExerciseVideoId] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [frequency, setFrequency] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSaving(true)
    setError(null)
    const res = await fetch('/api/prescribed-exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        exerciseVideoId,
        sets: sets === '' ? undefined : Number(sets),
        reps: reps === '' ? undefined : Number(reps),
        frequency: frequency || undefined,
        notes: notes || undefined,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error ?? 'No se pudo asignar el ejercicio')
      return
    }
    onAssigned(data.exercise)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-raised w-full max-w-sm p-5 space-y-4">
        <h3 className="font-display font-semibold text-lg text-[var(--text-1)]">Asignar ejercicio</h3>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Paciente</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="input-field w-full mt-1">
              <option value="">Selecciona un paciente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Ejercicio</span>
            <select value={exerciseVideoId} onChange={(e) => setExerciseVideoId(e.target.value)} className="input-field w-full mt-1">
              <option value="">Selecciona un video</option>
              {videos.map((v) => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-3)]">Series</span>
              <input type="number" min={0} value={sets} onChange={(e) => setSets(e.target.value)} className="input-field w-full mt-1" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-3)]">Repeticiones</span>
              <input type="number" min={0} value={reps} onChange={(e) => setReps(e.target.value)} className="input-field w-full mt-1" />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Frecuencia</span>
            <input
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="Ej. 3 veces por semana"
              className="input-field w-full mt-1"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Notas</span>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field w-full mt-1" />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving || !clientId || !exerciseVideoId}>
            {saving ? 'Guardando...' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  )
}
