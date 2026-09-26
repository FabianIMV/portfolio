// ============================================
// SIGNAL — visual layer for the portfolio
// Self-healing ASCII portrait, cursor, magnetic
// buttons, text decode and card tilt.
// Vanilla JS, no dependencies.
// ============================================

(function () {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
    const lang = () => (document.documentElement.getAttribute('data-lang') === 'es' ? 'es' : 'en');

    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.classList.add(finePointer ? 'sx-fine' : 'sx-touch');
        initHealingPortrait();
        initCursor();
        initMagnetic();
        initDecode();
        initTilt();
        initMarquee();
    });

    // Duplicate the stack list so the marquee loops seamlessly
    function initMarquee() {
        const track = $('.sx-marquee-track');
        const list = track && $('.sx-marquee-list', track);
        if (!list) return;
        const clone = list.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    }

    // ========================================
    // SELF-HEALING PORTRAIT
    // Every glyph is a particle with a spring to its home cell.
    // The pointer is an "incident": it tears glyphs away, they
    // glitch while displaced and converge back (auto-remediation).
    // Health / incidents / MTTR are measured from the real physics.
    // ========================================
    function initHealingPortrait() {
        const figure = $('#sxPortrait');
        const canvas = $('#healCanvas');
        const source = $('#healSource');
        if (!figure || !canvas || !source || !canvas.getContext) return;

        const ctx = canvas.getContext('2d');
        const frame = $('.sx-portrait-frame', figure);
        const ui = {
            state: $('#healState'),
            stateLabel: $('#healState b'),
            health: $('#healHealth'),
            incidents: $('#healIncidents'),
            mttr: $('#healMttr'),
            statusIndicator: $('#statusIndicator'),
            statusText: $('#statusText')
        };

        const RAMP = ' .:-=+*o#%@';
        const GLITCH = '01<>/\\{}[]#$%&*!?~^;ABCDEFKXZ';
        const COLORS = ['#c8ff2e', '#f1efe8', '#ff4a2b'];   // healthy, healing, broken
        // Crop of the source photo (drops the black band at the bottom)
        const CROP = { x: 58, y: 0, w: 290, h: 330 };

        let W = 0, H = 0, dpr = 1, cellW = 0, cellH = 0, cols = 0, rows = 0;
        let atlas = null, slotW = 0, slotH = 0;
        let n = 0, hx, hy, x, y, vx, vy, chr, alp, gch, delay;
        let pointer = { x: -9999, y: -9999, active: false, speed: 0 };
        let running = false, visible = true, started = 0, lastT = 0;
        let smoothHealth = 100;
        const incident = { state: 'healthy', start: 0, count: 0, calmSince: 0, healedAt: 0 };

        function loadFont() {
            if (!document.fonts || !document.fonts.load) return Promise.resolve();
            return Promise.race([
                document.fonts.load('600 16px "Geist Mono"'),
                new Promise(r => setTimeout(r, 1200))
            ]).catch(() => { });
        }

        function loadImage() {
            if (source.complete && source.naturalWidth) return Promise.resolve();
            return new Promise((resolve, reject) => {
                source.addEventListener('load', resolve, { once: true });
                source.addEventListener('error', reject, { once: true });
            });
        }

        function buildAtlas(chars) {
            slotW = Math.ceil(cellW * dpr) + 2;
            slotH = Math.ceil(cellH * dpr) + 2;
            atlas = document.createElement('canvas');
            atlas.width = slotW * chars.length;
            atlas.height = slotH * COLORS.length;
            const a = atlas.getContext('2d');
            a.textAlign = 'center';
            a.textBaseline = 'middle';
            a.font = '600 ' + Math.round(cellH * 0.92 * dpr) + 'px "Geist Mono", ui-monospace, Menlo, monospace';
            COLORS.forEach((c, row) => {
                a.fillStyle = c;
                for (let i = 0; i < chars.length; i++) {
                    a.fillText(chars[i], i * slotW + slotW / 2, row * slotH + slotH / 2 + 1);
                }
            });
        }

        function build() {
            const rect = frame.getBoundingClientRect();
            W = Math.max(200, Math.round(rect.width));
            H = Math.max(200, Math.round(rect.height));
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';

            // Grid density adapts to the frame size
            const targetCols = W < 420 ? 72 : 96;
            cellW = W / targetCols;
            cellH = cellW * 1.32;
            cols = targetCols;
            rows = Math.floor(H / cellH);

            // Sample the photo into the grid, with a cover fit
            const off = document.createElement('canvas');
            off.width = cols;
            off.height = rows;
            const o = off.getContext('2d', { willReadFrequently: true });
            const gridAspect = (cols * cellW) / (rows * cellH);
            const cropAspect = CROP.w / CROP.h;
            let sx = CROP.x, sy = CROP.y, sw = CROP.w, sh = CROP.h;
            if (gridAspect > cropAspect) { sh = CROP.w / gridAspect; sy = CROP.y + (CROP.h - sh) * 0.2; }
            else { sw = CROP.h * gridAspect; sx = CROP.x + (CROP.w - sw) / 2; }
            o.drawImage(source, sx, sy, sw, sh, 0, 0, cols, rows);
            const data = o.getImageData(0, 0, cols, rows).data;

            // Luminance grid + background mask (bright, desaturated pixels)
            const lumGrid = new Float32Array(cols * rows);
            const mask = new Uint8Array(cols * rows);
            for (let i = 0; i < cols * rows; i++) {
                const R = data[i * 4] / 255, G = data[i * 4 + 1] / 255, B = data[i * 4 + 2] / 255;
                const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
                const lum = 0.2126 * R + 0.7152 * G + 0.0722 * B;
                const sat = mx ? (mx - mn) / mx : 0;
                lumGrid[i] = lum;
                mask[i] = (lum > 0.84 && sat < 0.2) ? 0 : 1;
            }

            // Unsharp mask so eyes, brows and beard pop out of the skin tones
            const cells = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    if (!mask[i]) continue;
                    let sum = 0, cnt = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const rr = r + dy, cc = c + dx;
                            if (rr < 0 || cc < 0 || rr >= rows || cc >= cols || !mask[rr * cols + cc]) continue;
                            sum += lumGrid[rr * cols + cc]; cnt++;
                        }
                    }
                    const blur = sum / cnt;
                    cells.push([c, r, lumGrid[i] + (lumGrid[i] - blur) * 1.6]);
                }
            }

            n = cells.length;
            hx = new Float32Array(n); hy = new Float32Array(n);
            x = new Float32Array(n); y = new Float32Array(n);
            vx = new Float32Array(n); vy = new Float32Array(n);
            chr = new Uint8Array(n); gch = new Uint8Array(n);
            alp = new Float32Array(n); delay = new Float32Array(n);

            // Robust contrast stretch (5th..97th percentile)
            const sorted = cells.map(cell => cell[2]).sort((a, b) => a - b);
            const lo = sorted[Math.floor(sorted.length * 0.05)] || 0;
            const hi = sorted[Math.floor(sorted.length * 0.97)] || 1;
            const span = Math.max(0.05, hi - lo);
            const offX = (W - cols * cellW) / 2;
            const offY = (H - rows * cellH) / 2;
            cells.forEach(([c, r, lum], i) => {
                const l = Math.pow(Math.max(0, Math.min(1, (lum - lo) / span)), 1.35);
                hx[i] = offX + c * cellW;
                hy[i] = offY + r * cellH;
                chr[i] = Math.max(1, Math.min(RAMP.length - 1, Math.round(l * (RAMP.length - 1))));
                alp[i] = 0.1 + 0.9 * l;
                gch[i] = RAMP.length + ((Math.random() * GLITCH.length) | 0);
                // Boot sequence: glyphs rain down column by column
                x[i] = hx[i];
                y[i] = reduceMotion ? hy[i] : hy[i] - H * (0.7 + Math.random() * 0.9);
                vx[i] = vy[i] = 0;
                delay[i] = reduceMotion ? 0 : (c / cols) * 380 + Math.random() * 700;
            });

            buildAtlas(RAMP + GLITCH);
        }

        function setState(next, t) {
            if (incident.state === next) return;
            incident.state = next;
            figure.classList.toggle('is-degraded', next === 'degraded' || next === 'critical');
            figure.classList.toggle('is-critical', next === 'critical');
            figure.classList.toggle('is-healed', next === 'healed');
            const labels = {
                healthy: 'HEALTHY', degraded: 'DEGRADED', critical: 'SEV-1', healed: 'SELF-HEALED'
            };
            if (ui.stateLabel) ui.stateLabel.textContent = labels[next];

            // Mirror the incident in the global status bar (unless Konami mode owns it)
            if (ui.statusText && !document.body.classList.contains('incident-active')) {
                const broken = next === 'degraded' || next === 'critical';
                ui.statusText.textContent = broken ? (next === 'critical' ? 'SEV-1 · AUTO-HEALING' : 'DEGRADED · AUTO-HEALING') : 'SYSTEM ONLINE';
                if (ui.statusIndicator) ui.statusIndicator.classList.toggle('sx-degraded', broken);
            }
            if (next === 'healed') incident.healedAt = t;
        }

        function updateIncident(health, t) {
            if (t - started < 2600) return; // ignore the boot sequence
            const s = incident.state;
            if (health < 97.5 && (s === 'healthy' || s === 'healed')) {
                incident.start = t;
                incident.count++;
                if (ui.incidents) ui.incidents.textContent = incident.count;
                setState('degraded', t);
            }
            if (health < 72 && s === 'degraded') setState('critical', t);
            if ((s === 'degraded' || s === 'critical')) {
                if (health > 99.7 && !pointer.active) {
                    if (!incident.calmSince) incident.calmSince = t;
                    if (t - incident.calmSince > 180) {
                        const mttr = (incident.calmSince - incident.start) / 1000;
                        if (ui.mttr) ui.mttr.textContent = mttr.toFixed(2) + 's';
                        incident.calmSince = 0;
                        setState('healed', t);
                    }
                } else {
                    incident.calmSince = 0;
                }
            }
            if (s === 'healed' && t - incident.healedAt > 1600) setState('healthy', t);
        }

        function shockwave(px, py, power) {
            const R = Math.max(W, H) * 0.42;
            for (let i = 0; i < n; i++) {
                const dx = x[i] - px, dy = y[i] - py;
                const d = Math.sqrt(dx * dx + dy * dy) || 1;
                if (d > R) continue;
                const f = (1 - d / R) * power * (0.6 + Math.random() * 0.8);
                vx[i] += (dx / d) * f;
                vy[i] += (dy / d) * f;
            }
        }

        function step(t) {
            if (!running) return;
            const dt = Math.min(2, (t - lastT) / 16.67 || 1);
            lastT = t;
            const elapsed = t - started;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);

            const K = 0.07 * dt, D = Math.pow(0.86, dt);
            const R = Math.max(70, W * 0.17), R2 = R * R;
            const force = 2.6 + Math.min(6, pointer.speed * 0.12);
            const px = pointer.x, py = pointer.y, pa = pointer.active;

            // Idle "refresh" scanline sweeping down every few seconds
            const scanY = reduceMotion ? -999 : ((elapsed % 5200) / 5200) * (H + 160) - 80;
            let disp = 0;

            for (let i = 0; i < n; i++) {
                if (elapsed < delay[i]) continue;
                let ax = -(x[i] - hx[i]) * K;
                let ay = -(y[i] - hy[i]) * K;
                if (pa) {
                    const dx = x[i] - px, dy = y[i] - py;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < R2) {
                        const d = Math.sqrt(d2) || 1;
                        const f = (1 - d / R) * force * dt;
                        // Radial push + tangential swirl = fluid-looking tear
                        ax += (dx / d) * f - (dy / d) * f * 0.45;
                        ay += (dy / d) * f + (dx / d) * f * 0.45;
                    }
                }
                vx[i] = (vx[i] + ax) * D;
                vy[i] = (vy[i] + ay) * D;
                x[i] += vx[i] * dt;
                y[i] += vy[i] * dt;

                const ox = x[i] - hx[i], oy = y[i] - hy[i];
                const off = Math.abs(ox) + Math.abs(oy);
                if (elapsed > 2600) disp += Math.min(off, 60);

                let glyph = chr[i], color = 0, a = alp[i];
                if (off > 2.5) {
                    // Displaced glyphs corrupt into noise and heat up
                    if (Math.random() < 0.18) gch[i] = RAMP.length + ((Math.random() * GLITCH.length) | 0);
                    glyph = gch[i];
                    color = off > 26 ? 2 : 1;
                    a = Math.min(1, a + 0.35);
                } else if (Math.abs(hy[i] - scanY) < 26) {
                    a = Math.min(1, a + 0.45 * (1 - Math.abs(hy[i] - scanY) / 26));
                    if (Math.random() < 0.012) glyph = RAMP.length + ((Math.random() * GLITCH.length) | 0);
                }
                ctx.globalAlpha = a;
                ctx.drawImage(atlas, glyph * slotW, color * slotH, slotW, slotH,
                    x[i] - 1 / dpr, y[i] - 1 / dpr, slotW / dpr, slotH / dpr);
            }
            ctx.globalAlpha = 1;

            // Health = inverse of the average displacement
            const avg = n ? disp / n : 0;
            const health = Math.max(0, 100 - avg * 9);
            smoothHealth += (health - smoothHealth) * 0.25;
            if (ui.health) ui.health.textContent = smoothHealth.toFixed(1);
            updateIncident(smoothHealth, t);
            pointer.speed *= 0.9;

            requestAnimationFrame(step);
        }

        function start() {
            if (running || !visible || document.hidden) return;
            running = true;
            lastT = performance.now();
            requestAnimationFrame(step);
        }
        function stop() { running = false; }

        function toLocal(e) {
            const r = canvas.getBoundingClientRect();
            return { x: e.clientX - r.left, y: e.clientY - r.top };
        }
        function move(e) {
            const p = toLocal(e);
            if (pointer.active) {
                pointer.speed += Math.hypot(p.x - pointer.x, p.y - pointer.y);
            }
            pointer.x = p.x;
            pointer.y = p.y;
            pointer.active = true;
        }
        function leave() { pointer.active = false; pointer.x = pointer.y = -9999; }

        canvas.addEventListener('pointermove', move);
        canvas.addEventListener('pointerleave', leave);
        canvas.addEventListener('pointercancel', leave);
        canvas.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') leave(); });
        canvas.addEventListener('pointerdown', (e) => {
            const p = toLocal(e);
            shockwave(p.x, p.y, e.pointerType === 'mouse' ? 26 : 20);
            if (e.pointerType !== 'mouse') { pointer.x = p.x; pointer.y = p.y; pointer.active = true; }
        });
        // On touch, the page can still scroll vertically; keep tracking the finger
        canvas.addEventListener('touchmove', (e) => {
            const t = e.touches[0];
            if (t) move(t);
        }, { passive: true });
        canvas.addEventListener('touchend', leave, { passive: true });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver((entries) => {
                visible = entries[0].isIntersecting;
                visible ? start() : stop();
            }).observe(figure);
        }
        document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

        let resizeTimer = 0, lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            // Mobile browsers fire resize when the URL bar hides; only rebuild on width changes
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => { build(); started = performance.now() - 3000; }, 180);
        });

        Promise.all([loadImage(), loadFont()]).then(() => {
            build();
            figure.classList.add('is-live');
            started = performance.now();
            start();
        }).catch(() => { /* keep the <img> fallback */ });

        // Expose a tiny hook for the terminal / console curious folks
        window.breakFabian = () => {
            shockwave(W / 2, H / 2, 40);
            return 'SEV-1 declared. Watch the auto-remediation…';
        };
    }

    // ========================================
    // CURSOR: trailing ring + contextual label
    // ========================================
    function initCursor() {
        const el = $('#sxCursor');
        if (!el || !finePointer || reduceMotion) return;
        const label = $('#sxCursorLabel');
        let tx = -100, ty = -100, rx = -100, ry = -100, shown = false;

        const labels = {
            portrait: { es: 'rómpeme', en: 'break me' },
            link: { es: 'abrir', en: 'open' },
            btn: { es: 'ejecutar', en: 'run' }
        };

        document.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            tx = e.clientX; ty = e.clientY;
            if (!shown) { shown = true; rx = tx; ry = ty; el.classList.add('on'); }
            const target = e.target;
            let mode = '';
            if (target.closest && target.closest('#healCanvas')) mode = 'portrait';
            else if (target.closest && target.closest('a')) mode = 'link';
            else if (target.closest && target.closest('button')) mode = 'btn';
            el.dataset.mode = mode;
            if (label) label.textContent = mode ? labels[mode][lang()] : '';
        }, { passive: true });
        document.addEventListener('pointerleave', () => { shown = false; el.classList.remove('on'); });
        document.addEventListener('pointerdown', () => el.classList.add('down'));
        document.addEventListener('pointerup', () => el.classList.remove('down'));

        (function loop() {
            rx += (tx - rx) * 0.2;
            ry += (ty - ry) * 0.2;
            el.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
            requestAnimationFrame(loop);
        })();
    }

    // ========================================
    // MAGNETIC BUTTONS
    // ========================================
    function initMagnetic() {
        if (!finePointer || reduceMotion) return;
        $$('.sx-magnetic, .social-icon').forEach(el => {
            el.addEventListener('pointermove', (e) => {
                const r = el.getBoundingClientRect();
                const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
                const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
                el.style.transform = 'translate(' + dx * 14 + 'px,' + dy * 12 + 'px)';
            });
            el.addEventListener('pointerleave', () => { el.style.transform = ''; });
        });
    }

    // ========================================
    // DECODE: headings resolve from noise when revealed
    // ========================================
    function decode(el) {
        const final = el.textContent;
        if (!final.trim()) return;
        const chars = '!<>-_\\/[]{}=+*^?#01ABCDEFXZ';
        const total = 22 + final.length;
        let frameN = 0;
        el.style.minWidth = el.offsetWidth ? el.offsetWidth + 'px' : '';
        (function tick() {
            let out = '';
            for (let i = 0; i < final.length; i++) {
                const settle = (i / final.length) * (total - 10) + 8;
                if (final[i] === ' ' || frameN >= settle) out += final[i];
                else out += chars[(Math.random() * chars.length) | 0];
            }
            el.textContent = out;
            frameN++;
            if (frameN <= total) requestAnimationFrame(tick);
            else { el.textContent = final; el.style.minWidth = ''; }
        })();
    }

    function initDecode() {
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        const targets = [];
        $$('.section-title, [data-scramble]').forEach(title => {
            const parts = $$('.l-es, .l-en', title);
            if (parts.length) targets.push({ root: title, parts: parts });
            else targets.push({ root: title, parts: [title] });
        });
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const t = targets.find(tt => tt.root === entry.target);
                if (t) setTimeout(() => t.parts.forEach(decode), 120);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.6 });
        targets.forEach(t => io.observe(t.root));
    }

    // ========================================
    // 3D TILT on cards
    // ========================================
    function initTilt() {
        if (!finePointer || reduceMotion) return;
        $$('.card, .deploy-entry').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                card.style.setProperty('--rx', (-py * 5).toFixed(2) + 'deg');
                card.style.setProperty('--ry', (px * 6).toFixed(2) + 'deg');
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
                card.classList.add('sx-tilting');
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
                card.classList.remove('sx-tilting');
            });
        });
    }
})();
