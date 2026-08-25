'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface PublicService {
  id: string
  name: string
  price: number | null
  priceMax: number | null
  priceType: string | null
  durationMinutes: number | null
}

// This widget is public/client-facing and stays in English regardless of the
// dashboard's locale, so it formats price display itself rather than pulling
// in the Spanish-language dashboard helper.
function formatPublicServicePrice(s: Pick<PublicService, 'price' | 'priceMax' | 'priceType'>): string {
  if (s.priceType === 'call_for_price' || s.price == null) return 'Call for price'
  const price = `$${s.price.toLocaleString()}`
  if (s.priceType === 'price_range') {
    return s.priceMax != null ? `${price} - $${s.priceMax.toLocaleString()}` : price
  }
  if (s.priceType === 'starting_at') return `From ${price}`
  return price
}

// The "Book" tab of the floating widget: a single-page form (Full Name,
// Phone, Email, Program, Date & Time, Notes) — talks only to the public,
// unauthenticated /api/widget/public/[businessId]/{services,book} routes, so
// it works both embedded on a third-party site and on the public
// /sites/[slug] page.
export function WidgetBookingPanel({
  businessId,
  primaryColor,
  isDark,
}: {
  businessId: string
  primaryColor: string
  isDark: boolean
  agentId?: string | null
}) {
  const [services, setServices] = useState<PublicService[] | null>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    serviceId: '',
    scheduledAt: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<{ scheduledAt: string } | null>(null)

  useEffect(() => {
    fetch(`/api/widget/public/${businessId}/services`)
      .then((r) => r.json())
      .then((d) => setServices(d.services ?? []))
      .catch(() => setServices([]))
  }, [businessId])

  async function submitBooking(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/widget/public/${businessId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: form.serviceId || undefined,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          clientName: form.name,
          clientEmail: form.email,
          clientPhone: form.phone || undefined,
          notes: form.notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setConfirmed({ scheduledAt: data.appointment.scheduled_at })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const subtleText = isDark ? 'text-neutral-400' : 'text-neutral-500'
  const border = isDark ? 'border-neutral-700' : 'border-neutral-200'
  const inputCls = `w-full rounded-lg border px-3 py-2 text-sm bg-transparent ${border} ${
    isDark ? 'placeholder:text-neutral-500' : 'placeholder:text-neutral-400'
  }`
  const labelCls = `block text-[10px] font-semibold uppercase tracking-wide mb-1 ${subtleText}`

  if (confirmed) {
    const when = new Date(confirmed.scheduledAt)
    return (
      <div className="py-3 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 mx-auto" style={{ color: primaryColor }} />
        <p className="text-sm font-semibold">Appointment Requested!</p>
        <p className={`text-xs ${subtleText}`}>
          We will confirm your appointment for{' '}
          {when.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })}{' '}
          at{' '}
          {when.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
          .
        </p>
        <p className={`text-xs ${subtleText}`}>Check your email for confirmation details.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submitBooking} className="space-y-3 max-h-[70vh] overflow-y-auto pr-0.5">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={labelCls}>Full Name *</p>
          <input
            required
            className={inputCls}
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <p className={labelCls}>Phone</p>
          <input
            className={inputCls}
            placeholder="(555) 000-0000"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className={labelCls}>Email *</p>
        <input
          required
          type="email"
          className={inputCls}
          placeholder="jane@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={labelCls}>Program</p>
          <select
            className={`${inputCls} ${isDark ? '[color-scheme:dark]' : ''}`}
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
          >
            <option value="">— Select a program —</option>
            {services?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} · {formatPublicServicePrice(s)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className={labelCls}>Date &amp; Time *</p>
          <input
            required
            type="datetime-local"
            className={`${inputCls} ${isDark ? '[color-scheme:dark]' : ''}`}
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
          />
        </div>
      </div>

      <div>
        <p className={labelCls}>Notes</p>
        <textarea
          className={inputCls}
          placeholder="Tell us about your injury or recovery goals…"
          rows={2}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-40"
        style={{ backgroundColor: primaryColor }}
      >
        {submitting ? 'Booking…' : 'Book Appointment'}
      </button>
    </form>
  )
}
