# TutorAI Answer Checker

TutorAI is a small local Chrome/Edge extension. A learner selects an answer on a visible multiple-choice page, clicks the tiny `?` in the lower-right corner, and receives only **Correct** or **Incorrect**.

It does not display the correct answer, provide hints, click answers, or submit work.

## Windows quick start

The complete beginner-friendly guide is here:

**[Windows Setup Guide](docs/WINDOWS_SETUP.md)**

The short version:

1. Install the current [Node.js LTS release](https://nodejs.org/en/download).
2. Download this repository from [GitHub](https://github.com/whynobro/tutorai) and extract the ZIP.
3. Double-click `setup-windows.cmd`.
4. Put your own OpenAI API key in the generated `.env` file.
5. Double-click `start-tutorai.cmd` and leave its window open.
6. Open `chrome://extensions` or `edge://extensions`, enable **Developer mode**, select **Load unpacked**, and choose `apps\extension\dist`.

Repository: **https://github.com/whynobro/tutorai**

Direct ZIP download: **https://github.com/whynobro/tutorai/archive/refs/heads/main.zip**

## Documentation

- [Full Windows setup](docs/WINDOWS_SETUP.md)
- [Troubleshooting](docs/TROUBLESHOOTING_WINDOWS.md)
- [Privacy, permissions, and appropriate use](docs/PRIVACY_AND_SAFETY.md)
- [Sender handoff checklist](docs/HANDOFF_CHECKLIST.md)

## What the recipient needs

- Windows 10 or 11
- Chrome or Microsoft Edge
- Node.js 22 or newer (an LTS release is recommended)
- An OpenAI Platform account, API key, and available API billing/credits
- Permission to use screenshots and outside assistance on the pages where TutorAI is used

A ChatGPT subscription and OpenAI API billing are separate. Each recipient should create and pay for their own API key. Never send an API key by email, text message, Discord, or GitHub.

## Developer commands

```powershell
npm ci
Copy-Item .env.example .env
npm run typecheck
npm test
npm run build
npm run start:api
```

The API listens only on `127.0.0.1:8787`. Its health endpoint is `http://127.0.0.1:8787/health`.

## Project layout

- `apps/extension` — Manifest V3 browser extension and compact UI
- `apps/api` — local API process that owns the OpenAI key
- `packages/contracts` — strict request/response schemas
- `tests/fixtures` — a sample multiple-choice page
- `scripts` — Windows setup and launch helpers

## Security design

- The OpenAI API key stays in the local `.env` file and local API process.
- `.env`, build output, and dependencies are excluded from Git.
- A screenshot is taken only after the user clicks `?`.
- The application does not write screenshots to disk.
- OpenAI Responses requests use `store: false`.
- The extension receives only `correct`, `incorrect`, or a safe failure category.

See [Privacy and Safety](docs/PRIVACY_AND_SAFETY.md) for the full explanation.

