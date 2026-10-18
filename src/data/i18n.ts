import { education, languages, profile, roles, skills } from "@/data/cv";
import {
  educationEs,
  engineeringEs,
  languagesEs,
  profileEs,
  projectsEs,
  rolesEs,
  skillsEs,
} from "@/data/cv.es";
import { engineering, projects } from "@/data/projects";

export type Lang = "en" | "es";

export const LANGS: Lang[] = ["en", "es"];

/** every dataset the site renders, in the requested language */
export function contentFor(lang: Lang) {
  if (lang === "es") {
    return {
      profile: { ...profile, ...profileEs },
      roles: rolesEs,
      skills: skillsEs,
      education: educationEs,
      languages: languagesEs,
      projects: projectsEs,
      engineering: engineeringEs,
    };
  }
  return { profile, roles, skills, education, languages, projects, engineering };
}

export type Copy = {
  navTop: string;
  openMenu: string;
  closeMenu: string;
  switchTo: string;
  cv: string;
  email: string;
  readCv: string;
  startStory: string;
  scroll: string;
  guestsReached: string;
  hotels: string;
  yearsIntegrations: string;
  users: string;
  reviews: string;
  marketplaces: string;
  educationNav: string;
  educationEyebrow: string;
  educationTitle: string;
  stackNav: string;
  stackEyebrow: string;
  stackTitle: string;
  stackLead: string;
  agentNav: string;
  agentEyebrow: string;
  agentTitle: string;
  agentLead: string;
  contactNav: string;
  contactEyebrow: string;
  contactTitle: string;
  contactLead: (location: string) => string;
  agentOpening: string;
  agentYou: string;
  agentAgent: string;
  agentTyping: string;
  agentPlaceholder: string;
  agentPlaceholderSpent: string;
  agentInputLabel: string;
  agentAsk: string;
  agentLeft: (n: number) => string;
  agentSpent: (max: number) => string;
  agentOr: string;
  agentUnreachable: (email: string) => string;
  suggested: { q: string; a: string }[];
  cvBack: string;
  cvSkills: string;
  cvExperience: string;
  cvProjects: string;
  cvEngineering: string;
  cvEducation: string;
  cvLanguages: string;
  cvRepository: string;
};

const en: Copy = {
  navTop: "Top",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  switchTo: "Ver en español",
  cv: "CV",
  email: "Email",
  readCv: "Read the CV",
  startStory: "Start the story",
  scroll: "scroll",
  guestsReached: "guests reached",
  hotels: "hotels",
  yearsIntegrations: "of hospitality integrations",
  users: "users",
  reviews: "over 426 reviews",
  marketplaces: "marketplaces automated",
  educationNav: "Education",
  educationEyebrow: "Education",
  educationTitle: "Madrid and Texas, same arc",
  stackNav: "Stack",
  stackEyebrow: "Toolkit",
  stackTitle: "What I build with",
  stackLead: "Backend-leaning, infrastructure-comfortable, and increasingly agent-shaped.",
  agentNav: "Ask the agent",
  agentEyebrow: "Live demo",
  agentTitle: "Ask an agent that read the CV",
  agentLead: "An LLM grounded only in this site's data. Five questions per visit.",
  contactNav: "Contact",
  contactEyebrow: "Contact",
  contactTitle: "Let's talk",
  contactLead: (location) => `${location} · open to the right conversation.`,
  agentOpening:
    "I'm an agent Juan wired into this page — same idea as the ones he builds for hotel operations, only this one has read his CV. Ask me anything about his work.",
  agentYou: "you",
  agentAgent: "agent",
  agentTyping: "agent is typing…",
  agentPlaceholder: "Ask about his stack, a project…",
  agentPlaceholderSpent: "Question limit reached",
  agentInputLabel: "Ask the agent a question",
  agentAsk: "Ask",
  agentLeft: (n) => `${n} question${n === 1 ? "" : "s"} left`,
  agentSpent: (max) => `That's the ${max}-question limit for one visit.`,
  agentOr: "or write to",
  agentUnreachable: (email) =>
    `The live agent is unreachable right now. Everything it would tell you is on this page and in the CV — and Juan answers directly at ${email}.`,
  suggested: [
    {
      q: "What do you actually do all day?",
      a: "I design and own integrations between hospitality systems: Opera Cloud PMS via OHIP, Salesforce CRM, FreedomPay. Concretely: schema mapping, OAuth2 plumbing, idempotency keys, event-driven reconciliation jobs on Kubernetes, and lately an MCP tool layer so LLM agents can execute those workflows.",
    },
    {
      q: "What's the MCP tool layer about?",
      a: "Hotel operations are locked behind clunky enterprise APIs. I expose them as structured, permissioned MCP tools, so an agent can look up a reservation, modify a profile, or trigger a service request through the same validated path a staff member would use — with guardrails and audit instead of free-form API access.",
    },
    {
      q: "Tell me about Vice Resell.",
      a: "I founded and was CTO of an AI-driven marketplace automation platform that reached 6,000+ users before it was acquired. LLM-powered pricing recommendations, listing generation and negotiation messaging — always paired with rule-based systems, because pure LLM output isn't reliable enough to touch money.",
    },
    {
      q: "Hardest problem you've shipped?",
      a: "Credit-card check-in and deposit capture between FreedomPay and Opera Cloud. Payments and PMS folios disagree constantly, retries are unavoidable, and double-charging a guest is unacceptable — so everything had to be idempotent and reconcilable in real time.",
    },
    {
      q: "Are you available?",
      a: `Based in Madrid, open to the right conversation. Email ${profile.email} and I'll reply.`,
    },
  ],
  cvBack: "← back to JD Portfolio",
  cvSkills: "Skills",
  cvExperience: "Experience",
  cvProjects: "Projects",
  cvEngineering: "Selected engineering",
  cvEducation: "Education",
  cvLanguages: "Languages",
  cvRepository: "repository →",
};

const es: Copy = {
  navTop: "Inicio",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  switchTo: "View in English",
  cv: "CV",
  email: "Correo",
  readCv: "Ver el CV",
  startStory: "Empezar la historia",
  scroll: "desliza",
  guestsReached: "huéspedes alcanzados",
  hotels: "hoteles",
  yearsIntegrations: "de integraciones hoteleras",
  users: "usuarios",
  reviews: "con 426 reseñas",
  marketplaces: "marketplaces automatizados",
  educationNav: "Formación",
  educationEyebrow: "Formación",
  educationTitle: "Madrid y Texas, el mismo arco",
  stackNav: "Stack",
  stackEyebrow: "Herramientas",
  stackTitle: "Con lo que construyo",
  stackLead: "Orientado a backend, cómodo en infraestructura y cada vez más centrado en agentes.",
  agentNav: "Pregunta al agente",
  agentEyebrow: "Demo en vivo",
  agentTitle: "Pregunta a un agente que se ha leído el CV",
  agentLead: "Un LLM limitado a los datos de esta web. Cinco preguntas por visita.",
  contactNav: "Contacto",
  contactEyebrow: "Contacto",
  contactTitle: "Hablemos",
  contactLead: (location) => `${location} · abierto a la conversación adecuada.`,
  agentOpening:
    "Soy un agente que Juan ha conectado a esta página — la misma idea que los que construye para operaciones hoteleras, solo que este se ha leído su CV. Pregúntame lo que quieras sobre su trabajo.",
  agentYou: "tú",
  agentAgent: "agente",
  agentTyping: "el agente está escribiendo…",
  agentPlaceholder: "Pregunta por su stack, un proyecto…",
  agentPlaceholderSpent: "Límite de preguntas alcanzado",
  agentInputLabel: "Haz una pregunta al agente",
  agentAsk: "Enviar",
  agentLeft: (n) => `${n} pregunta${n === 1 ? "" : "s"} restante${n === 1 ? "" : "s"}`,
  agentSpent: (max) => `Ese es el límite de ${max} preguntas por visita.`,
  agentOr: "o escribe a",
  agentUnreachable: (email) =>
    `El agente en vivo no está disponible ahora mismo. Todo lo que te contaría está en esta página y en el CV — y Juan responde directamente en ${email}.`,
  suggested: [
    {
      q: "¿Qué haces exactamente en tu día a día?",
      a: "Diseño y mantengo integraciones entre sistemas hoteleros: Opera Cloud PMS vía OHIP, Salesforce CRM, FreedomPay. En concreto: mapeo de esquemas, fontanería OAuth2, claves de idempotencia, trabajos de conciliación dirigidos por eventos en Kubernetes y, últimamente, una capa de herramientas MCP para que los agentes LLM ejecuten esos flujos.",
    },
    {
      q: "¿Qué es la capa de herramientas MCP?",
      a: "Las operaciones de hotel viven detrás de APIs corporativas incómodas. Las expongo como herramientas MCP estructuradas y con permisos, de modo que un agente puede consultar una reserva, modificar un perfil o lanzar una petición de servicio por el mismo camino validado que usaría el personal — con límites y auditoría en vez de acceso libre a la API.",
    },
    {
      q: "Cuéntame sobre Vice Resell.",
      a: "Fundé y fui CTO de una plataforma de automatización de marketplaces con IA que llegó a más de 6.000 usuarios antes de ser adquirida. Recomendación de precios, generación de anuncios y mensajes de negociación con LLM — siempre acompañados de reglas deterministas, porque la salida pura de un LLM no es lo bastante fiable para tocar dinero.",
    },
    {
      q: "¿El problema más difícil que has resuelto?",
      a: "El check-in con tarjeta y la captura de depósitos entre FreedomPay y Opera Cloud. Pagos y facturas del PMS se contradicen constantemente, los reintentos son inevitables y cobrar dos veces a un huésped es inaceptable — así que todo tenía que ser idempotente y conciliable en tiempo real.",
    },
    {
      q: "¿Estás disponible?",
      a: `En Madrid, abierto a la conversación adecuada. Escribe a ${profile.email} y te respondo.`,
    },
  ],
  cvBack: "← volver a JD Portfolio",
  cvSkills: "Competencias",
  cvExperience: "Experiencia",
  cvProjects: "Proyectos",
  cvEngineering: "Ingeniería destacada",
  cvEducation: "Formación",
  cvLanguages: "Idiomas",
  cvRepository: "repositorio →",
};

export const copy: Record<Lang, Copy> = { en, es };
