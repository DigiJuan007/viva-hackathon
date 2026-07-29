# Viva — Companion Moment

**A voice-first, on-device AI companion for isolated seniors.**
Built for **Build with Gemma NYC — On-Device AI for Healthcare** (Saturday, August 1, 2026) · Track: **🔒 On-Device Private Health**

---

## The problem

Isolation is a documented health outcome for seniors — comparable in impact to smoking or obesity — and it rarely gets treated because it has been normalized. Most "senior tech" assumes a comfort with apps and typing that many older adults don't have. Meanwhile, the stories and memories they carry are locked in their heads, at risk of being lost.

## What Viva does

Viva is a warm, voice-first companion that lives on a senior's own device. It does two things:

1. **Daily Companion Moment** — a short, spoken daily check-in: breathing, gentle movement, a reminiscence prompt, and a favorite-song moment. No typing, no login, no menus to learn.
2. **Legacy capture** *(build-day extension)* — a senior speaks a memory in response to a simple prompt ("Tell me about a day you'd live again exactly as it was"), and the companion reflects it back as a short, titled story they can keep.

The seven-day Companion Moment pack shipped in this repo (`content.js`) is universal, generic wellness content — it is not tied to any real person and contains no real names, health facts, or transcripts.

## Architecture — on-device by design

Viva's inference runs on **Gemma 4** (Google DeepMind, Apache 2.0), served locally via **Ollama** on **loopback only** (`http://127.0.0.1:11434`). There is no cloud vendor in the conversational data path: no API call carrying a senior's voice, memory, or health mention ever leaves the device it's spoken on.

- **Model:** `gemma4:e4b` (4.5B effective params, edge/mobile-optimized), with `gemma4:e2b` staged as a lighter fallback.
- **Runtime:** Ollama, talking to Apple's MLX/Metal backend on Apple Silicon (or the equivalent local backend on other hardware).
- **Data path:** app → `127.0.0.1:11434` → local model → app. No DNS resolution, no external host, no telemetry call in that loop.
- **Why this matters:** on-device inference removes the hard part of health-data handling by architecture, not by a compliance layer bolted on after the fact — nothing is transmitted, so there is nothing to intercept, log, or subpoena on the wire. This repo does not claim any formal certification; see **Scope**, below.

The static shell in this repo (`app.js`, `content.js`) is the reusable UX and content-pack pattern the on-device model plugs into. The exact integration point is marked in `app.js`:

```js
// AI BACKEND SWAP POINT:
async function answerQuestion(day, question) {
  void question;
  return day.help;
}
```

As shipped here, this function returns static, pre-written, day-specific help — the MVP intentionally makes **zero network calls**. The Saturday build points this function at the local Ollama endpoint above so the "Ask a Question" flow and the legacy-capture conversation run through live on-device Gemma 4 inference instead.

## How to run it

No build step, no dependencies, no account. From this directory:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080` in a browser. Opening `index.html` directly as a file also works for everything except installability (service workers require a real server or `localhost`).

**To add live on-device inference:** install [Ollama](https://ollama.com), run `ollama pull gemma4:e4b`, start `ollama serve`, and point the `answerQuestion` function in `app.js` at `http://127.0.0.1:11434/api/chat`. See `app.js` for the exact swap point.

**Install on a phone/tablet:** open the hosted app in a mobile browser and use "Add to Home Screen" (iOS Safari) or "Install app" (Android Chrome). The app installs as a standalone PWA and works offline once loaded.

## Scope — decision-support only

This build follows the hackathon's own scope rules:

- **Decision-support only.** Viva reminds, logs, and accompanies. It does not diagnose, does not recommend treatment, and does not give medical advice.
- **Synthetic or public data only.** No real patient or client data appears anywhere in this repository or in any demo built from it. The seven-day content pack is original, generic wellness copy written for this project.
- **Not a claim of regulatory compliance.** On-device architecture reduces the surface area a compliance program has to cover — it is not itself a certification, and this project makes no claim of formal compliance with any healthcare data regulation.

## License

MIT — see `LICENSE`. Chosen for a hackathon submission: it lets judges, organizers, and anyone else freely read, run, fork, and build on the code with minimal friction, while keeping the standard "as-is, no warranty" protection.

## Status

This repository is a clean-room build for the Build with Gemma NYC submission — it contains only the demo application and its assets, built and/or extended live during the event's build window (11:00 AM–3:45 PM, Saturday, August 1, 2026).

**Live demo:** `[FILL SATURDAY]`
**Kaggle Writeup:** `[FILL SATURDAY]`
