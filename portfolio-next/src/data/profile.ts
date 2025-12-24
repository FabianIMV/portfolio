export const profile = {
    name: 'Fabián Muñoz V.',
    role: 'Site Reliability Engineer',
    company: 'Banco Falabella',
    location: 'Santiago, Chile',
    email: 'fabianignaciomv@gmail.com',
    linkedin: 'https://linkedin.com/in/fabianimv',
    github: 'https://github.com/FabianIMV',
    bio: {
        es: '3+ años construyendo sistemas observables de alta disponibilidad. Especializado en Golden Signals, SLI/SLO, correlación de incidentes y automatización.',
        en: '3+ years building high-availability observable systems. Specialized in Golden Signals, SLI/SLO, incident correlation and automation.',
    },
    careerStartDate: '2022-11-01',
};

export const experience = [
    {
        version: 'v3.0.0',
        status: 'ACTIVE',
        company: 'Banco Falabella',
        role: 'Site Reliability Engineer',
        period: 'Oct 2025 - Present',
        namespace: 'banking',
        description: {
            es: 'SRE para infraestructura de banca digital. Kafka monitoring, Golden Signals, respuesta a incidentes 24/7.',
            en: 'SRE for digital banking infrastructure. Kafka monitoring, Golden Signals, 24/7 incident response.',
        },
        tags: ['Kubernetes', 'Datadog', 'Grafana', 'Prometheus', 'Terraform', 'Kafka', 'Splunk', 'Nagios', 'AppDynamics'],
    },
    {
        version: 'v2.x',
        status: 'STABLE',
        company: 'Innfinit SpA',
        role: 'SRE Consultant',
        period: 'Nov 2022 - Oct 2025',
        namespace: 'consulting',
        description: {
            es: 'Consultoría SRE para cliente gran aseguradora. Plataformas de observabilidad multi-región.',
            en: 'SRE consulting for large insurance client. Multi-region observability platforms.',
        },
        tags: ['AWS', 'Grafana', 'Prometheus', 'Terraform'],
    },
    {
        version: 'v1.x',
        status: 'LEGACY',
        company: 'Recomin SM',
        role: 'Technical Support',
        period: 'Jul 2022 - Nov 2022',
        namespace: 'startup',
        description: {
            es: 'Desarrollo fullstack inicial. Base sólida en desarrollo web.',
            en: 'Initial fullstack development. Solid foundation in web development.',
        },
        tags: ['Technical Support', 'Excel', 'Windows'],
    },
];

export const skills = {
    observability: [
        { name: 'Datadog', level: 95 },
        { name: 'Grafana', level: 90 },
        { name: 'Prometheus', level: 88 },
        { name: 'ELK Stack', level: 82 },
        { name: 'Splunk', level: 75 },
    ],
    cloud: [
        { name: 'AWS', level: 92 },
        { name: 'Kubernetes', level: 90 },
        { name: 'Terraform', level: 85 },
        { name: 'Docker', level: 80 },
    ],
    development: [
        { name: 'Python', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'Bash', level: 80 },
        { name: 'Go', level: 65 },
    ],
};

export const projects = [
    {
        name: 'True Q',
        url: 'https://trueq-vercel.vercel.app/',
        tech: 'ML, React',
        description: 'ML-powered quiz application',
    },
    {
        name: 'Chile Dashboard',
        url: 'https://fabianignaciomv.grafana.net/dashboard/snapshot/3d7TxzqNkU9CLAoX0fQPGjXE1t3f17dT',
        tech: 'Grafana, APIs',
        description: 'Real-time Chile economic indicators',
    },
    {
        name: 'Gemini Checker',
        url: 'https://fabianimv.github.io/gemini-models-health-checker/',
        tech: 'API Monitor',
        description: 'Gemini AI models health checker',
    },
    {
        name: 'Ferremas',
        url: 'https://ferremas.vercel.app/',
        tech: 'E-commerce',
        description: 'Hardware store e-commerce',
    },
    {
        name: 'Kafka Lab',
        url: 'https://github.com/FabianIMV/kafka-home-lab',
        tech: 'Infrastructure',
        description: 'Kafka home lab setup',
    },
    {
        name: 'Learn Piano',
        url: 'https://fabianimv.github.io/learn-piano/',
        tech: 'Claude AI',
        description: 'AI-powered piano learning',
    },
];

export const certifications = [
    'AWS Certified Cloud Practitioner',
    'Microsoft Azure AI Fundamentals',
    'DevOps Essentials Professional Certificate',
];
