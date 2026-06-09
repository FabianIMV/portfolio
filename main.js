// ============================================
// FABIÁN MUÑOZ — SRE PORTFOLIO
// Vanilla JS, no frameworks. Fast by design.
// ============================================

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', () => {
        initLanguage();
        initStatusBar();
        initNavbar();
        initScrollProgress();
        initReveals();
        initCounters();
        initGauges();
        initSpotlight();
        initTypingEffect();
        initBackgroundCanvas();
        initGitHubStats();
        initAlertStream();
        initChatbot();
        initTerminal();
        initCommandPalette();
        initKonami();
        initCopyEmail();
        initFooter();
    });

    // ========== HELPERS ==========
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    function getLang() {
        return document.documentElement.getAttribute('data-lang') === 'es' ? 'es' : 'en';
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function showToast(message, level, duration) {
        const container = $('#toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast' + (level ? ' ' + level : '');
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('leaving');
            setTimeout(() => toast.remove(), 350);
        }, duration || 4000);
    }

    // ========== LANGUAGE ==========
    function setLang(lang) {
        document.documentElement.setAttribute('data-lang', lang);
        document.documentElement.lang = lang;
        try { localStorage.setItem('portfolio-lang', lang); } catch (e) { /* private mode */ }
        updateChatPlaceholder();
    }

    function toggleLang() {
        setLang(getLang() === 'es' ? 'en' : 'es');
    }

    function initLanguage() {
        const btn = $('#langToggle');
        if (btn) btn.addEventListener('click', toggleLang);
        updateChatPlaceholder();
    }

    // ========== STATUS BAR ==========
    function initStatusBar() {
        const hudTime = $('#hudTime');
        function updateClock() {
            if (!hudTime) return;
            try {
                hudTime.textContent = new Date().toLocaleTimeString('en-GB', {
                    hour12: false, timeZone: 'America/Santiago'
                });
            } catch (e) {
                hudTime.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
            }
        }
        updateClock();
        setInterval(updateClock, 1000);

        // Real uptime: days since SRE career started (Nov 2022)
        const sreStart = new Date('2022-11-01T00:00:00');
        const uptimeDays = Math.floor((Date.now() - sreStart.getTime()) / 86400000);
        const uptimeEl = $('#uptimeCounter');
        if (uptimeEl) uptimeEl.textContent = uptimeDays;

        // Playful live metrics
        const latency = $('#latencyMetric');
        const health = $('#healthMetric');
        function updateMetrics() {
            if (document.body.classList.contains('incident-active')) return;
            if (latency) latency.textContent = 35 + Math.floor(Math.random() * 25);
            if (health) health.textContent = (99.9 + Math.random() * 0.09).toFixed(2);
        }
        updateMetrics();
        setInterval(updateMetrics, 2500);
    }

    // ========== NAVBAR ==========
    function initNavbar() {
        const navbar = $('#navbar');
        const mobileBtn = $('#mobileMenuBtn');
        const mobileMenu = $('#mobileMenu');

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });

        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', () => {
                const open = mobileMenu.classList.toggle('open');
                mobileBtn.setAttribute('aria-expanded', String(open));
            });
            $$('.mobile-link', mobileMenu).forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('open');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                });
            });
        }

        // Scrollspy
        const sections = ['home', 'experience', 'projects', 'skills', 'contact']
            .map(id => document.getElementById(id)).filter(Boolean);
        const navLinks = $$('.nav-link');
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === entry.target.id));
            });
        }, { rootMargin: '-35% 0px -55% 0px' });
        sections.forEach(s => spy.observe(s));
    }

    // ========== SCROLL PROGRESS ==========
    function initScrollProgress() {
        const bar = $('#scrollProgress');
        if (!bar) return;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
                ticking = false;
            });
        }, { passive: true });
    }

    // ========== REVEAL ANIMATIONS ==========
    function initReveals() {
        const reveals = $$('.reveal');
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            reveals.forEach(el => el.classList.add('visible'));
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        reveals.forEach(el => observer.observe(el));
    }

    // ========== ANIMATED COUNTERS ==========
    function initCounters() {
        const counters = $$('.counter');
        if (!counters.length) return;
        const animate = (el) => {
            const target = parseInt(el.dataset.target, 10) || 0;
            if (prefersReducedMotion) { el.textContent = target; return; }
            const duration = 1100;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        counters.forEach(c => observer.observe(c));
    }

    // ========== SKILL GAUGES ==========
    function initGauges() {
        const gauges = $$('.gauge');
        if (!gauges.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const fill = $('.gauge-fill', entry.target);
                const level = entry.target.dataset.level || 0;
                if (fill) requestAnimationFrame(() => { fill.style.width = level + '%'; });
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.4 });
        gauges.forEach(g => observer.observe(g));
    }

    // ========== CARD SPOTLIGHT ==========
    function initSpotlight() {
        if (window.matchMedia('(hover: none)').matches) return;
        $$('.card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
        });
    }

    // ========== TYPING EFFECT ==========
    function initTypingEffect() {
        const el = $('#typingText');
        if (!el) return;
        const phrases = [
            'kubectl get pods -n production',
            'Golden Signals | SLI/SLO | MTTR',
            'Building Observable Systems',
            'argocd app sync portfolio --prune',
            'Incident Correlation & Root Cause',
            'AWS | Kubernetes | Terraform',
            'terraform apply -auto-approve  # YOLO'
        ];
        if (prefersReducedMotion) { el.textContent = phrases[1]; return; }

        let phraseIndex = 0, charIndex = 0, deleting = false;
        function type() {
            const phrase = phrases[phraseIndex];
            charIndex += deleting ? -1 : 1;
            el.textContent = phrase.substring(0, charIndex);
            let delay = deleting ? 32 : 70;
            if (!deleting && charIndex === phrase.length) {
                delay = 2100;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 450;
            }
            setTimeout(type, delay);
        }
        setTimeout(type, 900);
    }

    // ========== BACKGROUND CANVAS (lightweight starfield) ==========
    function initBackgroundCanvas() {
        const canvas = $('#bgCanvas');
        if (!canvas || prefersReducedMotion) return;
        if (navigator.connection && navigator.connection.saveData) return;

        const ctx = canvas.getContext('2d');
        const isMobile = window.innerWidth < 700;
        const STAR_COUNT = isMobile ? 50 : 110;
        let width, height, stars = [];
        let running = true;

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function makeStar() {
            const palette = ['rgba(0,212,255,', 'rgba(0,255,136,', 'rgba(139,92,246,', 'rgba(232,236,244,'];
            return {
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.4 + 0.3,
                vy: Math.random() * 0.16 + 0.03,
                color: palette[Math.floor(Math.random() * palette.length)],
                alpha: Math.random() * 0.5 + 0.15,
                pulse: Math.random() * Math.PI * 2
            };
        }

        function frame(t) {
            if (!running) return;
            ctx.clearRect(0, 0, width, height);
            for (const s of stars) {
                s.y -= s.vy;
                if (s.y < -4) { s.y = height + 4; s.x = Math.random() * width; }
                const tw = s.alpha * (0.7 + 0.3 * Math.sin(t / 900 + s.pulse));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.color + tw + ')';
                ctx.fill();
            }
            requestAnimationFrame(frame);
        }

        resize();
        stars = Array.from({ length: STAR_COUNT }, makeStar);
        requestAnimationFrame(frame);

        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', () => {
            const wasRunning = running;
            running = !document.hidden;
            if (running && !wasRunning) requestAnimationFrame(frame);
        });
    }

    // ========== GITHUB STATS (live, cached, graceful) ==========
    function initGitHubStats() {
        const wrap = $('#ghStats');
        if (!wrap || !window.fetch) return;

        function render(data) {
            const repos = $('#ghRepos');
            const followers = $('#ghFollowers');
            if (repos) repos.textContent = data.public_repos;
            if (followers) followers.textContent = data.followers;
            wrap.hidden = false;
        }

        try {
            const cached = sessionStorage.getItem('gh-stats');
            if (cached) { render(JSON.parse(cached)); return; }
        } catch (e) { /* ignore */ }

        fetch('https://api.github.com/users/FabianIMV')
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => {
                const slim = { public_repos: data.public_repos, followers: data.followers };
                try { sessionStorage.setItem('gh-stats', JSON.stringify(slim)); } catch (e) { /* ignore */ }
                render(slim);
            })
            .catch(() => { /* stay hidden — no broken UI */ });
    }

    // ========== ALERT STREAM (event log) ==========
    function initAlertStream() {
        const scroll = $('#alertScroll');
        if (!scroll) return;
        const events = [
            ['info', 'Deployment portfolio-v4 rolled out successfully'],
            ['info', 'New certification acquired: AWS Cloud Practitioner'],
            ['info', 'LinkedIn connection established'],
            ['warn', 'Coffee level LOW — refill needed'],
            ['info', 'GitHub contribution recorded'],
            ['info', 'Portfolio visitor detected — hello there 👋'],
            ['info', 'System health check: PASSED'],
            ['warn', 'Konami code listener armed'],
            ['info', 'SLO budget: 99.99% remaining'],
            ['info', 'Kafka consumer lag: 0ms']
        ];
        const now = new Date();
        const items = events.map(([level, msg], i) => {
            const t = new Date(now.getTime() - (i + 1) * 137000);
            const time = '[' + t.toTimeString().slice(0, 8) + ']';
            return '<div class="alert-item"><span class="alert-level ' + level + '">' +
                level.toUpperCase() + '</span><span class="alert-time">' + time +
                '</span><span class="alert-message">' + msg + '</span></div>';
        }).join('');
        // Duplicate once so the CSS -50% scroll loops seamlessly
        scroll.innerHTML = items + items;
    }

    // ========== COPY EMAIL ==========
    function initCopyEmail() {
        const btn = $('#copyEmailBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const email = 'fabianignaciomv@gmail.com';
            const done = () => showToast(getLang() === 'es'
                ? '✓ Email copiado al portapapeles' : '✓ Email copied to clipboard');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(done).catch(() => {
                    window.location.href = 'mailto:' + email;
                });
            } else {
                window.location.href = 'mailto:' + email;
            }
        });
    }

    // ========== FOOTER ==========
    function initFooter() {
        const year = $('#footerYear');
        if (year) year.textContent = new Date().getFullYear();
    }

    // ========================================
    // AI CHATBOT (AWS Lambda backend + local fallback)
    // ========================================
    let aiChatOpen = false;

    function updateChatPlaceholder() {
        const input = $('#aiChatInput');
        if (input) {
            input.placeholder = getLang() === 'es' ? 'Escribe tu pregunta…' : 'Type your question…';
        }
    }

    function toggleAIChat() {
        const widget = $('#aiChatWidget');
        if (!widget) return;
        aiChatOpen = !aiChatOpen;
        widget.hidden = !aiChatOpen;
        if (aiChatOpen) {
            updateChatPlaceholder();
            const input = $('#aiChatInput');
            if (input && window.innerWidth > 700) input.focus();
        }
    }

    function handleAIKeyPress(event) {
        if (event.key === 'Enter') sendAIMessage();
    }

    function addAIMessage(message, type) {
        const container = $('#aiChatMessages');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'chat-row' + (type === 'user' ? ' user' : '');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + (type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai');
        if (type === 'user') {
            bubble.textContent = message;
        } else {
            // Bot responses may contain links; user input never reaches innerHTML
            bubble.innerHTML = linkify(escapeHTML(message));
        }
        row.appendChild(bubble);
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
    }

    function linkify(text) {
        return text.replace(/(https?:\/\/[^\s<]+)/g,
            '<a href="$1" target="_blank" rel="noopener">$1</a>');
    }

    function showAITyping() {
        const container = $('#aiChatMessages');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'chat-row';
        row.id = 'aiTypingIndicator';
        row.innerHTML = '<div class="chat-bubble chat-bubble-ai typing-dots"><span>●</span><span>●</span><span>●</span></div>';
        container.appendChild(row);
        container.scrollTop = container.scrollHeight;
    }

    function hideAITyping() {
        const el = $('#aiTypingIndicator');
        if (el) el.remove();
    }

    async function sendAIMessage() {
        const input = $('#aiChatInput');
        if (!input) return;
        const message = input.value.trim();
        if (!message) return;

        addAIMessage(message, 'user');
        input.value = '';
        showAITyping();

        const minDelay = new Promise(r => setTimeout(r, 600));
        const response = await getAIResponse(message);
        await minDelay;
        hideAITyping();
        addAIMessage(response, 'ai');
    }

    function detectLanguage(message) {
        const spanishWords = ['hola', 'qué', 'que ', 'cómo', 'como ', 'dónde', 'donde', 'cuándo', 'por qué',
            'experiencia', 'proyectos', 'habilidades', 'contacto', 'gracias', 'buenas'];
        const lower = message.toLowerCase();
        return spanishWords.some(w => lower.includes(w)) ? 'es' : getLang();
    }

    async function getAIResponse(message) {
        const endpoint = window.CHATBOT_API_ENDPOINT || null;
        const lang = detectLanguage(message);

        if (endpoint) {
            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 12000);
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message }),
                    signal: controller.signal
                });
                clearTimeout(timer);
                if (res.ok) {
                    const data = await res.json();
                    if (data.message) return data.message;
                }
            } catch (e) {
                // fall through to local responses
            }
        }
        return getBasicResponse(message, lang);
    }

    function getBasicResponse(message, lang) {
        const lower = message.toLowerCase();
        const es = lang === 'es';

        const topics = [
            {
                keys: ['hola', 'hello', 'hi ', 'buenas'],
                es: '¡Hola! 👋 ¿Qué te gustaría saber sobre Fabián? Puedo contarte de su experiencia, proyectos o skills.',
                en: 'Hello! 👋 What would you like to know about Fabián? I can tell you about his experience, projects or skills.'
            },
            {
                keys: ['experiencia', 'experience', 'trabajo', 'work', 'falabella', 'innfinit'],
                es: 'Fabián es SRE en Banco Falabella (infraestructura bancaria crítica, Kafka, golden signals). Antes, 3 años como SRE en Innfinit para clientes Fortune 500 como Liberty Mutual y Sovos. 📊',
                en: 'Fabián is an SRE at Banco Falabella (critical banking infrastructure, Kafka, golden signals). Before that, 3 years as SRE at Innfinit for Fortune 500 clients like Liberty Mutual and Sovos. 📊'
            },
            {
                keys: ['proyectos', 'projects'],
                es: 'Proyectos destacados: 🎵 YouTube Music Playlist Creator, 🥊 NutriCombat (PWA con IA), 📊 Dashboard Chile en Grafana, y un Kafka Home Lab. Mira la sección Proyectos del sitio.',
                en: 'Featured projects: 🎵 YouTube Music Playlist Creator, 🥊 NutriCombat (AI-powered PWA), 📊 Chile Dashboard in Grafana, and a Kafka Home Lab. Check the Projects section.'
            },
            {
                keys: ['habilidades', 'skills', 'stack', 'tecnolog'],
                es: 'Stack principal: ☁️ AWS, ⚓ Kubernetes, 🐙 Argo CD, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🐶 Datadog, 🐍 Python y Bash.',
                en: 'Main stack: ☁️ AWS, ⚓ Kubernetes, 🐙 Argo CD, 🏗️ Terraform, 📈 Grafana, 🔥 Prometheus, 🐶 Datadog, 🐍 Python and Bash.'
            },
            {
                keys: ['cert'],
                es: 'Certificaciones: AWS Cloud Practitioner (activa), Azure AI Fundamentals y OCI Foundations. 🏅',
                en: 'Certifications: AWS Cloud Practitioner (active), Azure AI Fundamentals and OCI Foundations. 🏅'
            },
            {
                keys: ['contacto', 'contact', 'email', 'correo', 'linkedin'],
                es: 'Contacto: 💼 https://linkedin.com/in/fabianimv · 📧 fabianignaciomv@gmail.com · 🐙 https://github.com/FabianIMV',
                en: 'Contact: 💼 https://linkedin.com/in/fabianimv · 📧 fabianignaciomv@gmail.com · 🐙 https://github.com/FabianIMV'
            },
            {
                keys: ['sre', 'observab', 'monitor'],
                es: 'Fabián se especializa en observabilidad: golden signals (latencia, tráfico, errores, saturación), SLI/SLO, correlación de incidentes y reducción de MTTR. 🔭',
                en: 'Fabián specializes in observability: golden signals (latency, traffic, errors, saturation), SLI/SLO, incident correlation and MTTR reduction. 🔭'
            }
        ];

        for (const topic of topics) {
            if (topic.keys.some(k => lower.includes(k))) return es ? topic.es : topic.en;
        }

        const fallback = es ? [
            '🤖 Buena pregunta. Revisa las secciones de Experiencia, Proyectos y Skills para más detalles.',
            '💡 Puedo contarte sobre: experiencia, proyectos, skills, certificaciones o contacto.',
            '🔍 Prueba preguntando por "experiencia", "proyectos" o "skills".'
        ] : [
            '🤖 Good question. Check the Experience, Projects and Skills sections for more details.',
            '💡 I can tell you about: experience, projects, skills, certifications or contact.',
            '🔍 Try asking about "experience", "projects" or "skills".'
        ];
        return fallback[Math.floor(Math.random() * fallback.length)];
    }

    function initChatbot() {
        window.toggleAIChat = toggleAIChat;
        window.sendAIMessage = sendAIMessage;
        window.handleAIKeyPress = handleAIKeyPress;
        updateChatPlaceholder();
    }

    // ========================================
    // INTERACTIVE TERMINAL (easter egg)
    // ========================================
    function initTerminal() {
        const overlay = $('#terminalOverlay');
        const body = $('#terminalBody');
        const form = $('#terminalForm');
        const input = $('#terminalInput');
        const openBtn = $('#terminalBtn');
        const closeBtn = $('#terminalClose');
        if (!overlay || !body || !form || !input) return;

        let history = [];
        let historyIndex = -1;
        let booted = false;

        function print(html, cls) {
            const line = document.createElement('div');
            if (cls) line.className = cls;
            line.innerHTML = html;
            body.appendChild(line);
            body.scrollTop = body.scrollHeight;
        }

        function boot() {
            if (booted) return;
            booted = true;
            print('<span class="t-green">fabian@portfolio</span> <span class="t-dim">~ v4.0.0 (uptime: ' +
                Math.floor((Date.now() - new Date('2022-11-01').getTime()) / 86400000) + 'd)</span>');
            print(getLang() === 'es'
                ? '<span class="t-dim">Escribe <span class="t-cmd">help</span> para ver los comandos disponibles.</span>'
                : '<span class="t-dim">Type <span class="t-cmd">help</span> to see available commands.</span>');
        }

        function open() {
            overlay.hidden = false;
            boot();
            input.focus();
        }

        function close() {
            overlay.hidden = true;
        }

        window.__openTerminal = open;

        if (openBtn) openBtn.addEventListener('click', open);
        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.hidden) close();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (history.length && historyIndex < history.length - 1) {
                    historyIndex++;
                    input.value = history[history.length - 1 - historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    input.value = history[history.length - 1 - historyIndex];
                } else {
                    historyIndex = -1;
                    input.value = '';
                }
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const raw = input.value.trim();
            input.value = '';
            if (!raw) return;
            history.push(raw);
            historyIndex = -1;
            print('<span class="t-green">$</span> <span class="t-cmd">' + escapeHTML(raw) + '</span>');
            run(raw.toLowerCase());
        });

        function run(cmd) {
            const es = getLang() === 'es';
            const commands = {
                help() {
                    print(es
                        ? 'Comandos: <span class="t-cmd">whoami · experience · projects · skills · certs · contact · social · uptime · lang · sudo · coffee · incident · clear · exit</span>'
                        : 'Commands: <span class="t-cmd">whoami · experience · projects · skills · certs · contact · social · uptime · lang · sudo · coffee · incident · clear · exit</span>');
                },
                whoami() {
                    print('<span class="t-green">Fabián Muñoz</span> — Site Reliability Engineer @ Banco Falabella');
                    print('<span class="t-dim">Santiago, Chile 🇨🇱 · ' + (es
                        ? 'Observabilidad, Kubernetes, Argo CD y café.'
                        : 'Observability, Kubernetes, Argo CD and coffee.') + '</span>');
                },
                experience() {
                    print('<span class="t-green">[ACTIVE]</span> Banco Falabella — SRE <span class="t-dim">(Oct 2025 → now)</span>');
                    print('<span class="t-cmd">[STABLE]</span> Innfinit SpA — SRE <span class="t-dim">(Nov 2022 → Oct 2025)</span>');
                    print('<span class="t-amber">[LEGACY]</span> Recomin SM — Tech Support <span class="t-dim">(Mar 2019 → Nov 2022)</span>');
                },
                projects() {
                    print('• YT Music Playlist Creator <span class="t-dim">Python</span>');
                    print('• NutriCombat <span class="t-dim">PWA + Gemini AI</span>');
                    print('• Chile Dashboard <span class="t-dim">Grafana</span>');
                    print('• Kafka Home Lab <span class="t-dim">Docker</span>');
                    print('<a href="https://github.com/FabianIMV?tab=repositories" target="_blank" rel="noopener">github.com/FabianIMV</a>');
                },
                skills() {
                    print('Observability  <span class="t-green">█████████░</span> Datadog, Grafana, Prometheus');
                    print('Cloud/Infra    <span class="t-cmd">████████░░</span> AWS, K8s, Argo CD, Terraform');
                    print('Development    <span class="t-amber">████████░░</span> Python, Bash, JavaScript');
                },
                certs() {
                    print('✓ AWS Cloud Practitioner <span class="t-green">[ACTIVE]</span>');
                    print('✓ Azure AI Fundamentals <span class="t-green">[ACTIVE]</span>');
                    print('✓ OCI Foundations <span class="t-amber">[EXPIRED]</span>');
                },
                contact() {
                    print('📧 <a href="mailto:fabianignaciomv@gmail.com">fabianignaciomv@gmail.com</a>');
                    print('💼 <a href="https://linkedin.com/in/fabianimv" target="_blank" rel="noopener">linkedin.com/in/fabianimv</a>');
                },
                social() { commands.contact(); },
                uptime() {
                    const days = Math.floor((Date.now() - new Date('2022-11-01').getTime()) / 86400000);
                    print('<span class="t-green">up ' + days + ' days</span> <span class="t-dim">(' +
                        (es ? 'carrera SRE desde Nov 2022' : 'SRE career since Nov 2022') + ')</span>');
                },
                lang() {
                    toggleLang();
                    print(getLang() === 'es' ? '🇪🇸 Idioma cambiado a español' : '🇬🇧 Language switched to English');
                },
                sudo() {
                    print('<span class="t-red">' + (es
                        ? 'fabian no está en el archivo sudoers. Este incidente será reportado.'
                        : 'fabian is not in the sudoers file. This incident will be reported.') + '</span>');
                },
                coffee() {
                    print('<span class="t-amber">☕ ' + (es
                        ? 'Brewing… nivel de café restaurado al 100%. MTTR mejorado.'
                        : 'Brewing… coffee level restored to 100%. MTTR improved.') + '</span>');
                },
                incident() {
                    close();
                    triggerIncident();
                },
                konami() { commands.incident(); },
                clear() { body.innerHTML = ''; },
                exit() { close(); },
                ls() {
                    print('<span class="t-cmd">experience/  projects/  skills/  certs/  contact/</span>  README.md  postmortems/');
                },
                pwd() { print('/home/fabian/portfolio'); },
                ping() { print('PONG <span class="t-dim">time=42ms ttl=64</span>'); },
                date() { print(new Date().toString()); }
            };
            commands['cat readme.md'] = commands.whoami;

            const fn = commands[cmd] || commands[cmd.split(' ')[0]];
            if (fn) {
                fn();
            } else {
                print('<span class="t-red">' + (es
                    ? 'comando no encontrado: ' : 'command not found: ') + escapeHTML(cmd) +
                    '</span> <span class="t-dim">— ' + (es ? 'prueba' : 'try') + ' <span class="t-cmd">help</span></span>');
            }
        }
    }

    // ========================================
    // COMMAND PALETTE (Ctrl+K)
    // ========================================
    function initCommandPalette() {
        const overlay = $('#cmdkOverlay');
        const input = $('#cmdkInput');
        const list = $('#cmdkList');
        const openBtn = $('#cmdkBtn');
        if (!overlay || !input || !list) return;

        const actions = () => {
            const es = getLang() === 'es';
            return [
                { icon: '~', label: es ? 'Ir a Inicio' : 'Go to Home', hint: '#home', run: () => scrollToId('home') },
                { icon: '01', label: es ? 'Ir a Experiencia' : 'Go to Experience', hint: '#experience', run: () => scrollToId('experience') },
                { icon: '02', label: es ? 'Ir a Proyectos' : 'Go to Projects', hint: '#projects', run: () => scrollToId('projects') },
                { icon: '03', label: es ? 'Ir a Skills' : 'Go to Skills', hint: '#skills', run: () => scrollToId('skills') },
                { icon: '04', label: es ? 'Ir a Contacto' : 'Go to Contact', hint: '#contact', run: () => scrollToId('contact') },
                { icon: '>_', label: es ? 'Abrir terminal interactiva' : 'Open interactive terminal', hint: 'fun', run: () => window.__openTerminal && window.__openTerminal() },
                { icon: 'AI', label: es ? 'Hablar con el asistente AI' : 'Talk to the AI assistant', hint: 'chat', run: () => { if (!aiChatOpen) toggleAIChat(); } },
                { icon: 'ES', label: es ? 'Switch to English' : 'Cambiar a Español', hint: 'lang', run: toggleLang },
                { icon: 'GH', label: 'GitHub — FabianIMV', hint: '↗', run: () => window.open('https://github.com/FabianIMV', '_blank', 'noopener') },
                { icon: 'IN', label: 'LinkedIn — fabianimv', hint: '↗', run: () => window.open('https://linkedin.com/in/fabianimv', '_blank', 'noopener') },
                { icon: '@', label: es ? 'Enviar email' : 'Send email', hint: 'mailto', run: () => { window.location.href = 'mailto:fabianignaciomv@gmail.com'; } },
                { icon: '📊', label: es ? 'Dashboard Chile (Grafana, en vivo)' : 'Chile Dashboard (Grafana, live)', hint: '↗', run: () => window.open('https://fabianignaciomv.grafana.net/public-dashboards/33bf370f0531403d9d263556593c06d0', '_blank', 'noopener') },
                { icon: '🖥', label: es ? 'Modo terminal (versión Next.js)' : 'Terminal mode (Next.js version)', hint: '↗', run: () => { window.location.href = './portfolio-next/out/'; } },
                { icon: '🔥', label: es ? 'Declarar un incidente (demo)' : 'Declare an incident (demo)', hint: 'SEV-1', run: triggerIncident }
            ];
        };

        let filtered = [];
        let selected = 0;

        function scrollToId(id) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }

        function render() {
            const q = input.value.trim().toLowerCase();
            filtered = actions().filter(a => !q || a.label.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
            selected = Math.min(selected, Math.max(filtered.length - 1, 0));
            if (!filtered.length) {
                list.innerHTML = '<li class="cmdk-empty">' + (getLang() === 'es' ? 'Sin resultados' : 'No results') + '</li>';
                return;
            }
            list.innerHTML = filtered.map((a, i) =>
                '<li class="cmdk-item' + (i === selected ? ' selected' : '') + '" data-index="' + i + '" role="option">' +
                '<span class="cmdk-icon">' + a.icon + '</span><span>' + a.label + '</span><small>' + a.hint + '</small></li>'
            ).join('');
            $$('.cmdk-item', list).forEach(item => {
                item.addEventListener('click', () => {
                    const a = filtered[parseInt(item.dataset.index, 10)];
                    closePalette();
                    if (a) a.run();
                });
                item.addEventListener('mousemove', () => {
                    selected = parseInt(item.dataset.index, 10);
                    $$('.cmdk-item', list).forEach(el => el.classList.toggle('selected', el === item));
                });
            });
        }

        function openPalette() {
            overlay.hidden = false;
            input.value = '';
            input.placeholder = getLang() === 'es' ? 'Escribe un comando o busca…' : 'Type a command or search…';
            selected = 0;
            render();
            input.focus();
        }

        function closePalette() {
            overlay.hidden = true;
        }

        if (openBtn) openBtn.addEventListener('click', openPalette);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                overlay.hidden ? openPalette() : closePalette();
                return;
            }
            if (overlay.hidden) return;
            if (e.key === 'Escape') {
                closePalette();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                selected = Math.min(selected + 1, filtered.length - 1);
                render();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selected = Math.max(selected - 1, 0);
                render();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const a = filtered[selected];
                closePalette();
                if (a) a.run();
            }
        });

        input.addEventListener('input', () => { selected = 0; render(); });
    }

    // ========================================
    // INCIDENT MODE (Konami code easter egg)
    // ========================================
    let incidentRunning = false;

    function triggerIncident() {
        if (incidentRunning) return;
        incidentRunning = true;

        const overlay = $('#incidentOverlay');
        const statusText = $('#statusText');
        const health = $('#healthMetric');
        const latency = $('#latencyMetric');
        const es = getLang() === 'es';

        document.body.classList.add('incident-active');
        if (overlay) overlay.hidden = false;
        if (statusText) statusText.textContent = 'SEV-1 INCIDENT';
        if (health) health.textContent = '97.20';
        if (latency) latency.textContent = '1847';

        const timeline = [
            [300, () => showToast('🚨 ALERT: error rate > 5% on checkout-service', 'crit', 3500)],
            [1600, () => showToast('📟 ' + (es ? 'Pagineando al ingeniero on-call: fabian@' : 'Paging on-call engineer: fabian@'), 'warn', 3500)],
            [3200, () => showToast('🔍 ' + (es ? 'Causa raíz identificada: deploy sin revisar a viernes 18:00' : 'Root cause found: unreviewed Friday 6pm deploy'), 'warn', 3500)],
            [5000, () => showToast('⏪ ' + (es ? 'Ejecutando rollback…' : 'Rolling back…'), 'warn', 3000)],
            [7200, () => showToast('✅ ' + (es ? 'Incidente resuelto. MTTR: 8 segundos. Nuevo récord.' : 'Incident resolved. MTTR: 8 seconds. New record.'), '', 4500)],
            [8400, () => {
                document.body.classList.remove('incident-active');
                if (overlay) overlay.hidden = true;
                if (statusText) statusText.textContent = 'SYSTEM ONLINE';
                showToast('📋 ' + (es ? 'Postmortem sin culpas programado. Así trabaja un SRE 😉' : 'Blameless postmortem scheduled. That\'s how SREs roll 😉'), '', 6000);
                incidentRunning = false;
            }]
        ];
        timeline.forEach(([delay, fn]) => setTimeout(fn, delay));
    }

    function initKonami() {
        const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let pos = 0;
        document.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === seq[pos]) {
                pos++;
                if (pos === seq.length) {
                    pos = 0;
                    triggerIncident();
                }
            } else {
                pos = key === seq[0] ? 1 : 0;
            }
        });
    }
})();
