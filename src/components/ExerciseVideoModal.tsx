'use client'

import { useState } from 'react'
import type { ExerciseVideo } from '@/types'

export function ExerciseVideoModal({
  video,
  onClose,
  onSaved,
}: {
  video?: ExerciseVideo
  onClose: () => void
  onSaved: (video: ExerciseVideo) => void
}) {
  const [title, setTitle] = useState(video?.title ?? '')
  const [description, setDescription] = useState(video?.description ?? '')
  const [videoUrl, setVideoUrl] = useState(video?.video_url ?? '')
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnail_url ?? '')
  const [category, setCategory] = useState(video?.category ?? '')
  const [durationSeconds, setDurationSeconds] = useState(video?.duration_seconds?.toString() ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSaving(true)
    setError(null)

    const payload = {
      title,
      description: description || undefined,
      videoUrl,
      thumbnailUrl: thumbnailUrl || undefined,
      category: category || undefined,
      durationSeconds: durationSeconds === '' ? undefined : Number(durationSeconds),
      isActive: video?.is_active ?? true,
      sortOrder: video?.sort_order ?? 0,
    }

    const res = video
      ? await fetch(`/api/exercise-videos/${video.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: payload.title,
            description: payload.description ?? null,
            video_url: payload.videoUrl,
            thumbnail_url: payload.thumbnailUrl ?? null,
            category: payload.category ?? null,
            duration_seconds: payload.durationSeconds ?? null,
          }),
        })
      : await fetch('/api/exercise-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar el video')
      return
    }
    onSaved(data.video)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-raised w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 className="font-display font-semibold text-lg text-[var(--text-1)]">
          {video ? 'Editar video' : 'Nuevo video de ejercicio'}
        </h3>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Título</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field w-full mt-1" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Descripción</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input-field w-full mt-1" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">URL del video</span>
            <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." className="input-field w-full mt-1" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">URL de miniatura (opcional)</span>
            <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." className="input-field w-full mt-1" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-3)]">Categoría</span>
              <input value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-full mt-1" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-[var(--text-3)]">Duración (seg.)</span>
              <input
                type="number"
                min={0}
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(e.target.value)}
                className="input-field w-full mt-1"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving || !title || !videoUrl}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
