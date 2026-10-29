# Portfolio — Fabián Muñoz

**Live:** https://fabianimv.github.io/portfolio/

Personal portfolio of a Site Reliability Engineer, designed as a system running in production.

## Stack

- **Site:** vanilla HTML, CSS and JavaScript. No framework, no build step, no runtime dependencies besides Google Fonts.
- **Hosting:** GitHub Pages, deployed by a GitHub Actions workflow on every push to `main`.
- **Terminal mode:** `portfolio-next/`, a Next.js + three.js (React Three Fiber) app exported as static files and linked from the footer.
- **Chat assistant:** an AWS Lambda in `lambda/` that answers questions about my profile using Google Gemini.

## Design

- **Concept:** "system in production". A status bar HUD, deploy-style experience log, health and incident metrics, an SSH-style contact section and an alert stream.
- **Design tokens:** CSS custom properties on `:root` in `styles.css`. `signal.css` loads afterwards and overrides them with the current look: ink black, bone text and a single acid accent (`#c8ff2e`).
- **Typography:** Geist (sans), Geist Mono (technical UI) and Instrument Serif (editorial headings).
- **Theme:** dark only.
- **Motion:** `prefers-reduced-motion` is respected in both CSS and JS, and pointer effects only run on devices with a fine pointer.
- **Bilingual:** English and Spanish via `.l-en` / `.l-es` spans, with the language set before first paint.

## Animations

| Effect | Technique |
|---|---|
| Self-healing ASCII portrait | Canvas 2D + `requestAnimationFrame`, paused off-screen with IntersectionObserver |
| Custom cursor, magnetic buttons | `pointermove` + `transform` |
| Text decode | `requestAnimationFrame`, triggered by IntersectionObserver |
| 3D card tilt, card spotlight | JS sets CSS custom properties |
| Scroll reveals, counters, skill gauges | IntersectionObserver + CSS transitions |
| Film grain | Inline SVG `feTurbulence` + CSS `@keyframes` |
| Stack marquee, pulses, alert stream, toasts | CSS `@keyframes` |
| Terminal mode 3D scene | three.js via React Three Fiber |
| Terminal mode dashboard | Framer Motion |

## Project structure

```
.
├── index.html            # single page: SEO metadata, icon sprite, all sections
├── styles.css, main.js   # base styles and interactivity (chat, terminal, Ctrl+K palette, i18n)
├── signal.css, signal.js # visual layer: ASCII portrait, cursor, decode, tilt
├── chatbot-config.js     # chat assistant API endpoint
├── portfolio-next/       # terminal mode (Next.js source + exported out/)
├── lambda/               # chat assistant backend
├── sitemap.xml, robots.txt, site.webmanifest, humans.txt
└── .github/workflows/    # GitHub Pages deploy
```

## Run locally

Static site, from the repository root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

Terminal mode (Node.js 20+):

```bash
cd portfolio-next
npm install
npm run dev
```

The app uses a `basePath`, so open http://localhost:3000/portfolio/portfolio-next/out/. Run `npm run build` to regenerate the static export in `portfolio-next/out/`.

## Built with AI

Parts of this site were built with AI coding agents: GitHub Copilot coding agent (design refresh, translation, accessibility) and Claude Code (zero-framework rebuild and the current ASCII-portrait design), reviewed and merged through pull requests.

## License

The **code** in this repository is released under the [MIT License](LICENSE). This covers the HTML, CSS and JavaScript files, `portfolio-next/` and `lambda/`.

The **personal content is not covered by the MIT License** and remains all rights reserved:

- Experience, bio and other descriptive texts about me
- The ASCII portrait and its source image, my photo (`profilepic.jpeg`)
- The link preview image (`og-image.png`)
- My name and contact details

If you reuse this code for your own portfolio, replace all of the above with your own content.
