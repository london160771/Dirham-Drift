# Dirham Drift

**Race for money. Don't let money race you.**

A top-down racing career game set in the UAE where every money choice — borrowing, saving, insuring, investing, or falling for a scam — changes how your car drives in the next race.

Made for the Zoud GameLab FinLit Jam 2026 ("Make FinLit Fun").

[Play on itch.io](#) · [Install as an app](#) · [Gameplay video](#) · Tests: 83 passing (2026-10-28)

## The problem

Money lessons are usually cards and menus, and people skip text. In Dirham Drift you borrow AED 6,000 for a turbo and pay back AED 7,000. Crash without insurance, miss payments, and the bank takes the turbo back — you feel the car get slower.

## How it plays

`RACE → EARN → BORROW → CRASH → REPO → SCAM → RECOVER`

- Race on the **Marina street circuit** (3 laps around the canal) and the **Sheikh Zayed sprint** (start to finish).
- Earn AED, then visit the **Pit Hub**: upgrade in the Garage; save, borrow, insure and invest at the Bank.
- Life happens between races: repair bills, rent, a fake bank text, a "30% a week" fund.
- Short lessons appear after each consequence and collect in your Lesson Book.

**Modes:** Quick Season (5 min) · Career Season (10 races) · Quick Race · Ghost Challenge (if built)

## Judge path (60 seconds)

1. Press Play (landscape, fullscreen).
2. Choose **Quick Season (5 min)**.
3. Take the loan and skip insurance — see what happens.
4. Read the recap and Lesson Book.

## Controls

- **Phone (landscape):** left thumb steers; right thumb Gas, Brake, Nitro.
- **Keyboard:** arrows / WASD, Space = nitro, Shift = brake, P = pause.

## What's real

Racing and the money engine are real game code. All rates and prices are simplified and illustrative; all banks and funds are fictional. Not financial advice. See [REAL_VS_MOCKED.md](REAL_VS_MOCKED.md).

## Architecture

```
React shell (menus, Pit Hub) → Money engine (pure JS, tested) ↔ Phaser race scene
                                                    Ghost API (Node + Express + MongoDB) — optional
```

## Tested, not claimed

`npm run verify` on 2026-10-28: lint clean, **83 tests in 13 files passed**, build OK. Covers lap logic, race determinism, the money engine (all 7 PRD §18 consequence checks, 300 random seasons) and engine ↔ Pit Hub screens (buy, borrow, repossession). Frame rate on real phones is not measured yet.

## Run it locally

```bash
npm install
npm run dev
npm run verify
```

## Accessibility

Steering assist, optional auto-accelerate, Chill mode, text size, colour-blind safe signs, reduce motion, left-handed layout, control size, volume controls. Sound is never required.

## Known limits

To be filled honestly before submission.

## Roadmap

1. Live 2-phone racing
2. Abu Dhabi city and new tracks
3. Classroom mode with a teacher pack

## Credits and AI disclosure

Design and development: Adesope (Ayyoweb3). Built with AI assistance (Claude by Anthropic) for code. Other AI tools and free assets will be credited here with their licences.
