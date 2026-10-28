# PROJECT_STATE — Dirham Drift

> Where the project actually stands. A progress log, not requirements (those live in `PRD.md`).
> Update at the end of every phase. Only write what was verified. If this file and the repo disagree, the repo wins.

**Last updated:** 2026-10-25 · **By:** Claude (planning) · **Commit:** none yet

---

## 1. Right now

- **Active phase:** Phase 0 — Setup + Gate 0 (PRD §27)
- **Status:** Not started — planning complete, docs written
- **Next step:** create the repo and start Phase 0
- **Blocked by:** nothing

## 2. Phase tracker

| Phase (PRD §27) | Status | Verified on | Commit | Gate |
|---|---|---|---|---|
| 0 — Setup + Gate 0 | Not started | | | 🛑 Owner (phone) |
| 1 — Racing core | Not started | | | 🛑 Owner |
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
| Full gate | `npm run verify` | — | — |
| Tests | `npm test` | — | — |
| Lint | `npm run lint` | — | — |
| Build | `npm run build` | — | — |
| Phone landscape screenshots | — | — | — |
| Quick Season snapshot (PRD §19) | — | — | — |
| Frame rate on real phone | — | — | — |

## 4. What works (verified)

- Nothing built yet.

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
- **Branch:** main (not created) · **Uncommitted work:** none
- **Env vars needed:** none until Phase 7 (`MONGODB_URI`, `ALLOWED_ORIGINS` — names only)
- **Watch out for:** CLAUDE.md §8 gotchas; `docs/CONCEPT-BRIEF.md` is outdated.

## 11. Build log

- **2026-10-25** — Planning complete. PRD v1.0 and doc set written. Concept brief archived to `docs/`.
