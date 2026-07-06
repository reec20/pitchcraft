---
name: verify
description: How to build, launch, and drive the pitchcraft tuner app for runtime verification
---

# Verifying pitchcraft (React/Vite tuner)

## Build & serve

```bash
npm install            # if node_modules missing (eslint/vite not global)
npm run lint
npm run build          # outputs to dist/
npm run preview -- --port 4517 --strictPort   # serves the prod build (run in background)
```

The app is served at `http://localhost:4517/pitchcraft/` (vite `base` is `/pitchcraft/`, matching the GitHub Pages homepage). The bare `/` path also responds.

## Driving the UI headlessly

No playwright/puppeteer in the project. Install `playwright-core` in the scratchpad and point it at the system browser:

```js
import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true });
```

Useful handles:
- Locale switch: `?lang=zh-hans` / `?lang=zh-hant` query param (default zh-Hant).
- Instrument buttons: `button[aria-label^="吉他"]`, `button[aria-label^="貝斯"/"贝斯"]`, …
- Guitar tuning chips: `button[aria-label^="調弦模式"/"调弦模式"]`, active one has `aria-pressed="true"`.
- String note buttons: `button[aria-label^="第 "]` — text is `<note><octave><freq> Hz` with no separator (e.g. `E282 Hz` = E2, 82 Hz); parse carefully.
- Reference pitch: `select#ref-pitch`.

## Gotchas

- Two `403` console errors on load are the Google AdSense/Analytics tags in `index.html` failing outside production — pre-existing, ignore.
- Clicking a string button creates an AudioContext (plays a tone) — harmless in headless.
- Mic-based detection (`getUserMedia`) can't be driven headlessly without fake-audio flags; verify around it.
