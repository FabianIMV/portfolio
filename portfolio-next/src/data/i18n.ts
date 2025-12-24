// Simple i18n for terminal
export type Lang = 'es' | 'en';

export const t = {
    welcome: {
        es: "Bienvenido al Portfolio Terminal de Fabián",
        en: "Welcome to Fabián's SRE Terminal Portfolio"
    },
    helpTip: {
        es: "Escribe help si necesitas ayuda para explorar lo que puedes hacer aquí",
        en: "Type help if you need help to explore what you can do here"
    },
    tryNeofetch: {
        es: "O prueba neofetch para una vista rápida",
        en: "Or try neofetch for a quick overview"
    },
    availableCommands: {
        es: "COMANDOS DISPONIBLES",
        en: "AVAILABLE COMMANDS"
    },
    tip: {
        es: "Tip: Tab=autocompletado, ↑↓=historial",
        en: "Tip: Tab=autocomplete, ↑↓=history"
    },
    commands: {
        whoami: { es: "Mostrar mi perfil", en: "Show my profile" },
        neofetch: { es: "Info del sistema estilo SRE", en: "System info SRE style" },
        contact: { es: "Datos de contacto", en: "Contact details" },
        ls: { es: "Listar secciones", en: "List sections" },
        cat: { es: "Ver una sección", en: "View a section" },
        skills: { es: "Habilidades técnicas", en: "Technical skills" },
        projects: { es: "Proyectos personales", en: "Personal projects" },
        certs: { es: "Certificaciones", en: "Certifications" },
        kubectl: { es: "Comandos Kubernetes", en: "Kubernetes commands" },
        docker: { es: "Comandos Docker", en: "Docker commands" },
        incident: { es: "Simular incidente", en: "Trigger incident sim" },
        resolve: { es: "Resolver incidente", en: "Resolve incident" },
        clear: { es: "Limpiar terminal", en: "Clear terminal" },
        matrix: { es: "Easter egg", en: "Easter egg" },
        exit: { es: "Volver al portfolio", en: "Back to portfolio" },
    },
    cmdNotFound: {
        es: "Comando no encontrado",
        en: "Command not found"
    },
    forHelp: {
        es: "Escribe help para ver comandos disponibles.",
        en: "Type help for available commands."
    },
    backToPortfolio: {
        es: "Volviendo al portfolio...",
        en: "Returning to portfolio..."
    },
    technicalSkills: {
        es: "Habilidades Técnicas",
        en: "Technical Skills"
    },
    personalProjects: {
        es: "Proyectos Personales",
        en: "Personal Projects"
    },
    certifications: {
        es: "Certificaciones",
        en: "Certifications"
    },
    contactInfo: {
        es: "Información de Contacto",
        en: "Contact Information"
    },
    incidentResolved: {
        es: "✅ ¡Incidente resuelto!",
        en: "✅ Incident resolved!"
    }
};

export function getLang(): Lang {
    if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('es')) return 'es';
    }
    return 'en';
}
