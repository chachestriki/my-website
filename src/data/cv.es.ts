import type { Role } from "@/data/cv";
import type { Project, SideProject } from "@/data/projects";

/** Spanish copy of everything the site renders from the CV datasets */
export const profileEs = {
  title: "Ingeniero de Software Full-Stack / Python",
  location: "Madrid, España",
  tagline: "Construyo la fontanería entre sistemas que nunca se diseñaron para hablarse.",
  summary:
    "Ingeniero full-stack orientado a backend, trabajando en integraciones hoteleras, automatización de pagos y herramientas LLM. Conecto Opera Cloud (OHIP), Salesforce y FreedomPay con servicios idempotentes en Python sobre Kubernetes, y se los expongo a agentes de IA mediante MCP. Antes fundé y vendí Vice Resell, una plataforma de automatización de reventa con más de 6.000 usuarios.",
};

export const languagesEs = [
  { name: "Español", level: "nativo" },
  { name: "Inglés", level: "bilingüe — carrera completada en Texas A&M" },
];

export const rolesEs: Role[] = [
  {
    id: "room-mate",
    company: "Room Mate Hospitality Group",
    role: "Ingeniero de Software Full Stack",
    period: "2026 – Actualidad",
    summary:
      "Responsable de la arquitectura de integración entre Oracle Opera Cloud (OHIP) y Salesforce CRM en más de 100 hoteles y unos 4,5 M de perfiles de huésped, además de la capa de herramientas de IA que va encima.",
    highlights: [
      "Dueño de la integración Opera Cloud (OHIP) ↔ Salesforce: perfiles de huésped, reservas y datos de fidelización sincronizados en tiempo real en lugar de a mano.",
      "Construí un servidor MCP que convierte las specs OpenAPI oficiales de Oracle en más de 3.000 herramientas con permisos, para que los agentes LLM operen reservas y huéspedes sin ver nunca las credenciales OAuth.",
      "Desplegué agentes de voz con ElevenLabs sobre esa capa de herramientas, para flujos conversacionales de personal y de huésped.",
      "Construí consumidores en streaming de reservas de OTAs (Booking, Expedia, Hotelbeds, Mirai, Keytel) hacia Opera, con hashing y control de offsets para que un reenvío nunca duplique una reserva.",
    ],
    stack: ["Python", "OHIP", "Salesforce", "MCP", "ElevenLabs", "OCI"],
  },
  {
    id: "mastel",
    company: "Mastel Hospitality",
    role: "Ingeniero de Software Full Stack",
    period: "2023 – 2026",
    summary:
      "Automatización de pagos y reservas para cadenas hoteleras internacionales como Marriott, Atlantis y Pestana.",
    highlights: [
      "Automaticé el check-in con tarjeta y la captura de depósitos entre FreedomPay y Opera Cloud, eliminando el manejo manual de tarjetas en recepción.",
      "Construí APIs REST idempotentes y trabajos dirigidos por eventos (Docker + Kubernetes en OCI) que concilian pagos contra facturas en tiempo real.",
      "Entregué pipelines de facturación e impuestos para Homa Apartments y Pestana Hotels, sustituyendo el cierre de mes hecho en hojas de cálculo.",
    ],
    stack: ["Python", "FastAPI", "Kubernetes", "FreedomPay", "Opera Cloud", "PostgreSQL"],
  },
  {
    id: "vice-resell",
    company: "Vice Resell (Adquirida)",
    role: "Fundador / CTO",
    period: "2023 – 2026",
    summary:
      "Fundé, construí y vendí la plataforma de automatización de reventa detrás de la mayor comunidad de reselling de España: más de 6.000 usuarios, generación de anuncios, precios y mensajes de negociación.",
    highlights: [
      "La llevé a más de 6.000 usuarios de pago y a la mayor comunidad de reventa de España (5,0 ★ con 426 reseñas públicas) antes de la adquisición en 2026.",
      "Automaticé los marketplaces de punta a punta — Vinted, Wallapop y Vestiaire — con una extensión de Chrome y un backend de crosslisting que publica, reajusta precios y responde desde un único inventario.",
      "Construí un pipeline RAG (FAISS sobre datos limpios de marketplace + GPT-4 vision) que rellena título, descripción, marca, categoría, colores y precio a partir de una foto.",
      "Mantuve la salida del LLM detrás de controles deterministas de precio e inventario, porque un texto generado nunca debería ser lo último entre un usuario y su dinero.",
    ],
    stack: ["Python", "FastAPI", "FAISS", "OpenAI API", "Next.js", "Supabase", "Chrome MV3"],
  },
  {
    id: "odyn",
    company: "Odyn AI",
    role: "Sales Engineer (Remoto)",
    period: "2022 – 2023",
    summary:
      "Parte técnica de un producto de call intelligence de Silicon Valley: voz a texto, texto a voz y análisis de reuniones en Zoom, Google Meet y Microsoft Teams.",
    highlights: [
      "Llevé despliegues e integraciones de clientes en tres plataformas de reuniones.",
      "Convertí lo que los clientes pedían en las demos en requisitos para los pipelines de voz y de sentimiento.",
    ],
    stack: ["Voz a texto", "Texto a voz", "Zoom API", "Teams API"],
  },
  {
    id: "lenovo",
    company: "Lenovo",
    role: "Ventas de Infraestructura",
    period: "2021",
    summary:
      "Venta de infraestructura de centro de datos: servidores, almacenamiento y redes para clientes de empresa.",
    highlights: [
      "Dimensioné y presupuesté configuraciones de servidor, almacenamiento y red según las cargas de trabajo del cliente.",
      "Primer contacto con el IT corporativo y con los compradores para los que hoy construyo integraciones.",
    ],
    stack: ["Infraestructura de centro de datos", "IT corporativo"],
  },
];

export const skillsEs: { group: string; items: string[] }[] = [
  { group: "Backend", items: ["Python", "FastAPI", ".NET", "Flask", "APIs REST", "OAuth2"] },
  { group: "Frontend", items: ["Angular", "Next.js", "JavaScript", "TypeScript"] },
  { group: "Infraestructura", items: ["Docker", "Kubernetes", "CI/CD", "Microservicios", "Kafka"] },
  { group: "Cloud", items: ["Oracle Cloud (OCI)", "GCP", "AWS", "Azure"] },
  { group: "Bases de datos", items: ["PostgreSQL", "SQL", "MongoDB"] },
  { group: "Sistemas / Dominio", items: ["Opera Cloud", "OHIP", "PMS / CRM / TPV", "Salesforce"] },
  {
    group: "IA / Automatización",
    items: [
      "OpenAI API",
      "Sistemas de herramientas MCP",
      "Flujos con agentes LLM",
      "Pipelines de voz con ElevenLabs",
      "RAG / búsqueda vectorial FAISS",
    ],
  },
];

export const educationEs = [
  {
    school: "Texas A&M University",
    place: "College Station, TX",
    degree: "Grado en Ciencias de la Computación y Empresa",
  },
  {
    school: "Universidad Carlos III",
    place: "Madrid, ESP",
    degree: "Grado en Gestión y Tecnología — TFG sobre detección de bots en Instagram",
  },
];

export const projectsEs: Project[] = [
  {
    id: "vice-resell",
    name: "Vice Resell",
    role: "Fundador / CTO",
    period: "2023 – 2026 · adquirida",
    tag: "Automatización de reventa + la mayor comunidad de reselling de España",
    blurb:
      "Automatización de marketplaces para más de 6.000 revendedores: anuncios a partir de fotos, precios sobre comparables en vivo y mensajes de negociación, vendida como comunidad de 20 €/mes en Whop.",
    bullets: [
      "Python alrededor de las APIs de OpenAI con controles deterministas de precio e inventario.",
      "Datos de moda: normalización de tallas y colores, valoración del estado y señales de falsificación.",
      "5,0 ★ con 426 reseñas públicas; adquirida en 2026.",
    ],
    stat: { value: "6.000+", label: "revendedores en la plataforma" },
    link: { label: "Ficha en Whop", href: "https://whop.com/vice-resell/products/vice-resell/" },
    color: "#ff2fa0",
    scene: "factory",
  },
  {
    id: "odyn",
    name: "ODYN AI",
    role: "Sales engineer",
    period: "2022 – 2023",
    tag: "Call intelligence para Zoom, Meet y Teams",
    blurb:
      "Empresa de IA de Silicon Valley cuyo producto escucha las llamadas de ventas en Zoom, Google Meet y Microsoft Teams y aprende de cada una: lee la actitud del cliente, extrae inteligencia de la cuenta y se la devuelve al equipo.",
    bullets: [
      "Voz a texto y resúmenes de reunión desplegados en Zoom y Teams.",
      "Señales de sentimiento y actitud por llamada, convertidas en coaching para el equipo comercial.",
      "Vendí y definí el alcance de las integraciones que los clientes acabaron usando.",
    ],
    stat: { value: "3", label: "plataformas de reuniones integradas" },
    color: "#7c5cff",
    scene: "odyn",
  },
  {
    id: "botlab",
    name: "Detección de bots en Instagram",
    role: "Trabajo de fin de grado",
    period: "2022",
    tag: "Clasificar cuentas automatizadas con señales públicas del perfil",
    blurb:
      "Mi TFG: un clasificador que separa cuentas automatizadas de Instagram de personas reales usando señales públicas de perfil, publicación e interacción.",
    bullets: [
      "Conjunto de variables a partir de la cadencia de publicación, ratios de seguidores, reutilización de textos y forma de la interacción.",
      "Dataset etiquetado, partición train/test y un modelo supervisado evaluado por precisión y recall, no por accuracy bruto.",
      "Lo interesante es la asimetría de coste: marcar a una persona real es peor que dejar escapar un bot.",
    ],
    stat: { value: "2", label: "clases: bot o humano" },
    color: "#2ecf9f",
    scene: "botlab",
  },
];

export const engineeringEs: SideProject[] = [
  {
    id: "opera-mcp",
    name: "OperaMCP",
    tag: "Servidor MCP para Oracle Hospitality",
    body: "Genera más de 3.000 herramientas invocables por LLM directamente desde las specs OpenAPI oficiales de OHIP / Opera Cloud — nombres semánticos, OAuth2 y cabeceras obligatorias resueltos en el servidor, para que el cliente de IA nunca toque una credencial.",
    stack: ["Python", "MCP", "OpenAPI", "OAuth2", "Docker"],
  },
  {
    id: "ohip-streaming",
    name: "Ingesta en streaming de OTAs",
    tag: "Booking, Expedia, Hotelbeds, Mirai, Keytel → Opera Cloud",
    body: "Consumidores en streaming que llevan eventos de reserva de cinco OTAs a Opera Cloud: un router por canal, minimización de payload, hashing y control de offsets para que un evento reenviado nunca cree una reserva duplicada.",
    stack: ["Python", "APIs de streaming", "Opera Cloud", "Docker"],
  },
  {
    id: "rag-listing",
    name: "Pipeline RAG de anuncios",
    tag: "Entra una foto, sale un anuncio",
    body: "Limpia datos de producto de marketplace hacia un índice FAISS más una tabla SQLite, y los sirve como servicio de búsqueda vectorial en FastAPI que fundamenta a GPT-4 cuando escribe título, descripción, marca, categoría, colores y precio de una prenda.",
    stack: ["Python", "FastAPI", "FAISS", "SQLite", "GPT-4 vision"],
  },
  {
    id: "crosslister",
    name: "Crosslister de Vinted + extensión de Chrome",
    tag: "Un inventario, tres marketplaces",
    body: "Workspace en Next.js (auth con Supabase, fotos en R2, cola de trabajos) más una extensión MV3 con flujos por marketplace que publica y sincroniza el mismo artículo en Vinted, Wallapop y Vestiaire.",
    stack: ["TypeScript", "Next.js", "Supabase", "Chrome MV3", "R2"],
  },
];
