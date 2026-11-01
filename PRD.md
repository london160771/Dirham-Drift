# PRD — Dirham Drift

**Race for money. Don't let money race you.**

| | |
|---|---|
| **Status** | Final — build against this |
| **Version** | 1.0 |
| **Date** | 2026-10-25 |
| **Owner** | Adesope (Ayyoweb3) |
| **Hackathon / track** | Zoud GameLab (Global Game Jam × Zoud, UAE) — theme "Make FinLit Fun" |
| **Official deadline** | Nov 15, 2026, 11:59 pm AoE = **Nov 16, 2026, 12:59 pm WAT** |
| **Internal cutoff** | **Nov 15, 2026, 6:00 pm WAT** (submit by then) |
| **Links** | Repo: [ ] · Live (Vercel): [ ] · itch.io: [ ] · Video: [ ] |

> **This file is the only source of truth for requirements.** Agents read the relevant section before building and cite it (e.g. "PRD §11"). When reality disagrees, fix this file and log it in §16.
> Use simple words. Every section must be specific enough to build and test against.

---

## 1. One-line definition

Dirham Drift is a top-down racing career game set in the UAE that lets young players feel what borrowing, saving, insuring, investing and scams really do — because every money choice changes how their car drives in the next race — instead of reading money tips on cards.

**Memorable flow (use it everywhere — code, UI, README, video):**

```
RACE → EARN → BORROW → CRASH → REPO → SCAM → RECOVER
```

---

## 2. The story (the video's spine)

- **Act 1 — The hook.** Driver view on the Marina street circuit at night. Win the race, earn AED.
- **Act 2 — The shortcut.** Pit Hub: the turbo costs more than you have. Take the big loan: borrow AED 15,000, pay back AED 18,000. The car is visibly faster.
- **Act 3 — The bill.** Crash with no insurance. Repair bill. Missed payment. **The bank repossesses the turbo** — the next race feels slower.
- **Act 4 — The scam.** "Desert Gold Racing Fund" promises 30% a week. Red flags shown. Invest → first payout → "withdrawals paused" → money gone.
- **Act 5 — Recover.** Second run: save, insure, invest steadily. Win the Sheikh Zayed sprint final debt-free. Season recap.
- **Close.** "Every other game tells you about debt. Dirham Drift lets you feel it."

---

## 3. Problem

**Tiny scenario with numbers:** Ali wins AED 3,000 a race and wants a AED 5,000 engine upgrade. Saving takes two races. Borrowing gets it now: borrow 6,000, repay 700 × 10 races = 7,000. In race 4 he crashes without insurance, the repair is AED 2,500, he can't make the repayment, gets two strikes, and the bank takes the upgrade back. He is now slower *and* still in debt — worse off than if he had saved.

**Why it happens:** money lessons are usually taught as text, quizzes or menus. People skip text. They remember consequences they felt.

**Who feels it:** young people in the UAE and the region getting their first salary, car loan, credit card, or "too good to be true" investment message.

---

## 4. Insight and core guarantee

**Insight:** You can't make people read money lessons in the middle of a race. But you can make them feel the lesson on the next lap.

**Core guarantee:** **Every money decision changes something the player can feel on the track within one race.** No money system exists only as a menu.

---

## 5. The gap

**Jam entries today (12 as of Oct 24):** card and payday games own budgeting; life-sims own "UAE money life"; one detective game, one tycoon, one card game.

| Existing entry | What it owns | How we differ |
|---|---|---|
| Rainy Day (Rui Codex) | Broad UAE money-life: paydays, 32 lesson cards, Islamic banking, scams, Arabic | We teach 5 concepts deeply through action, not many through cards |
| My DUNYA | UAE life-sim from 18 to 50 | We are one career (racer) in real time |
| First Pour, Payday Tides, Rainy Day (Boldurian), Future Me | Salary budgeting | No budgeting screens; money comes from racing |
| Autopay 06:00, Sago Village, 1Dirham | Detective, tycoon, card game | Only real-time action entry |

**What's missing:** a real-time action game where money changes performance.

**We must not be:** another budgeting sim, another life-sim, a "cover every money topic" game, a quiz with a car skin, or a racing game with a bank menu bolted on.

---

## 6. Users and jobs to be done

| User | Needs | Success looks like |
|---|---|---|
| Young player, 16–25, UAE / region | A fun racing game; quick sessions on a phone | Finishes a season and can say why borrowing cost them |
| Teacher / FinLit programme | A short, fun session about debt, saving, scams | One Quick Season in a class period |
| **Judge** | No signup, plays alone, short on time, honest limits | Meets every money system in ≤ 5 minutes via Quick Season |

**Primary user story:** As a young player, I want to upgrade my car fast so I can win bigger races, and I want to see what borrowing, skipping insurance or chasing high returns really costs me.

---

## 7. Goals and non-goals

**Goals**
- **G1 (Fun):** racing that feels good on a phone in landscape and on desktop.
- **G2 (FinLit in the mechanics):** loans, repossession, insurance, savings, index fund and scams all change the car or the race.
- **G3 (Judge-ready):** Quick Season shows every system in ≤ 5 minutes, same events every time.
- **G4 (Reach):** plays in the browser on itch.io and installs as an app (PWA) from Vercel.

**Non-goals (this build will not):**
- Live online multiplayer, accounts, leaderboards.
- 3D graphics, more than 2 tracks, more than 1 city.
- Credit scores, taxes, remittances, budgeting screens.
- Real bank or car brands.
- Real financial advice.

---

## 8. Product principles

1. **Feel first, read second.** Lessons appear after a consequence, never before.
2. **Honest numbers.** Total cost is shown before every loan. All numbers are simplified and labelled so.
3. **Never block a choice.** Warnings (e.g. scam red flags) inform; they don't stop the player. Falling for it is the lesson.
4. **Never soft-lock.** The player can always start another race.
5. **Racing stays pure.** No money pop-ups during a race. Money lives in the HUD and the Pit Hub.
6. **No predatory design.** No ads, no loot boxes, no real-money purchases.

---

## 9. Core flow and user journeys

**End-to-end loop:**
1. Pick a mode → race (3 laps on Marina, or start-to-finish on Sheikh Zayed).
2. Results statement: position, prize, automatic deductions.
3. Event card (if any): choose how to pay or respond.
4. Pit Hub home: Garage + Bank, net worth at top.
5. Next race card: track, entry fee, prize → Race.
6. After the last race: season recap.

**Journey A — the borrower (happy-then-painful):** win race 1 → turbo costs more than cash → take quick loan → faster in race 2 → crash, no insurance → repair bill → can't cover repayment → strike → second strike → newest upgrade repossessed → Pit Lesson → slower next race.

**Journey B — the scam:** Desert Gold Fund offer appears → red-flag checklist shown → invest → next stop: first payout (+30%) → next stop: "withdrawals paused" → deposit lost → Pit Lesson.

**Journey C — the saver (recovery):** keep savings, buy insurance, invest in the index fund → crash bill paid by insurance + savings → no strikes → upgrades bought with cash → Grand Final win, debt-free.

---

## 10. Functional requirements

### Racing
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-RACE-001 | P0 | Top-down racing with a follow camera (driver view, zoomed in, ahead of the car). | Camera follows the player smoothly at 60 fps desktop, ≥ 45 fps mid-range Android. |
| FR-RACE-002 | P0 | Marina street circuit: 3 laps around a canal (one side up, bridge at the sea mouth, back down the other side, hairpins at both ends). | Lap counting uses ordered checkpoints; skipping a section does not count a lap. |
| FR-RACE-003 | P0 | Sheikh Zayed sprint: point to point, 4 race lanes, median with oncoming traffic, metro line alongside, 2 interchanges driven under. | Race ends when a car crosses the finish line; positions are correct. |
| FR-RACE-004 | P0 | 4 AI rivals follow a racing line with small speed variation; stage sets their pace. | Rivals finish every race without getting stuck; Pro/Final rivals are faster than Rookie. |
| FR-RACE-005 | P0 | Wall/barrier hits slow the car and add damage (0–100%). Damage lowers top speed until repaired. | A hard hit adds damage; damage shows in HUD; speed drops by the configured amount. |
| FR-RACE-006 | P0 | Nitro: fills over time, boosts speed for a short burst. | Nitro bar fills, empties on use, speed increases while active. |
| FR-RACE-007 | P0 | Countdown, positions, lap/progress, speed, cash and loan status in the HUD. | All values update live; money values come from the season state. |
| FR-RACE-008 | P0 | Code-drawn tracks in the locked "Dubai at night" style (see §21). | No image tiles for roads; track geometry is a spline used for drawing, walls, checkpoints and AI line. Scenery beside the road (ground textures, palms, yachts, rooftops) may be images placed along the spline (§16, 2026-10-29). |

### Controls
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-CTL-001 | P0 | Phone (landscape): left thumb = steer left / right buttons; right thumb = **Gas** (big), **Brake**, **Nitro** above Gas. No auto-accelerate by default. | Multi-touch works (steer + gas at once). |
| FR-CTL-002 | P0 | Keyboard: arrows / WASD drive, Space = nitro, Shift = brake, P = pause. | All actions work without a mouse. |
| FR-CTL-003 | P0 | Portrait on phone shows a "Rotate your phone" screen on every screen, from the title onward. | Nothing can be tapped or played in portrait; the race pauses in portrait and resumes in landscape. |
| FR-CTL-004 | P0 | First-race hints fade in next to each control and disappear once used. | Shown only on first race; can be reset in Settings. |

### Money (rules in §11)
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-MON-001 | P0 | Garage: 3 upgrade slots (Engine = top speed, Tyres = grip, Nitro = boost), 3 levels each. | Buying an upgrade changes car stats in the next race and changes how the car looks. |
| FR-MON-002 | P0 | Bank — loans: Quick loan and Big loan, total cost shown before accepting; repayments auto-deducted after each race. | Accept screen shows amount, per-race payment, number of races, total to repay. |
| FR-MON-003 | P0 | Late payment: late fee + strike. 2 strikes (1 in Quick Season) → newest upgrade repossessed. | Repo removes the upgrade, its stats and its look; a Pit Lesson follows. |
| FR-MON-004 | P0 | Savings: deposit/withdraw any time in the Pit Hub; small safe growth; used automatically for bills when cash is short. | A bill paid from savings causes no strike. |
| FR-MON-005 | P0 | Insurance: optional per-race premium; covers part of repair costs. | Insured crash bill = 20% of repair; uninsured = 100%. |
| FR-MON-006 | P0 | Index fund: invest/sell in the Pit Hub; value moves each race within a seeded range. | Value changes after every race; can go down. |
| FR-MON-007 | P0 | Desert Gold Racing Fund (scam): offer with red-flag checklist; first payout real; then withdrawals paused and deposit lost. | Follows §11 scam rule exactly. |
| FR-MON-008 | P0 | Repairs are optional: pay to fix damage, or race damaged (slower). | Choice shown on results; unpaid damage carries into next race. |
| FR-MON-009 | P0 | Entry fees for Pro (AED 1,000) and Grand Final (AED 3,000). If the player can't pay, they can borrow or enter a free Club Race instead. | The player is never stuck with no race to start. |
| FR-MON-010 | P0 | Net worth always visible in the Pit Hub. | Matches the §11 formula. |
| FR-MON-011 | P1 | Interest-free loan option (fixed fee instead of interest), total cost shown, with "interest-free doesn't mean free" note. | Total = amount + fixed fee, shown upfront. |

### Events and lessons
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-EVT-001 | P0 | Event cards between races, from a pool (§11), with choices. | Each card shows choices and their cost before choosing. |
| FR-LSN-001 | P0 | Pit Lesson card appears right after a consequence: 1–2 simple sentences + one key number. | Never shown before the consequence; never more than one per Pit Hub stop. |
| FR-LSN-002 | P0 | Lesson Book collects lessons met (about 10, §11). | Recap shows which were met. |
| FR-LSN-003 | P0 | Glossary: underlined money words in the Pit Hub open a plain explanation. | At least: interest, loan, repossess, premium, insurance, savings, index fund, scam, net worth, late fee. |

### Modes and seasons
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-MODE-001 | P0 | **Quick Season (5 min):** 3 races, fixed seed, scripted events (§19). | Same events in the same order every run. Player choices still change the outcome. |
| FR-MODE-002 | P0 | **Career Season:** 10 races in 3 stages, random events with fixed anchors (§11), new seed each career. | Two careers have different event orders; anchors always happen. |
| FR-MODE-003 | P0 | **Quick Race:** pick a track, no money. | No Pit Hub, no money in HUD. |
| FR-MODE-004 | P0 | Season recap: net worth, debt-free or not, lessons met, grade A–F, "what if you had saved instead". | Recap numbers match the ledger. |
| FR-MODE-005 | P0 | Save and continue Career Season (browser storage). | Closing and reopening resumes at the last Pit Hub. |
| FR-MODE-007 | P1 | **Difficulty:** Easy / Medium / Hard picked on Mode select before Quick Race, Career Season and Quick Season. Harder = better AI rivals (§16). Money rules, events and prizes are the same on every level. | Easy plays exactly like the game before difficulty existed; Hard rivals finish faster than Medium, Medium faster than Easy; a season keeps the level it started with after save and continue; Ghost Challenge is not affected. |
| FR-MODE-006 | P1 | **Ghost Challenge:** record your best lap/run, get a 6-character code, a friend races your ghost. | Code works across devices; ghost replays the recorded path. |

### Shell, guide, app
| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| FR-UI-001 | P0 | Title screen, mode select, How to Play, Settings, pause menu. | Reachable within 2 taps; first race starts ≤ 2 taps from title. |
| FR-UI-002 | P0 | How to Play: controls, the loop, money basics (one card per system), modes, tips, install steps. | Available from title and pause. |
| FR-UI-003 | P0 | First Pit Hub visit shows 3 short tips (Garage, Bank, net worth). | First time only. |
| FR-A11Y-001 | P0 | Settings: steering assist, optional auto-accelerate (off by default), Chill mode, text size S/M/L, colour-blind safe icons/signs, reduce motion, left-handed layout, control size, vibration on/off, music/effects volume. | Each setting works and persists. |
| FR-SND-001 | P0 | Engine sound generated in code (pitch follows speed), effects from CC0 packs, 2 music tracks, money sounds (coin in, thud out). | Game is fully playable with sound off; every sound has a visual cue. |
| FR-PWA-001 | P1 | Installable PWA from the Vercel site; install guide for Android, iPhone, desktop; landscape where supported. | Installs and launches offline on Android Chrome and iPhone Safari. |
| FR-PWA-002 | P0 | When running on itch.io, PWA install code is off. | No service worker registered on itch domains. |
| FR-PWA-003 | P1 | Title screen shows a small "Install it on your phone for a better experience" note that opens the install guide. | Shown only where install works (not on itch.io) and not when already running as the installed app. |
| FR-I18N-001 | P0 | All player-facing text lives in one strings file from day one. | No hard-coded UI strings in components or scenes. |
| FR-I18N-002 | P1 | Arabic toggle; menus and Pit Hub flip right-to-left; race HUD layout stays the same. | Every string has an Arabic version; Arabic font loads. |

---

## 11. Domain rules and invariants

All numbers are simplified, illustrative and live in one config file (`src/game/config/economy.js`). Tuning happens in Phase 4.

**Start:** cash AED 5,000, savings 0, no upgrades, no loan.

**Prize money (5 cars):** 1st 3,000 · 2nd 1,800 · 3rd 1,000 · 4th 400 · 5th 0. Grand Final win: 15,000. Club Race prizes are half of normal.

**Upgrades:** Engine / Tyres / Nitro, levels 1–3, cost 2,500 / 5,000 / 9,000. Car value = 50% of the price paid for installed upgrades.

**Loans (one active loan at a time):**
| Loan | Borrow | Repay per race | Races | Total |
|---|---|---|---|---|
| Quick | 6,000 | 700 | 10 | 7,000 |
| Big | 15,000 | 1,500 | 12 | 18,000 |
| Interest-free (P1, FR-MON-011) | 6,000 | 660 | 10 | 6,600 (fixed fee 600) |

**Payment order after each race:** prize in → loan repayment → insurance premium → rent (if due) → bills. Required payments use cash first, then savings automatically.

**Late payment:** if cash + savings can't cover a required payment → AED 300 late fee added to what's owed, the unpaid amount carries over, and **+1 strike**. **2 strikes** (Career) or **1 strike** (Quick Season) → the **newest installed upgrade is repossessed** and strikes reset to 0. Strikes reset when the loan is fully repaid.

**Insurance:** AED 250 per race, opt in/out in the Pit Hub. Covers 80% of repair cost.

**Damage and repair:** repair cost = AED 1,000 + (damage% × 30), so 100% damage = AED 4,000. Repair is optional; unrepaired damage lowers top speed in the next race.

**Savings:** +1% per race on the balance (rounded down to whole AED).

**Index fund:** after each race, value changes by a seeded random amount from −6% to +9% (rounded down to whole AED).

**Scam — Desert Gold Racing Fund:**
1. Offer shows "30% a week, guaranteed" + red-flag checklist (not licensed, guaranteed returns, pressure to bring friends, hard to withdraw).
2. Stop 1 after investing: payout of 30% of the deposit, paid as real cash.
3. Stop 2: "Withdrawals paused." Deposit is gone. Pit Lesson follows.

**Career Season structure (10 races):**
| Stage | Races | Track | Entry fee | Rival pace |
|---|---|---|---|---|
| Rookie Cup | 1–4 | Marina circuit | Free | Base |
| Pro Series | 5–8 | Both | AED 1,000 | Faster (2+ upgrade levels recommended) |
| Grand Final | 9–10 | Sheikh Zayed sprint | AED 3,000 | Fastest; win = AED 15,000 |

**Career anchors (always happen):** loan offers available from race 1 · garage rent AED 1,500 every 4 races · scam offer once between races 3–5.

**Event pool (random, Career only):** puncture (AED 400) · fake bank text (ignore = safe; "click the link" = lose AED 1,000) · friend asks to borrow AED 1,000 (may or may not repay) · sponsor deal (+2,000 now, AED 1,500 penalty if not top 3 next race) · bonus prize (+500).

**Net worth** = cash + savings + index fund value + car value − loan amount still owed − overdue amounts.

**Lessons (about 10):** cost of borrowing · total cost of a loan · missed payments and repossession · emergency fund · insurance · investing ups and downs · too-good-to-be-true returns · phishing · lending to friends · entry fees and risk vs reward. (Wording lives in the strings file.)

### Invariants
- **INV-1:** All money is whole AED integers. No floats in money math. Percentages round down.
- **INV-2:** The money engine is pure: `(state, action) → newState`, with the seeded RNG state carried inside `state` (so a saved season resumes with the same random draws). No UI, no Phaser, no storage inside it.
- **INV-3:** Same seed + same choices + same race results → same final state, every time.
- **INV-4:** Every money change writes a ledger entry. `cash = startingCash + sum(ledger cash changes)` always holds.
- **INV-5:** A loan's shown total equals the sum of its scheduled payments.
- **INV-6:** Car stats are derived only from installed upgrades + damage. Repossession updates stats for the next race.
- **INV-7:** Never soft-lock: from any Pit Hub state there is always a startable race (Club Race is free).
- **INV-8:** No money changes happen during a race; the race returns only results (position, time, damage, hits).

**Season state machine:** `PIT_HUB → PRE_RACE → RACING → RESULTS → EVENT? → PIT_HUB → … → RECAP`. Illegal transitions throw.

**Ghost API error codes:**
| Code | When | Retryable | Next action |
|---|---|---|---|
| `invalid_ghost` | Payload fails validation | no | Re-record the run |
| `payload_too_large` | Over size limit | no | Re-record a shorter run |
| `ghost_not_found` | Unknown or expired code | no | Check the code |
| `rate_limited` | Too many requests | yes | Wait and retry |
| `server_waking` | Render cold start / timeout | yes | Show "waking server" and retry |
| `origin_not_allowed` | Request from a site outside the CORS allowlist (server guard; the game never sees it) | no | — |

---

## 12. Non-functional requirements

- **Performance:** 60 fps desktop, ≥ 45 fps mid-range Android (target until measured). First load under ~5 MB (target).
- **Mobile:** landscape only during play; touch targets ≥ 44 px; works on Android Chrome and iPhone Safari.
- **Accessibility:** see FR-A11Y-001; no flashing; sound never required; no timers in the Pit Hub.
- **Privacy:** no accounts, no tracking, no ads. Career save is in the browser. Ghost codes store only the run path, track and time.
- **Security (ghost server):** input validation, size limit, rate limit, CORS allowlist (Vercel domain + itch.io game domains). No secrets in the client.
- **Setup:** clean clone to running in ≤ 5 minutes.

---

## 13. Architecture

```
React shell (menus, Pit Hub, settings, guide)
   │  reads/writes season state
   ▼
Money engine (pure JS: economy rules, events, seeds, ledger)  ← unit-tested
   ▲  race results in / car stats out
   │
Phaser race scene (track drawing, physics, AI, camera, HUD, sound)
   │  P1 only
   ▼
Ghost API (Node + Express + MongoDB on Render)
```

- **Stack:** React + Vite (JavaScript, ESM) for the shell; Phaser for the race; Vitest for tests; vite-plugin-pwa for install. Ghost server: Node + Express + MongoDB Atlas. Chosen because it's the owner's stack; Phaser added because a race needs a game engine.
- **Components:**
  - `src/game/engine/` — money engine (pure).
  - `src/game/config/` — economy numbers, track splines, car stats.
  - `src/game/race/` — Phaser scenes, track renderer, car physics, AI, camera, HUD.
  - `src/game/audio/` — engine synth, effects, music.
  - `src/ui/` — React screens.
  - `src/i18n/` — strings (en, ar).
  - `server/` — ghost API (P1).
- **Trust boundaries:** the client is trusted for single-player state (it's a game). The ghost server never trusts the client: validates every ghost.
- **Pure core, effects at the edges:** the money engine and seeded RNG never touch storage, DOM, Phaser or network.

---

## 14. Data model and API contract

**Client save (browser storage):** `{ version, mode, seed, raceIndex, state, ledger, settings, lessonsMet }`. Versioned; unknown versions start fresh.

**MongoDB collection `ghosts` (P1):** `code` (unique, 6 chars) · `track` · `timeMs` · `frames` (compressed path, ~20 samples/s) · `createdAt` (TTL 30 days).

**Endpoints (P1):**
| Method | Path | Input | Output | Errors |
|---|---|---|---|---|
| POST | `/v1/ghosts` | `{ track, timeMs, frames }` | `{ code }` | `invalid_ghost`, `payload_too_large`, `rate_limited` |
| GET | `/v1/ghosts/:code` | — | `{ track, timeMs, frames }` | `ghost_not_found`, `rate_limited` |
| GET | `/health` | — | `{ status }` | — |

No extra endpoints.

---

## 15. Jam fit

No sponsor SDK is required; any engine is allowed. The "fit" is the theme and rubric: money concepts turned into game mechanics, set in the UAE, playable on phones.

| Requirement | Where it lives |
|---|---|
| Playable game on itch.io | HTML5 upload (Phase 8) |
| Concept doc / GDD (official 6-section template, PDF, public link) | Phase 8 |
| 2-minute gameplay video (real footage) | §22, Phase 8 |
| Game budget (PDF) | Phase 8, from the locked budget plan |
| AI disclosure | itch submission form + page |
| Each jammer registered via the form | Owner, before submitting |

---

## 16. Decisions log and Gate 0

**Gate 0 — riskiest premise:** a top-down car feels good with touch controls on a phone, in the browser, in landscape.
- Option A (ideal): free steering with Gas/Brake/Nitro, light drift on hard turns.
- Option B (fallback): stronger steering assist that pulls toward the racing line.
- Acceptance: one Marina lap on the owner's real phone feels fun; ≥ 45 fps; multi-touch works.
- **Result:** deferred — owner phone test pending (owner decision 2026-10-28: build Phases 0–3 first, test on a real phone after Phase 3). Car-handling numbers stay in `src/game/config/` and are not frozen yet.

**Resolved decisions — do not re-litigate:**
| Date | Decision | Reason / evidence |
|---|---|---|
| 2026-10-24 | Racing career game, top-down 2D, browser + PWA | Only action entry in the jam; 3D too slow for the time |
| 2026-10-24 | Multiplayer = Ghost Challenge (P1); live 2-phone racing → roadmap | Judges play alone; live sync is too risky |
| 2026-10-25 | Name: Dirham Drift | Confirmed by owner; no existing game found with this name |
| 2026-10-25 | Code-drawn tracks, "Dubai at night" style; Kenney tiles dropped | Owner wanted a premium look; spline drives drawing, walls and AI |
| 2026-10-25 | 2 tracks: Marina street circuit (3 laps), Sheikh Zayed sprint (point to point) | Believable real-life layouts; two race types |
| 2026-10-25 | Phone play is landscape only | Proper racing feel |
| 2026-10-25 | Controls: steer L/R left thumb; Gas, Brake, Nitro right thumb; no auto-accelerate by default | Owner decision; auto-accelerate kept only as an accessibility option |
| 2026-10-25 | Hub art from free AI tools, matching the game colours; disclosed | Free; disclosure allowed by jam rules |
| 2026-10-25 | Money system, 10-race Career Season, Quick Season (seeded), Pit Hub flow, lessons after consequences | Locked in planning |
| 2026-10-25 | Sound: code engine synth + CC0 effects + 2 music tracks; captions instead of voiceover in video | Free, light, accessible |
| 2026-10-25 | Arabic toggle P1; strings file P0; accessibility settings P0 | Bonus points; cheap if planned early |
| 2026-10-25 | Submit on itch.io (HTML5 upload) + Vercel link for app install | Jam submits only via itch; PWA install doesn't work in itch's frame |
| 2026-10-25 | 9 phases with 3 owner playtest gates; commit only after approval | Owner's workflow |
| 2026-10-25 | No in-game live AI | Not needed by the rubric; all behaviour is game code |
| 2026-10-28 | Gate 0 and the Phase 1 owner gate deferred until after Phase 3; Phases 0–3 committed and pushed to `main` as each passes `npm run verify` | Owner's build brief for this run |
| 2026-10-28 | Phaser 4.2.1 runs with `render.maxTextures = 1` | Phaser 4.2.1's multi-texture shader picks the texture with an exact float compare on an interpolated value (`outTexDatum == float(INDEX)` in `GetTexture-glsl.js`). With a rotated camera, images dropped out in pieces in a minimal repro (headless Chromium, SwiftShader). One texture per batch removes the compare; the track is baked into a few large textures, so draw calls stay low |
| 2026-10-28 | Vitest pinned to 4.0.18 | npm 10.9 crashes (`Cannot read properties of null (reading 'edgesOut')`) resolving Vitest ≥ 4.1 peer deps; 4.0.18 installs cleanly on npm 10 and 11 |
| 2026-10-28 | Race camera rotates with the car (car points up, look-ahead in front); `CAMERA.mode` in config can switch to a fixed north-up view | "Driver view, zoomed in, ahead of the car" (FR-RACE-001); to be confirmed at the owner phone test |
| 2026-10-28 | Money-engine clarifications (Phase 2): RNG state lives in the season state; each required payment is all-or-nothing from cash then savings; an unpaid payment moves to "overdue", and a stop with any miss adds one AED 300 late fee and one strike (never more per stop); overdue is collected first at the next stop; insurance premium counts as a required payment; repossession does not reduce debt; repair is optional, paid from cash then savings, and only covered if the car was insured when the damage happened; entry fees come from cash; a Club Race takes that season slot (half prizes, Rookie rivals); the Grand Final win (AED 15,000) applies to both final races; the scam offer appears after race 3 or 4 (seeded); one Pit Lesson per stop, extra lessons wait for the next stop; a race can't return less damage than it started with | §11 left these details open; chosen so every §18 check passes and the rules stay simple. Event chance (50% per stop) and friend repay chance (60%) are tuning values in `economy.js` |
| 2026-10-28 | Vitest runs the `.jsx` screen tests in jsdom with `esbuild.jsx = 'automatic'` set only in test mode | Vitest 4.0.18 with Vite 8.3.4 compiled test JSX as classic `React.createElement` ("React is not defined") even with the React plugin; setting it for builds too makes Vite warn that esbuild options are ignored |
| 2026-10-28 | Pit Hub clarifications (Phase 3): Career Season is reachable from Mode select now so the Pit Hub can be played (season polish, recap, save are Phase 4); quitting a season race retires the player (last place, no prize, damage kept); the results statement lists every ledger line since the race started; the first-visit tips flag lives in Settings and resets with "Show control hints again"; glossary words are marked `[[word]]` in the strings file | Keeps the screens honest to the ledger and never leaves a race without results |
| 2026-10-28 | Quick Season script details (Phase 4, §19): seed 20261115; starts with AED 1,500 cash and Engine level 1 already fitted, so the "turbo" (Engine level 2, AED 5,000) costs more than any race-1 prize can leave you; race 1 starts straight from Mode select (2 taps from title, FR-UI-001); the turbo, Quick loan and insurance are spotlighted in the Pit Hub after race 1; after race 2: rent (AED 1,500), then a scripted crash bill = repair cost of 60% damage (AED 2,800; insured pays 20%), then the Desert Gold offer; race 3 is the Sheikh Zayed final with free entry; 1 strike repossesses | §19 needs the turbo to cost more than cash and every system in ≤ 5 minutes; a free final keeps the saver path able to race it. All values live in `src/game/config/season.js` (`SEASONS.quick`) |
| 2026-10-28 | Season grade thresholds (§33 Q3): **default, owner to tune.** Grade by final net worth — Career A ≥ 35,000 · B ≥ 22,000 · C ≥ 12,000 · D ≥ 5,000; Quick A ≥ 15,000 · B ≥ 10,000 · C ≥ 6,000 · D ≥ 3,000; else F; one grade lower if not debt-free | Picked from a headless sim of 40 careers per play style (saver winning most races ≈ A/B, borrower ≈ D/F); `GRADES` in `src/game/config/season.js` |
| 2026-10-28 | Recap "what if you had saved instead" = the same season seed and the same finishes replayed through the engine with a saver policy (no loan, no upgrades bought, no scam, always insured, repair when possible, spare cash in savings, safe event choices) | Honest and checkable: it uses the real money rules, not a made-up number |
| 2026-10-28 | Career save (FR-MODE-005): browser storage key `dirham-drift:career` holds `{ version, mode, seed, raceIndex, state, statementFrom }`; ledger and lessons met live inside `state`; settings stay in their own key. Saved after every change outside a race, so reopening resumes at the last Pit Hub (or the statement/event card it was on); cleared at the recap. Unknown save or state versions start fresh (state version is now 2) | Matches §14 without duplicating the ledger; a closed race never pays out twice |
| 2026-10-28 | Sound sources (Phase 5, FR-SND-001): kenney.nl downloads are blocked from the build machine (HTTP 403 through the network proxy), so crash, coin, thud and click come from the CC0 pack "100 CC0 SFX" by rubberduck (OpenGameArt.org), converted to mono MP3; engine (pitch follows speed), nitro whoosh, countdown beeps, repossession drop and both music loops (hub, race) are generated in code with Web Audio. Every sound has a file slot: drop `src/assets/audio/<id>.mp3` (ids: hit, coin, thud, click, nitro, beep, go, repo, music-hub, music-race) and rebuild — no code change | MP3 plays on iPhone Safari; Ogg Vorbis support there is not guaranteed. Files are found at build time, so a missing file never causes a 404 |
| 2026-10-28 | Hub art (Phase 5): the title skyline, garage, bank and Desert Gold poster are drawn in code (SVG) in the §21 style; each has an image slot `src/assets/art/{title,garage,bank,scamAd}.{png,jpg,webp,avif}` that replaces the code art after a rebuild, no code change | Owner's AI images are not made yet |
| 2026-10-28 | Accessibility settings defined (FR-A11Y-001): steering assist nudges the car toward the road centre 140 px ahead; auto-accelerate holds gas unless braking; Chill mode = rivals 10% slower and half crash damage; text size S/M/L scales menu and Pit Hub text (race HUD unchanged); colour-blind safe = blue gains, orange losses (▲▼ signs always shown); reduce motion = no menu animation, fewer sparks, steady nitro flame (defaults to the device setting); left-handed = pedals left, steering right; touch control size S/M/L; vibration on crashes (Android only — iPhone has no vibration API); music and effects volume 0–100% | Each one is simple, testable and persists in browser storage |
| 2026-10-29 | PWA (Phase 6, FR-PWA-001/002): vite-plugin-pwa 2.0.0 (generateSW, Workbox 7.4.1) builds the manifest and service worker, but registration is manual and only runs when the page is not in an iframe, the browser has service workers, and the host is not `itch.io`, `itch.zone` or `hwcdn.net` (`PWA_RULES` in `src/game/config/app.js`). The "Install app" button and guide only show where install works; Android/desktop get a one-tap Install when the browser offers it | itch.io serves games in an iframe on its own CDN domains; a service worker there would be wrong scope and can cache stale builds |
| 2026-10-29 | Arabic (Phase 6, FR-I18N-002): `src/i18n/ar.js` mirrors every English key with the same `{variables}` and `[[glossary]]` words (tested); text is **AI-assisted, pending native review**. Arabic sets `<html lang="ar" dir="rtl">` so menus and Pit Hub flip; the race screen is forced `dir="ltr"` so the HUD and touch controls keep their layout. Font: Cairo (SIL OFL 1.1) Arabic subset, weights 400/700/900, bundled from @fontsource/cairo 5.3.0 so it works offline. Money reads "{amount} درهم"; digits stay Western | FR-I18N-002 asks for RTL menus with the HUD unchanged; a bundled font avoids a Google Fonts request (not allowed offline or by CLAUDE.md) |
| 2026-10-29 | Interest-free loan (FR-MON-011): borrow AED 6,000, pay AED 660 after each of 10 races = AED 6,600; the AED 600 fixed fee is the whole cost and is shown as "Fixed fee (no interest)" with the note "Interest-free doesn't mean free". Same late-payment and repossession rules as other loans. **Default, owner to tune** (`LOANS.interestFree` in `src/game/config/economy.js`) | Cheaper than the Quick loan (AED 1,000 extra) so it is the sensible choice, but never free |
| 2026-10-29 | Owner phone-test fixes (no scope change): the mode menu has Back (returns to the Pit Hub the player left, same season, or the title) and Home (title); the insurance toggle has a "Tap to insure your car" line; Bank amount chips only set the amount, shown in a whole-AED input (16 px so iPhone Safari does not zoom), and a Deposit/Withdraw/Invest/Sell button confirms; the race game boots only once the phone is in landscape and the camera resizes with the canvas (`RENDER.rotateSettleMs`) | Owner found the race zoomed in on iPhone after starting in portrait and rotating; chips that move money on one tap were easy to hit by mistake |
| 2026-10-29 | Game images from Google Gemini (owner-made, prompts in project files `reports/gemini-art-prompts.md`). Hub slots filled: `src/assets/art/{title,garage,bank,scamAd}.webp`; the Bank image is now a banner above the Bank sections instead of a 35%-opacity backdrop. Race images live in `src/assets/race/` and are loaded by the race scene before the track is baked: car sprites (player, 4 rivals, 3 traffic) replace the code car body; upgrades are still drawn in code on top (stripes and scoop clipped to the car shape, wing, wheels, nitro tanks, glow), so every upgrade and repossession stays visible (§1). Water, promenade and roadside sand are tiled textures; palms, yachts and 4 rooftop variants are sprites. Road surface, lanes, curbs, barriers, lamps, gantries, overpasses and the metro train stay code-drawn. Any missing file falls back to the code art (`SCENE_ART`, `CAR_SPRITES` in `src/game/config/style.js`). Images were cut out from their green backgrounds, resized and saved as WebP offline (about 600 KB in all); rivals and traffic are recolours of the player and traffic cars until top-down versions are made | Gemini's rival images were 3/4 garage views and the metro train a side view, so they could not be used top-down. A full-track picture can never match the spline that drives walls and AI, so FR-RACE-008 keeps the road in code |
| 2026-10-30 | Ghost Challenge (Phase 7, FR-MODE-006): a ghost race is a solo time trial (no AI rivals) on either track, so the only opponent is the ghost; the HUD shows time and the ghost's time instead of position. The player car is sampled 20 times a second from the start (`frames` = `[x, y, headingMilliradians]` whole numbers); the ghost is a see-through car (no collisions) interpolated between samples. Codes: 6 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0/O/1/I), made with `crypto.randomInt`, retried on a clash. Server check: known track, whole `timeMs` 10 s–5 min, frame count matches the time (±5), every frame 3 whole numbers within ±20,000 (heading ±3,200), no jump over 80 px between samples; body limit 160 KB. Rate limit per IP per minute: 10 saves, 60 loads. CORS: exact origins plus `https://*.domain` wildcards from `ALLOWED_ORIGINS`; other browser origins get 403 `origin_not_allowed`. `/health` pings MongoDB (503 `{ status: 'waking' }` until connected). The Ghost Challenge card only shows when the build has `VITE_GHOST_API_URL`. Waking: after 2.5 s the game shows "Waking server…"; it gives up after 75 s and offers Try again. Keepalive: GitHub Actions cron hits `/health` twice a day (repo variable `GHOST_API_URL`) so Atlas M0 is not paused; Render free still sleeps 15 min after the last request | Solo keeps the ghost readable and the run fair; checks are cheap and stop broken or teleporting paths without needing track geometry on the server |
| 2026-10-29 | Zakat note (recap, P1): estimate = 2.5% (`ZAKAT.perMille` 25) of cash + savings + index fund at season end, rounded down to whole AED; car parts and debts are not included. Shown as a simplified note with "Real Zakat rules have more detail"; it never changes money | A teaching note, not a ruling: nisab and the lunar-year rule are mentioned, not calculated |
| 2026-10-31 | Race camera zoomed in 2.5× (owner pick from phone screenshots): `CAMERA.worldViewHeight` 640 → 256 world units when stopped, `speedZoomOut` 0.12 → 0.4 so it pulls back to about 427 units at top speed; the look-ahead is a share of the current view (`lookAheadRatio` 0.28), so the car stays at the same spot on screen and sees more road when fast. Camera speed uses the car's top speed without the nitro boost, so nitro pulls the camera back instead of briefly zooming in | Owner found the race too zoomed out on a phone; closer cars read better, pull-back keeps about 0.6 s of road ahead at top speed (was about 0.9 s). The track bakes at full resolution on phones now (`bakeScaleMax` 1), to be checked at the real-phone test |
| 2026-10-31 | Difficulty (FR-MODE-007, owner request): three levels change the AI rivals only (`DIFFICULTY` in `src/game/config/race.js`). Easy = the game as it was (rival pace ×1.00, pace wobble ±3%, nitro chance 0.35/s, no catch-up). Medium = pace ×1.05, wobble ±2%, nitro 1/s, catch-up up to +3%. Hard = pace ×1.10, wobble ±1%, nitro 4/s (on almost every straight), catch-up up to +6%. Pace multiplies top speed, acceleration and corner speed and stacks on stage pace (Rookie/Pro/Final) and on Chill mode. Catch-up raises the top speed of a rival who is behind the player, scaling to full at 600 px behind (`AI.catchUpFullGap`); leaders are never slowed. The last choice is kept in settings (`difficulty`); a season stores its level in the career save (`difficulty`, missing = Easy), so Continue keeps it and it can't be changed mid-season. Shown on Mode select, the pre-race card, the Continue card and the recap. No money changes: Quick Season events stay identical | Owner wants harder, more interesting AI; AI-only keeps the money engine and the Quick Season snapshot untouched, and a locked level stops dropping to Easy just for the Grand Final |
| 2026-10-31 | Owner request: the rotate screen covers the whole app on a touch phone in portrait (title, menus, Pit Hub, race), not only the race; the title shows a small install note (FR-PWA-003) that opens the install guide, hidden on itch.io and inside the installed app; desktop Pit Hub keeps the Turbo banner to its text height; the Bank says "One strike" in Quick Season instead of "1 strikes" | Owner wants no play at all until the phone is landscape, and to nudge phone players to the installed app |
| 2026-11-01 | Owner request: new deploys reached players only after many refreshes, and the installed app needed a reinstall. The service worker now uses vite-plugin-pwa `registerType: 'prompt'` with `clientsClaim`; the app checks for a new version on open, when it comes back to the screen and every `PWA_RULES.updateCheckMinutes` (30); when one is ready a small "New version ready. Tap to update." bar shows on menu screens only (`PWA_RULES.updateBarScreens`), never in a race, season or ghost run; tapping reloads into the new build, otherwise it applies on the next full close and reopen. Offline play and localStorage saves are unchanged; itch.io still gets no service worker | The old `autoUpdate` setup only checked on page load and could reload the page at any time, including mid-race. Vercel headers were already `max-age=0, must-revalidate` for `index.html` and `sw.js`, so no header change was needed |
| 2026-11-01 | Demo video (§22, owner request): add a voiceover (owner generates it with ElevenLabs from Claude's timed script, disclosed as AI voice) on top of the captions; Act 2 uses the big loan (borrow AED 15,000, pay back AED 18,000) instead of the quick loan | Owner asked for a voiceover. The recorded Act 2/3 footage uses the big loan, and in Quick Season the big loan is the path that leaves cash to invest in Desert Gold after the scripted crash, so the scam act can be shot in the same style; both loans are real config values (`LOANS` in `src/game/config/economy.js`) |

---

## 17. Real vs simplified

| Part | Status | How the player sees it |
|---|---|---|
| Racing, physics, AI rivals | Real game code | — |
| Money engine and ledger | Real game code, tested | — |
| Interest, fees, returns, prices | **Simplified and illustrative** | "Numbers are simplified. Not financial advice." on Bank screen and How to Play |
| Banks, funds, sponsors | **Fictional** | Fictional names only, no real logos |
| Desert Gold Racing Fund | **Fictional scam for teaching** | Red-flag checklist + lesson |
| Ghost Challenge (P1) | Real server | "Waking server…" when Render is cold |
| PWA install | Real (website only; off on itch.io and inside iframes) | Install guide; button hidden on itch |
| Arabic text | AI-assisted translation, pending native review | Credits say so |
| Zakat note | **Simplified estimate** (2.5% of cash + savings + fund) | "Simplified for learning" line under the note |

`REAL_VS_MOCKED.md` copies this table.

---

## 18. Consequence checks (the "break it" lab for a game)

Scripted tests through the real money engine. Each must pass:

| # | Scenario | Expected result |
|---|---|---|
| 1 | Quick loan, no insurance, 100% crash, no savings, low prize (Career) | 1st missed payment → late fee + strike 1; 2nd → newest upgrade repossessed; strikes reset |
| 2 | Same crash with insurance | Bill = 20% of repair; no strike if cash covers it |
| 3 | Same crash, uninsured, enough savings | Bill paid from savings automatically; no strike |
| 4 | Invest in Desert Gold | Stop 1 pays 30% of deposit; stop 2 deposit is gone; scam lesson recorded |
| 5 | Can't afford Pro entry fee, no loan | Club Race is offered and startable (INV-7) |
| 6 | Accept a loan | Shown total = sum of scheduled payments (INV-5) |
| 7 | Any sequence of 10 races | Ledger sum matches cash (INV-4); all money values are integers (INV-1) |

---

## 19. Seeded scenario and success measures

**Quick Season (seed fixed in config) always runs:**
1. **Race 1 — Marina.** Pit Hub: turbo (Engine level) costs more than cash → loan offer + insurance offer shown.
2. **Race 2 — Marina.** After the race: a crash/puncture repair bill **always** hits (even on a clean race) + rent → Desert Gold offer.
3. **Race 3 — Sheikh Zayed sprint (final).** Scam collapses if invested → recap with "what if you had saved instead".

**Test:** with a fixed script of choices and fixed race placings, the final state matches a checked-in snapshot (generated once in Phase 4, reviewed by the owner, then locked).

| Measure | Target |
|---|---|
| Taps from title to first race | ≤ 2 |
| Quick Season length | ≤ 5 minutes |
| Money systems felt on track | 5 of 5 (loan, repo, insurance, savings, scam) + index fund |
| Frame rate | 60 fps desktop, ≥ 45 fps mid-range Android |
| Consequence checks (§18) | 7 of 7 pass |
| Install works | Android Chrome, iPhone Safari, desktop Chrome |

---

## 20. Test plan

- **Unit (Vitest):** money engine — loans, payment order, late fees, strikes, repossession, insurance, savings growth, index fund, scam, events, net worth, rounding.
- **Consequence checks:** §18 table as tests.
- **Determinism:** same seed + choices → same state (INV-3); Quick Season snapshot test.
- **Property test:** random sequences of actions never break INV-1, INV-4, INV-7.
- **Ghost API (P1):** validation, size limit, not-found, rate limit.
- **Manual:** owner playtests at the 3 gates; real-phone test of the itch upload before submitting.
- Test counts are reported only after they pass and must match README and submission.

---

## 21. Product surfaces

1. **Title** — Play, How to Play, Settings, language.
2. **Mode select** — Quick Season (5 min), Career Season, Quick Race, Ghost Challenge (P1).
3. **Race** — driver view + HUD + touch controls.
4. **Results statement** — position, prize, deductions like a mini bank statement; repair choice.
5. **Event card** — one event, choices with costs.
6. **Pit Lesson card** — after consequences.
7. **Pit Hub home** — Garage door, Bank door, net worth.
8. **Garage** — car on a lift, 3 slots.
9. **Bank** — savings, loans, insurance, index fund, offers.
10. **Next race card** — track, entry fee, prize.
11. **Season recap** — net worth, grade, lessons met, "what if".
12. **Lesson Book** · 13. **How to Play** · 14. **Settings** · 15. **Rotate your phone** · 16. **Install guide** (Vercel only).

**Visual style (locked):** Dubai at night. Dark asphalt, gold (money) and teal (bank / calm) accents, red only for danger (debt, crash, scam). Marina: canal with yachts, promenade with palms, barriers and street lamps, red/white curbs on corners, towers with rooftop pools and helipads, start gantry. Sheikh Zayed: wide 4-lane road, lit median, oncoming traffic, metro line with moving train, interchanges overhead. Gains/losses always use icons and +/− signs, not colour alone.

---

## 22. Demo script — 2 minutes, real gameplay only

| Time | On screen | Caption |
|---|---|---|
| 0:00–0:10 | Marina driver view, overtake into hairpin, cross line 1st | "Race for money." |
| 0:10–0:15 | Title card over gameplay | "Dirham Drift — don't let money race you" |
| 0:15–0:35 | Pit Hub → big loan → buy turbo; total-to-repay screen | "Borrow AED 15,000. Pay back AED 18,000." |
| 0:35–0:45 | Faster race, nitro flames | "Faster now…" |
| 0:45–1:05 | Crash, no insurance → bill → missed payment → turbo repossessed | "…until the bill comes." |
| 1:05–1:10 | Pit Lesson card | (lesson text) |
| 1:10–1:30 | Desert Gold offer → red flags → invest → payout → "withdrawals paused" | "30% a week? Too good to be true." |
| 1:30–1:45 | Second run: save, insure, index fund → win Sheikh Zayed final | "Same game. Better choices." |
| 1:45–1:55 | Season recap | "Feel the lesson. Then learn it." |
| 1:55–2:00 | Installing the app + itch link | "Play free in your browser" |

Recorded with the Quick Season seed. Desktop: OBS 1080p60. Phone: built-in recorder, landscape. Edit: ffmpeg. Captions always on screen (judges may watch muted), plus a voiceover the owner generates with an AI voice (ElevenLabs) from the timed script; game audio sits under the voiceover. Record each moment the day it works.

---

## 23. Judge experience

- **First 10 s (itch page):** "A racing game where loans, insurance and scams change how your car drives." + GIF of the repossession.
- **First 60 s:** Play → Quick Season → first race starts within 2 taps.
- **First 5 min:** finish Quick Season, see the recap, read How to Play, open GDD, budget and limits.

**60-second judge path (README + itch page):**
1. Press Play on the itch page (landscape, fullscreen).
2. Choose **Quick Season (5 min)**.
3. In the Pit Hub, try the loan and skip insurance to see what happens.
4. Read the recap and the Lesson Book.

---

## 24. Rubric → evidence

| Criterion (points) | Evidence |
|---|---|
| Prototype & Gameplay (25) | Two code-drawn tracks, AI rivals, touch + keyboard, follow camera, Quick Season; stable itch build |
| FinLit in the mechanics (25) | Loan → faster now / smaller prizes; repo → part removed; insurance → repair cost; savings → no strike; scam → cash lost; entry fees → risk (§11, §18) |
| Development & commercial potential (20) | GDD, budget with funding tiers and milestones, roadmap, revenue model (school licence, partner editions, no ads/loot boxes), PWA |
| Educational impact (15) | Pit Lessons after consequences, Lesson Book, recap with "what if", replay value |
| Creativity & innovation (15) | Only racing entry; debt you feel as a slower car; scam fund as an in-game character |
| Bonus: UAE / Arab localization (+5) | AED, Marina and Sheikh Zayed tracks, Arabic toggle (P1), interest-free loan option (P1), Zakat note in recap (P1) |
| Bonus: Accessibility (+5) | FR-A11Y-001 settings, colour-blind safe signs, sound not required, no Pit Hub timers, keyboard play |

---

## 25. Positioning and judge Q&A

**Positioning statement (use word for word):**
> Most money games teach with cards and menus. Dirham Drift is a racing game where every money choice changes how your car drives — so you feel the cost of debt, the value of insurance and the trap of a scam before you read a single tip.

- *How is this different from Rainy Day?* Rainy Day teaches many topics through payday choices. We teach a few deeply through action: debt is a slower car.
- *Isn't racing just a skin?* No. Remove the bank and the racing changes; remove the racing and the money has no source. They are one loop.
- *Are the numbers real?* Simplified and illustrative, with total cost always shown. Not advice.
- *Interest-free banking?* The P1 interest-free loan uses a fixed fee and says clearly that interest-free doesn't mean free.
- *Why no online multiplayer?* Judges play alone. Ghost Challenge works solo; live races are on the roadmap.
- *What didn't you finish?* Listed honestly in REAL_VS_MOCKED.md and ROADMAP.md.

**Innovation note:** top-down arcade racing, career economies and consequence-based learning all exist. The originality is the loop that ties every money choice to car performance.

---

## 26. Scope control

**P0 — must ship:** racing on both tracks, touch + keyboard controls, money engine + tests, Pit Hub, events, lessons, Lesson Book, glossary, Quick Season, Career Season, Quick Race, recap, save/continue, title, How to Play, first-race hints, settings + accessibility, sound, strings file, itch build.

**P1 — only after P0 is deployed and recorded:** PWA install + guide, Arabic toggle, interest-free loan, Zakat note, Ghost Challenge.

**Never in this build (→ ROADMAP.md):** live online multiplayer, accounts, leaderboards, 3D, more tracks or cities, credit score, taxes, remittances, real brands, tilt steering, gamepad.

---

## 27. Build order and phases

One phase at a time. Claude may run automatic-check phases back to back, but **stops at every 🛑 gate** for the owner. Every phase ends with a phase report; commit and push only after the owner approves. The owner handles all deploys.

### Phase 0 — Setup + Gate 0 (Oct 26–27)
- **Goal:** prove the car feels good on a phone.
- **Scope:** Vite + React + Phaser project; Vitest, ESLint; strings file; Marina track drawn from its spline (style per §21); one player car; touch + keyboard controls; follow camera; rotate screen; build with relative paths.
- **Acceptance:** one lap drivable on desktop and phone; multi-touch works; frame rate shown in a debug overlay.
- **Tests:** `npm run verify` passes.
- **Record:** a short phone clip of one lap.
- **Gate:** 🛑 Owner plays on a real phone. Fill in §16 Gate 0 result.

### Phase 1 — Racing core (Oct 28–30)
- **Goal:** fun races on both tracks.
- **Scope:** 4 AI rivals, checkpoints and laps, positions, countdown, wall hits + damage, nitro, race HUD (money values stubbed), results data out, Sheikh Zayed sprint track, Quick Race mode, car stats object.
- **Acceptance:** FR-RACE-001…008, FR-CTL-001…004.
- **Tests:** checkpoint/lap logic and position sorting unit tests; verify passes.
- **Record:** Act 1 (Marina race win).
- **Gate:** 🛑 Owner playtests both tracks. **Car feel is frozen after approval.**

### Phase 2 — Money engine (Oct 31)
- **Goal:** all §11 rules as pure, tested code.
- **Scope:** `src/game/engine/` — state, actions, ledger, seeded RNG, loans, payment order, strikes, repo, insurance, damage/repair, savings, index fund, scam, events, career anchors, net worth, season state machine.
- **Acceptance:** INV-1…INV-8; §18 consequence checks 7/7.
- **Tests:** unit + property tests; verify passes.
- **Record:** —
- **Gate:** automatic.

### Phase 3 — Pit Hub (Nov 1–3)
- **Goal:** money screens connected to the race.
- **Scope:** results statement, repair choice, event cards, Pit Hub home, Garage (upgrades change stats and looks), Bank, Pit Lesson cards, Lesson Book, glossary, next race card, first-visit tips; race reads car stats, returns results.
- **Acceptance:** FR-MON-001…010, FR-EVT-001, FR-LSN-001…003, FR-UI-003.
- **Tests:** engine ↔ UI integration tests for buy, borrow, repo; verify passes.
- **Record:** Act 2 (loan → faster car).
- **Gate:** automatic + screenshots at phone landscape size.

### Phase 4 — Seasons (Nov 4–5)
- **Goal:** both season modes complete and balanced.
- **Scope:** Career Season (stages, entry fees, Club Race, anchors, event pool, rival pace), Quick Season (seeded script), recap with grade and "what if", save/continue, Quick Season snapshot test.
- **Acceptance:** FR-MODE-001…005; §19 seeded scenario.
- **Tests:** determinism + snapshot; verify passes.
- **Record:** Acts 3–4 (repo, scam).
- **Gate:** 🛑 Owner plays a full Quick Season and a full Career Season; tunes numbers in config.

### Phase 5 — Polish (Nov 6–8)
- **Goal:** feels like a finished game.
- **Scope:** title screen, mode select polish, How to Play, settings + all accessibility options, engine synth, effects, music, money sounds, skid marks, sparks, nitro flames, hub art placement (owner supplies images), credits screen.
- **Acceptance:** FR-UI-001…002, FR-A11Y-001, FR-SND-001.
- **Tests:** settings persistence tests; verify passes.
- **Record:** Act 5 + recap.
- **Gate:** automatic + screenshots.

### Phase 6 — App + Arabic (Nov 9) — P1
- **Scope:** vite-plugin-pwa, manifest, icons, install guide screen, itch-domain switch (FR-PWA-002), Arabic strings + RTL menus + Arabic font, Zakat note, interest-free loan.
- **Acceptance:** FR-PWA-001…002, FR-I18N-002, FR-MON-011.
- **Gate:** install test on Android + iPhone (owner).

### Phase 7 — Ghost Challenge (Nov 10–11) — P1
- **Scope:** run recording, ghost playback, `server/` Express + MongoDB API per §14, CORS allowlist, rate limit, "waking server" state.
- **Acceptance:** FR-MODE-006; API errors per §11.
- **Tests:** API tests; verify passes.
- **Gate:** owner tries a code between two phones.

### Phase 8 — Ship (Nov 12–15)
- **Scope:** itch build + upload test, real-phone test on itch, bug fixes only, README + REAL_VS_MOCKED final, GDD (official template) and budget PDFs, video edit, itch page, submit.
- **Acceptance:** §30 checklist.
- **Gate:** 🛑 Owner final playthrough, then submits by the internal cutoff.

**If time runs short:** Phases 0–5 are must-haves. Phases 6 and 7 shrink or move to ROADMAP.md.

---

## 28. Deadline plan

| Date | Gate |
|---|---|
| Oct 27 | Gate 0 passed on a real phone |
| Oct 30 | Both tracks fun; car feel frozen |
| Nov 3 | Loan → faster car works in the Pit Hub |
| Nov 5 | Both seasons playable end to end; numbers tuned |
| Nov 8 | Game feels finished (P0 complete) |
| Nov 11 | P1 done or cut |
| Nov 14 | GDD, budget, video, itch page ready |
| **Nov 15, 6:00 pm WAT** | **Submitted** (internal cutoff) |
| Nov 16, 12:59 pm WAT | Jam closes (no edits after) |

- **After Nov 14:** fixes only (bugs, links, page text).
- **After submission:** no feature work on the jam build; new ideas go to ROADMAP.md.

---

## 29. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Car feel on phones is bad | Critical | Gate 0 first; Option B steering assist |
| Racing eats all the time | High | Car feel frozen after Phase 1 |
| Money side feels bolted on | High | Core guarantee (§4); consequence checks (§18) |
| Numbers feel unfair or wrong | Medium | All in one config; tuned at Phase 4 gate; "simplified" label |
| itch frame breaks PWA or audio | Medium | itch-domain switch; audio starts on first tap; test the upload early |
| iPhone ignores orientation lock | Low | Rotate screen covers it |
| Render cold start | Low | Ghost is P1; "waking server" state |
| Running TwitchCon hackathon in parallel | Medium | P1 is cut first |
| Copying a rival's wording/layout | Low | Our own words in GDD, budget and page |

---

## 30. Definition of finished

- [ ] A stranger can open the itch page and finish Quick Season on a phone and on desktop.
- [ ] Every money system in §11 changes something on the track, as shown in the video.
- [ ] §18 consequence checks pass (7 of 7) and every invariant in §11 has a passing test.
- [ ] Clean clone → `npm install` → `npm run verify` passes.
- [ ] Video shows every act with real gameplay.
- [ ] §17, REAL_VS_MOCKED.md, README, GDD and itch page all agree; every number matches the config.
- [ ] GDD PDF, budget PDF, video and AI disclosure attached; registration form done.
- [ ] PROJECT_STATE.md is current.

---

## 31. Submission fields and deliverables

| Field | Source |
|---|---|
| Game | itch HTML5 upload (landscape, fullscreen button, mobile friendly) |
| Install as app | Vercel link on the itch page |
| Concept doc / GDD | Official 6-section template → PDF, public link |
| Video | 2-minute cut (§22), YouTube embed |
| Budget | Locked plan → PDF (tiers $5K / $15K / ~$45K, line items, milestones, revenue model) |
| AI disclosure | Code, Arabic translation help and the video edit and voiceover script: Claude; game images (title, garage, bank, scam poster, cars, track scenery): Google Gemini; video voiceover voice: ElevenLabs |
| Screenshots | Marina race, Sheikh Zayed sprint, Pit Hub, scam red flags, season recap |

---

## 32. Future story

- **Roadmap:** live 2-phone racing; Abu Dhabi city and new tracks; credit score system; classroom mode with teacher pack; app store release.
- **Why it matters later:** schools and FinLit programmes need short, fun sessions; banks and fintechs run financial-wellbeing days and need partner editions.
- **Funding:** budget plan with milestone-based tiers (see Phase 8 PDF).

---

## 33. Open questions

| # | Question | Owner | Decide by |
|---|---|---|---|
| 1 | Is "Best Game from the UAE" open to non-UAE teams? (Ask in jam Discord.) | Adesope | Nov 1 |
| 2 | Which free AI tools for hub art and music, and do their terms allow commercial use? | Adesope | Nov 5 |
| 3 | Season grade thresholds (A–F) — defaults set in config (§16), owner to tune | Tuned at Phase 4 gate | Nov 5 |
| 4 | Arabic speaker for a quick review (jam Discord) | Adesope | Nov 9 |

When answered, move the answer to §16.
