# PROJECT_STATE — Dirham Drift

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-11-01 · **By:** Claude (build) · **Commit:** see build log

---

## 1. Right now

- **Active phase:** Phase 7 — Ghost Challenge (owner approved starting it 2026-10-30; branch + PR, owner merges)
- **Status:** Phase 7 built and verified locally on branch `claude/project-thread-dnj9pv` (PR open); server not deployed. Phases 4–6 built, verified and pushed; owner checks pending (Gate 0 phone test, Phase 4 full-season playtest + balance, Quick Season snapshot review, Phase 6 install test on Android + iPhone, Arabic native review)
- **Next step:** owner merges the PR, sets up Atlas + Render + `VITE_GHOST_API_URL` on Vercel, then the two-phone code test (Phase 7 gate)
- **Blocked by:** nothing

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Gate |
|---|---|---|---|---|
| 0 — Setup + Gate 0 | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner phone test deferred |
| 1 — Racing core | Built, verify passes | 2026-10-28 | see build log | 🛑 Owner playtest deferred; car feel not frozen |
| 2 — Money engine | Done (automatic gate) | 2026-10-28 | see build log | Auto + review (self-review done in this run) |
| 3 — Pit Hub | Done (automatic gate) | 2026-10-28 | see build log | Auto + screenshots |
| 4 — Seasons | Built, verify passes | 2026-10-28 | 781af4d | 🛑 Owner full-season playtest + tuning pending; snapshot pending owner review |
| 5 — Polish | Done (automatic gate) | 2026-10-28 | 39a9aaa | Auto + screenshots |
| 6 — App + Arabic (P1) | Built, verify passes | 2026-10-29 | 6c2c29e | Owner install test on Android + iPhone pending |
| 7 — Ghost Challenge (P1) | Built, verify + server tests pass | 2026-10-30 | see PR | Owner two-phone test pending (needs deploy) |
| 8 — Ship | Not started | | | 🛑 Owner + review |

Never mark a phase Done until its acceptance criteria pass and the owner approves.

## 3. Last verification

| Check | Command | Result | Date |
|---|---|---|---|
| Full gate | `npm run verify` | pass | 2026-11-01 |
| Tests | `npm test` | 178 passed (29 files) | 2026-11-01 |
| Ghost server tests | `cd server && npm test` | 23 passed (in-memory MongoDB 8.2) | 2026-10-30 |
| Lint | `npm run lint` | 0 errors, 0 warnings | 2026-10-31 |
| Build | `npm run build` | pass, relative `./assets` paths; PWA precache 43 entries (2,348 KiB, images included) | 2026-10-30 |
| Phone landscape screenshots | Playwright 844×390 + 1280×720, English and Arabic | taken, checked | 2026-10-29 |
| Quick Season snapshot (PRD §19) | `tests/engine/quickSeason.test.js` | generated 2026-10-28; Phase 6 added the recap `zakat` field (event order unchanged) — **pending owner review** (not locked yet) | 2026-10-29 |
| PWA install on a real phone | — | **owner check pending** | — |
| Frame rate on real phone | — | — | — |

## 4. What works (verified)

- Vite + React + Phaser 4.2.1 project; `npm run verify` = lint + Vitest + build.
- Marina street circuit drawn in code from its spline (canal, bridge at the sea mouth, hairpins at both ends, palms, lamps, towers with pools/helipads, yachts, curbs, start gantry).
- One player car with arcade physics, barrier collisions, rotating follow camera with look-ahead.
- Touch controls (steer pad, Gas, Brake, Nitro) and keyboard (arrows/WASD, Shift, Space, P). Two-finger steer + gas checked with a two-point touch event in headless Chromium.
- Rotate-your-phone screen in portrait; frame-rate debug overlay (Settings → Show frame rate).
- 4 AI rivals on a racing line with lane changes to pass, seeded pace variation and stage pace (Rookie / Pro / Final); unstick reset.
- Difficulty Easy / Medium / Hard (FR-MODE-007) on Mode select for Quick Race, Career and Quick Season: faster, steadier rivals with more nitro and catch-up on harder levels; Easy matches the old race exactly (checked by comparing finish times before and after); a season keeps its level in the save.
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
- Quick Season (5 min) in Mode select: seeded script (PRD §19) — race 1 starts straight away (2 taps from title); after race 1 the Pit Hub spotlights the turbo (Engine level 2, more than your cash), the Quick loan and insurance; after race 2 rent + a scripted crash bill always hit, then Desert Gold; race 3 is the free Sheikh Zayed final; an invested scam collapses before the recap. Same events every run; choices change the outcome.
- Season recap (both seasons): grade A–F, final net worth with breakdown (cash, savings, fund, car value, owed), debt-free or not, races/wins/podiums, every lesson met or not, and "what if you had saved instead" (same finishes replayed through the engine with a saver policy).
- Career save and continue: saved in the browser after every change outside a race; Mode select shows "Continue career (race N of 10, net worth)"; starting a new career replaces it; the save clears at the recap; unknown versions start fresh.
- Title screen with a code-drawn Dubai-at-night skyline; How to Play (controls, the loop, one card per money system, modes, tips, simplified-numbers note) from the title and the pause menu; Settings; Credits.
- Settings (all persist): music and effects volume, text size S/M/L, touch control size S/M/L, steering assist, auto-accelerate (off by default), Chill mode, colour-blind safe colours, reduce motion, left-handed layout, vibration, frame rate, reset hints.
- Sound: engine synth whose pitch follows speed (louder/higher on nitro), CC0 crash/coin/thud/click, code-made nitro whoosh, countdown beeps, repossession drop and two music loops (hub, race); audio starts on the first tap; every sound has a visual cue and a file slot.
- Race effects: skid marks when drifting, sparks on barrier hits, nitro flames; bolder upgrade looks at race zoom (dark stripes, red scoop, rear wing, wheels with gold rims sticking out, teal side tanks, a gold glow that grows with upgrades).
- Game images (Google Gemini, made by the owner): title skyline, garage, Bank banner, Desert Gold poster; top-down car sprites for the player, rivals and traffic with upgrades still drawn on top; Marina water, promenade, palms, yachts and rooftops; Sheikh Zayed sand and rooftops. Each falls back to code art if its file is missing.
- App install (website only): manifest, icons, offline service worker; "Install app" on the title and an install guide (Android, iPhone, desktop) only where install works; nothing registers on itch.io domains or inside an iframe.
- Arabic toggle (title and Settings, remembered): every string has an Arabic version; menus and Pit Hub flip right-to-left; race HUD and touch controls keep their layout; Cairo Arabic font bundled for offline.
- Interest-free loan in the Bank: AED 6,000, AED 660 × 10 races = AED 6,600, fixed fee AED 600 shown with "Interest-free doesn't mean free".
- Zakat note in the season recap: simplified 2.5% estimate of cash + savings + fund.
- Event cards with each choice's cost before choosing; Desert Gold shows the red-flag checklist. Pit Lesson cards (one per stop) with the key number; Lesson Book (10); glossary words underlined in the Pit Hub open plain explanations.

## 5. Real vs simplified right now

See `REAL_VS_MOCKED.md`.

## 6. Live links

| Item | Value |
|---|---|
| Vercel (app install) | not deployed |
| itch.io page | not created |
| Ghost API (Render) | not deployed (code ready in `server/`) |
| Video | not recorded |

## 7. Demo recordings (PRD §22)

| Act | Recorded? | File / link | Date |
|---|---|---|---|
| 1 — Hook (Marina win) | no | | |
| 2 — Loan → faster car | no — can be recorded now (Career Season → Bank → loan → Garage → race) | | |
| 3 — Crash → repo | no — can be recorded now (Quick Season: loan + turbo, finish low in race 2, skip insurance) | | |
| 4 — Scam | no — can be recorded now (Quick Season: invest in Desert Gold after race 2) | | |
| 5 — Recover + recap | no — can be recorded now (Quick Season, saver run; recap shows the Zakat note) | | |
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

- Balance numbers and grade thresholds are defaults from a headless sim, not a real playtest (owner check pending).
- Quick Season snapshot is generated but pending owner review; it is not locked.
- Sound: only crash, coin, thud and click are recorded CC0 files; nitro, beeps, engine, repossession and both music loops are generated in code (owner may replace via file slots).
- Rival cars are recolours of the player car and traffic cars recolours of one grey car until top-down rival images are made; the metro train is still code-drawn (Gemini's train was a side view).
- Frame rate on a real phone not measured (headless only).
- PWA install not yet tested on a real Android or iPhone; the service worker only registers once deployed (or on `localhost`).
- Arabic text is AI-assisted and pending native review (some number–noun agreement, e.g. "10 سباقات", needs a native pass).
- Quick Season repo warning reads "1 strikes" in English (plural not handled); cosmetic.

## 10. Handoff notes

- **Read first:** `CLAUDE.md`, PRD §27 Phase 0, PRD §10 (Racing + Controls), PRD §21 (visual style).
- **Branch:** `claude/project-thread-dnj9pv` (Phase 7 PR) · **Uncommitted work:** none
- **Env vars needed:** Render: `MONGODB_URI`, `ALLOWED_ORIGINS` (see `server/.env.example`). Vercel: `VITE_GHOST_API_URL` (public URL, no secret). GitHub repo variable `GHOST_API_URL` for the keepalive.
- **Watch out for:** CLAUDE.md §8 gotchas; `docs/CONCEPT-BRIEF.md` is outdated.

## 11. Build log

- **2026-11-01 — New version bar (owner request, FR-PWA-001, PRD §16)**: service worker switched to prompt mode with `clientsClaim`; update checks on open, on return to the screen and every 30 min (`src/ui/pwa/appUpdate.js`, `registerSw.js`); `UpdateBar` shows "New version ready. Tap to update." (EN + AR) on menu screens only, never in a race/season/ghost run. Checked in Chromium with two real builds on a local server: bar appears after an update check, stays hidden in a race, tap reloads into the new build, a full close and reopen also gets it, offline reload still works. Note: the first deploy after this one still needs one full close of the app, because older installs run the old service worker code.
- **2026-10-31 — Portrait block, install note, two fixes (owner request, FR-CTL-003, FR-PWA-003, PRD §16)**: the rotate screen now sits over the whole app on a touch phone in portrait, from the title on (moved from the race screen to `App.jsx`; the race still pauses); title has a small "Install it on your phone for a better experience" note that opens the install guide, only where install works and not inside the installed app (`isStandalone` in `pwaHost.js`); desktop Pit Hub Turbo banner keeps its text height (`pit.css`); Bank says "One strike" in Quick Season (EN + AR `bank.repoWarningOne`). New `tests/ui/landscapeAndInstall.test.jsx`. `npm run verify`: lint clean, 172 tests in 28 files, build OK. Owner check: open the site on a phone held upright and confirm nothing is playable until rotated.
- **2026-10-31 — Phone landscape fit (owner request, PRD §21 screens, no feature change)**: new `src/styles/compact.css` (only applies when the screen is 500 px tall or less, plus a global `text-size-adjust: 100%` so iPhone Safari stops enlarging small text in landscape). Mode select now fits 844×390 and 667×375 with no scroll (cards in one row, difficulty info on the same line); Pit Hub home fits with no scroll; Bank is about half as tall (smaller banner, tighter offers, Savings / Insurance / Index fund side by side) but still scrolls. Desktop screenshots are byte-identical before and after. `npm run verify`: lint clean, 165 tests in 27 files, build OK. Screenshots (English + Arabic, 844×390, 667×375, 1366×768) in project files `screenshots/phone-fit/`. Owner check: open both screens on the iPhone (the text enlarging only happens on a real iPhone, not in headless Chromium).
- **2026-10-31 — Difficulty Easy / Medium / Hard (owner request, FR-MODE-007, PRD §16)**: picker on Mode select for Quick Race, Career and Quick Season; AI-only tuning in `DIFFICULTY` (`src/game/config/race.js`): rival pace, pace wobble, nitro use, catch-up. Easy finish times match the old code exactly (same seeds, compared before/after). Season level saved in the career save and shown on the pre-race card, Continue card and recap. `npm run verify`: lint clean, 165 tests in 27 files, build OK; Quick Season snapshot unchanged. Screenshots 844×390 and 1280×720 (English + Arabic) in project files `screenshots/difficulty/`. Owner check: play Hard on a phone and say if it feels right (numbers are first guesses).
- **2026-10-31 — Closer race camera (owner request, FR-RACE-001, PRD §16)**: camera 2.5× closer when stopped and pulls back more at top speed; look-ahead scales with the view; nitro now pulls the camera back (it used to zoom in for a moment). Files: `src/game/config/camera.js`, `src/game/race/scenes/{raceCamera,RaceScene}.js`, `tests/race/raceCamera.test.js`. `npm run verify` passed (lint clean, 154 tests in 25 files, build OK). Playwright screenshots 844×390 and 1280×720 on both tracks (start, speed, nitro) in project files `screenshots/camera-zoom/final/`. Owner check: drive it on a real phone (turn warning, frame rate, road sharpness).
- **2026-10-30 — Phase 7 report (Ghost Challenge, PRD §27; built against FR-MODE-006, §11 ghost errors, §12 security, §14 API)**
  - Files: server `server/{package.json,package-lock.json,.env.example}`, `server/src/{index,app,config,codes,cors,errors,rateLimit,validateGhost,ghostStore}.js`, `server/test/*`; client `src/game/config/ghost.js`, `src/game/race/ghost/{recorder,playback}.js`, `src/game/race/scenes/{ghostRun,RaceScene}.js`, `src/game/race/sim/raceSim.js` (any rival count), `src/ui/ghost/*`, `src/ui/{raceSetup.js,race/Hud.jsx,race/RaceScreen.jsx,screens/modes.js,format.js}`, `src/App.jsx`, `src/styles/ghost.css`, `src/i18n/{en,ar}.js`, `.github/workflows/ghost-keepalive.yml`; tests `tests/race/ghost.test.js`, `tests/ui/ghost.test.jsx`.
  - Tests: `npm run verify` passed — lint clean, 149 tests in 24 files, build OK. `cd server && npm test` — 23 passed against an in-memory MongoDB: save → 6-character code → load back, lower-case codes, only track/time/path + 30-day TTL stored, not-found, 10 kinds of invalid ghost, broken JSON, 413 over the size limit, longest allowed run fits, CORS preflight + itch wildcard + blocked origins, rate limit + Retry-After + reset, `server_waking` and `/health` while the DB is down. Client: a recorded run on each track passes the server's own validator, same run → same path, client/server config agree, playback interpolation and ±π seam; UI: mode card only with a server URL, code clean-up, not-found, waking → retry, share code, dead heat, rate limit.
  - Manual checks: real server (in-memory MongoDB) + dev build in Playwright: phone 844×390 recorded a Sheikh Zayed run and got a code; desktop 1280×720 entered that code and raced the ghost (ghost car visible pulling away), got its own code; unknown code shows the error in English and Arabic. Screenshots in project files `screenshots/phase-7/`. Quick Season snapshot unchanged.
  - PRD updates: §11 `origin_not_allowed` row; §16 Phase 7 row.
  - Limits: server not deployed; the two-phone test needs Atlas + Render + `VITE_GHOST_API_URL`. Render free sleeps 15 min after the last request (first load ~30–60 s, shown as "Waking server…"). Server-side checks stop broken paths, not a determined cheater. Ghost Arabic strings AI-translated, pending review.
  - Video act: none new (Ghost is P1, not in the 2-minute script).

- **2026-10-29 — Owner phone-test fixes (PR #1, merged to main by owner approval 2026-10-29)**: mode menu Back returns to the Pit Hub you left (Home goes to the title); insurance "Tap to insure your car" line; Bank chips set an amount in an input + confirm button (16 px input, no iPhone zoom); race boots only in landscape and the camera resizes with the canvas. `npm run verify` passed — lint clean, 128 tests in 21 files, build OK. Playwright 390×844 → 844×390 rotate matches a direct landscape start (headless Chromium did not show the iPhone zoom bug, so the owner should re-test on the iPhone). Screenshots in project files `screenshots/fixes-menu-bank-rotate/`.

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
- **2026-10-28 — Phase 4 report (Seasons, PRD §27; built against FR-MODE-001…005, §19 seeded scenario, §11 Career structure)**
  - Files: `src/game/config/season.js` (Quick Season script, `GRADES`, `SAVER_PLAN`), `src/game/engine/{season,afterRace,recap,index}.js` (start cash/upgrades per mode, per-race entry fee override, rent list, scripted crash bill, race log, grade, "what if", recap summary; state version 2), `src/ui/storage/seasonStore.js`, `src/ui/season/{useSeason.js,SeasonFlow.jsx,SeasonRecap.jsx,TurboOffer.jsx,PitHub.jsx,Money.jsx}` (SeasonOver stub removed), `src/ui/screens/{modes.js,ModeSelect.jsx}`, `src/App.jsx`, `src/styles/season.css`, `src/i18n/en.js`, tests `tests/engine/{quickSeason,recap}.test.js` + snapshot, `tests/ui/seasons.test.jsx`, `tests/ui/{seasonHarness.jsx,pitHub.test.jsx}`.
  - Tests: `npm run verify` passed — lint clean, 101 tests in 16 files passed, build OK. New: Quick Season script (turbo > cash after any race-1 result; race 2 crash bill + rent + Desert Gold; scam collapses before recap; same events every run; choices change the outcome; borrower loses the turbo), Quick Season snapshot (event order + full final state + recap), grade thresholds + in-debt drop, recap numbers = ledger, "what if" replay, race log; UI: Quick Season auto-starts race 1, turbo/loan/insurance spotlight, recap content, career save → resume at the Pit Hub with the same cash and upgrades, Continue only when saved, unknown versions ignored, save cleared at recap.
  - Manual checks: Playwright 844×390 (touch, DPR 2) and 1280×720 through a real Quick Season (real Phaser races, retired via pause) — modes, race 1, statement, turbo spotlight, loan, statement with missed crash bill + late fee + repossession, Desert Gold, recap — then a career saved, left and continued. No page errors. Screenshots in project files `screenshots/phase-4/`.
  - Config: Quick Season and grade values in `src/game/config/season.js`. No env vars.
  - PRD updates: §16 rows (Quick Season script details, grade defaults "owner to tune", "what if" method, save format); §33 Q3 note.
  - Owner checks pending: full Quick + Career playtest and balance tuning; Quick Season snapshot approval.
  - Video acts: **Act 3 (crash → repo) and Act 4 (scam) can be recorded now** in Quick Season.
- **2026-10-28 — Phase 5 report (Polish, PRD §27; built against FR-UI-001…002, FR-A11Y-001, FR-SND-001, §21 surfaces 1, 13, 14)**
  - Files: config `src/game/config/{settings,audio,effects,art}.js` (+ `style.js` car looks, `car.js` unchanged); audio `src/game/audio/{audio,synth,music,engineSound,slots}.js` + `src/assets/audio/{hit,coin,thud,click}.mp3` (CC0); race `src/game/race/scenes/{RaceScene,raceEffects}.js`, `src/game/race/render/{carArt,carTexture}.js`, `src/game/race/sim/{carPhysics,walls,performance,raceSim}.js` (assist input, chill damage, hits/drift in telemetry); UI `src/ui/screens/{TitleScreen,HowToPlay,howToPlayCards,SettingsScreen,CreditsScreen,creditsList}.jsx|js`, `src/ui/art/*`, `src/ui/{applySettings,uiSounds,raceSetup}.js`, `src/ui/race/{RaceScreen,Overlays,useRaceSounds}`, `src/ui/season/{SeasonFlow,useMoneySounds,Garage,EventCard,bank/Bank}`, `src/ui/storage/settingsStore.js`, `src/styles/polish.css` (+ text-scale, colour vars, control-scale in existing CSS), `src/i18n/en.js`; tests `tests/ui/settings.test.jsx`, `tests/race/assists.test.js`, `tests/race/carPhysics.test.js`.
  - Tests: `npm run verify` passed — lint clean, 113 tests in 18 files passed, build OK. New: settings defaults; every toggle persists across a reload; text/control size and volumes persist and set the page variables; flags become page classes; reset hints; How to Play has every section and money card with no unfilled numbers + the simplified note; credits name CC0 / MIT / Claude; assists off by default, Chill mode slows rivals and halves crash damage, steering assist and auto-accelerate reach the race; money sound choice; chill damage in the wall test.
  - Manual checks: Playwright 844×390 (touch, DPR 2) and 1280×720 — title art, How to Play (controls, money), Settings, Credits, Bank and Garage art, upgraded car in a real race (stripes, scoop, wheels, tanks, glow), nitro flame, How to Play from the pause menu, Desert Gold poster, the Phase 4 Quick Season flow again. No page errors. Sound cannot be heard in headless Chromium: audio code paths ran without errors, but loudness and mix are an owner check.
  - Every sound has a visual cue: engine ↔ speedometer; crash ↔ DMG in HUD + sparks; coin/thud ↔ ▲/▼ statement lines; nitro ↔ flame + nitro bar; beeps ↔ countdown numbers; repossession ↔ red statement line; click ↔ button press.
  - Network: kenney.nl blocked (403) → CC0 pack from OpenGameArt used for 4 effects; the rest generated in code (PRD §16).
  - PRD updates: §16 rows for sound sources + file slots, hub art slots, accessibility definitions.
  - Still needs real files / owner images: hub art (4 slots), music (2 loops), optional nitro/beep/go/repo recordings.
  - Video act: **Act 5 + recap can be recorded** (Quick Season, saver run).
- **2026-10-29 — Phase 6 report (App + Arabic, PRD §27; built against FR-PWA-001…002, FR-I18N-002, FR-MON-011, §26 P1 Zakat note)**
  - Files: `package.json` (exact: @fontsource/cairo 5.3.0, vite-plugin-pwa 2.0.0, workbox-build 7.4.1, workbox-window 7.4.1), `vite.config.js` (PWA plugin, manual registration, off in tests), `index.html` (icons, apple web-app tags), `public/icons/*`, `src/game/config/{app,economy}.js` (`PWA_RULES`, `LOANS.interestFree`, `ZAKAT`), `src/game/engine/{recap,index}.js` (`zakatEstimate`), `src/i18n/{ar,en,strings}.js`, `src/ui/{applyLanguage.js,pwa/*}`, `src/ui/screens/{InstallGuide,LanguageToggle,TitleScreen,SettingsScreen,howToPlayCards,creditsList}`, `src/ui/season/{SeasonRecap.jsx,bank/LoanSection.jsx}`, `src/ui/race/RaceScreen.jsx` (`dir="ltr"`), `src/App.jsx`, `src/main.jsx`, `src/styles/{arabic,pit,season,polish}.css`; tests `tests/ui/{arabic.test.jsx,pwa.test.js,strings.test.js,seasons.test.jsx}`, `tests/engine/{rules,recap}.test.js`, Quick Season snapshot (+ recap `zakat`).
  - Tests: `npm run verify` passed — lint clean, 122 tests in 20 files passed, build OK (PWA: `sw.js`, `manifest.webmanifest`, 22 precache entries). New: Arabic has every English key with the same variables and glossary words; language switch + English fallback; toggle flips `dir`/`lang`, shows Arabic and persists; install button hidden where PWA is off; itch.io/itch.zone/hwcdn.net and iframes switch PWA off; interest-free total = borrow + fixed fee and repays exactly that; Zakat estimate whole AED, rounded down, never negative; recap shows the Zakat note.
  - Snapshot: the Quick Season snapshot changed only by the new recap `zakat` field (`amount 315, base 12600`); event order and final state unchanged.
  - Manual checks: Playwright 844×390 (touch, DPR 2) and 1280×720 in English and Arabic — title (language toggle, Install app), install guide, Settings, How to Play, modes, race HUD (unchanged layout in Arabic), statement, Pit Hub, Bank with three loans, recap with Zakat note. No page errors. Screenshots in project files `screenshots/phase-6/`.
  - Config: `PWA_RULES` (`src/game/config/app.js`), `LOANS.interestFree` and `ZAKAT` (`src/game/config/economy.js`). No env vars.
  - PRD updates: §11 loans table (interest-free row); §16 rows (PWA switch, Arabic + font, interest-free numbers, Zakat method); §17 rows (PWA, Arabic, Zakat).
  - Owner checks pending: PWA install on Android Chrome and iPhone Safari after deploy; Arabic native review.
  - Video act: install act can be recorded after the owner deploys to Vercel.
- **2026-10-29 — Gemini images added (no phase; owner asked for it and to push to main)**
  - Files: `src/assets/art/{title,garage,bank,scamAd}.webp`, `src/assets/race/*.webp` (17 files), `src/game/assets/fileSlots.js` (shared by audio, hub art and race art), `src/game/race/render/{raceArt,carSprite,carArt,carTexture,decor,marinaScene,sheikhZayedScene}.js`, `src/game/race/scenes/{RaceScene,ambientTraffic,trackVisuals}.js`, `src/game/config/style.js` (`CAR_SPRITES`, `SCENE_ART`, garage preview pixel ratio), `src/ui/season/{CarPreview.jsx,bank/Bank.jsx}`, `src/styles/{polish,pit}.css`, `src/i18n/{en,ar}.js` (credits), `tests/race/raceArt.test.js`.
  - Tests: `npm run verify` passed — lint clean, 132 tests in 22 files passed (4 new: every car, scenery and hub image ships; code fallback), build OK. Quick Season snapshot unchanged.
  - Manual checks: Playwright 844×390 (touch, DPR 3) and 1440×900 on the production build: title, Pit Hub, Garage before/after upgrades, Bank banner, Marina and Sheikh Zayed races. No page errors. The Desert Gold poster was not screenshotted (it needs a Quick Season run to race 2).
  - Owner checks pending: look on a real phone; regenerate rival cars (top-down), metro train (top-down) and optionally the palm (flat background).

