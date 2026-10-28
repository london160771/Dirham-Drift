# CLAUDE.md — Dirham Drift

> Single rules file for every agent. Claude Code reads it automatically. Codex reads AGENTS.md by default, so start Codex prompts with "Read CLAUDE.md and PRD.md first."
> Point to PRD sections; never copy requirements here.

## 1. What this is

**Dirham Drift** — a top-down racing career game set in the UAE where every money choice (borrow, save, insure, invest, fall for a scam) changes how your car drives in the next race.
Tagline: Race for money. Don't let money race you.
Jam: Zoud GameLab FinLit Jam ("Make FinLit Fun"). Deadline: Nov 16, 2026, 12:59 pm WAT. **Internal cutoff: Nov 15, 2026, 6:00 pm WAT.**

Memorable flow: `RACE → EARN → BORROW → CRASH → REPO → SCAM → RECOVER`

Core guarantee: **Every money decision changes something the player can feel on the track within one race.**

## 2. Source of truth

**`PRD.md` is the only source of truth for requirements.** There is no SPEC, DESIGN or PLAN file. `docs/CONCEPT-BRIEF.md` is an archived early draft — it is outdated (e.g. it mentions auto-accelerate and Kenney tiles). Never build from it.

Read in this order before any work:
1. `PRD.md` — the section for the part you're building.
2. `PROJECT_STATE.md` — what is actually done.
3. The code. The repo is the final truth for what exists.

Rules:
- Cite the PRD section you build against (e.g. "PRD §11").
- If an engine, library or browser doesn't behave as the PRD says, stop, fix the PRD with the evidence, and log it in PRD §16.
- If a request conflicts with the PRD, stop and update the PRD first. Never change scope silently.
- Update `PROJECT_STATE.md` at the end of every phase.

## 3. Resolved decisions

Live in **PRD §16**. Don't reopen them without new evidence.

## 4. Commands

Run from the repo root. If a command isn't here, read `package.json` — never guess.

```bash
npm install            # install
npm run dev            # local dev (Vite)
npm test               # Vitest
npm run lint           # ESLint, zero warnings
npm run build          # production build (relative base for itch.io)
npm run verify         # lint + test + build — the gate
```

Ghost server (Phase 7 only), from `server/`:
```bash
npm install && npm run dev && npm test
```

Fill in exact scripts once `package.json` exists (Phase 0).

## 5. Scope

P0 / P1 / Never lists: **PRD §26**. Screens: **PRD §21**. Endpoints: **PRD §14**.
- Don't add screens, modes, money systems or endpoints that aren't in the PRD.
- **New ideas go to `ROADMAP.md`**, never into the build.
- Car feel is frozen after Phase 1 approval. No steering rework later.

## 6. Invariants

All invariants, money rules and the season state machine live in **PRD §11**. Always:
- Money is whole AED integers. Percentages round down. No floats in money math.
- The money engine (`src/game/engine/`) is pure: no Phaser, React, DOM, storage or network inside it.
- All randomness goes through the seeded RNG. Never call `Math.random()` in game logic.
- Every money change writes a ledger entry.
- All numbers live in `src/game/config/`. No magic numbers in scenes or components.
- No money changes during a race. The race returns results only.
- Never soft-lock: there is always a startable race.
- Illegal season state transitions throw.

## 7. Honesty rules

- Never invent numbers, test counts, frame rates or screenshots.
- Frame rate and load size are **targets** until measured on a real device.
- Report test counts only after they pass, with the real output.
- Every number in the UI, README, GDD, video and itch page comes from the config and matches exactly.
- The "Numbers are simplified. Not financial advice." note stays on the Bank screen and How to Play.
- Banks, funds and sponsors are fictional. No real brands or logos.
- Keep `REAL_VS_MOCKED.md` matching PRD §17 and the code.
- AI use is disclosed. Credit every free asset with its licence.

## 8. Gotchas (check installed versions — not your training data)

- **Phaser:** check the installed major version first. Phaser 4 APIs differ from Phaser 3. Read the installed docs before using an API.
- **React StrictMode** mounts twice in dev: create the Phaser game once and destroy it on unmount, or two games will run.
- **Vite `base`** must be `'./'` or the itch.io upload shows a blank screen.
- **itch.io** runs the game in an iframe on its own domains: don't register the service worker there (PRD FR-PWA-002); fullscreen needs a user gesture.
- **iPhone Safari:** ignores orientation lock (rotate screen covers it); audio starts only after a user tap; no vibration API.
- **Multi-touch:** steer + gas must work at the same time. Test with two fingers.
- **Vite env:** any `VITE_` variable ships to the browser. No secrets in the client.
- **Express 5:** async errors reach the error handler automatically; check the installed version. **Mongoose 8+:** no callbacks.
- **CORS (Phase 7):** allow the Vercel domain and itch.io game domains only.

## 9. Code quality

- No comments. Clear names and small files explain the code. Split files past ~200 lines.
- Pure core, effects at the edges.
- No dead code, no TODOs, no commented-out blocks.
- Reuse; don't copy-paste.
- Few dependencies; pin exact versions.
- Don't rewrite completed phases. Preserve working behaviour.
- Zero lint warnings in committed code.
- Tests for the money engine, consequence checks (PRD §18), determinism and lap logic.
- JavaScript (ESM), not TypeScript.

## 10. Phase workflow

Phases live in **PRD §27**.

Before a phase: name it, list its acceptance criteria, inspect the code, plan the smallest change.

During: build only that phase.

Automatic-check phases (2, 3, 5) may run back to back. **Always stop at a 🛑 owner gate** (Phases 0, 1, 4, 8) and at the install/ghost owner checks (6, 7).

**Verify before claiming done:**
- Run `npm run verify` and read the real output (don't pipe into `tail` and trust the exit code).
- Reproduce a bug before fixing it.
- Screenshot UI screens at **phone landscape size (e.g. 844×390)** and at desktop size. Look at them.
- Check failure states, not just the happy path.

**Phase report** (then stop and wait):
- files changed;
- tests run and real results;
- manual checks done;
- config or env changes;
- PRD / PROJECT_STATE updates;
- limits, risks, ideas sent to ROADMAP.md;
- which video act can now be recorded;
- the next phase — without starting it.

## 11. Demo and recording

- Video acts: **PRD §22**. Tell the owner the moment an act can be recorded.
- Quick Season (**PRD §19**) must always produce the same event order. If its snapshot test changes, something broke — report it.
- README must have: judge path, how to play, real vs simplified link, test count, video link, credits, AI disclosure, known limits.

## 12. Review checkpoints

- Default implementation model: faster model.
- Stronger model reviews: Gate 0 result, money engine (end of Phase 2), and the final build before submission (Phase 8).

## 13. Git

- Commit only after the owner approves the phase. "Keep going" is not approval to commit.
- Order: finish → report → approval → commit → push → report the hash.
- Conventional messages (`feat:`, `fix:`, `docs:`, `test:`).
- **Never deploy.** The owner deploys to Vercel and uploads to itch.io.
- Never commit secrets (`.env` is gitignored).

## 14. Deadline discipline

- After Nov 14: bug fixes, links and text only.
- After submission: no feature commits to the jam build. Ideas go to ROADMAP.md.

## 15. Definition of done

Project checklist: **PRD §30**. A phase is done when its PRD §27 acceptance criteria pass, `npm run verify` passes, the report is written, and `PROJECT_STATE.md` is updated.
