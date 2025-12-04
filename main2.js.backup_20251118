// ========================================
// MODERN PORTFOLIO WITH GSAP ANIMATIONS
// ========================================

// Wait for DOM, Alpine.js and all resources to load
window.addEventListener('load', () => {
    // Wait a bit more to ensure Alpine.js has fully initialized
    setTimeout(() => {
        initCustomCursor();
        initThreeJS();
        initGSAPAnimations();
        initScrollEffects();
        initAIChatbot();
    }, 100);
});

// ========== CUSTOM CURSOR ==========
function initCustomCursor() {
    if (window.innerWidth <= 768) return; // Skip on mobile

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.opacity = '1';
    document.body.appendChild(cursor);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.2;
        cursorY += dy * 0.2;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effect - use setTimeout to ensure elements exist
    setTimeout(() => {
        const hoverElements = document.querySelectorAll('a, button, .cyber-card, .tech-item, input, textarea');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }, 500);
}

// ========== THREE.JS 3D BACKGROUND ==========
function initThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 2000 : 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Geometric shapes
    const torusGeometry = new THREE.TorusGeometry(10, 1, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
        color: 0x667eea,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x764ba2,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = -20;
    sphere.position.y = 10;
    scene.add(sphere);

    camera.position.z = 30;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        torus.rotation.x += 0.01;
        torus.rotation.y += 0.005;
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.01;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========== GSAP ANIMATIONS ==========
function initGSAPAnimations() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Hero section animations
    const tl = gsap.timeline({ delay: 0.3 });

    const profilePhoto = document.querySelector('.profile-photo');
    const glitchElement = document.querySelector('.glitch');
    const homeSubtitle = document.querySelector('#home .text-2xl');
    const homeParagraph = document.querySelector('#home p');
    const homeButtons = document.querySelectorAll('#home .flex.gap-4 a');
    const techItemsHero = document.querySelectorAll('.tech-item');

    if (profilePhoto) {
        tl.fromTo(profilePhoto,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', clearProps: 'all' }
        );
    }

    if (glitchElement) {
        tl.fromTo(glitchElement,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'all' },
            '-=0.5'
        );
    }

    if (homeSubtitle) {
        tl.fromTo(homeSubtitle,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' },
            '-=0.4'
        );
    }

    if (homeParagraph) {
        tl.fromTo(homeParagraph,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', clearProps: 'all' },
            '-=0.3'
        );
    }

    if (homeButtons.length > 0) {
        tl.fromTo(homeButtons,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', clearProps: 'all' },
            '-=0.2'
        );
    }

    if (techItemsHero.length > 0) {
        tl.fromTo(techItemsHero,
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: 'back.out(1.7)', clearProps: 'all' },
            '-=0.3'
        );
    }

    // Navbar scroll effect
    gsap.to('.navbar', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '100px top',
            scrub: true,
        },
        backgroundColor: 'rgba(15, 15, 35, 0.9)',
        backdropFilter: 'blur(20px)',
    });

    // Simple fade-in animations for sections when they enter viewport
    const sections = ['#experience', '#projects', '#skills', '#contact'];

    sections.forEach(section => {
        const sectionEl = document.querySelector(section);
        if (!sectionEl) return;

        // Animate section title
        const title = sectionEl.querySelector('h2');
        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'top 20%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }
            );
        }

        // Animate cards with simple fade
        const cards = sectionEl.querySelectorAll('.cyber-card');
        if (cards.length > 0) {
            cards.forEach((card, index) => {
                gsap.fromTo(card,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 90%',
                            end: 'top 20%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: 'power2.out'
                    }
                );

                // Add hover 3D effect
                card.addEventListener('mouseenter', () => {
                    gsap.to(card, {
                        scale: 1.02,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    gsap.to(card, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            });
        }
    });

    // Contact section - simple hover effect
    const contactLinks = document.querySelectorAll('#contact a');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Smooth scroll
    gsap.registerPlugin(ScrollToPlugin);
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// ========== SCROLL EFFECTS ==========
function initScrollEffects() {
    const scrollProgress = document.getElementById('scrollProgress');

    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
}

// ========== AI CHATBOT ==========
let conversationLanguage = null;
let aiChatOpen = false;

function initAIChatbot() {
    window.toggleAIChat = toggleAIChat;
    window.sendAIMessage = sendAIMessage;
    window.handleAIKeyPress = handleAIKeyPress;
}

function updateChatPlaceholder() {
    const input = document.getElementById('aiChatInput');
    if (input) {
        try {
            const alpineElement = document.querySelector('[x-data]');
            const currentLang = alpineElement && alpineElement.__x && alpineElement.__x.$data
                ? alpineElement.__x.$data.lang
                : 'en';

            if (currentLang === 'es') {
                input.placeholder = 'Escribe tu pregunta...';
            } else {
                input.placeholder = 'Type your question...';
            }
        } catch (error) {
            input.placeholder = 'Type your question...';
        }
    }
}

function toggleAIChat() {
    const widget = document.getElementById('aiChatWidget');
    const button = document.getElementById('aiChatButton');
    aiChatOpen = !aiChatOpen;

    if (aiChatOpen) {
        widget.classList.remove('hidden');
        widget.classList.add('flex');

        // GSAP animation for opening
        gsap.from(widget, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)'
        });

        gsap.to(button.querySelector('.fa-robot'), {
            rotation: 360,
            duration: 0.5,
            ease: 'power2.out'
        });

        updateChatPlaceholder();
    } else {
        gsap.to(widget, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                widget.classList.add('hidden');
                widget.classList.remove('flex');
            }
        });
    }
}

function handleAIKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function getCurrentLang() {
    try {
        return document.querySelector('[x-data]').__x.$data.lang || 'en';
    } catch {
        return 'en';
    }
}

async function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();

    if (!message) return;

    addAIMessage(message, 'user');
    input.value = '';
    showAITyping();

    setTimeout(async () => {
        const response = await getAIResponse(message);
        hideAITyping();
        addAIMessage(response, 'ai');
    }, 1000 + Math.random() * 1000);
}

function addAIMessage(message, type) {
    const messagesContainer = document.getElementById('aiChatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex ' + (type === 'user' ? 'justify-end' : '');

    const bubbleClass = type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai';
    messageDiv.innerHTML = `
        <div class="${bubbleClass} text-white p-3 rounded-lg max-w-xs text-sm">
            ${message}
        </div>
    `;

    // GSAP animation for new message
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    messagesContainer.appendChild(messageDiv);

    gsap.to(messageDiv, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showAITyping() {
    const messagesContainer = document.getElementById('aiChatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'aiTypingIndicator';
    typingDiv.className = 'flex';
    typingDiv.innerHTML = `
        <div class="chat-bubble-ai text-white p-3 rounded-lg">
            <span class="typing-animation">●</span>
            <span class="typing-animation" style="animation-delay: 0.2s">●</span>
            <span class="typing-animation" style="animation-delay: 0.4s">●</span>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideAITyping() {
    const typingIndicator = document.getElementById('aiTypingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function detectLanguage(message) {
    try {
        if (!window.GEMINI_CONFIG || !window.GEMINI_CONFIG.apiKey) {
            return getCurrentLang();
        }

        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        const requestBody = {
            contents: [{
                parts: [{
                    text: `Detect the language of this message and respond ONLY with "es" for Spanish or "en" for English. Message: "${message}"`
                }]
            }]
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': window.GEMINI_CONFIG.apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            const data = await response.json();
            const detectedLang = data.candidates[0].content.parts[0].text.trim().toLowerCase();
            return detectedLang === 'es' ? 'es' : 'en';
        }
    } catch (error) {
        console.log('Language detection fallback');
    }

    return getCurrentLang();
}

async function getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('habla español') || lowerMessage.includes('speak spanish') || lowerMessage.includes('en español')) {
        conversationLanguage = 'es';
        return '¡Perfecto! Ahora te responderé en español. ¿En qué puedo ayudarte? 😊';
    }
    if (lowerMessage.includes('speak english') || lowerMessage.includes('habla inglés') || lowerMessage.includes('in english')) {
        conversationLanguage = 'en';
        return 'Perfect! Now I\'ll respond in English. How can I help you? 😊';
    }

    let detectedLang = await detectLanguage(message);

    if (conversationLanguage !== null && conversationLanguage !== detectedLang) {
        conversationLanguage = detectedLang;
    } else if (conversationLanguage === null) {
        conversationLanguage = detectedLang;
    }

    try {
        if (!window.GEMINI_CONFIG || !window.GEMINI_CONFIG.apiKey) {
            return getBasicResponse(message, detectedLang);
        }

        const portfolioContext = getPortfolioContext(detectedLang);

        const systemPrompt = detectedLang === 'es'
            ? `Eres un asistente personal de Fabián Muñoz. Responde de manera amigable y conversacional sobre su experiencia, proyectos y habilidades. Usa emojis ocasionalmente. Mantén las respuestas concisas (máximo 50 palabras). NO repitas saludos en cada respuesta. Enfócate en responder la pregunta específica. Para contacto, dirige a LinkedIn o formulario de contacto.

Contexto del portfolio:
${portfolioContext}

Responde siempre en español, siendo directo y útil.`
            : `You are Fabián Muñoz's personal assistant. Respond in a friendly and conversational manner about his experience, projects, and skills. Use emojis occasionally. Keep responses concise (max 50 words). DON'T repeat greetings in every response. Focus on answering the specific question. For contact, direct to LinkedIn or contact form.

Portfolio context:
${portfolioContext}

Always respond in English, being direct and helpful.`;

        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUsuario: ${message}`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 60
            }
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': window.GEMINI_CONFIG.apiKey
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response content received');
        }

    } catch (error) {
        return getBasicResponse(message, detectedLang);
    }
}

function getPortfolioContext(lang) {
    if (lang === 'es') {
        return `
PERFIL PROFESIONAL:
- Fabián Muñoz es Ingeniero en Computación y Analista Programador
- Se desempeña como Ingeniero en Observabilidad con 2 años de experiencia
- Site Reliability Engineer (SRE) en Innfinit desde noviembre 2022
- Especializado en observabilidad, monitoreo y confiabilidad de sistemas críticos

EXPERIENCIA:
- 2 años como Ingeniero en Observabilidad y SRE
- Especialista en monitoreo de sistemas críticos empresariales
- Participando en proyectos de arquitectura CN/Delta
- Experiencia con golden signals y gestión SLI/SLO
- Trabajo con infraestructura cloud y automatización

TECNOLOGÍAS:
- ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform
- 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda
- 🐍 Python, Jenkins, CI/CD

PROYECTOS:
- 🎵 YouTube Music Playlist Creator (40+ stars)
- 🥊 NutriCombat - PWA con IA
- 📊 Chile Dashboard en Grafana con datos oficiales
- 💼 Proyectos web True Q, Ferremás, Psicóloga Valeria Améstica, BYF

CONTACTO:
- 💼 LinkedIn: https://linkedin.com/in/fabianimv
- 📧 Para contacto directo, usar el formulario de contacto del sitio
- 🌐 Portfolio: https://fabianimv.github.io/portfolio`;
    } else {
        return `
PROFESSIONAL PROFILE:
- Fabián Muñoz is a Computer Engineer and Analyst Programmer
- Works as Observability Engineer with 2 years of experience
- Site Reliability Engineer (SRE) at Innfinit since November 2022
- Specialized in observability, monitoring and critical system reliability

EXPERIENCE:
- 2 years as Observability Engineer and SRE
- Specialist in critical enterprise system monitoring
- Participating in CN/Delta architecture projects
- Experience with golden signals and SLI/SLO management
- Working with cloud infrastructure and automation

TECHNOLOGIES:
- ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform
- 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda
- 🐍 Python, Jenkins, CI/CD

PROJECTS:
- 🎵 YouTube Music Playlist Creator (40+ stars)
- 🥊 NutriCombat - PWA with AI
- 📊 Chile Dashboard in Grafana with official data
- 💼 Web projects True Q, Ferremás, Psychologist Valeria Améstica, BYF

CONTACT:
- 💼 LinkedIn: https://linkedin.com/in/fabianimv
- 📧 For direct contact, use the site's contact form
- 🌐 Portfolio: https://fabianimv.github.io/portfolio`;
    }
}

function getBasicResponse(message, currentLang) {
    const lowerMessage = message.toLowerCase();

    const responsesES = {
        'hola': '¡Hola! 👋 ¿En qué puedo ayudarte a conocer más sobre Fabián?',
        'hello': '¡Hola! 👋 ¿En qué puedo ayudarte a conocer más sobre Fabián?',
        'experiencia': 'Fabián es especialista en SRE en Innfinit, enfocado en observabilidad y monitoreo de sistemas críticos. 📊',
        'experience': 'Fabián es especialista en SRE en Innfinit, enfocado en observabilidad y monitoreo de sistemas críticos. 📊',
        'proyectos': 'Sus proyectos destacados incluyen: 🎵 YouTube Music Playlist Creator (40+ stars), 🥊 NutriCombat - PWA para atletas de combate con IA, 📊 Dashboard Chile.',
        'projects': 'Sus proyectos destacados incluyen: 🎵 YouTube Music Playlist Creator (40+ stars), 🥊 NutriCombat - PWA para atletas de combate con IA.',
        'habilidades': 'Maneja: ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda, 🐍 Python.',
        'skills': 'Maneja: ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda, 🐍 Python.',
        'contacto': 'Contacto: 💼 LinkedIn: https://linkedin.com/in/fabianimv o usa el formulario de contacto del sitio 📧',
        'contact': 'Contacto: 💼 LinkedIn: https://linkedin.com/in/fabianimv o usa el formulario de contacto del sitio 📧',
    };

    const responsesEN = {
        'hola': 'Hello! 👋 How can I help you learn more about Fabián?',
        'hello': 'Hello! 👋 How can I help you learn more about Fabián?',
        'experiencia': 'Fabián is an SRE specialist at Innfinit, focused on observability and monitoring of critical systems. 📊',
        'experience': 'Fabián is an SRE specialist at Innfinit, focused on observability and monitoring of critical systems. 📊',
        'proyectos': 'His featured projects include: 🎵 YouTube Music Playlist Creator (40+ stars), 🥊 NutriCombat - PWA for combat athletes with AI.',
        'projects': 'His featured projects include: 🎵 YouTube Music Playlist Creator (40+ stars), 🥊 NutriCombat - PWA for combat athletes with AI.',
        'habilidades': 'He handles: ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda, 🐍 Python.',
        'skills': 'He handles: ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda, 🐍 Python.',
        'contacto': 'Contact: 💼 LinkedIn: https://linkedin.com/in/fabianimv or use the site contact form 📧',
        'contact': 'Contact: 💼 LinkedIn: https://linkedin.com/in/fabianimv or use the site contact form 📧',
    };

    const responses = currentLang === 'es' ? responsesES : responsesEN;

    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    const defaultResponses = currentLang === 'es' ? [
        '🤖 Interesante pregunta. Te recomiendo revisar las secciones de Experiencia, Proyectos y Habilidades del portfolio para más detalles.',
        '💡 ¿Te interesa algo específico sobre la experiencia SRE de Fabián? Puedo contarte sobre sus proyectos, habilidades técnicas o experiencia laboral.',
        '🔍 Puedo ayudarte con información sobre: experiencia, proyectos, habilidades, contacto, educación, o sus especialidades en SRE.'
    ] : [
        '🤖 Interesting question. I recommend checking the Experience, Projects and Skills sections of the portfolio for more details.',
        '💡 Are you interested in something specific about Fabián\'s SRE experience? I can tell you about his projects, technical skills or work experience.',
        '🔍 I can help you with information about: experience, projects, skills, contact, education, or his SRE specialties.'
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
