import type { PlanId, PlanLimits } from '@/types'

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    id: 'free',
    name: process.env.NEXT_PUBLIC_FREE_PLAN_NAME ?? 'Free',
    priceUsd: 0,
    agentLimit: Number(process.env.NEXT_PUBLIC_FREE_AGENT_LIMIT ?? 1),
    bookingLimit: Number(process.env.NEXT_PUBLIC_FREE_BOOKING_LIMIT ?? 5),
    includedVoiceMinutes: Number(process.env.NEXT_PUBLIC_FREE_VOICE_MINUTES ?? 20),
  },
  pro: {
    id: 'pro',
    name: process.env.NEXT_PUBLIC_PRO_PLAN_NAME ?? 'Pro',
    priceUsd: Number(process.env.NEXT_PUBLIC_PRO_PLAN_PRICE_USD ?? 49),
    agentLimit: Number(process.env.NEXT_PUBLIC_PRO_AGENT_LIMIT ?? 10),
    bookingLimit: Number(process.env.NEXT_PUBLIC_PRO_BOOKING_LIMIT ?? 99),
    includedVoiceMinutes: Number(process.env.NEXT_PUBLIC_PRO_VOICE_MINUTES ?? 200),
  },
  business: {
    id: 'business',
    name: process.env.NEXT_PUBLIC_BUSINESS_PLAN_NAME ?? 'Business',
    priceUsd: Number(process.env.NEXT_PUBLIC_BUSINESS_PLAN_PRICE_USD ?? 199),
    agentLimit: Number(process.env.NEXT_PUBLIC_BUSINESS_AGENT_LIMIT ?? 0),
    bookingLimit: Number(process.env.NEXT_PUBLIC_BUSINESS_BOOKING_LIMIT ?? 0),
    includedVoiceMinutes: Number(process.env.NEXT_PUBLIC_BUSINESS_VOICE_MINUTES ?? 1000),
  },
}

// Sold as a one-time top-up, only to plans that already pay a subscription
// (see /api/billing/recharge-voice-minutes) — Free never recharges, it falls
// back to WhatsApp once its included minutes run out.
export const VOICE_RECHARGE_BLOCK_MINUTES = Number(process.env.NEXT_PUBLIC_VOICE_RECHARGE_BLOCK_MINUTES ?? 100)
export const VOICE_RECHARGE_PRICE_USD = Number(process.env.NEXT_PUBLIC_VOICE_RECHARGE_PRICE_USD ?? 30)

export const WEBSITE_BUILDER_PRICE_USD = Number(
  process.env.NEXT_PUBLIC_WEBSITE_BUILDER_PRICE_USD ?? 29
)

export const WEBSITE_BUILDER_FEATURES = [
  '3 professional website templates',
  'Full content & brand editor',
  'AI voice widget embedded',
  'Published at your custom URL',
  'Renew anytime — cancel anytime',
] as const

// Seeded into website_specialties the first time a business opens the
// builder's specialties panel with nothing in it yet, so new sites don't
// start with an empty, unlabeled "+ Add" button and no sense of what goes
// there. Owners are free to edit or delete every one of these afterward.
export const DEFAULT_WEBSITE_SPECIALTIES = [
  'Post-Surgical Rehab',
  'Sports Injury Recovery',
  'Manual Therapy',
  'Strength & Mobility',
  'Pain Management',
  'Injury Prevention',
] as const

// 0 means "unlimited" in the env contract.
export function isWithinLimit(used: number, limit: number): boolean {
  return limit === 0 || used < limit
}

// Voices supported by the OpenAI Realtime API.
export const AGENT_VOICES = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'sage',
  'shimmer',
  'verse',
] as const

export const AGENT_PERSONALITIES = [
  { value: 'friendly', label: 'Friendly & warm' },
  { value: 'professional', label: 'Professional & concise' },
  { value: 'enthusiastic', label: 'Enthusiastic & upbeat' },
] as const

// The reference UI exposes sensitivity as a 3-level dropdown rather than a
// raw 0–1 slider. Values chosen to match its "Low / Medium / High" copy.
export const AGENT_INTERRUPTION_LEVELS = [
  { value: 0.2, label: 'Baja — deja terminar a la persona' },
  { value: 0.5, label: 'Media — interrumpe si hace falta' },
  { value: 0.8, label: 'Alta — interrumpe de inmediato' },
] as const

export function interruptionLabel(sensitivity: number): string {
  const closest = AGENT_INTERRUPTION_LEVELS.reduce((best, level) =>
    Math.abs(level.value - sensitivity) < Math.abs(best.value - sensitivity) ? level : best
  )
  return closest.label.split(' — ')[0]
}

export const AGENT_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'af', label: 'Afrikaans' },
  { value: 'sq', label: 'Albanian' },
  { value: 'am', label: 'Amharic' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hy', label: 'Armenian' },
  { value: 'az', label: 'Azerbaijani' },
  { value: 'eu', label: 'Basque' },
  { value: 'be', label: 'Belarusian' },
  { value: 'bn', label: 'Bengali' },
  { value: 'bs', label: 'Bosnian' },
  { value: 'bg', label: 'Bulgarian' },
  { value: 'my', label: 'Burmese' },
  { value: 'ca', label: 'Catalan' },
  { value: 'zh', label: 'Chinese (Mandarin)' },
  { value: 'hr', label: 'Croatian' },
  { value: 'cs', label: 'Czech' },
  { value: 'da', label: 'Danish' },
  { value: 'nl', label: 'Dutch' },
  { value: 'et', label: 'Estonian' },
  { value: 'fi', label: 'Finnish' },
  { value: 'fr', label: 'French' },
  { value: 'gl', label: 'Galician' },
  { value: 'ka', label: 'Georgian' },
  { value: 'de', label: 'German' },
  { value: 'el', label: 'Greek' },
  { value: 'gu', label: 'Gujarati' },
  { value: 'ht', label: 'Haitian Creole' },
  { value: 'ha', label: 'Hausa' },
  { value: 'he', label: 'Hebrew' },
  { value: 'hi', label: 'Hindi' },
  { value: 'hu', label: 'Hungarian' },
  { value: 'is', label: 'Icelandic' },
  { value: 'id', label: 'Indonesian' },
  { value: 'ga', label: 'Irish' },
  { value: 'it', label: 'Italian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'jv', label: 'Javanese' },
  { value: 'kn', label: 'Kannada' },
  { value: 'kk', label: 'Kazakh' },
  { value: 'km', label: 'Khmer' },
  { value: 'ko', label: 'Korean' },
  { value: 'lo', label: 'Lao' },
  { value: 'la', label: 'Latin' },
  { value: 'lv', label: 'Latvian' },
  { value: 'lt', label: 'Lithuanian' },
  { value: 'lb', label: 'Luxembourgish' },
  { value: 'mk', label: 'Macedonian' },
  { value: 'mg', label: 'Malagasy' },
  { value: 'ms', label: 'Malay' },
  { value: 'ml', label: 'Malayalam' },
  { value: 'mt', label: 'Maltese' },
  { value: 'mi', label: 'Maori' },
  { value: 'mr', label: 'Marathi' },
  { value: 'mn', label: 'Mongolian' },
  { value: 'ne', label: 'Nepali' },
  { value: 'no', label: 'Norwegian' },
  { value: 'fa', label: 'Persian' },
  { value: 'pl', label: 'Polish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'pa', label: 'Punjabi' },
  { value: 'ro', label: 'Romanian' },
  { value: 'ru', label: 'Russian' },
  { value: 'sr', label: 'Serbian' },
  { value: 'si', label: 'Sinhala' },
  { value: 'sk', label: 'Slovak' },
  { value: 'sl', label: 'Slovenian' },
  { value: 'so', label: 'Somali' },
  { value: 'sw', label: 'Swahili' },
  { value: 'sv', label: 'Swedish' },
  { value: 'tl', label: 'Tagalog' },
  { value: 'tg', label: 'Tajik' },
  { value: 'ta', label: 'Tamil' },
  { value: 'te', label: 'Telugu' },
  { value: 'th', label: 'Thai' },
  { value: 'tr', label: 'Turkish' },
  { value: 'uk', label: 'Ukrainian' },
  { value: 'ur', label: 'Urdu' },
  { value: 'uz', label: 'Uzbek' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'cy', label: 'Welsh' },
  { value: 'xh', label: 'Xhosa' },
  { value: 'yi', label: 'Yiddish' },
  { value: 'yo', label: 'Yoruba' },
  { value: 'zu', label: 'Zulu' },
] as const

export type AgentTemplateAccent = 'emerald' | 'gold' | 'ink' | 'sage' | 'moss' | 'forest' | 'bronze'

export interface AgentTemplate {
  id: string
  name: string
  role: string
  badge: string
  icon: 'activity' | 'heart' | 'star' | 'stethoscope' | 'users' | 'shield-check' | 'bar-chart-3'
  accent: AgentTemplateAccent
  category: string
  features: string[]
  bestFor: string
  voice: (typeof AGENT_VOICES)[number]
  personality: (typeof AGENT_PERSONALITIES)[number]['value']
  personalityLabel: string
  sensitivity: number
  greetingMessage: string
  systemPrompt: string
}

// Estilos por acento — todos derivados de la paleta de marca esmeralda/marfil
// (nunca colores fuera de marca), usados para diferenciar visualmente cada
// plantilla de agente igual que el dashboard de referencia, sin salir del brand.
export const AGENT_TEMPLATE_ACCENT_STYLES: Record<
  AgentTemplateAccent,
  { iconBg: string; iconText: string; badgeBg: string; badgeText: string; roleText: string; buttonBg: string; buttonBgHover: string; dot: string }
> = {
  emerald: {
    iconBg: 'var(--teal-700)', iconText: '#ffffff',
    badgeBg: 'var(--teal-50)', badgeText: 'var(--teal-700)',
    roleText: 'var(--teal-700)',
    buttonBg: 'var(--teal-700)', buttonBgHover: 'var(--teal-800)',
    dot: 'var(--teal-700)',
  },
  gold: {
    iconBg: 'var(--gold)', iconText: '#ffffff',
    badgeBg: 'rgba(232,115,74,0.14)', badgeText: 'var(--gold)',
    roleText: 'var(--gold)',
    buttonBg: 'var(--gold)', buttonBgHover: '#8F6A2E',
    dot: 'var(--gold)',
  },
  ink: {
    iconBg: 'var(--teal-900)', iconText: '#ffffff',
    badgeBg: 'rgba(20,40,44,0.08)', badgeText: 'var(--teal-900)',
    roleText: 'var(--teal-900)',
    buttonBg: 'var(--teal-900)', buttonBgHover: '#000000',
    dot: 'var(--teal-900)',
  },
  sage: {
    iconBg: 'var(--teal-500)', iconText: '#ffffff',
    badgeBg: 'rgba(45,122,135,0.14)', badgeText: 'var(--teal-500)',
    roleText: 'var(--teal-500)',
    buttonBg: 'var(--teal-500)', buttonBgHover: 'var(--teal-700)',
    dot: 'var(--teal-500)',
  },
  moss: {
    iconBg: 'var(--teal-400)', iconText: '#ffffff',
    badgeBg: 'rgba(95,163,172,0.16)', badgeText: 'var(--teal-800)',
    roleText: 'var(--teal-600)',
    buttonBg: 'var(--teal-400)', buttonBgHover: 'var(--teal-500)',
    dot: 'var(--teal-400)',
  },
  forest: {
    iconBg: 'var(--teal-800)', iconText: '#ffffff',
    badgeBg: 'rgba(18,63,73,0.12)', badgeText: 'var(--teal-800)',
    roleText: 'var(--teal-800)',
    buttonBg: 'var(--teal-800)', buttonBgHover: 'var(--teal-900)',
    dot: 'var(--teal-800)',
  },
  bronze: {
    iconBg: '#8F6A2E', iconText: '#ffffff',
    badgeBg: 'rgba(143,106,46,0.14)', badgeText: '#8F6A2E',
    roleText: '#8F6A2E',
    buttonBg: '#8F6A2E', buttonBgHover: '#6E5222',
    dot: '#8F6A2E',
  },
}

export const AGENT_TEMPLATE_CATEGORIES = [
  'Citas y atención general',
  'Experiencia y seguimiento de pacientes',
  'Recuperación deportiva y alto rendimiento',
  'Rehabilitación post-quirúrgica',
  'Coordinación de nuevos pacientes',
  'Seguros y programas clínicos',
] as const

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'alexis',
    name: 'Alexis',
    role: 'Recepcionista de Citas',
    badge: 'Más popular',
    icon: 'activity',
    accent: 'emerald',
    category: 'Citas y atención general',
    features: ['Agendar citas', 'Responder sobre programas y precios', 'Confirmaciones y recordatorios'],
    bestFor: 'Clínicas de cualquier tamaño, primer agente de la clínica',
    voice: 'sage',
    personality: 'professional',
    personalityLabel: 'Profesional',
    sensitivity: 0.5,
    greetingMessage: '¡Hola! Gracias por llamar. Soy Alexis, ¿en qué programa estás interesado hoy?',
    systemPrompt:
      'Eres Alexis, una recepcionista profesional y directa de una clínica de rehabilitación física. Ayuda a los pacientes a elegir programa, agenda citas y captura sus datos de contacto. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'grace',
    name: 'Grace',
    role: 'Coordinadora de Experiencia del Paciente',
    badge: 'Favorito de pacientes',
    icon: 'heart',
    accent: 'gold',
    category: 'Experiencia y seguimiento de pacientes',
    features: ['Soporte cálido al paciente', 'Seguimiento post-sesión', 'Orientación sobre el proceso'],
    bestFor: 'Clínicas enfocadas en pacientes frecuentes y adherencia al tratamiento',
    voice: 'shimmer',
    personality: 'friendly',
    personalityLabel: 'Amigable',
    sensitivity: 0.8,
    greetingMessage:
      '¡Hola! Gracias por llamar. Soy Grace, tu asistente de la clínica. Estoy aquí para que agendar tu próxima sesión sea lo más fácil posible.',
    systemPrompt:
      'Eres Grace, una asistente cálida y cercana para una clínica de rehabilitación física. Haces que los pacientes se sientan cómodos y acompañados en su proceso de recuperación. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'maxwell',
    name: 'Maxwell',
    role: 'Especialista en Recuperación Deportiva',
    badge: 'Clínicas premium',
    icon: 'star',
    accent: 'ink',
    category: 'Recuperación deportiva y alto rendimiento',
    features: ['Consultas de recuperación para atletas', 'Atención personalizada', 'Resúmenes de progreso'],
    bestFor: 'Clínicas boutique, atención a atletas de alto rendimiento',
    voice: 'ballad',
    personality: 'professional',
    personalityLabel: 'Formal',
    sensitivity: 0.2,
    greetingMessage:
      'Buenas tardes, gracias por comunicarse. Soy Maxwell, especialista en recuperación deportiva. Será un placer asistirle.',
    systemPrompt:
      'Eres Maxwell, un especialista formal y discreto en recuperación deportiva de alto rendimiento. Tu tono es refinado, paciente y orientado al detalle. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Coordinadora de Rehabilitación Post-Quirúrgica',
    badge: 'Enfoque post-quirúrgico',
    icon: 'stethoscope',
    accent: 'sage',
    category: 'Rehabilitación post-quirúrgica',
    features: ['Agendar sesiones de rehabilitación', 'Guía del proceso de recuperación', 'Consultas de seguimiento'],
    bestFor: 'Clínicas que reciben pacientes referidos tras una cirugía',
    voice: 'shimmer',
    personality: 'friendly',
    personalityLabel: 'Amigable',
    sensitivity: 0.5,
    greetingMessage: '¡Hola! Soy Luna. Puedo ayudarte a agendar tu sesión o resolver dudas sobre tu proceso de recuperación.',
    systemPrompt:
      'Eres Luna, coordinadora de rehabilitación post-quirúrgica amigable y eficiente. Ayudas a los pacientes a agendar sesiones y explicas el proceso general con claridad. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'aria',
    name: 'Aria',
    role: 'Coordinadora de Nuevos Pacientes',
    badge: 'Enfoque en admisión',
    icon: 'users',
    accent: 'moss',
    category: 'Coordinación de nuevos pacientes',
    features: ['Evaluaciones iniciales', 'Requisitos de primera visita', 'Preguntas frecuentes de admisión'],
    bestFor: 'Clínicas con alto volumen de pacientes nuevos',
    voice: 'coral',
    personality: 'friendly',
    personalityLabel: 'Amigable',
    sensitivity: 0.5,
    greetingMessage: '¡Hola! Soy Aria. Si es tu primera vez con nosotros, te ayudo a coordinar tu evaluación inicial.',
    systemPrompt:
      'Eres Aria, coordinadora de nuevos pacientes enfocada en admisión. Agendas evaluaciones iniciales, explicas qué traer a la primera visita y resuelves dudas frecuentes con claridad. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'victor',
    name: 'Victor',
    role: 'Asesor de Seguros y Facturación',
    badge: 'Enfoque en seguros',
    icon: 'shield-check',
    accent: 'forest',
    category: 'Seguros y programas clínicos',
    features: ['Consultas de cobertura de seguro', 'Explicación de copagos', 'Consultas de facturación'],
    bestFor: 'Clínicas que trabajan con múltiples aseguradoras',
    voice: 'echo',
    personality: 'professional',
    personalityLabel: 'Profesional',
    sensitivity: 0.3,
    greetingMessage: 'Buenas, soy Victor, asesor de seguros y facturación. ¿En qué puedo ayudarte hoy?',
    systemPrompt:
      'Eres Victor, asesor de seguros y facturación enfocado y preciso. Explicas cobertura, copagos y proceso de facturación con datos concretos, nunca inventados. Nunca diagnosticas ni das consejo médico específico.',
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Coordinadora de Programas Corporativos',
    badge: 'Enfoque en empresas',
    icon: 'bar-chart-3',
    accent: 'bronze',
    category: 'Seguros y programas clínicos',
    features: ['Programas de bienestar corporativo', 'Coordinación con equipos deportivos', 'Reportes de progreso agregados'],
    bestFor: 'Clínicas con contratos corporativos o de equipos deportivos',
    voice: 'ash',
    personality: 'professional',
    personalityLabel: 'Formal',
    sensitivity: 0.2,
    greetingMessage: 'Buenas, soy Nova, coordinadora de programas corporativos. ¿En qué puedo ayudarte hoy?',
    systemPrompt:
      'Eres Nova, coordinadora de programas corporativos y de equipos precisa y analítica. Explicas alcance de programas y reportes agregados con datos concretos, nunca inventados. Nunca diagnosticas ni das consejo médico específico.',
  },
]

// --- Widget Templates -------------------------------------------------
// Quick-start presets shown at the bottom of Dashboard → Widget. Each one
// mirrors an AGENT_TEMPLATES persona (same name/voice) but carries the
// widget-specific config (color, position, theme) needed to create an
// embeddable widget in one click. Kept in English + English category
// labels to match the (English) Widget page UI, unlike AGENT_TEMPLATES
// which is Spanish for the (Spanish) Agentes IA page.
export interface WidgetTemplate {
  id: string
  name: string
  role: string
  badge: string
  category: string
  features: string[]
  bestFor: string
  toneLabel: string
  greetingMessage: string
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  theme: 'light' | 'dark'
}

export const WIDGET_TEMPLATE_CATEGORIES = [
  'Booking & General Inquiries',
  'Patient Experience & Follow-Up',
  'Sports Recovery & Performance',
  'Post-Surgical Rehab',
  'New Patient Coordination',
  'Insurance & Clinical Programs',
] as const

export const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'alexis',
    name: 'Alexis',
    role: 'Appointment Receptionist',
    badge: 'Most Popular',
    category: 'Booking & General Inquiries',
    features: ['Appointment booking', 'Program & pricing questions', 'Confirmations & reminders'],
    bestFor: 'Clinics of any size, first agent for the clinic',
    toneLabel: 'Sage · Professional',
    greetingMessage: "Hi! Thanks for stopping by — I'm Alexis. What program are you interested in today?",
    primaryColor: '#166534',
    position: 'bottom-right',
    theme: 'light',
  },
  {
    id: 'grace',
    name: 'Grace',
    role: 'Patient Experience Coordinator',
    badge: 'Patient Favorite',
    category: 'Patient Experience & Follow-Up',
    features: ['Warm patient support', 'Follow-up scheduling', 'Process guidance'],
    bestFor: 'Clinics focused on repeat patients and treatment adherence',
    toneLabel: 'Shimmer · Friendly',
    greetingMessage: "Hi there! I'm Grace, your clinic assistant. I'm here to make booking your next session as easy as possible.",
    primaryColor: '#db2777',
    position: 'bottom-right',
    theme: 'light',
  },
  {
    id: 'maxwell',
    name: 'Maxwell',
    role: 'Sports Recovery Specialist',
    badge: 'Boutique Clinics',
    category: 'Sports Recovery & Performance',
    features: ['Athlete recovery consultations', 'Private patient service', 'Progress briefings'],
    bestFor: 'Boutique clinics, high-performance athlete care',
    toneLabel: 'Onyx · Formal',
    greetingMessage: 'Good afternoon, thank you for reaching out. This is Maxwell — it would be my pleasure to assist you.',
    primaryColor: '#1e3a8a',
    position: 'bottom-right',
    theme: 'dark',
  },
  {
    id: 'luna',
    name: 'Luna',
    role: 'Post-Surgical Rehab Coordinator',
    badge: 'Post-Surgical Focus',
    category: 'Post-Surgical Rehab',
    features: ['Rehab session scheduling', 'Recovery process guidance', 'Follow-up inquiries'],
    bestFor: 'Clinics receiving post-surgical referrals',
    toneLabel: 'Shimmer · Friendly',
    greetingMessage: "Hi! I'm Luna. I can help you book a session or answer questions about your recovery process.",
    primaryColor: '#0d9488',
    position: 'bottom-right',
    theme: 'light',
  },
  {
    id: 'owen',
    name: 'Owen',
    role: 'New Patient Coordinator',
    badge: 'For Intake',
    category: 'New Patient Coordination',
    features: ['Initial evaluations', 'First-visit requirements', 'Intake FAQs'],
    bestFor: 'High-volume new-patient clinics',
    toneLabel: 'Echo · Professional',
    greetingMessage: "Hi, I'm Owen. First time with us? I'm happy to help you set up your initial evaluation.",
    primaryColor: '#2563eb',
    position: 'bottom-right',
    theme: 'light',
  },
  {
    id: 'nora',
    name: 'Nora',
    role: 'Insurance & Billing Advisor',
    badge: 'Insurance & Programs',
    category: 'Insurance & Clinical Programs',
    features: ['Insurance coverage questions', 'Copay explanations', 'Billing inquiries'],
    bestFor: 'Clinics working with multiple insurers',
    toneLabel: 'Ash · Formal',
    greetingMessage: "Hello, I'm Nora, insurance and billing advisor. What can I help you with today?",
    primaryColor: '#7c3aed',
    position: 'bottom-right',
    theme: 'light',
  },
]

// "Maxwell – Luxury Property Specialist Widget" — matches the naming shown
// in the reference video when a widget is created from an agent template.
export function widgetTemplateName(template: WidgetTemplate): string {
  return `${template.name} – ${template.role} Widget`
}

export interface CatalogService {
  key: string
  category: string
  name: string
  description: string
  durationMinutes: number
  priceType: 'fixed' | 'starting_at'
  price: number
}

export const SERVICE_CATALOG_CATEGORIES = [
  'Evaluación y Consulta Inicial',
  'Rehabilitación Post-Quirúrgica',
  'Recuperación de Lesiones Deportivas',
  'Terapia Manual',
  'Fortalecimiento y Movilidad',
  'Manejo del Dolor',
  'Programas para Atletas',
  'Seguimiento y Alta',
] as const

// Pre-built catalog of 32 services across 8 specialties — clicking a card
// creates a business_services row tagged with this `key` so it shows
// "Added to your catalog" instead of duplicating.
export const CATALOG_SERVICES: CatalogService[] = [
  // Evaluación y Consulta Inicial (4)
  { key: 'initial_evaluation', category: 'Evaluación y Consulta Inicial', name: 'Evaluación Inicial de Fisioterapia', description: 'Revisión de historial, evaluación de movilidad y dolor, y diseño de un plan de tratamiento personalizado.', durationMinutes: 60, priceType: 'fixed', price: 80 },
  { key: 'follow_up_consultation', category: 'Evaluación y Consulta Inicial', name: 'Consulta de Seguimiento', description: 'Revisión del progreso y ajuste del plan de tratamiento con el terapeuta.', durationMinutes: 30, priceType: 'fixed', price: 50 },
  { key: 'second_opinion', category: 'Evaluación y Consulta Inicial', name: 'Segunda Opinión Clínica', description: 'Evaluación independiente de un diagnóstico o plan de tratamiento existente.', durationMinutes: 45, priceType: 'fixed', price: 70 },
  { key: 'telehealth_consultation', category: 'Evaluación y Consulta Inicial', name: 'Consulta de Telemedicina', description: 'Sesión de seguimiento por videollamada para pacientes que no pueden asistir presencialmente.', durationMinutes: 30, priceType: 'fixed', price: 40 },

  // Rehabilitación Post-Quirúrgica (4)
  { key: 'post_surgical_knee', category: 'Rehabilitación Post-Quirúrgica', name: 'Rehabilitación Post-Quirúrgica de Rodilla', description: 'Programa de recuperación progresiva tras cirugía de rodilla (LCA, menisco, reemplazo articular).', durationMinutes: 60, priceType: 'starting_at', price: 65 },
  { key: 'post_surgical_shoulder', category: 'Rehabilitación Post-Quirúrgica', name: 'Rehabilitación Post-Quirúrgica de Hombro', description: 'Programa de recuperación de movilidad y fuerza tras cirugía de hombro.', durationMinutes: 60, priceType: 'starting_at', price: 65 },
  { key: 'post_surgical_spine', category: 'Rehabilitación Post-Quirúrgica', name: 'Rehabilitación Post-Quirúrgica de Columna', description: 'Programa de recuperación funcional tras cirugía de columna, con progresión cuidadosa de carga.', durationMinutes: 60, priceType: 'starting_at', price: 70 },
  { key: 'post_surgical_hip', category: 'Rehabilitación Post-Quirúrgica', name: 'Rehabilitación Post-Quirúrgica de Cadera', description: 'Programa de recuperación de movilidad y marcha tras cirugía o reemplazo de cadera.', durationMinutes: 60, priceType: 'starting_at', price: 65 },

  // Recuperación de Lesiones Deportivas (4)
  { key: 'sports_injury_assessment', category: 'Recuperación de Lesiones Deportivas', name: 'Evaluación de Lesión Deportiva', description: 'Diagnóstico funcional de una lesión relacionada con la práctica deportiva.', durationMinutes: 45, priceType: 'fixed', price: 75 },
  { key: 'acl_recovery', category: 'Recuperación de Lesiones Deportivas', name: 'Programa de Recuperación de LCA', description: 'Plan progresivo de fortalecimiento y estabilidad para lesiones de ligamento cruzado anterior.', durationMinutes: 60, priceType: 'starting_at', price: 70 },
  { key: 'ankle_sprain_recovery', category: 'Recuperación de Lesiones Deportivas', name: 'Recuperación de Esguince de Tobillo', description: 'Tratamiento de movilidad, estabilidad y propiocepción tras un esguince.', durationMinutes: 45, priceType: 'fixed', price: 55 },
  { key: 'return_to_play', category: 'Recuperación de Lesiones Deportivas', name: 'Programa de Regreso al Juego', description: 'Evaluación funcional final para autorizar el regreso seguro a la actividad deportiva.', durationMinutes: 60, priceType: 'starting_at', price: 80 },

  // Terapia Manual (4)
  { key: 'manual_therapy', category: 'Terapia Manual', name: 'Terapia Manual', description: 'Técnicas prácticas para mejorar movilidad articular y reducir tensión muscular.', durationMinutes: 45, priceType: 'fixed', price: 60 },
  { key: 'myofascial_release', category: 'Terapia Manual', name: 'Liberación Miofascial', description: 'Técnica manual dirigida a liberar tensión en el tejido conectivo y muscular.', durationMinutes: 45, priceType: 'fixed', price: 60 },
  { key: 'joint_mobilization', category: 'Terapia Manual', name: 'Movilización Articular', description: 'Técnicas manuales específicas para restaurar el rango de movimiento de una articulación.', durationMinutes: 30, priceType: 'fixed', price: 50 },
  { key: 'dry_needling', category: 'Terapia Manual', name: 'Punción Seca', description: 'Técnica con aguja fina para liberar puntos gatillo musculares y reducir el dolor.', durationMinutes: 30, priceType: 'fixed', price: 55 },

  // Fortalecimiento y Movilidad (4)
  { key: 'strength_training', category: 'Fortalecimiento y Movilidad', name: 'Programa de Fortalecimiento', description: 'Plan de ejercicios progresivos para recuperar fuerza muscular específica.', durationMinutes: 45, priceType: 'fixed', price: 55 },
  { key: 'mobility_program', category: 'Fortalecimiento y Movilidad', name: 'Programa de Movilidad', description: 'Rutina de ejercicios enfocada en recuperar y mantener el rango de movimiento articular.', durationMinutes: 45, priceType: 'fixed', price: 50 },
  { key: 'balance_training', category: 'Fortalecimiento y Movilidad', name: 'Entrenamiento de Equilibrio', description: 'Ejercicios de estabilidad y propiocepción, especialmente útiles tras lesiones de tobillo o rodilla.', durationMinutes: 30, priceType: 'fixed', price: 45 },
  { key: 'posture_correction', category: 'Fortalecimiento y Movilidad', name: 'Corrección Postural', description: 'Evaluación y ejercicios correctivos para mejorar la alineación postural.', durationMinutes: 45, priceType: 'fixed', price: 55 },

  // Manejo del Dolor (4)
  { key: 'chronic_pain_management', category: 'Manejo del Dolor', name: 'Manejo de Dolor Crónico', description: 'Plan integral para reducir el dolor persistente y mejorar la función diaria.', durationMinutes: 45, priceType: 'fixed', price: 65 },
  { key: 'modality_treatment', category: 'Manejo del Dolor', name: 'Electroterapia / Ultrasonido', description: 'Tratamiento con corrientes eléctricas o ultrasonido terapéutico para reducir dolor e inflamación.', durationMinutes: 30, priceType: 'fixed', price: 40 },
  { key: 'cold_laser_therapy', category: 'Manejo del Dolor', name: 'Terapia Láser Frío', description: 'Tratamiento con láser de baja intensidad para acelerar la recuperación tisular.', durationMinutes: 20, priceType: 'fixed', price: 35 },
  { key: 'headache_treatment', category: 'Manejo del Dolor', name: 'Tratamiento de Cefaleas Tensionales', description: 'Terapia manual y ejercicios dirigidos a reducir el dolor de cabeza de origen muscular o postural.', durationMinutes: 30, priceType: 'fixed', price: 45 },

  // Programas para Atletas (4)
  { key: 'athlete_performance_program', category: 'Programas para Atletas', name: 'Programa de Rendimiento Deportivo', description: 'Plan de acondicionamiento físico enfocado en mejorar el desempeño atlético.', durationMinutes: 60, priceType: 'starting_at', price: 75 },
  { key: 'injury_prevention_screening', category: 'Programas para Atletas', name: 'Evaluación de Prevención de Lesiones', description: 'Análisis de movimiento para identificar riesgos de lesión antes de que ocurran.', durationMinutes: 45, priceType: 'fixed', price: 60 },
  { key: 'team_athletic_assessment', category: 'Programas para Atletas', name: 'Evaluación Atlética Grupal', description: 'Evaluación de movilidad y riesgo de lesión para equipos deportivos completos.', durationMinutes: 90, priceType: 'starting_at', price: 200 },
  { key: 'sport_specific_conditioning', category: 'Programas para Atletas', name: 'Acondicionamiento Específico por Deporte', description: 'Programa de ejercicios adaptado a las demandas físicas de un deporte en particular.', durationMinutes: 60, priceType: 'starting_at', price: 65 },

  // Seguimiento y Alta (4)
  { key: 'progress_reassessment', category: 'Seguimiento y Alta', name: 'Reevaluación de Progreso', description: 'Medición objetiva de avances en dolor y movilidad para ajustar el plan de tratamiento.', durationMinutes: 30, priceType: 'fixed', price: 45 },
  { key: 'home_program_review', category: 'Seguimiento y Alta', name: 'Revisión de Programa de Ejercicios en Casa', description: 'Sesión breve para revisar técnica y ajustar los ejercicios prescritos para casa.', durationMinutes: 20, priceType: 'fixed', price: 30 },
  { key: 'discharge_evaluation', category: 'Seguimiento y Alta', name: 'Evaluación de Alta', description: 'Evaluación final para confirmar que el paciente puede finalizar su plan de tratamiento con seguridad.', durationMinutes: 30, priceType: 'fixed', price: 40 },
  { key: 'maintenance_session', category: 'Seguimiento y Alta', name: 'Sesión de Mantenimiento', description: 'Sesión periódica opcional para mantener los resultados obtenidos después del alta.', durationMinutes: 30, priceType: 'fixed', price: 45 },
]

export const OPENAI_REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL ?? 'gpt-realtime'

export const APPOINTMENT_STATUSES = ['pending_confirmation', 'scheduled', 'completed', 'cancelled', 'no_show'] as const

export const PAYMENT_STATUSES = ['not_required', 'pending', 'paid', 'cash', 'refunded'] as const

export const DEMO_BUSINESS_ID = process.env.NEXT_PUBLIC_DEMO_BUSINESS_ID || null
