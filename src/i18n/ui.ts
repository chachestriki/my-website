import type { Lang } from "./lang";

export type NewsItem = {
  year: string;
  href: string;
  before: string;
  label: string;
  after: string;
};

export type Feature = {
  href: string;
  title: string;
  text: string;
};

export type Ui = {
  metaDescription: string;
  skip: string;
  mastTitle: string;
  nav: {
    menu: string;
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    contact: string;
    home: string;
    news: string;
  };
  footer: {
    home: string;
    news: string;
    guestbook: string;
    email: string;
    resume: string;
    visitor: string;
    netscape: string;
    updated: string;
  };
  langLabel: string;
  home: {
    title: string;
    description: string;
    welcome: string;
    reached: string;
    engineer: string;
    caption: string;
    features: string;
    news: string;
    items: Feature[];
    updates: NewsItem[];
  };
  about: {
    title: string;
    description: string;
    portraitAlt: string;
    portraitCaption: string;
    middle: string;
    name: string;
    titleLabel: string;
    based: string;
    email: string;
    phone: string;
    close: string;
    experience: string;
    projects: string;
    note: string;
    resume: string;
  };
  experience: {
    title: string;
    description: string;
    intro: string;
    projects: string;
    stack: string;
  };
  projects: {
    title: string;
    description: string;
    intro: string;
    experience: string;
    stack: string;
  };
  skills: {
    title: string;
    description: string;
    intro: string;
  };
  education: {
    title: string;
    description: string;
    intro: string;
  };
  contact: {
    title: string;
    description: string;
    intro: string;
    email: string;
    phone: string;
    where: string;
    send: string;
    name: string;
    subject: string;
    message: string;
    submit: string;
    hint: string;
    placeholder: string;
    defaultSubject: string;
    missingName: string;
    nameLine: string;
  };
  cv: {
    title: string;
    print: string;
    experience: string;
    skills: string;
    education: string;
    back: string;
  };
  missing: {
    title: string;
    body: string;
    back: string;
  };
};

const en: Ui = {
  metaDescription:
    "Personal web site of Juan Diego Gómez, a full-stack software engineer in Madrid. Projects, experience, and how to get in touch.",
  skip: "Skip to content",
  mastTitle: "Full-Stack Software Engineer",
  nav: {
    menu: "Sections",
    about: "About Me",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    education: "Education",
    contact: "Contact",
    home: "Home",
    news: "What's New",
  },
  footer: {
    home: "Home",
    news: "What's New",
    guestbook: "Guestbook",
    email: "E-mail",
    resume: "Résumé",
    visitor: "You are visitor",
    netscape:
      "Best viewed with Netscape Navigator 2.0 at 800×600. Also fine in the browser you are using now.",
    updated: "Last updated 18 October 2026.",
  },
  langLabel: "Language",
  home: {
    title: "Juan Diego Gómez — Personal Web Site",
    description:
      "Full-stack software engineer specializing in backend systems, hospitality integrations, and payment automation.",
    welcome: "Welcome",
    reached: "You have reached the personal web site of",
    engineer: "a full-stack software engineer in",
    caption: "Me, as God, playing the guitar.",
    features: "Features",
    news: "What's New",
    items: [
      {
        href: "/about",
        title: "About Me",
        text: "Who I am, where I work from, and the kind of systems I like to wire together.",
      },
      {
        href: "/experience",
        title: "Experience",
        text: "Room Mate, Mastel, Vice Resell, Odyn, and a first internship at Lenovo. The roles, the years, and what actually shipped.",
      },
      {
        href: "/projects",
        title: "Projects",
        text: "Opera Cloud, Salesforce, hotel tools for agents, and a marketplace that was acquired.",
      },
      {
        href: "/skills",
        title: "Skills",
        text: "Python, FastAPI, Kubernetes, PostgreSQL, cloud, and the hospitality stack I integrate.",
      },
      {
        href: "/education",
        title: "Education",
        text: "Computer Science and Business at Texas A&M, and Management & Technology at Universidad Carlos III.",
      },
      {
        href: "/contact",
        title: "Contact",
        text: "Electronic mail and telephone. I still answer both.",
      },
    ],
    updates: [
      {
        year: "2026",
        href: "/experience#room-mate",
        before: "",
        label: "Joined Room Mate Hospitality Group",
        after: " to own the Opera Cloud and Salesforce integration, plus the agent tools on top of it.",
      },
      {
        year: "2023",
        href: "/projects#vice-resell",
        before: "",
        label: "Vice Resell",
        after: " passed 10,000 users. The company was later acquired.",
      },
      {
        year: "2023",
        href: "/experience#mastel",
        before: "",
        label: "Check-in payments",
        after: " between FreedomPay and Opera for Marriott, Atlantis, and Pestana.",
      },
      {
        year: "2022",
        href: "/experience#odyn",
        before: "",
        label: "Odyn AI",
        after: ", shipping speech-to-text into Zoom and Teams.",
      },
      {
        year: "2022",
        href: "/experience#lenovo",
        before: "",
        label: "Lenovo",
        after: ", a summer internship in Madrid with the infrastructure sales group.",
      },
    ],
  },
  about: {
    title: "About Me",
    description:
      "Full-stack software engineer specializing in backend systems, hospitality integrations, and payment automation.",
    portraitAlt: "Juan Diego Gómez on stage dressed as God, sunglasses on, playing an electric guitar.",
    portraitCaption: "This is me, performing as God and playing the guitar.",
    middle:
      "The work is usually the unglamorous middle: a property-management system on one side, a CRM or a card processor on the other, and a service that has to keep them honest when the network blinks. Lately that middle also includes language-model agents, which only behave if the tools underneath them are boring and strict.",
    name: "Name",
    titleLabel: "Title",
    based: "Based in",
    email: "E-mail",
    phone: "Telephone",
    close: "Read the",
    experience: "experience",
    projects: "projects",
    note: "send a note",
    resume: "résumé",
  },
  experience: {
    title: "Experience",
    description: "Roles at Room Mate, Mastel, Vice Resell, Odyn AI, and Lenovo.",
    intro:
      "Five stops so far. It starts with a summer in infrastructure sales and ends with systems that have to exchange real data. The project write-ups live on the",
    projects: "projects",
    stack: "Stack",
  },
  projects: {
    title: "Projects",
    description: "Opera Cloud, Salesforce, hotel tools for agents, and Vice Resell.",
    intro:
      "A shelf of things that left my machine and ran for someone else. The jobs they belonged to are on the",
    experience: "experience",
    stack: "Stack",
  },
  skills: {
    title: "Skills",
    description: "Languages, infrastructure, cloud, databases, and the hospitality systems I work with.",
    intro: "The tools show up because a system needed them, not because the list looked long.",
  },
  education: {
    title: "Education",
    description: "Texas A&M University and Universidad Carlos III de Madrid.",
    intro: "Two degrees, one in Texas and one in Madrid. Both mix computing with how a business actually runs.",
  },
  contact: {
    title: "Contact",
    description: "E-mail Juan Diego Gómez or call.",
    intro:
      "The guestbook is electronic mail. Write if you have a system that needs to talk to another one, or if you just want to say hello.",
    email: "E-mail",
    phone: "Telephone",
    where: "Where",
    send: "Send a note",
    name: "Your name",
    subject: "Subject",
    message: "Message",
    submit: "Send e-mail",
    hint: "This opens your mail program with the note addressed to me. Nothing is stored on this site.",
    placeholder: "Hello",
    defaultSubject: "Hello from your web site",
    missingName: "(not given)",
    nameLine: "Name",
  },
  cv: {
    title: "Résumé",
    print: "Use your browser's print command for a paper copy. The sidebar stays off the page.",
    experience: "Experience",
    skills: "Skills",
    education: "Education",
    back: "Back to the home page",
  },
  missing: {
    title: "Page not found",
    body: "This address is not on the server. The page may have moved, or it was never here.",
    back: "Return to the home page",
  },
};

const es: Ui = {
  metaDescription:
    "Página personal de Juan Diego Gómez, ingeniero de software full stack en Madrid. Proyectos, experiencia y cómo escribirle.",
  skip: "Saltar al contenido",
  mastTitle: "Ingeniero de software full stack",
  nav: {
    menu: "Secciones",
    about: "Sobre mí",
    experience: "Experiencia",
    projects: "Proyectos",
    skills: "Habilidades",
    education: "Formación",
    contact: "Contacto",
    home: "Inicio",
    news: "Novedades",
  },
  footer: {
    home: "Inicio",
    news: "Novedades",
    guestbook: "Libro de visitas",
    email: "Correo",
    resume: "Currículum",
    visitor: "Eres el visitante",
    netscape:
      "Se ve mejor con Netscape Navigator 2.0 a 800×600. También vale el navegador que usas ahora.",
    updated: "Última actualización: 18 de octubre de 2026.",
  },
  langLabel: "Idioma",
  home: {
    title: "Juan Diego Gómez — Página personal",
    description:
      "Ingeniero de software full stack, centrado en backend, integraciones de hostelería y automatización de pagos.",
    welcome: "Bienvenido",
    reached: "Has llegado a la página personal de",
    engineer: "ingeniero de software full stack en",
    caption: "Yo, de Dios, tocando la guitarra.",
    features: "Secciones",
    news: "Novedades",
    items: [
      {
        href: "/about",
        title: "Sobre mí",
        text: "Quién soy, desde dónde trabajo y el tipo de sistemas que me gusta conectar.",
      },
      {
        href: "/experience",
        title: "Experiencia",
        text: "Room Mate, Mastel, Vice Resell, Odyn y unas primeras prácticas en Lenovo. Los puestos, los años y lo que salió de verdad.",
      },
      {
        href: "/projects",
        title: "Proyectos",
        text: "Opera Cloud, Salesforce, herramientas de hotel para agentes y un marketplace que fue adquirido.",
      },
      {
        href: "/skills",
        title: "Habilidades",
        text: "Python, FastAPI, Kubernetes, PostgreSQL, nube y la pila de hostelería que integro.",
      },
      {
        href: "/education",
        title: "Formación",
        text: "Informática y Empresa en Texas A&M, y Gestión y Tecnología en la Universidad Carlos III.",
      },
      {
        href: "/contact",
        title: "Contacto",
        text: "Correo electrónico y teléfono. Sigo contestando a los dos.",
      },
    ],
    updates: [
      {
        year: "2026",
        href: "/experience#room-mate",
        before: "Entré en ",
        label: "Room Mate Hospitality Group",
        after: " para encargarme de la integración de Opera Cloud y Salesforce, y de las herramientas de agentes que van encima.",
      },
      {
        year: "2023",
        href: "/projects#vice-resell",
        before: "",
        label: "Vice Resell",
        after: " superó los 10.000 usuarios. La empresa fue adquirida después.",
      },
      {
        year: "2023",
        href: "/experience#mastel",
        before: "",
        label: "Pagos de check-in",
        after: " entre FreedomPay y Opera para Marriott, Atlantis y Pestana.",
      },
      {
        year: "2022",
        href: "/experience#odyn",
        before: "",
        label: "Odyn AI",
        after: ", llevando voz a texto a Zoom y Teams.",
      },
      {
        year: "2022",
        href: "/experience#lenovo",
        before: "",
        label: "Lenovo",
        after: ", unas prácticas de verano en Madrid con el grupo de ventas de infraestructura.",
      },
    ],
  },
  about: {
    title: "Sobre mí",
    description:
      "Ingeniero de software full stack, centrado en backend, integraciones de hostelería y automatización de pagos.",
    portraitAlt: "Juan Diego Gómez en el escenario, vestido de Dios, con gafas de sol, tocando una guitarra eléctrica.",
    portraitCaption: "Soy yo, actuando de Dios y tocando la guitarra.",
    middle:
      "El trabajo suele ser el tramo poco glamuroso del medio: un sistema de gestión hotelera a un lado, un CRM o un procesador de tarjetas al otro, y un servicio que tiene que mantenerlos en orden cuando la red parpadea. Últimamente ese tramo también incluye agentes de modelos de lenguaje, que solo se portan bien si las herramientas de debajo son aburridas y estrictas.",
    name: "Nombre",
    titleLabel: "Título",
    based: "Dónde",
    email: "Correo",
    phone: "Teléfono",
    close: "Lee la",
    experience: "experiencia",
    projects: "proyectos",
    note: "envía una nota",
    resume: "currículum",
  },
  experience: {
    title: "Experiencia",
    description: "Puestos en Room Mate, Mastel, Vice Resell, Odyn AI y Lenovo.",
    intro:
      "Cinco paradas hasta ahora. Empieza con un verano en ventas de infraestructura y acaba en sistemas que tienen que intercambiar datos de verdad. Las fichas están en la página de",
    projects: "proyectos",
    stack: "Tecnologías",
  },
  projects: {
    title: "Proyectos",
    description: "Opera Cloud, Salesforce, herramientas de hotel para agentes y Vice Resell.",
    intro:
      "Una estantería de cosas que salieron de mi máquina y funcionaron para otra persona. Los trabajos a los que pertenecían están en la página de",
    experience: "experiencia",
    stack: "Tecnologías",
  },
  skills: {
    title: "Habilidades",
    description: "Lenguajes, infraestructura, nube, bases de datos y los sistemas de hostelería con los que trabajo.",
    intro: "Las herramientas aparecen porque un sistema las necesitaba, no porque la lista quedara larga.",
  },
  education: {
    title: "Formación",
    description: "Texas A&M University y Universidad Carlos III de Madrid.",
    intro: "Dos títulos, uno en Texas y otro en Madrid. Los dos mezclan la informática con cómo funciona de verdad un negocio.",
  },
  contact: {
    title: "Contacto",
    description: "Escribe a Juan Diego Gómez o llama.",
    intro:
      "El libro de visitas es el correo electrónico. Escribe si tienes un sistema que tiene que hablar con otro, o si solo quieres saludar.",
    email: "Correo",
    phone: "Teléfono",
    where: "Dónde",
    send: "Enviar una nota",
    name: "Tu nombre",
    subject: "Asunto",
    message: "Mensaje",
    submit: "Enviar correo",
    hint: "Esto abre tu programa de correo con la nota dirigida a mí. En este sitio no se guarda nada.",
    placeholder: "Hola",
    defaultSubject: "Hola desde tu página web",
    missingName: "(sin nombre)",
    nameLine: "Nombre",
  },
  cv: {
    title: "Currículum",
    print: "Usa el comando de imprimir del navegador para una copia en papel. La barra lateral no sale en la página.",
    experience: "Experiencia",
    skills: "Habilidades",
    education: "Formación",
    back: "Volver al inicio",
  },
  missing: {
    title: "Página no encontrada",
    body: "Esta dirección no está en el servidor. La página se ha movido, o nunca estuvo aquí.",
    back: "Volver al inicio",
  },
};

export const ui: Record<Lang, Ui> = { en, es };
