# PROJECT_STATE — Dirham Drift

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-10-28 · **By:** Claude (build) · **Commit:** see build log

---

## 1. Right now

- **Active phase:** none — Phases 0–3 built; waiting for the owner's phone test (Gate 0 + Phase 1 playtest)
- **Status:** Phases 0–3 passed their automatic checks; Gate 0 and the Phase 1 owner playtest are deferred by the owner until now
- **Next step:** owner phone test, then Phase 4 only on the owner's go
- **Blocked by:** nothing

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Gate |
|---|---|---|---|---|
| 0 — Setup + Gate 0 | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner phone test deferred |
| 1 — Racing core | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner playtest deferred; car feel not frozen |
| 2 — Money engine | Done (automatic gate) | 2026-10-28 | see build log | Auto + review (self-review done in this run) |
| 3 — Pit Hub | Done (automatic gate) | 2026-10-28 | see build log | Auto + screenshots |
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
| Tests | `npm test` | 83 passed (13 files) | 2026-10-28 |
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
- Money engine (`src/game/engine/`, pure, no UI/Phaser/storage): season state + state machine (illegal transitions throw), ledger for every money change, seeded RNG, upgrades + car value, Quick/Big loans, payment order, late fees, strikes, repossession, insurance, damage/repair, savings growth, index fund, Desert Gold scam, event pool, rent and scam anchors, entry fees, Club Race, prizes, lessons queue, net worth. All §18 consequence checks pass (7/7).
- Pit Hub (Career Season entry in Mode select): net worth, cash, savings and debt always on top (with strikes); tabs for Pit Hub, Garage, Bank, Lesson Book; first-visit tips (Garage, Bank, net worth), once.
- Garage: 3 slots × 3 levels; buying changes the next race's car stats and its look (wheels for tyres, stripes/scoop/spoiler for engine, teal exhaust/tanks for nitro), shown on a lift preview and in the race; optional repair.
- Bank: Quick/Big loan cards show you get, per race, races, total to repay and extra cost before accepting; savings deposit/withdraw; insurance toggle; index fund invest/sell; "Numbers are simplified. Not financial advice." note.
- Next race card: stage race (entry fee, win prize) or free Club Race; never stuck. Pre-race card warns about damage.
- Race reads car stats + damage from the season and shows cash + loan left in the HUD; it returns results only. Quitting a season race retires (last place, no prize, damage kept).
- Results statement: every ledger line since the race started (prize, entry fee, repayments, missed payments, late fee + strike, repossession, rent, growth, fund move, scam), cash now, repair-or-race-damaged choice (insured bill = 20%).
- Event cards with each choice's cost before choosing; Desert Gold shows the red-flag checklist. Pit Lesson cards (one per stop) with the key number; Lesson Book (10); glossary words underlined in the Pit Hub open plain explanations.

## 5. Real vs simplified right now

See `REAL_VS_MOCKED.md`.

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
| 2 — Loan → faster car | no — can be recorded now (Career Season → Bank → loan → Garage → race) | | |
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

- Career Season is playable end to end but untuned, has no save/continue and ends on a stub "Season complete" card (recap with grade and "what if" is Phase 4). Quick Season is not in the menu yet (Phase 4).
- Upgrade looks are small at race zoom; clearer at the Garage preview.
- Frame rate on a real phone not measured (headless only).

## 10. Handoff notes

- **Read first:** `CLAUDE.md`, PRD §27 Phase 0, PRD §10 (Racing + Controls), PRD §21 (visual style).
- **Branch:** main · **Uncommitted work:** none (after the Phase 3 commit)
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
- **2026-10-28 — Phase 2 report (Money engine, PRD §27; built against PRD §11 rules + INV-1…INV-8, §18)**
  - Files: `src/game/config/{economy,season}.js`; `src/game/engine/{money,ledger,lessons,payments,garage,loans,bank,repair,scam,strikes,events,season,afterRace,netWorth,machine,index}.js`; `tests/engine/{helpers,consequences,rules,machine,property}.test.js`.
  - Tests: `npm run verify` passed — lint clean, 72 tests in 11 files passed, build OK. §18 consequence checks 7/7. Property test: 300 random seasons (career + quick) keep INV-1 (whole AED), INV-4 (ledger sums = cash, savings, fund, overdue) and INV-7 (a startable race from every Pit Hub). Determinism: same seed + choices → identical final state. INV-8: every money action throws during RACING.
  - Lint guard: ESLint blocks `Math.random`, Phaser/React/UI imports and browser globals inside `src/game/engine/`.
  - PRD updates: INV-2 wording (RNG state inside the season state) and the Phase 2 clarifications row in §16.
  - Review: self-review of the engine against §11 in this run; the PRD's "stronger model review" is still worth doing before Phase 4 tuning.
  - Limits: Quick Season scripted events (§19) and the snapshot test belong to Phase 4; Quick Season currently has no events. Numbers are untuned.
  - Video act: none new (engine only).
- **2026-10-28 — Phase 3 report (Pit Hub, PRD §27; built against FR-MON-001…010, FR-EVT-001, FR-LSN-001…003, FR-UI-003, §21 surfaces 4–10 and 12)**
  - Files: `src/ui/season/*` (SeasonFlow, useSeason reducer, SeasonRace, PitHub, MoneyBar, Garage, CarPreview, `bank/*`, NextRace + PreRaceCard, ResultsStatement + `statement.js`, EventCard + `eventText.js`, PitLesson, LessonBook, Glossary + RichText, FirstVisitTips, SeasonOver stub, AmountChips, Money), `src/styles/pit.css`, `src/game/race/render/carArt.js` (upgrade looks, shared by the race texture and the Garage preview), `src/App.jsx` (Career Season entry), `src/ui/race/RaceScreen.jsx` (quit passes telemetry), `src/i18n/en.js` (all Pit Hub strings; numbers filled from config), `src/game/config/{economy,race,style}.js` (bank chips, per-race seed step, seed range, garage preview, stripe colour), `vite.config.js` (node + jsdom test projects), `tests/ui/{seasonHarness.jsx,pitHub.test.jsx,statementAndEvents.test.jsx}`.
  - Tests: `npm run verify` passed — lint clean, 83 tests in 13 files passed, build OK. New engine ↔ UI tests (jsdom, real engine, fake race): buy upgrade → cash drops, pips change, next race setup has the new stats and look; loan → total shown before accepting, cash added, HUD gets cash + loan left, repayment line after the race; missed payment (Quick rules) → MISSED + late fee + repossession lines, Pit Lesson, upgrade gone from Garage and from the next race look; quit = retired with AED 0; uninsured repair = full bill, insured = 20%; Desert Gold red flags + choice costs + unaffordable choice disabled; sponsor risk shown; Bank note present; glossary popup; first-visit tips once.
  - Manual checks: Playwright 844×390 (touch, DPR 2) and 1280×720 through a real career: tips, home, bank before/after a loan, glossary, garage before/after 3 upgrades, pre-race card, real Phaser race with touch Gas + steer (HUD shows cash + loan), retire → statement with repair choice, random events, Desert Gold, Pit Lesson, missed rent + strike statement, Lesson Book. No page errors. Screenshots in project files `screenshots/phase-3/`.
  - Found and fixed: Vitest 4.0.18 on Vite 8 compiled test JSX as classic `React.createElement` → `esbuild.jsx = 'automatic'` in test mode only (PRD §16); class-name clash between door buttons and the Garage/Bank grids; engine stripes were gold on a gold car.
  - PRD updates: §16 rows for the test JSX setting and the Phase 3 UI clarifications.
  - Limits: see §9. Numbers untuned. No save yet.
  - Video act: **Act 2 (loan → faster car) can be recorded now.**
