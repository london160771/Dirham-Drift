# Dirham Drift

**Race for money. Don't let money race you.**

A top-down racing career game set in the UAE where every money choice — borrowing, saving, insuring, investing, or falling for a scam — changes how your car drives in the next race.

Made for the Zoud GameLab FinLit Jam 2026 ("Make FinLit Fun").

**[Play in the browser / install as an app](https://dirham-drift.vercel.app)** · [itch.io page](https://ayyoweb3.itch.io/dirham-drift) · [Gameplay video (2 min)](https://youtu.be/FEmNQwNXv-w) · Tests: 178 game + 23 server passing (2026-11-02)

| Link | What it is |
|---|---|
| https://dirham-drift.vercel.app | The game. Plays in any browser; on a phone it can be installed as an app. |
| https://ayyoweb3.itch.io/dirham-drift | The jam page (being prepared for submission). |
| https://dirham-drift.onrender.com/health | Ghost Challenge server. On the free tier it sleeps when idle, so the first call can take 30–60 s. |
| Gameplay video (2 min) | https://youtu.be/FEmNQwNXv-w |

## The problem

Money lessons are usually cards and menus, and people skip text. In Dirham Drift you borrow AED 6,000 for a turbo and pay back AED 7,000. Crash without insurance, miss payments, and the bank takes the turbo back — you feel the car get slower.

## How it plays

`RACE → EARN → BORROW → CRASH → REPO → SCAM → RECOVER`

- Race on the **Marina street circuit** (3 laps around the canal) and the **Sheikh Zayed sprint** (start to finish).
- Earn AED, then visit the **Pit Hub**: upgrade in the Garage; save, borrow, insure and invest at the Bank.
- Life happens between races: repair bills, rent, a fake bank text, a "30% a week" fund.
- Short lessons appear after each consequence and collect in your Lesson Book.

**Modes:** Quick Season (5 min) · Career Season (10 races) · Quick Race · Ghost Challenge (record a run, share a 6-character code, race a friend's ghost)

## Judge path (60 seconds)

1. Open https://dirham-drift.vercel.app and press Play (phone in landscape, or desktop).
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
                                                    Ghost API (Node + Express + MongoDB, server/) — optional
```

## Tested, not claimed

`npm run verify` on 2026-11-02: lint clean (0 warnings), **178 tests in 29 files passed**, build OK. Ghost server: **23 API tests passed** (`cd server && npm test`, in-memory MongoDB). Covers lap logic, race determinism, the money engine (all 7 PRD §18 consequence checks, 300 random seasons), the Quick Season script and snapshot, the season recap, career save, settings persistence, Arabic string parity, the itch.io PWA switch, the app update bar, the interest-free loan, the Zakat estimate, difficulty levels, assists, menu Back/Home, Bank amount inputs, engine ↔ Pit Hub screens (buy, borrow, repossession), ghost recording/playback, race camera framing and the Ghost API (validation, size limit, not-found, rate limit, CORS). Frame rate on real phones is not measured yet.

## Run it locally

```bash
npm install
npm run dev
npm run verify
```

Ghost server (optional, needs MongoDB; copy `server/.env.example` to `server/.env`):

```bash
cd server
npm install && npm run dev && npm test
```

Point the game at it with `VITE_GHOST_API_URL=http://localhost:8080 npm run dev`. Without that variable the Ghost Challenge mode is hidden.

## Accessibility

Steering assist, optional auto-accelerate, Chill mode, text size, colour-blind safe signs, reduce motion, left-handed layout, control size, volume controls. Sound is never required.

## Known limits

- **Numbers are simplified.** Rates, fees and returns are illustrative, not real offers. Banks, funds and sponsors are fictional. Not financial advice.
- **Balance is not final.** Prices, prizes and recap grade thresholds come from simulated seasons, not wide playtesting.
- **Frame rate** has not been measured on real phones yet (tested in desktop browsers and headless phone sizes).
- **Ghost Challenge** needs a network connection. Its server is on a free tier that sleeps when idle, so the first request can take 30–60 s (the game shows "Waking server…"). It races a recorded ghost, not a live opponent.
- **App install** works from the Vercel site only. On itch.io the game runs in a frame, so install is turned off there.
- **iPhone:** Safari ignores the orientation lock (a rotate screen asks you to turn the phone), sound starts after the first tap, and there is no vibration.
- **Saves** are kept in the browser only. Clearing site data removes a career in progress.
- **Arabic** text is an AI-assisted translation, reviewed by the developer.
- **Art:** rival and traffic cars are recolours of the AI-made car images; the metro train and car upgrade parts are drawn in code.

## Roadmap

1. Live 2-phone racing
2. Abu Dhabi city and new tracks
3. Classroom mode with a teacher pack

## Credits and AI disclosure

Design, direction and testing: Adesope (Ayyoweb3).

**AI use (disclosed):**

- Code: written with AI assistance (Claude by Anthropic).
- Arabic translation: AI-assisted (Claude), reviewed by the developer.
- Game images (title skyline, garage, bank, scam poster, cars and track scenery): made with Google Gemini image generation, then cut out and resized for the game.
- Demo video: voiceover generated with ElevenLabs; edited with AI assistance (Claude) from real gameplay captures.

**Assets and libraries:**

- Sound effects (crash, coin, thud, click): "100 CC0 SFX" by rubberduck, OpenGameArt.org — CC0.
- Engine, nitro, countdown beeps, the repossession sound and both music loops are generated in code. The demo video's music is also generated in code.
- Roads, lanes, barriers, curbs, lamps, the metro train and car upgrade parts are drawn in code.
- Fonts: system fonts for English; Cairo by Mohamed Gaber (SIL Open Font License 1.1, via Fontsource) for Arabic.
- Libraries: Phaser 4, React, Vite, vite-plugin-pwa and Workbox (MIT). Ghost server: Express and Mongoose (MIT).

All banks, funds and sponsors are fictional. No real brands or logos.
