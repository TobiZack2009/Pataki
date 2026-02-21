# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pataki is an AI-powered health navigation and microinsurance platform for Nigeria. It provides AI triage (voice/text/OCR input → risk scoring → care path routing) combined with a micro-payment insurance flow ("Pool & Protect") and a health wallet with credits.

## Tech Stack

- **Frontend**: Vite + plain HTML + Tailwind CSS + JavaScript (JSDoc for type annotations — no TypeScript)
- **Database/Auth**: Firebase (Firestore, region: `africa-south1`)
- **No framework** (no React/Vue) — vanilla JS with JSDoc

## Development Commands

Vite and Tailwind are not yet installed. To bootstrap:

```bash
npm install vite tailwindcss @tailwindcss/vite
npx vite          # dev server
npx vite build    # production build
```

There are currently no lint or test scripts configured.

## Firebase

- Config is in `firebase.json`; Firestore rules in `firestore.rules`
- **Firestore rules are currently open** (`allow read, write: if true`) — development only, must be locked before production
- Deploy rules/indexes: `firebase deploy --only firestore`

## Offline-First Architecture

The app must be offline-capable. Any Firebase or network call that fails should fall back to mock/local data. Never let a failed request break the UI — always have a graceful local fallback.

## Design System: Material You (MD3)

Full spec lives in `design.xml`. Key rules:

- **Seed color**: Purple `#6750A4` (Primary)
- **Font**: Roboto (weights 400, 500, 700)
- **Background**: `#FFFBFE` — never pure white
- **Cards**: Surface Container `#F3EDF7`, `rounded-3xl` (24px) minimum
- **Buttons**: Always `rounded-full` (pill-shaped), `active:scale-95` for press feedback
- **Inputs**: Filled text field style — rounded top (`rounded-t-lg`), square bottom, 2px bottom border
- **State layers**: Use opacity overlays (`bg-md-primary/90` hover, `/80` active) rather than color changes
- **Transitions**: `300ms cubic-bezier(0.2, 0, 0, 1)` standard; `200ms` for micro-interactions
- **Blur shapes**: Large organic blurred divs (primary/secondary/tertiary at 10–30% opacity, `blur-3xl`) must appear in hero and key sections

`agents.md` contains a system prompt for an AI design agent — use it as context when asking Claude to help with UI/design work.

## Key Product Flows

1. **Triage**: User inputs symptoms (voice/text/OCR) → AI scores risk (Low/Med/High) → shows nearby clinics if high
2. **Insurance ("Pool & Protect")**: Weekly micropayments → AI vetting → doctor approval → 6-digit Care Code + QR → pharmacy scans → pooled fund settlement
3. **Health Wallet**: Tracks contributions and Pataki Credits earned via engagement
