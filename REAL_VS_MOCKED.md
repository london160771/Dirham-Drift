# Real vs. simplified — Dirham Drift

Dirham Drift is a game. Nothing in it moves real money. This page says plainly what is real game code, what is simplified, and what is fictional.

| Part | Status | Proof |
|---|---|---|
| Racing, physics, AI rivals | Real game code | `src/game/race/` (sim, track, render, scenes); tests in `tests/race/` |
| Money engine (loans, strikes, repossession, insurance, savings, index fund, scam, ledger) | Real game code, unit-tested | `src/game/engine/`; 47 engine tests in `tests/engine/` incl. all 7 PRD §18 checks (2026-10-28) |
| Pit Hub screens (Garage, Bank, statement, events, lessons, glossary) | Real game code, every number read from the engine or config | `src/ui/season/`; 11 engine ↔ UI tests in `tests/ui/` (2026-10-28) |
| Interest, fees, returns, prices | **Simplified and illustrative** | All numbers in `src/game/config/economy.js`; note on Bank screen and How to Play |
| Banks, funds, sponsors | **Fictional** | No real names or logos |
| Desert Gold Racing Fund | **Fictional scam, for teaching** | Red-flag checklist + Pit Lesson |
| Ghost Challenge (P1) | Real server (Render + MongoDB) | [to fill if built] |
| App install (PWA, P1) | Real, from the website only; off on itch.io domains and inside iframes | `vite.config.js`, `src/ui/pwa/`; tests in `tests/ui/pwa.test.js` (2026-10-29). Install on Android/iPhone not yet tested on a real phone |
| Interest-free loan (P1) | Real game code; fixed fee is **simplified** | `LOANS.interestFree` in `src/game/config/economy.js`; test in `tests/engine/rules.test.js` |
| Zakat note (P1) | **Simplified estimate** (2.5% of cash + savings + fund) | `zakatEstimate` in `src/game/engine/recap.js`; "Simplified for learning" shown under it |
| Arabic text (P1) | **AI-assisted translation, pending native review** | `src/i18n/ar.js`; key and variable parity tested in `tests/ui/strings.test.js`; disclosed in Credits |

**Not financial advice.** Rates and returns are not predictions.

**Not built yet (2026-10-29):** Ghost Challenge (Phase 7). PWA, Arabic toggle, interest-free loan and Zakat note are built (Phase 6). Sound is part real CC0 recordings (crash, coin, thud, click) and part generated in code (engine, nitro, beeps, music); hub art is drawn in code until AI images are added. Quick Season, season recap (grade + "what if") and Career save are built (Phase 4); grade thresholds are defaults the owner will tune. This file is updated as each phase is verified.

This file, PRD §17 and the code agree. An honest "not yet" beats a fake green badge.
