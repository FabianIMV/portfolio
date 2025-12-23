// ========================================
// ULTRA MODERN PORTFOLIO WITH VISUAL EFFECTS
// SRE CONTROL ROOM EDITION
// ========================================

// Wait for DOM, Alpine.js and all resources to load
window.addEventListener('load', () => {
    // Wait a bit more to ensure Alpine.js has fully initialized
    setTimeout(() => {
        // Custom cursor removed - using native device cursor
        initMouseGradient();
        initTypingEffect();
        initThreeJS();
        initGSAPAnimations();
        initScrollEffects();
        initScrollReveal();
        initSpotlightCards();
        initMagneticButtons();
        initAIChatbot();
        initSREMetrics(); // New SRE Control Room metrics
        initGrafanaCharts(); // Grafana-style dashboard
    }, 100);
});

// ========== SRE CONTROL ROOM METRICS ==========
function initSREMetrics() {
    // Update HUD clock every second
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const hudTime = document.getElementById('hudTime');
        if (hudTime) hudTime.textContent = timeStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // Simulated live metrics with random fluctuations
    function updateMetrics() {
        const latency = document.getElementById('latencyMetric');
        const cpu = document.getElementById('cpuMetric');
        const health = document.getElementById('healthMetric');
        const requests = document.getElementById('hudRequests');

        if (latency) {
            const latencyVal = 35 + Math.floor(Math.random() * 25);
            latency.textContent = latencyVal;
        }

        if (cpu) {
            const cpuVal = 18 + Math.floor(Math.random() * 20);
            cpu.textContent = cpuVal;
        }

        if (health) {
            const healthVal = (99.9 + Math.random() * 0.09).toFixed(2);
            health.textContent = healthVal;
        }

        if (requests) {
            const reqVal = 120 + Math.floor(Math.random() * 80);
            requests.textContent = reqVal;
        }
    }
    updateMetrics();
    setInterval(updateMetrics, 2000);

    // Random pod ID every 30 seconds (simulating pod restarts)
    function updatePodId() {
        const podId = document.getElementById('podId');
        if (podId) {
            const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            let id = '';
            for (let i = 0; i < 5; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            podId.textContent = id;
        }
    }
    setInterval(updatePodId, 30000);

    // Calculate uptime (days since Nov 2022 - start of SRE career)
    const sreStart = new Date('2022-11-01');
    const now = new Date();
    const uptimeDays = Math.floor((now - sreStart) / (1000 * 60 * 60 * 24));
    const uptimeCounter = document.getElementById('uptimeCounter');
    if (uptimeCounter) uptimeCounter.textContent = uptimeDays;

    // Also update career days in dashboard
    const careerDays = document.getElementById('careerDays');
    if (careerDays) careerDays.textContent = uptimeDays;

    // Animate visitor counter
    animateVisitorCounter();
}

// ========== VISITOR COUNTER ANIMATION ==========
function animateVisitorCounter() {
    const counter = document.getElementById('visitorCount');
    if (!counter) return;

    // Start with a base number and slowly increment
    let count = 2847;

    // Occasionally increment the counter
    setInterval(() => {
        if (Math.random() > 0.7) {
            count++;
            counter.textContent = count.toLocaleString();
        }
    }, 5000);
}

// ========== GRAFANA CHARTS ==========
let careerChart = null;

function initGrafanaCharts() {
    const ctx = document.getElementById('careerTimelineChart');
    if (!ctx) return;

    // Career growth data points (monthly averages)
    const labels = ['Jul 22', 'Nov 22', 'Mar 23', 'Jul 23', 'Nov 23', 'Mar 24', 'Jul 24', 'Nov 24', 'Mar 25', 'Dec 25'];
    const skillData = [30, 45, 55, 65, 72, 78, 82, 88, 92, 95]; // Skill growth %
    const projectsData = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]; // Cumulative projects

    careerChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Skill Level',
                    data: skillData,
                    borderColor: '#4ade80',
                    backgroundColor: 'rgba(74, 222, 128, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#4ade80',
                    pointBorderColor: '#4ade80',
                    borderWidth: 2
                },
                {
                    label: 'Projects',
                    data: projectsData.map(p => p * 9), // Scale to match
                    borderColor: '#22d3ee',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 2,
                    pointBackgroundColor: '#22d3ee',
                    borderWidth: 2,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#888',
                        font: { size: 10 },
                        boxWidth: 12,
                        padding: 10
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 17, 34, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#aaa',
                    borderColor: '#333',
                    borderWidth: 1,
                    padding: 10
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#666', font: { size: 9 } }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#4ade80',
                        font: { size: 9 },
                        callback: (value) => value + '%'
                    },
                    min: 0,
                    max: 100
                },
                y1: {
                    position: 'right',
                    grid: { display: false },
                    ticks: {
                        color: '#22d3ee',
                        font: { size: 9 },
                        callback: (value) => Math.round(value / 9)
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// Refresh Grafana charts with slight variations
function refreshGrafanaCharts() {
    if (!careerChart) return;

    // Add slight random variations to simulate live data
    careerChart.data.datasets[0].data = careerChart.data.datasets[0].data.map((val, i) => {
        const variation = Math.random() * 2 - 1;
        return Math.min(100, Math.max(0, val + variation));
    });

    careerChart.update('none');

    // Flash the refresh button
    const btn = document.querySelector('.grafana-refresh');
    if (btn) {
        btn.style.background = 'var(--terminal-grafana)';
        btn.style.color = 'white';
        setTimeout(() => {
            btn.style.background = '';
            btn.style.color = '';
        }, 500);
    }
}

// Make refresh function global
window.refreshGrafanaCharts = refreshGrafanaCharts;

// ========== DASHBOARD PANEL NAVIGATION ==========
function scrollToPanel(panelIndex) {
    const container = document.getElementById('panelsContainer');
    if (!container) return;

    const panelWidth = container.offsetWidth;
    container.scrollTo({
        left: panelIndex * panelWidth,
        behavior: 'smooth'
    });

    updateActiveSidebar(panelIndex);
    updateProgressIndicator(panelIndex);
}

function updateActiveSidebar(activeIndex) {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateProgressIndicator(activeIndex) {
    // Update dots
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, index) => {
        if (index === activeIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update scrubber fill
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const percentage = ((activeIndex + 1) / 5) * 100;
        progressFill.style.width = percentage + '%';
    }

    // Update panel number text
    const panelNum = document.getElementById('currentPanelNum');
    const panelNumEn = document.getElementById('currentPanelNumEn');
    if (panelNum) panelNum.textContent = activeIndex + 1;
    if (panelNumEn) panelNumEn.textContent = activeIndex + 1;
}

// ========== DASHBOARD SCROLL TRACKING ==========
function initDashboardScrollTracking() {
    const container = document.getElementById('panelsContainer');
    if (!container) return;

    let scrollTimeout;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const panelWidth = container.offsetWidth;
            const scrollLeft = container.scrollLeft;
            const activeIndex = Math.round(scrollLeft / panelWidth);

            updateActiveSidebar(activeIndex);
            updateProgressIndicator(activeIndex);
        }, 50);
    });
}

// Initialize dashboard tracking on load
window.addEventListener('load', () => {
    setTimeout(() => {
        initDashboardScrollTracking();

        // Hide original content wrapper and navbar in dashboard mode
        const nav = document.getElementById('navbar');
        const contentWrapper = document.querySelector('.content-wrapper');
        const scrollIndicator = document.getElementById('scrollIndicator');

        if (nav) nav.style.display = 'none';
        if (contentWrapper) contentWrapper.style.display = 'none';
        if (scrollIndicator) scrollIndicator.style.display = 'none';
    }, 200);
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

// ========== CUSTOM CURSOR - INSTANT SRE CROSSHAIR ==========
function initCustomCursor() {
    if (window.innerWidth <= 768) return; // Skip on mobile

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';

    // Add center dot
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    cursor.appendChild(dot);

    document.body.appendChild(cursor);

    // INSTANT cursor movement - no easing
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Cursor hover effect
    setTimeout(() => {
        const hoverElements = document.querySelectorAll('a, button, .cyber-card, .tech-item, input, textarea, .widget-card, .sidebar-item');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    }, 500);
}

// ========== THREE.JS 3D BACKGROUND - ABSTRACT DATA FLOW ==========
function initThreeJS() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Color Palette
    const palette = {
        bg: 0x030014,
        cyan: 0x06b6d4,
        purple: 0x8b5cf6,
        green: 0x10b981,
        pink: 0xec4899,
        amber: 0xf59e0b,
        white: 0xffffff
    };

    // ======= STARFIELD BACKGROUND =======
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 6000;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPos[i3] = (Math.random() - 0.5) * 1000;
        starPos[i3 + 1] = (Math.random() - 0.5) * 1000;
        starPos[i3 + 2] = (Math.random() - 0.5) * 1000;

        // Mix of white and colored stars
        const colorChoice = Math.random();
        if (colorChoice > 0.7) {
            starColors[i3] = 0.4; starColors[i3 + 1] = 0.8; starColors[i3 + 2] = 1; // Cyan
        } else if (colorChoice > 0.5) {
            starColors[i3] = 0.6; starColors[i3 + 1] = 0.4; starColors[i3 + 2] = 1; // Purple
        } else {
            starColors[i3] = 1; starColors[i3 + 1] = 1; starColors[i3 + 2] = 1; // White
        }
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ======= SECTION NODES (Floating Geometric Shapes) =======
    const sectionNodes = [];
    const sectionData = [
        { name: 'Home', color: palette.cyan, pos: { x: 0, y: 0, z: 0 }, shape: 'icosahedron', size: 8 },
        { name: 'Experience', color: palette.purple, pos: { x: -60, y: 30, z: -80 }, shape: 'octahedron', size: 10 },
        { name: 'Projects', color: palette.green, pos: { x: 80, y: -20, z: -120 }, shape: 'dodecahedron', size: 12 },
        { name: 'Skills', color: palette.amber, pos: { x: -40, y: -50, z: -180 }, shape: 'tetrahedron', size: 10 },
        { name: 'Contact', color: palette.pink, pos: { x: 50, y: 40, z: -250 }, shape: 'icosahedron', size: 8 }
    ];

    sectionData.forEach((data, index) => {
        const group = new THREE.Group();
        group.position.set(data.pos.x, data.pos.y, data.pos.z);

        // Create geometry based on shape type
        let geometry;
        switch (data.shape) {
            case 'octahedron': geometry = new THREE.OctahedronGeometry(data.size); break;
            case 'dodecahedron': geometry = new THREE.DodecahedronGeometry(data.size); break;
            case 'tetrahedron': geometry = new THREE.TetrahedronGeometry(data.size); break;
            default: geometry = new THREE.IcosahedronGeometry(data.size);
        }

        // Wireframe outer shell
        const wireMat = new THREE.MeshBasicMaterial({
            color: data.color,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const wireMesh = new THREE.Mesh(geometry, wireMat);
        group.add(wireMesh);

        // Solid inner core (smaller)
        const coreGeometry = geometry.clone();
        const coreMat = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.2
        });
        const coreMesh = new THREE.Mesh(coreGeometry, coreMat);
        coreMesh.scale.set(0.6, 0.6, 0.6);
        group.add(coreMesh);

        // Glow ring
        const ringGeo = new THREE.RingGeometry(data.size * 1.5, data.size * 1.8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: data.color,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);

        scene.add(group);
        sectionNodes.push({
            group: group,
            wire: wireMesh,
            core: coreMesh,
            ring: ring,
            data: data,
            rotationSpeed: { x: 0.002 + Math.random() * 0.002, y: 0.003 + Math.random() * 0.002 }
        });
    });

    // ======= PARTICLE STREAMS BETWEEN NODES =======
    const streamParticles = [];
    const streamConnections = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [0, 3], [1, 2]];

    streamConnections.forEach(([fromIdx, toIdx]) => {
        const from = sectionData[fromIdx].pos;
        const to = sectionData[toIdx].pos;

        // Create particles along the path
        const particleCount = 30;
        const streamGeo = new THREE.BufferGeometry();
        const streamPos = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            streamPos[i * 3] = from.x + (to.x - from.x) * t;
            streamPos[i * 3 + 1] = from.y + (to.y - from.y) * t;
            streamPos[i * 3 + 2] = from.z + (to.z - from.z) * t;
        }

        streamGeo.setAttribute('position', new THREE.BufferAttribute(streamPos, 3));

        const streamMat = new THREE.PointsMaterial({
            color: palette.cyan,
            size: 1.5,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const stream = new THREE.Points(streamGeo, streamMat);
        scene.add(stream);

        streamParticles.push({
            mesh: stream,
            from: from,
            to: to,
            offset: Math.random() * Math.PI * 2
        });
    });

    // ======= FLOATING ALERT COMETS =======
    const comets = [];
    const alertMessages = ['Deploy ✓', 'SLO 99.9%', 'Latency OK', 'CPU: 23%', 'Pods: Healthy'];

    function createComet() {
        const cometGroup = new THREE.Group();

        // Comet head
        const headGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const headMat = new THREE.MeshBasicMaterial({ color: palette.green, transparent: true, opacity: 0.9 });
        const head = new THREE.Mesh(headGeo, headMat);
        cometGroup.add(head);

        // Trail
        const trailGeo = new THREE.BufferGeometry();
        const trailMat = new THREE.LineBasicMaterial({ color: palette.green, transparent: true, opacity: 0.5 });
        const trail = new THREE.Line(trailGeo, trailMat);
        cometGroup.add(trail);

        // Random start position
        const angle = Math.random() * Math.PI * 2;
        const radius = 50 + Math.random() * 100;
        const height = (Math.random() - 0.5) * 100;
        cometGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);

        scene.add(cometGroup);

        comets.push({
            group: cometGroup,
            head: head,
            trail: trail,
            velocity: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.8 - 0.5),
            history: [],
            message: alertMessages[Math.floor(Math.random() * alertMessages.length)]
        });
    }

    for (let i = 0; i < 8; i++) createComet();

    // ======= CAMERA SETUP & NAVIGATION =======
    camera.position.set(0, 15, 50);
    camera.lookAt(0, 0, 0);

    let currentSection = 0;
    let isAnimating = false;
    let mouseX = 0, mouseY = 0;

    // Fly to section function (exposed globally)
    window.flyToSection = (index) => {
        if (isAnimating || index === currentSection) return;
        isAnimating = true;

        const prevSection = currentSection;
        currentSection = index;

        const target = sectionData[index];
        const offset = { x: 15, y: 10, z: 40 }; // Camera offset from node

        // First, hide the current panel immediately
        document.querySelectorAll('.dashboard-panel').forEach((panel, i) => {
            if (i === prevSection) {
                panel.classList.remove('panel-visible');
            }
        });

        // Fly camera to new section (FASTER)
        gsap.to(camera.position, {
            x: target.pos.x + offset.x,
            y: target.pos.y + offset.y,
            z: target.pos.z + offset.z,
            duration: 1.2,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating = false;
            }
        });

        // Animate look target
        const lookTarget = { x: camera.position.x, y: camera.position.y, z: camera.position.z - 50 };
        gsap.to(lookTarget, {
            x: target.pos.x,
            y: target.pos.y,
            z: target.pos.z,
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
            }
        });

        // Show new panel AFTER camera arrives (emerge from geometry)
        setTimeout(() => {
            document.querySelectorAll('.dashboard-panel').forEach((panel, i) => {
                if (i === index) {
                    panel.classList.add('panel-visible');
                }
            });
        }, 1000); // Faster delay

        // Update sidebar active state
        updateActiveSidebar(index);
    };

    // Override scrollToPanel to use flyToSection
    window.scrollToPanel = (index) => {
        window.flyToSection(index);
    };

    // Keyboard navigation (Arrow keys)
    document.addEventListener('keydown', (e) => {
        if (isAnimating) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            const nextSection = Math.min(currentSection + 1, sectionData.length - 1);
            window.flyToSection(nextSection);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            const prevSection = Math.max(currentSection - 1, 0);
            window.flyToSection(prevSection);
        }
    });

    // Touch swipe navigation
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Check horizontal swipe (more than 50px and more horizontal than vertical)
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                // Swipe left -> next section
                const nextSection = Math.min(currentSection + 1, sectionData.length - 1);
                window.flyToSection(nextSection);
            } else {
                // Swipe right -> previous section
                const prevSection = Math.max(currentSection - 1, 0);
                window.flyToSection(prevSection);
            }
        }
    }, { passive: true });

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ======= ANIMATION LOOP =======
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Rotate starfield slowly
        stars.rotation.y += 0.0001;
        stars.rotation.x += 0.00005;

        // Animate section nodes
        sectionNodes.forEach((node, idx) => {
            node.wire.rotation.x += node.rotationSpeed.x;
            node.wire.rotation.y += node.rotationSpeed.y;
            node.core.rotation.x -= node.rotationSpeed.x * 0.5;
            node.core.rotation.y -= node.rotationSpeed.y * 0.5;
            node.ring.rotation.z += 0.005;

            // Pulse effect
            const pulse = Math.sin(time * 2 + idx) * 0.1 + 1;
            node.ring.scale.set(pulse, pulse, 1);
            node.wire.material.opacity = 0.3 + Math.sin(time * 1.5 + idx) * 0.1;
        });

        // Animate particle streams
        streamParticles.forEach((stream, idx) => {
            const positions = stream.mesh.geometry.attributes.position.array;
            const particleCount = positions.length / 3;

            for (let i = 0; i < particleCount; i++) {
                const baseT = (i / particleCount + time * 0.1 + stream.offset) % 1;
                positions[i * 3] = stream.from.x + (stream.to.x - stream.from.x) * baseT;
                positions[i * 3 + 1] = stream.from.y + (stream.to.y - stream.from.y) * baseT + Math.sin(time * 3 + i) * 2;
                positions[i * 3 + 2] = stream.from.z + (stream.to.z - stream.from.z) * baseT;
            }
            stream.mesh.geometry.attributes.position.needsUpdate = true;
        });

        // Animate comets
        comets.forEach(comet => {
            comet.group.position.add(comet.velocity);
            comet.history.push(comet.group.position.clone());
            if (comet.history.length > 15) comet.history.shift();

            if (comet.history.length > 1) {
                comet.trail.geometry.setFromPoints(comet.history);
            }

            // Reset if too far
            if (comet.group.position.length() > 300 || comet.group.position.z < -350) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 50 + Math.random() * 100;
                comet.group.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 100, Math.sin(angle) * radius);
                comet.history = [];
            }
        });

        // Mouse parallax (only when not animating)
        if (!isAnimating) {
            camera.position.x += (mouseX * 3 - (camera.position.x - sectionData[currentSection].pos.x - 15)) * 0.02;
            camera.position.y += (-mouseY * 3 - (camera.position.y - sectionData[currentSection].pos.y - 10)) * 0.02;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Initial panel visibility - only first panel visible
    document.querySelectorAll('.dashboard-panel').forEach((panel, i) => {
        if (i === 0) {
            panel.classList.add('panel-visible');
        } else {
            panel.classList.remove('panel-visible');
        }
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

        // Reset any previous GSAP transforms before animating
        gsap.set(widget, { scale: 1, opacity: 1 });

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
                // Reset for next open
                gsap.set(widget, { scale: 1, opacity: 1 });
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
