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
| App install (PWA, P1) | Real, from the Vercel site only | [to fill if built] |

**Not financial advice.** Rates and returns are not predictions.

**Not built yet (2026-10-28):** sound and full settings (Phase 5), PWA + Arabic (Phase 6), Ghost Challenge (Phase 7). Quick Season, season recap (grade + "what if") and Career save are built (Phase 4); grade thresholds are defaults the owner will tune. This file is updated as each phase is verified.

This file, PRD §17 and the code agree. An honest "not yet" beats a fake green badge.
