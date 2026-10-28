# PROJECT_STATE — Dirham Drift

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-10-28 · **By:** Claude (build) · **Commit:** see build log

---

## 1. Right now

- **Active phase:** Phase 2 — Money engine (PRD §27)
- **Status:** Phases 0–1 passed their automatic checks; Gate 0 and the Phase 1 owner playtest are deferred by the owner until after Phase 3
- **Next step:** Phase 2
- **Blocked by:** nothing

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Gate |
|---|---|---|---|---|
| 0 — Setup + Gate 0 | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner phone test deferred |
| 1 — Racing core | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner playtest deferred; car feel not frozen |
| 2 — Money engine | Not started | | | Auto + review |
| 3 — Pit Hub | Not started | | | Auto |
| 4 — Seasons | Not started | | | 🛑 Owner |
| 5 — Polish | Not started | | | Auto |
| 6 — App + Arabic (P1) | Not started | | | Owner install test |
| 7 — Ghost Challenge (P1) | Not started | | | Owner two-phone test |
| 8 — Ship | Not started | | | 🛑 Owner + review |

Never mark a phase Done until its acceptance criteria pass and the owner approves.

## 3. Last verification

| Check | Command | Result | Date |
|---|---|---|---|
| Full gate | `npm run verify` | pass | 2026-10-28 |
| Tests | `npm test` | 28 passed (7 files) | 2026-10-28 |
| Lint | `npm run lint` | 0 errors, 0 warnings | 2026-10-28 |
| Build | `npm run build` | pass, relative `./assets` paths | 2026-10-28 |
| Phone landscape screenshots | Playwright 844×390 + 1280×720 | taken, checked | 2026-10-28 |
| Quick Season snapshot (PRD §19) | — | — | — |
| Frame rate on real phone | — | — | — |

## 4. What works (verified)

- Vite + React + Phaser 4.2.1 project; `npm run verify` = lint + Vitest + build.
- Marina street circuit drawn in code from its spline (canal, bridge at the sea mouth, hairpins at both ends, palms, lamps, towers with pools/helipads, yachts, curbs, start gantry).
- One player car with arcade physics, barrier collisions, rotating follow camera with look-ahead.
- Touch controls (steer pad, Gas, Brake, Nitro) and keyboard (arrows/WASD, Shift, Space, P). Two-finger steer + gas checked with a two-point touch event in headless Chromium.
- Rotate-your-phone screen in portrait; frame-rate debug overlay (Settings → Show frame rate).
- 4 AI rivals on a racing line with lane changes to pass, seeded pace variation and stage pace (Rookie / Pro / Final); unstick reset.
- Ordered checkpoints and laps (3 on Marina), sprint finish line on Sheikh Zayed, live positions, 3-2-1-GO countdown.
- Barrier hits add damage (0–100%) that lowers top speed; wall scraping bleeds speed; nitro fills, bursts and empties.
- Sheikh Zayed sprint: 4 lanes, lit median, oncoming traffic, metro line with moving train, 2 overhead interchanges, finish gantry.
- Quick Race mode: Play → Quick Race → pick track → race → results (position, time, damage, hits, finishing order). No money in HUD.
- Race HUD: position, lap / progress, speed, nitro, damage; cash + loan slot ready for season modes. Pause (button or P), first-race control hints (reset in Settings).

## 5. Real vs simplified right now

See `REAL_VS_MOCKED.md`. Nothing built yet.

## 6. Live links

| Item | Value |
|---|---|
| Vercel (app install) | not deployed |
| itch.io page | not created |
| Ghost API (Render) | not deployed |
| Video | not recorded |

## 7. Demo recordings (PRD §22)

| Act | Recorded? | File / link | Date |
|---|---|---|---|
| 1 — Hook (Marina win) | no | | |
| 2 — Loan → faster car | no | | |
| 3 — Crash → repo | no | | |
| 4 — Scam | no | | |
| 5 — Recover + recap | no | | |
| Install + itch link | no | | |

## 8. Submission pack

| Item | Status |
|---|---|
| Registration form (each jammer) | [ ] |
| GDD (official template, PDF, public link) | not started |
| Budget PDF | plan locked, not written |
| 2-minute video | not started |
| itch.io page | not started |
| AI disclosure | not started |

## 9. Known issues and limitations

- None yet.

## 10. Handoff notes

- **Read first:** `CLAUDE.md`, PRD §27 Phase 0, PRD §10 (Racing + Controls), PRD §21 (visual style).
- **Branch:** main · **Uncommitted work:** none
- **Env vars needed:** none until Phase 7 (`MONGODB_URI`, `ALLOWED_ORIGINS` — names only)
- **Watch out for:** CLAUDE.md §8 gotchas; `docs/CONCEPT-BRIEF.md` is outdated.

## 11. Build log

- **2026-10-25** — Planning complete. PRD v1.0 and doc set written. Concept brief archived to `docs/`.
- **2026-10-28 — Phase 0 report (Setup + Gate 0, PRD §27; built against FR-RACE-001/002/008, FR-CTL-001/002/003, FR-I18N-001, §21 style)**
  - Files: `package.json`, `vite.config.js` (base `./`), `eslint.config.js` (bans `Math.random` in game code and UI/Phaser imports in the engine), `index.html`, `src/main.jsx`, `src/App.jsx`, `src/game/config/*` (car, camera, race, controls, style, tracks), `src/game/engine/rng.js`, `src/game/race/**` (track spline + geometry, car physics, walls, input, canvas-baked track renderer, Phaser scene), `src/ui/**` (title, settings, race screen, HUD, touch controls, hints, overlays), `src/i18n/*`, `tests/**`.
  - Tests: `npm run verify` passed — lint clean, 9 tests in 3 files passed, build OK.
  - Manual checks: Playwright screenshots at 844×390 (touch, DPR 2) and 1280×720; portrait 390×844 shows the rotate screen; two touch points (Gas + steer right) read as `steer 1 · gas 1` in the debug overlay and both release to 0. Headless frame rate is SwiftShader software rendering (≈30–60 fps) and says nothing about real phones.
  - Found and fixed: Phaser 4.2.1 multi-texture shader dropped textures under a rotated camera → `render.maxTextures = 1` (logged in PRD §16).
  - Config/env: no env vars. Vitest pinned to 4.0.18 (npm 10 crash with ≥ 4.1, PRD §16).
  - Limits: Gate 0 not done (no real phone here). Car feel not frozen.
  - Video act: none yet (Act 1 needs Phase 1 races).
- **2026-10-28 — Phase 1 report (Racing core, PRD §27; built against FR-RACE-001…008, FR-CTL-001…004)**
  - Files: `src/game/race/sim/*` (AI driver + passing, lap tracker, positions, walls with damage + scrape, race sim, results), `src/game/race/render/sheikhZayedScene.js`, `src/game/race/scenes/ambientTraffic.js`, `src/ui/screens/{ModeSelect,TrackSelect,QuickRaceResults}.jsx`, `src/ui/race/*` (HUD money slot, hints anchored to each control), `src/game/config/{race,car,style}.js`, `tests/race/*`.
  - Tests: `npm run verify` passed — lint clean, 28 tests in 7 files passed, build OK. New tests: lap counting (in order, 3 laps, skipped section doesn't count, backwards doesn't count, sprint finish), position sorting, damage → top speed, nitro fill/burn/boost, barrier hit damage vs gentle touch, all rivals finish both tracks, Pro/Final rivals faster than Rookie, same seed → same race, results carry no money.
  - Manual checks: Playwright 1280×720 and 844×390 (touch) on both tracks; nitro + steer + gas held with three touch points read correctly; results screen after a sprint; interchange, metro, median and oncoming traffic visible.
  - Car stats object: `buildRaceSetup({ carStats: { engine, tyres, nitro, damage } })` → `buildPerformance` (config `UPGRADE_EFFECTS`).
  - Limits: owner playtest not done; rival pace (Rookie 0.92 / Pro 1.0 / Final 1.06) and all handling numbers are first guesses in `src/game/config/`. Nitro has no flame effect yet (Phase 5). No sound (Phase 5).
  - Video act: **Act 1 (Marina race win) can be recorded** in Quick Race → Marina.
