export const SITE_CONFIG = {
  name: 'Cristal Hernandez',
  title: 'Psicóloga',
  fullTitle: 'Psic. Cristal Hernandez',
  tagline: 'Tu espacio seguro para sanar',
  description:
    'Me llamo Cristal y me dedico a acompañar procesos de bienestar emocional, autoconocimiento y salud mental. Conmigo encontrarás un espacio seguro y sin prejuicios en donde podrás expresarte libremente.',
  whatsapp: '+527471432188',
  whatsappDisplay: '+52 747 143 2188',
  instagram: 'https://www.instagram.com/psic.cris_hernandez',
  instagramHandle: '@psic.cris_hernandez',
  location: 'Guerrero, México',
}

export const NAV_LINKS = [
  { label: 'Sobre mí', href: '#sobre-mi' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Formación', href: '#formacion' },
  { label: 'Agendar', href: '/dashboard' },
]

export interface Service {
  title: string
  subtitle: string
  duration: string
  price: string
  promo: string
  features: string[]
  icon: string
}

export const SERVICES: Service[] = [
  {
    title: 'Atención Psicológica',
    subtitle: 'Cualquier Modalidad',
    duration: '45 - 60 minutos',
    price: '$200 MXN por sesión',
    promo: '30% en tu primera sesión',
    features: [
      'Historial Clínico completo',
      'Manejo de Emociones',
      'Seguimiento de consulta',
      'Prevención de recaídas',
    ],
    icon: 'Brain',
  },
]

export interface Experience {
  period: string
  role: string
  institution: string
  location: string
  note?: string
}

export const EXPERIENCE: Experience[] = [
  {
    period: '2020 — 2024',
    role: 'Licenciatura en Psicología',
    institution: 'Instituto Universitario del Sur',
    location: 'Chilpancingo, Guerrero',
    note: 'Titulada por Excelencia Académica',
  },
  {
    period: '2022',
    role: 'Pasante de Psicología Clínica',
    institution: 'Hospital General de Chilapa de Álvarez',
    location: 'Chilapa, Guerrero',
    note: 'Atención a Adolescentes, Adultos y Puérperas',
  },
  {
    period: '2023 — 2025',
    role: 'Psicóloga Educativa',
    institution: 'Colegio Primaria y Preescolar',
    location: 'Guerrero',
    note: 'Atención a Niños y Adolescentes',
  },
]

export interface Course {
  title: string
  institution: string
}

export const COURSES: Course[] = [
  { title: 'Atención a la Violencia Familiar', institution: 'CIJ' },
  {
    title: 'Prevención del maltrato a Niñas, Niños y Adolescentes',
    institution: 'CIJ',
  },
  {
    title: 'Vida saludable y prevención de Adicciones',
    institution: 'CIJ',
  },
  {
    title: 'Prevención de Adicciones y Violencia en Educación Media Superior',
    institution: 'CIJ',
  },
  {
    title: 'Atención y cuidado a personas Adultas Mayores',
    institution: 'CIJ',
  },
  {
    title: 'Duelo por muerte derivada de una crisis sanitaria',
    institution: 'CIJ',
  },
  { title: 'Primeros Auxilios Psicológicos', institution: 'CIJ' },
  {
    title: 'Taller de Prueba de Inteligencia Emocional',
    institution: 'Formación continua',
  },
]

export interface ValueCard {
  icon: string
  title: string
  description: string
}

export const VALUE_CARDS: ValueCard[] = [
  {
    icon: 'Heart',
    title: 'Empatía',
    description:
      'Te escucho sin juzgarte, en un espacio 100% seguro y lleno de comprensión.',
  },
  {
    icon: 'Lock',
    title: 'Confidencialidad',
    description:
      'Todo lo que compartes se queda entre nosotros. Tu privacidad es sagrada.',
  },
  {
    icon: 'Smile',
    title: 'Sin prejuicios',
    description:
      'Aquí puedes ser tú mismo/a con total libertad, sin miedo a ser criticado/a.',
  },
  {
    icon: 'RefreshCw',
    title: 'Seguimiento',
    description:
      'Doy seguimiento a tu proceso en cada sesión para acompañar tu crecimiento.',
  },
]

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Contáctame',
    description:
      'Escríbeme por WhatsApp o Instagram. Cuéntame brevemente cómo te sientes y agendamos juntos.',
    icon: 'MessageCircle',
  },
  {
    number: '02',
    title: 'Primera sesión',
    description:
      'Nos conocemos, exploramos tu historia y establecemos los objetivos de tu proceso terapéutico.',
    icon: 'Calendar',
  },
  {
    number: '03',
    title: 'Tu proceso',
    description:
      'Trabajamos juntos de forma constante con seguimiento personalizado en cada etapa de tu camino.',
    icon: 'TrendingUp',
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: '¿Cómo es la primera sesión?',
    answer:
      'La primera sesión es un espacio para conocernos. Platicamos sobre lo que te trajo aquí, tu historia y lo que esperas del proceso. No hay presión ni juicio, es una conversación tranquila.',
  },
  {
    question: '¿Es confidencial todo lo que hablo en terapia?',
    answer:
      'Sí, absolutamente. Todo lo que compartes en nuestras sesiones es estrictamente confidencial. Tu privacidad y confianza son mi prioridad.',
  },
  {
    question: '¿Qué modalidades de atención ofreces?',
    answer:
      'Ofrezco atención en línea (videollamada) y presencial, dependiendo de tu ubicación y preferencia. Tú eliges la modalidad que mejor se adapte a ti.',
  },
  {
    question: '¿Cuánto dura cada sesión?',
    answer:
      'Las sesiones tienen una duración de 45 a 60 minutos, con frecuencia semanal o quincenal según tu proceso y disponibilidad.',
  },
  {
    question: '¿Con qué tipo de problemáticas trabajas?',
    answer:
      'Trabajo con ansiedad, depresión, duelo, manejo emocional, autoestima, situaciones de violencia, adicciones, y más. Si tienes dudas sobre si puedo ayudarte, escríbeme y con gusto lo platicamos.',
  },
  {
    question: '¿Tienes experiencia con niños y adolescentes?',
    answer:
      'Sí, tengo experiencia trabajando con niños, adolescentes y adultos en contextos clínicos y educativos. Cada etapa de vida requiere un enfoque diferente y estoy preparada para ello.',
  },
]
