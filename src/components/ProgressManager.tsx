'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, UsersRound, Plus, Activity, HeartPulse } from 'lucide-react'
import type { Client, RecoveryLogWithClient } from '@/types'
import { formatDateTime } from '@/lib/formatDate'

export function ProgressManager({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Client | null>(null)
  const [logs, setLogs] = useState<RecoveryLogWithClient[]>([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search) return clients
    const q = search.toLowerCase()
    return clients.filter((c) => `${c.name} ${c.phone ?? ''} ${c.email ?? ''}`.toLowerCase().includes(q))
  }, [clients, search])

  useEffect(() => {
    if (!selected) return
    setLoading(true)
    fetch(`/api/recovery-logs?clientId=${selected.id}`)
      .then((res) => res.json())
      .then((data) => setLogs(data.logs ?? []))
      .finally(() => setLoading(false))
  }, [selected])

  function handleLogged(log: RecoveryLogWithClient) {
    setLogs((prev) => [log, ...prev])
    setFormOpen(false)
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-5">
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-4)]" />
          <input
            placeholder="Buscar paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field w-full !pl-8"
          />
        </div>
        <div className="max-h-[28rem] overflow-y-auto divide-y divide-[var(--border)] card-surface">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => setSelected(client)}
              className={`w-full text-left px-3 py-2.5 hover:bg-[var(--bg-raised)] transition-colors ${
                selected?.id === client.id ? 'bg-[var(--teal-50)]' : ''
              }`}
            >
              <p className="text-sm font-medium text-[var(--text-1)] truncate">{client.name}</p>
              <p className="text-xs text-[var(--text-3)] truncate">{client.phone ?? client.email ?? 'Sin contacto'}</p>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <UsersRound className="w-5 h-5 text-[var(--text-4)]" />
              <p className="text-sm text-[var(--text-3)]">Ningún paciente coincide.</p>
            </div>
          )}
        </div>
      </div>

      <div>
        {!selected ? (
          <div className="card-surface p-8 flex flex-col items-center justify-center gap-2 text-center h-full">
            <Activity className="w-6 h-6 text-[var(--text-4)]" />
            <p className="text-sm text-[var(--text-3)]">Selecciona un paciente para ver su progreso.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-[var(--text-1)]">{selected.name}</p>
                <p className="text-xs text-[var(--text-3)]">{logs.length} {logs.length === 1 ? 'registro' : 'registros'}</p>
              </div>
              <button className="btn-primary !text-xs" onClick={() => setFormOpen(true)}>
                <Plus className="w-3.5 h-3.5" /> Nuevo registro
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-[var(--text-3)]">Cargando...</p>
            ) : logs.length === 0 ? (
              <div className="card-surface p-6 text-center">
                <HeartPulse className="w-5 h-5 text-[var(--text-4)] mx-auto mb-2" />
                <p className="text-sm text-[var(--text-3)]">Todavía no hay registros de progreso para este paciente.</p>
              </div>
            ) : (
              <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wide text-[var(--text-3)] border-b border-[var(--border)]">
                      <th className="text-left font-semibold px-3.5 py-2">Fecha</th>
                      <th className="text-left font-semibold px-3.5 py-2">Dolor (0–10)</th>
                      <th className="text-left font-semibold px-3.5 py-2">Movilidad (0–100)</th>
                      <th className="text-left font-semibold px-3.5 py-2">Notas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="px-3.5 py-2.5 whitespace-nowrap text-[var(--text-1)]">{formatDateTime(log.logged_at)}</td>
                        <td className="px-3.5 py-2.5 text-[var(--text-2)]">{log.pain_level ?? '—'}</td>
                        <td className="px-3.5 py-2.5 text-[var(--text-2)]">{log.mobility_score ?? '—'}</td>
                        <td className="px-3.5 py-2.5 text-[var(--text-3)] max-w-xs truncate">{log.notes ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {formOpen && selected && (
        <NewRecoveryLogModal clientId={selected.id} onClose={() => setFormOpen(false)} onLogged={handleLogged} />
      )}
    </div>
  )
}

function NewRecoveryLogModal({
  clientId,
  onClose,
  onLogged,
}: {
  clientId: string
  onClose: () => void
  onLogged: (log: RecoveryLogWithClient) => void
}) {
  const [painLevel, setPainLevel] = useState('')
  const [mobilityScore, setMobilityScore] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setSaving(true)
    setError(null)
    const res = await fetch('/api/recovery-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        painLevel: painLevel === '' ? undefined : Number(painLevel),
        mobilityScore: mobilityScore === '' ? undefined : Number(mobilityScore),
        notes: notes || undefined,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error ?? 'No se pudo guardar el registro')
      return
    }
    onLogged(data.log)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="card-raised w-full max-w-sm p-5 space-y-4">
        <h3 className="font-display font-semibold text-lg text-[var(--text-1)]">Nuevo registro de progreso</h3>

        <div className="space-y-3">
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Nivel de dolor (0–10)</span>
            <input
              type="number"
              min={0}
              max={10}
              value={painLevel}
              onChange={(e) => setPainLevel(e.target.value)}
              className="input-field w-full mt-1"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Movilidad (0–100)</span>
            <input
              type="number"
              min={0}
              max={100}
              value={mobilityScore}
              onChange={(e) => setMobilityScore(e.target.value)}
              className="input-field w-full mt-1"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[var(--text-3)]">Notas</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="input-field w-full mt-1"
            />
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
