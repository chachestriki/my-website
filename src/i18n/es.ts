type EsRole = {
  role: string;
  period: string;
  summary: string;
  highlights: string[];
};

type EsProject = {
  period: string;
  where?: string;
  summary: string;
  points: string[];
  keywords: string[];
  alts?: string[];
  link?: string;
};

type EsSchool = {
  school?: string;
  place: string;
  degree: string;
};

type EsCopy = {
  profile: {
    mast: string;
    title: string;
    location: string;
    tagline: string;
    summary: string;
  };
  roles: Record<string, EsRole>;
  projects: Record<string, EsProject>;
  education: Record<string, EsSchool>;
  skillGroups: Record<string, string>;
  skillItems: Record<string, string>;
  sketches: Record<string, string>;
  status: Record<"Live" | "Shipped" | "Acquired", string>;
};

export const es: EsCopy = {
  profile: {
    mast: "Ingeniero de software full stack",
    title: "Ingeniero de software full stack / Python",
    location: "Madrid, España",
    tagline: "Construyo la fontanería entre sistemas que no estaban hechos para hablar entre sí.",
    summary:
      "Ingeniero de software full stack, centrado en backend, integraciones de hostelería y automatización de pagos. Diseño APIs y servicios distribuidos con Python, Docker, Kubernetes, PostgreSQL e infraestructura en la nube, y cada vez más pongo agentes de modelos de lenguaje encima.",
  },
  roles: {
    "room-mate": {
      role: "Ingeniero de software full stack",
      period: "2026 – Actualidad",
      summary:
        "Integraciones de hostelería en el ecosistema Oracle Opera Cloud (OHIP) y Salesforce CRM. La arquitectura que conecta el PMS y el CRM es mía.",
      highlights: [
        "Diseñé y mantengo la arquitectura de integración entre el PMS Oracle Opera Cloud (OHIP) y Salesforce CRM: sincronización en tiempo real de perfiles de huésped, reservas, datos de fidelización e información del ciclo de vida del cliente.",
        "Construí una capa de herramientas MCP que expone los sistemas operativos del hotel a agentes de modelos de lenguaje, mediante APIs estructuradas, para reservas, huéspedes y servicios hechos por el agente.",
        "Integré agentes de voz de ElevenLabs en la operación del hotel, con interfaces de conversación en tiempo real para el personal y para el huésped.",
      ],
    },
    mastel: {
      role: "Ingeniero de software full stack",
      period: "2023 – 2026",
      summary:
        "Automatización y pagos para cadenas hoteleras internacionales, entre ellas Marriott, Atlantis y Pestana, centrado en reservas y perfiles de huésped.",
      highlights: [
        "Diseñé servicios en Python para el check-in con tarjeta y la captura de depósitos entre FreedomPay y el PMS Opera Cloud.",
        "APIs REST idempotentes y trabajos por eventos (Docker y Kubernetes en OCI) para la conciliación en tiempo real.",
        "Pipelines de facturación e impuestos para grupos hoteleros, entre ellos Homa Apartments y Pestana Hotels.",
      ],
    },
    "vice-resell": {
      role: "Fundador / CTO",
      period: "2023 – 2026",
      summary:
        "Un marketplace con IA para ropa de segunda mano, con almacén, tienda y software de precios, anuncios y mensajes a compradores. Pasó de 10.000 usuarios y fue adquirido.",
      highlights: [
        "Sistemas con modelos de lenguaje: la API de OpenAI y reglas de control para que en producción el comportamiento siguiera siendo predecible.",
        "Pipelines de automatización para generar anuncios, ajustar precios y los mensajes.",
        "Llevé el almacén, donde se clasificaba la ropa, y la tienda, donde colgaba en los percheros. Las dos salas están en las fotos del proyecto.",
        "Llegó a más de 10.000 usuarios antes de la adquisición.",
      ],
    },
    odyn: {
      role: "Ingeniero de ventas (en remoto)",
      period: "2022 – 2023",
      summary:
        "Apoyo al desarrollo y al despliegue de un producto de voz a texto y resúmenes de reuniones, con integraciones de Zoom y Teams.",
      highlights: [
        "Despliegues técnicos e integración para clientes de Zoom y Teams.",
        "Traduje lo que pedían los clientes al plan de ingeniería de los pipelines de voz a texto.",
      ],
    },
    lenovo: {
      role: "Estudiante / Becario, Infrastructure and Solutions Group (Ventas)",
      period: "jul 2022 – ago 2022",
      summary:
        "Primera práctica, en Madrid. Un mes con el grupo de ventas de centro de datos e infraestructura, al lado de quien vende servidores, almacenamiento y el resto de esa pila.",
      highlights: [
        "Apoyé a los gestores de cuenta y a los equipos de overlay mientras preparaban oportunidades de infraestructura en cuentas de empresa y de sector público.",
        "Vi cómo pasaba un acuerdo por revisión: el catálogo, el pipeline y los números con los que se medía al equipo.",
        "Mantuve las notas y las herramientas de reporting para que el esfuerzo comercial siguiera coordinado.",
      ],
    },
  },
  projects: {
    "opera-salesforce": {
      period: "2026 – Actualidad",
      summary:
        "La arquitectura de integración entre el PMS Oracle Opera Cloud (OHIP) y Salesforce CRM. Opera sigue siendo la fuente de verdad de reservas, perfiles de huésped y folios. Salesforce recibe esos datos y devuelve actualizaciones del ciclo de vida.",
      points: [
        "Sincronización en tiempo real de perfiles de huésped, reservas, datos de fidelización e información del ciclo de vida del cliente, en las dos direcciones.",
        "Una pasarela OAuth2 y de app-key delante de Opera que normaliza los mensajes y convive con sus límites de tasa.",
      ],
      keywords: ["Opera Cloud", "OHIP", "Salesforce", "OAuth2", "Python", "OCI", "PMS", "CRM"],
    },
    "mcp-tools": {
      period: "2026 – Actualidad",
      summary:
        "La operación del hotel, expuesta a agentes de modelos de lenguaje como herramientas estructuradas y con permisos, para que un agente reserve, busque un huésped o lance una petición de servicio en lugar de pasársela a una persona.",
      points: [
        "Construí la capa de herramientas MCP sobre los mismos sistemas operativos que usa la integración del PMS.",
        "Las herramientas se quedan estrechas y explícitas: el agente llama a una función, no recibe una base de datos en bruto.",
      ],
      keywords: ["MCP", "OHIP", "Salesforce", "Python", "PMS"],
    },
    "vice-resell": {
      period: "2023 – 2026",
      where: "Fundador / CTO",
      summary:
        "Un asistente de IA para un negocio de ropa de segunda mano: precios, textos de anuncio y mensajes de negociación. Las fotos son el almacén, donde se clasificaba la ropa, y la tienda, donde colgaba en los percheros. Más de 10.000 usuarios, y después la adquisición.",
      points: [
        "Funciones de modelos de lenguaje sobre la API de OpenAI, con reglas de control para que el comportamiento en producción siguiera siendo manejable.",
        "Automatización del texto de los anuncios, de los precios y de los mensajes a compradores en marketplaces de reventa.",
      ],
      keywords: ["OpenAI", "modelos de lenguaje", "almacén", "tienda", "Python"],
      alts: [
        "El almacén de Vice Resell: bolsas de ropa de segunda mano en el suelo, con gente clasificándola.",
        "La tienda de Vice Resell: percheros llenos de chaquetas y sudaderas de segunda mano.",
      ],
      link: "Vice Resell en Whop",
    },
    odyn: {
      period: "2022 – 2023",
      summary:
        "Ingeniería de ventas para un producto de voz a texto y resúmenes de reuniones. Hice despliegues y mantuve las peticiones de los clientes atadas al plan de ingeniería.",
      points: [
        "Despliegues técnicos e integración para clientes de Zoom y Microsoft Teams.",
        "Traduje lo que necesitaban los compradores a trabajo que el pipeline de voz a texto podía hacer de verdad.",
      ],
      keywords: ["voz a texto", "Zoom", "Microsoft Teams", "Teams"],
      alts: ["Un chat de Discord en el que Demo OdynAI resume en inglés la llamada de ventas de Drew."],
    },
  },
  education: {
    tamu: {
      place: "College Station, Texas",
      degree: "Grado (B.S.) en Informática y Empresa",
    },
    uc3m: {
      school: "Universidad Carlos III de Madrid",
      place: "Madrid, España",
      degree: "Grado en Gestión y Tecnología",
    },
  },
  skillGroups: {
    Backend: "Backend",
    Frontend: "Frontend",
    Infrastructure: "Infraestructura",
    Cloud: "Cloud",
    Databases: "Bases de datos",
    "Systems / Domain": "Sistemas / Dominio",
    "AI / Automation": "IA / Automatización",
  },
  skillItems: {
    Microservices: "Microservicios",
    "MCP tool systems": "Sistemas de herramientas MCP",
    "LLM agent workflows": "Flujos de agentes LLM",
    "ElevenLabs speech pipelines": "Pipelines de voz de ElevenLabs",
    "Retrieval pipelines": "Pipelines de recuperación",
  },
  sketches: {
    "opera-salesforce": "Opera Cloud y Salesforce, intercambiando huéspedes y reservas.",
    "mcp-tools": "Sistemas del hotel detrás de una capa de herramientas, y después un agente.",
  },
  status: {
    Live: "Activo",
    Shipped: "Publicado",
    Acquired: "Adquirido",
  },
};
