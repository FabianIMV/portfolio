// ========================================
// ULTRA MODERN PORTFOLIO WITH VISUAL EFFECTS
// ========================================

// Wait for DOM, Alpine.js and all resources to load
window.addEventListener('load', () => {
    // Wait a bit more to ensure Alpine.js has fully initialized
    setTimeout(() => {
        initCustomCursor();
        initMouseGradient();
        initTypingEffect();
        initThreeJS();
        initGSAPAnimations();
        initScrollEffects();
        initScrollReveal();
        initSpotlightCards();
        initMagneticButtons();
        initAIChatbot();
    }, 100);
});

// ========== TYPING EFFECT ==========
function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;
    
    // Phrases from README profile
    const phrases = [
        '🔭 Building Observable Systems',
        '🚀 Golden Signals | SLI/SLO | MTTR',
        '🎯 3+ Years in Observability & Monitoring',
        '📊 High-Availability Architecture',
        '🔥 Incident Correlation & Root Cause',
        '☁️ AWS | Kubernetes | Terraform'
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    
    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    // Start typing after a small delay
    setTimeout(type, 1000);
}

// ========== MOUSE GRADIENT FOLLOW ==========
function initMouseGradient() {
    const gradient = document.getElementById('mouseGradient');
    if (!gradient || window.innerWidth <= 768) return;
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let gradientX = mouseX;
    let gradientY = mouseY;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateGradient() {
        gradientX += (mouseX - gradientX) * 0.08;
        gradientY += (mouseY - gradientY) * 0.08;
        gradient.style.left = `${gradientX}px`;
        gradient.style.top = `${gradientY}px`;
        requestAnimationFrame(animateGradient);
    }
    animateGradient();
}

// ========== SCROLL REVEAL ANIMATIONS ==========
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-scale');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    reveals.forEach(el => observer.observe(el));
}

// ========== SPOTLIGHT EFFECT ON CARDS ==========
function initSpotlightCards() {
    const cards = document.querySelectorAll('.spotlight-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Update the ::before position
            const before = card.querySelector('.spotlight-before') || card;
            before.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(99, 102, 241, 0.1), transparent 40%)`;
        });
    });
}

// ========== MAGNETIC BUTTON EFFECT ==========
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.magnetic-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

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

// ========== THREE.JS 3D BACKGROUND - ULTRA ==========
function initThreeJS() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles with multiple colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 3000 : 8000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const colors = [
        { r: 0.388, g: 0.4, b: 0.945 },    // Indigo
        { r: 0.024, g: 0.714, b: 0.831 },   // Cyan
        { r: 0.545, g: 0.361, b: 0.965 }    // Purple
    ];

    for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        posArray[i3] = (Math.random() - 0.5) * 120;
        posArray[i3 + 1] = (Math.random() - 0.5) * 120;
        posArray[i3 + 2] = (Math.random() - 0.5) * 120;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        colorsArray[i3] = color.r;
        colorsArray[i3 + 1] = color.g;
        colorsArray[i3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Floating geometric shapes
    const shapes = [];
    
    // Torus Knot
    const torusKnotGeometry = new THREE.TorusKnotGeometry(8, 2.5, 100, 16);
    const torusKnotMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
    torusKnot.position.set(25, 10, -30);
    scene.add(torusKnot);
    shapes.push({ mesh: torusKnot, speed: { x: 0.003, y: 0.005 } });

    // Icosahedron
    const icoGeometry = new THREE.IcosahedronGeometry(6, 0);
    const icoMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const ico = new THREE.Mesh(icoGeometry, icoMaterial);
    ico.position.set(-30, -15, -20);
    scene.add(ico);
    shapes.push({ mesh: ico, speed: { x: 0.008, y: 0.004 } });

    // Octahedron
    const octGeometry = new THREE.OctahedronGeometry(5, 0);
    const octMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        wireframe: true,
        transparent: true,
        opacity: 0.18
    });
    const oct = new THREE.Mesh(octGeometry, octMaterial);
    oct.position.set(20, -20, -25);
    scene.add(oct);
    shapes.push({ mesh: oct, speed: { x: 0.006, y: 0.007 } });

    // Ring
    const ringGeometry = new THREE.TorusGeometry(12, 0.5, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        wireframe: true,
        transparent: true,
        opacity: 0.12
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(-20, 20, -35);
    scene.add(ring);
    shapes.push({ mesh: ring, speed: { x: 0.002, y: 0.006 } });

    camera.position.z = 40;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth camera movement
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;

        particlesMesh.rotation.y += 0.0008;
        particlesMesh.rotation.x += 0.0003;

        // Animate shapes
        shapes.forEach(shape => {
            shape.mesh.rotation.x += shape.speed.x;
            shape.mesh.rotation.y += shape.speed.y;
        });

        // Camera follows mouse smoothly
        camera.position.x += (targetX * 8 - camera.position.x) * 0.03;
        camera.position.y += (targetY * 8 - camera.position.y) * 0.03;
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

// API Endpoint configurado después del deployment
const API_ENDPOINT = window.CHATBOT_API_ENDPOINT || null;

async function detectLanguage(message) {
    const spanishWords = ['hola', 'qué', 'cómo', 'dónde', 'cuándo', 'por qué', 'experiencia', 'proyectos', 'habilidades', 'contacto'];
    const lowerMessage = message.toLowerCase();

    for (const word of spanishWords) {
        if (lowerMessage.includes(word)) {
            return 'es';
        }
    }

    return 'en';
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
        // Verificar si hay endpoint configurado
        if (!API_ENDPOINT) {
            console.log('API endpoint no configurado, usando respuestas básicas');
            return getBasicResponse(message, detectedLang);
        }

        // Llamar a la Lambda a través de API Gateway
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.message) {
            return data.message;
        } else {
            throw new Error('No response content received');
        }

    } catch (error) {
        console.error('Error llamando a la API:', error);
        return getBasicResponse(message, detectedLang);
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
