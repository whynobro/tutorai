# TutorAI Sender Handoff Checklist

Use this checklist before sending TutorAI to another person.

## What to send

Send only this repository link:

**https://github.com/whynobro/tutorai**

For someone who does not use Git, send the direct ZIP link:

**https://github.com/whynobro/tutorai/archive/refs/heads/main.zip**

Also point them to:

**https://github.com/whynobro/tutorai/blob/main/docs/WINDOWS_SETUP.md**

## What never to send

- Your `.env` file.
- Your OpenAI API key.
- Your `node_modules` folder.
- Browser profile data or cookies.
- Screenshots containing names, grades, or private assignment content.

Each recipient creates and pays for their own OpenAI API key.

## Before announcing a new version

From the repository root, run:

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

Confirm that these files exist:

```text
apps\extension\dist\manifest.json
apps\api\dist\server.js
```

Test the handoff in a fresh folder or Windows account:

1. Download the GitHub ZIP.
2. Extract it.
3. Run `setup-windows.cmd`.
4. Add a temporary test API key to `.env`.
5. Run `start-tutorai.cmd`.
6. Check `http://127.0.0.1:8787/health`.
7. Load `apps\extension\dist` in a clean Chrome or Edge profile.
8. Test correct, incorrect, no-selection, and unreadable states.
9. Revoke the temporary test key after testing.

## Suggested message to the recipient

> TutorAI is a local Windows browser extension that checks whether the multiple-choice answer selected on a visible page is correct or incorrect. Download it from https://github.com/whynobro/tutorai and follow the Windows guide at https://github.com/whynobro/tutorai/blob/main/docs/WINDOWS_SETUP.md. You will need Node.js, Chrome or Edge, and your own OpenAI API key with API billing. Do not send your API key to me or anyone else, and use the tool only where screenshots and outside assistance are allowed.

