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

// ========== THREE.JS 3D BACKGROUND - SRE NETWORK TOPOLOGY ==========
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

    // SRE Green color palette
    const sreGreen = 0x00ff88;
    const sreCyan = 0x00d4ff;
    const srePurple = 0x8b5cf6;

    // Particles with network-themed colors
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 2000 : 5000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const colors = [
        { r: 0, g: 1, b: 0.53 },       // Terminal green
        { r: 0, g: 0.83, b: 1 },        // Cyan
        { r: 0.545, g: 0.361, b: 0.965 } // Purple (keep some original)
    ];

    for (let i = 0; i < particlesCount; i++) {
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
        size: 0.06,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // ======= NETWORK NODES =======
    const nodes = [];
    const nodePositions = [
        { x: -25, y: 15, z: -20 },
        { x: 20, y: 20, z: -25 },
        { x: -15, y: -10, z: -15 },
        { x: 25, y: -15, z: -30 },
        { x: 0, y: 5, z: -10 },
        { x: -30, y: -20, z: -35 },
        { x: 30, y: 0, z: -20 },
        { x: 10, y: -25, z: -25 }
    ];

    // Create glowing spheres as network nodes
    nodePositions.forEach((pos, index) => {
        const nodeGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? sreGreen : sreCyan,
            transparent: true,
            opacity: 0.8
        });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(pos.x, pos.y, pos.z);
        scene.add(node);
        nodes.push({ mesh: node, baseOpacity: 0.8, pulseOffset: Math.random() * Math.PI * 2 });

        // Add outer glow ring
        const glowGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: index % 2 === 0 ? sreGreen : sreCyan,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos.x, pos.y, pos.z);
        scene.add(glow);
        nodes.push({ mesh: glow, isGlow: true, pulseOffset: Math.random() * Math.PI * 2 });
    });

    // ======= CONNECTION LINES BETWEEN NODES =======
    const connections = [
        [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [4, 5], [4, 6], [5, 7], [6, 7], [0, 4], [1, 4], [3, 6]
    ];

    const lineMaterial = new THREE.LineBasicMaterial({
        color: sreGreen,
        transparent: true,
        opacity: 0.2
    });

    connections.forEach(([startIdx, endIdx]) => {
        const start = nodePositions[startIdx];
        const end = nodePositions[endIdx];
        const points = [
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3(end.x, end.y, end.z)
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    });

    // ======= TRAVELING DATA PACKETS =======
    const dataPackets = [];
    const packetGeometry = new THREE.SphereGeometry(0.3, 8, 8);

    connections.forEach(([startIdx, endIdx], idx) => {
        if (idx % 2 === 0) { // Only some connections have packets
            const packetMaterial = new THREE.MeshBasicMaterial({
                color: sreCyan,
                transparent: true,
                opacity: 0.9
            });
            const packet = new THREE.Mesh(packetGeometry, packetMaterial);
            const start = nodePositions[startIdx];
            packet.position.set(start.x, start.y, start.z);
            scene.add(packet);

            dataPackets.push({
                mesh: packet,
                start: nodePositions[startIdx],
                end: nodePositions[endIdx],
                progress: Math.random(), // Random starting position
                speed: 0.003 + Math.random() * 0.003,
                direction: 1
            });
        }
    });

    // ======= FLOATING GEOMETRIC SHAPES (simplified) =======
    const shapes = [];

    // Hexagon (server rack silhouette)
    const hexGeometry = new THREE.CylinderGeometry(4, 4, 8, 6);
    const hexMaterial = new THREE.MeshBasicMaterial({
        color: srePurple,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    const hex = new THREE.Mesh(hexGeometry, hexMaterial);
    hex.position.set(35, 0, -40);
    scene.add(hex);
    shapes.push({ mesh: hex, speed: { x: 0.002, y: 0.003 } });

    // Large ring (monitoring dashboard silhouette)
    const ringGeometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: sreGreen,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(-25, 25, -50);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);
    shapes.push({ mesh: ring, speed: { x: 0.001, y: 0.004 } });

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
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Smooth camera movement
        targetX += (mouseX - targetX) * 0.02;
        targetY += (mouseY - targetY) * 0.02;

        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;

        // Animate shapes
        shapes.forEach(shape => {
            shape.mesh.rotation.x += shape.speed.x;
            shape.mesh.rotation.y += shape.speed.y;
        });

        // Pulse nodes
        nodes.forEach((nodeObj, idx) => {
            const pulse = Math.sin(time * 2 + nodeObj.pulseOffset) * 0.3 + 0.7;
            if (nodeObj.isGlow) {
                nodeObj.mesh.material.opacity = 0.2 * pulse;
                nodeObj.mesh.rotation.z += 0.01;
            } else {
                nodeObj.mesh.material.opacity = nodeObj.baseOpacity * pulse;
            }
        });

        // Animate data packets traveling along connections
        dataPackets.forEach(packet => {
            packet.progress += packet.speed * packet.direction;

            if (packet.progress >= 1 || packet.progress <= 0) {
                packet.direction *= -1;
            }

            const t = packet.progress;
            packet.mesh.position.x = packet.start.x + (packet.end.x - packet.start.x) * t;
            packet.mesh.position.y = packet.start.y + (packet.end.y - packet.start.y) * t;
            packet.mesh.position.z = packet.start.z + (packet.end.z - packet.start.z) * t;

            // Pulse packet opacity
            packet.mesh.material.opacity = 0.5 + Math.sin(time * 5) * 0.4;
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
