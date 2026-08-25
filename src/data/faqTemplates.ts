// Static library shown in the "FAQ Templates" panel of the Knowledge page —
// a pre-written 40-question library across 9 rehab-clinic topics. `key` is
// persisted on the created knowledge_documents row (as `catalog_key`) so we
// can tell "already added" apart from a coincidentally-similar custom
// question.

export type FaqCategoryId =
  | 'booking'
  | 'programs_pricing'
  | 'cancellation_policy'
  | 'hours_location'
  | 'insurance_payment'
  | 'first_visit'
  | 'sports_injury'
  | 'progress_home_care'
  | 'general_policies'

export type FaqCategory = {
  id: FaqCategoryId
  label: string
}

export type FaqTemplate = {
  key: string
  categoryId: FaqCategoryId
  question: string
  answer: string
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: 'booking', label: 'Citas y reservas' },
  { id: 'programs_pricing', label: 'Programas y precios' },
  { id: 'cancellation_policy', label: 'Cancelaciones' },
  { id: 'hours_location', label: 'Horario y ubicación' },
  { id: 'insurance_payment', label: 'Seguros y pagos' },
  { id: 'first_visit', label: 'Primera visita' },
  { id: 'sports_injury', label: 'Lesiones deportivas' },
  { id: 'progress_home_care', label: 'Progreso y cuidado en casa' },
  { id: 'general_policies', label: 'Políticas generales' },
]

export const FAQ_TEMPLATES: FaqTemplate[] = [
  // Citas y reservas (5)
  {
    key: 'booking-schedule',
    categoryId: 'booking',
    question: '¿Cómo agendo una cita?',
    answer:
      'Puedes agendar directamente por teléfono, por nuestro chat o pidiéndole a nuestro agente de IA que te reserve un horario. Solo necesitamos el programa o motivo de consulta y tu disponibilidad.',
  },
  {
    key: 'booking-referral',
    categoryId: 'booking',
    question: '¿Necesito una referencia médica para agendar?',
    answer:
      'En la mayoría de los casos no es obligatoria, pero si tu seguro la requiere para cubrir el servicio, tráela a tu primera cita.',
  },
  {
    key: 'booking-duration',
    categoryId: 'booking',
    question: '¿Cuánto dura normalmente una cita?',
    answer:
      'La evaluación inicial suele durar entre 45 y 60 minutos; las sesiones de seguimiento entre 30 y 45 minutos, según el programa.',
  },
  {
    key: 'booking-multiple',
    categoryId: 'booking',
    question: '¿Puedo agendar varias sesiones a la vez?',
    answer:
      'Sí, muchos pacientes prefieren reservar su plan de sesiones semanales de una sola vez. Con gusto te ayudamos a organizar el calendario completo.',
  },
  {
    key: 'booking-late',
    categoryId: 'booking',
    question: '¿Qué pasa si llego tarde a mi cita?',
    answer:
      'Con hasta 10 minutos de retraso normalmente podemos atenderte sin problema. Pasado ese tiempo, es posible que debamos acortar la sesión para no afectar a los siguientes pacientes.',
  },

  // Programas y precios (5)
  {
    key: 'programs-menu',
    categoryId: 'programs_pricing',
    question: '¿Qué programas ofrecen?',
    answer:
      'Evaluación de fisioterapia, rehabilitación post-quirúrgica, recuperación de lesiones deportivas, terapia manual y programas de fortalecimiento y movilidad. Pregúntanos por el programa que mejor se ajuste a tu caso.',
  },
  {
    key: 'programs-price-range',
    categoryId: 'programs_pricing',
    question: '¿Cuánto cuestan las sesiones?',
    answer:
      'El costo varía según el programa y si tu seguro cubre parte del tratamiento. Te damos el precio exacto antes de agendar para que no haya sorpresas.',
  },
  {
    key: 'programs-sessions-needed',
    categoryId: 'programs_pricing',
    question: '¿Cuántas sesiones voy a necesitar?',
    answer:
      'Depende de tu diagnóstico y evolución. Después de la evaluación inicial, el terapeuta te da un estimado del número de sesiones recomendadas.',
  },
  {
    key: 'programs-duration-vary',
    categoryId: 'programs_pricing',
    question: '¿Por qué varía la duración de cada programa?',
    answer:
      'Una recuperación post-quirúrgica compleja requiere más tiempo que un programa de mantenimiento o prevención. Siempre te damos un estimado real antes de empezar.',
  },
  {
    key: 'programs-custom-plan',
    categoryId: 'programs_pricing',
    question: '¿El plan de tratamiento es personalizado?',
    answer:
      'Sí, cada plan se ajusta a tu diagnóstico, nivel de dolor y objetivos de recuperación — no usamos un protocolo genérico para todos los pacientes.',
  },

  // Cancelaciones (4)
  {
    key: 'cancel-notice',
    categoryId: 'cancellation_policy',
    question: '¿Cuál es su política de cancelación?',
    answer:
      'Puedes cancelar o reprogramar sin costo con al menos 2 horas de anticipación. Te lo agradecemos para poder ofrecer ese horario a otro paciente.',
  },
  {
    key: 'cancel-noshow',
    categoryId: 'cancellation_policy',
    question: '¿Qué pasa si no me presento a mi cita?',
    answer:
      'Entendemos que surgen imprevistos, pero las inasistencias repetidas sin aviso pueden afectar la continuidad de tu plan de recuperación y estar sujetas a un cargo.',
  },
  {
    key: 'reschedule',
    categoryId: 'cancellation_policy',
    question: '¿Puedo reprogramar mi cita?',
    answer:
      'Sí, puedes reprogramar desde el portal de citas o contactándonos directamente, sujeto a disponibilidad del nuevo horario.',
  },
  {
    key: 'cancel-fee',
    categoryId: 'cancellation_policy',
    question: '¿Cobran algún cargo por cancelación tardía?',
    answer:
      'Las cancelaciones con menos de 2 horas de anticipación pueden estar sujetas a un cargo, especialmente para sesiones largas de evaluación.',
  },

  // Horario y ubicación (4)
  {
    key: 'hours-open',
    categoryId: 'hours_location',
    question: '¿Cuál es su horario de atención?',
    answer:
      'Nuestro horario varía por día — pregúntale a nuestro agente de IA o consulta el horario publicado en nuestro sitio para el día que te interesa.',
  },
  {
    key: 'location-address',
    categoryId: 'hours_location',
    question: '¿Dónde están ubicados?',
    answer:
      'Te compartimos la dirección exacta y cómo llegar al agendar tu cita, o puedes pedírsela directamente a nuestro agente.',
  },
  {
    key: 'location-parking',
    categoryId: 'hours_location',
    question: '¿Hay estacionamiento disponible?',
    answer:
      'Sí, contamos con opciones de estacionamiento cerca de la clínica, incluyendo acceso accesible para pacientes con movilidad reducida.',
  },
  {
    key: 'hours-holidays',
    categoryId: 'hours_location',
    question: '¿Abren en días festivos?',
    answer:
      'El horario en días festivos puede variar. Te recomendamos confirmar disponibilidad antes de agendar para esas fechas.',
  },

  // Seguros y pagos (5)
  {
    key: 'insurance-accepted',
    categoryId: 'insurance_payment',
    question: '¿Aceptan seguro médico?',
    answer:
      'Trabajamos con varios seguros — pregúntanos si el tuyo está entre los aceptados y qué porcentaje de cobertura aplica a tu tratamiento.',
  },
  {
    key: 'payment-methods',
    categoryId: 'insurance_payment',
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos efectivo, tarjeta, y copagos de seguro. Pregúntanos por opciones de pago en línea al momento de agendar tu cita.',
  },
  {
    key: 'payment-no-insurance',
    categoryId: 'insurance_payment',
    question: '¿Qué pasa si no tengo seguro?',
    answer:
      'Ofrecemos tarifas particulares y, en algunos casos, paquetes de sesiones con descuento. Pregúntanos por las opciones disponibles.',
  },
  {
    key: 'payment-deposit',
    categoryId: 'insurance_payment',
    question: '¿Piden depósito para reservar?',
    answer:
      'Para evaluaciones iniciales o programas extensos podemos solicitar un depósito, que se descuenta del total al pagar tu tratamiento.',
  },
  {
    key: 'payment-preauth',
    categoryId: 'insurance_payment',
    question: '¿Necesito una autorización previa de mi seguro?',
    answer:
      'Depende de tu plan. Podemos ayudarte a verificar si tu seguro requiere autorización previa antes de tu primera sesión.',
  },

  // Primera visita (4)
  {
    key: 'first-visit-bring',
    categoryId: 'first_visit',
    question: '¿Qué debo llevar a mi primera cita?',
    answer:
      'Trae tu identificación, tarjeta de seguro (si aplica), cualquier estudio de imagen o referencia médica reciente, y ropa cómoda para moverte con libertad.',
  },
  {
    key: 'first-visit-what-happens',
    categoryId: 'first_visit',
    question: '¿Qué sucede en la evaluación inicial?',
    answer:
      'El terapeuta revisa tu historial, evalúa tu movilidad y dolor, y diseña un plan de tratamiento personalizado contigo antes de empezar cualquier ejercicio.',
  },
  {
    key: 'first-visit-arrive-early',
    categoryId: 'first_visit',
    question: '¿Con cuánto tiempo de anticipación debo llegar?',
    answer:
      'Te recomendamos llegar 15 minutos antes de tu primera cita para completar el papeleo de admisión.',
  },
  {
    key: 'first-visit-pain-during',
    categoryId: 'first_visit',
    question: '¿Sentiré dolor durante la evaluación?',
    answer:
      'Podemos probar movimientos que reproduzcan tu molestia para entender mejor el diagnóstico, pero siempre dentro de un rango tolerable — avísale a tu terapeuta si algo se siente demasiado intenso.',
  },

  // Lesiones deportivas (4)
  {
    key: 'sports-return-to-play',
    categoryId: 'sports_injury',
    question: '¿Cuánto tiempo toma volver a jugar después de una lesión?',
    answer:
      'Depende del tipo y severidad de la lesión. Tu terapeuta te da un estimado realista y evalúa tu progreso en cada etapa antes de autorizar el regreso a la actividad.',
  },
  {
    key: 'sports-prevention',
    categoryId: 'sports_injury',
    question: '¿Ofrecen programas de prevención de lesiones para atletas?',
    answer:
      'Sí, diseñamos programas de fortalecimiento y movilidad específicos para tu deporte, enfocados en reducir el riesgo de futuras lesiones.',
  },
  {
    key: 'sports-team-athletes',
    categoryId: 'sports_injury',
    question: '¿Trabajan con equipos deportivos o atletas de competencia?',
    answer:
      'Sí, tenemos experiencia con atletas de distintos niveles, desde recreativos hasta competitivos, y podemos coordinar con su entrenador o cuerpo técnico si es necesario.',
  },
  {
    key: 'sports-training-during',
    categoryId: 'sports_injury',
    question: '¿Puedo seguir entrenando mientras me recupero?',
    answer:
      'En muchos casos sí, con modificaciones. Tu terapeuta te indica qué actividades son seguras y cuáles debes evitar durante cada etapa de tu recuperación.',
  },

  // Progreso y cuidado en casa (4)
  {
    key: 'progress-tracking',
    categoryId: 'progress_home_care',
    question: '¿Cómo puedo ver mi progreso de recuperación?',
    answer:
      'Registramos tu nivel de dolor y movilidad en cada sesión, y puedes consultar tu historial de progreso desde el portal de pacientes.',
  },
  {
    key: 'home-exercises',
    categoryId: 'progress_home_care',
    question: '¿Me darán ejercicios para hacer en casa?',
    answer:
      'Sí, es parte esencial del tratamiento. Te asignamos videos de ejercicios prescritos con series, repeticiones y frecuencia recomendada, disponibles en tu portal de pacientes.',
  },
  {
    key: 'home-icing',
    categoryId: 'progress_home_care',
    question: '¿Debo aplicar hielo o calor en casa?',
    answer:
      'Depende de tu lesión y etapa de recuperación — tu terapeuta te indicará específicamente cuál usar y cuándo, ya que aplicar el equivocado puede retrasar tu progreso.',
  },
  {
    key: 'progress-plateau',
    categoryId: 'progress_home_care',
    question: '¿Qué pasa si siento que mi progreso se estancó?',
    answer:
      'Avísale a tu terapeuta — es normal ajustar el plan de tratamiento cuando el progreso se estanca, y puede ser momento de modificar los ejercicios o la frecuencia.',
  },

  // Políticas generales (5)
  {
    key: 'policy-companion',
    categoryId: 'general_policies',
    question: '¿Puedo llevar acompañante a mi cita?',
    answer:
      'Sí, puedes llevar acompañante siempre que el espacio lo permita — avísanos al agendar si es importante para ti.',
  },
  {
    key: 'policy-minors',
    categoryId: 'general_policies',
    question: '¿Atienden a menores de edad?',
    answer:
      'Sí, atendemos a menores acompañados de un padre, madre o tutor responsable durante toda la sesión.',
  },
  {
    key: 'policy-therapist-request',
    categoryId: 'general_policies',
    question: '¿Puedo pedir que me atienda un terapeuta específico?',
    answer:
      'Por supuesto, avísanos tu preferencia al agendar y haremos lo posible por asignarte con ese terapeuta según su disponibilidad.',
  },
  {
    key: 'policy-records',
    categoryId: 'general_policies',
    question: '¿Puedo solicitar una copia de mi historial de tratamiento?',
    answer:
      'Sí, puedes solicitar tu historial clínico y notas de progreso en cualquier momento a través de nuestro equipo administrativo.',
  },
  {
    key: 'policy-diagnosis-disclaimer',
    categoryId: 'general_policies',
    question: '¿El agente de IA puede diagnosticar mi lesión por teléfono?',
    answer:
      'No — el agente puede explicarte nuestros programas y ayudarte a agendar, pero cualquier diagnóstico o plan de tratamiento requiere una evaluación en persona con un terapeuta licenciado.',
  },
]
