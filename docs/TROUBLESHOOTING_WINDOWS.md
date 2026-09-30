# TutorAI Troubleshooting on Windows

Start with these three checks:

1. Is the `start-tutorai.cmd` window still open?
2. Does **http://127.0.0.1:8787/health** display `{"ok":true}`?
3. Is TutorAI enabled without errors at `chrome://extensions` or `edge://extensions`?

## The setup script will not run

Make sure the ZIP was extracted first. The folder should contain `setup-windows.cmd`, `package.json`, and an `apps` folder.

You can run the script manually:

1. Right-click the TutorAI folder while holding Shift.
2. Choose **Open PowerShell window here** or **Open in Terminal**.
3. Run:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1
```

If `node` is not recognized, install Node.js from **https://nodejs.org/en/download**, then close and reopen the terminal.

## The `dist` folder is missing

The extension must be built before it can be loaded. Run `setup-windows.cmd` again. If it fails, copy the final red error message—not the `.env` contents or API key—when asking for help.

The expected file is:

```text
apps\extension\dist\manifest.json
```

## Chrome says the manifest cannot be found

Select the `apps\extension\dist` folder, not the repository root. The selected folder must directly contain `manifest.json`.

## The question mark does not appear

- Refresh the page after loading or reloading the extension.
- Confirm the URL begins with `http://` or `https://`.
- TutorAI cannot run on `chrome://`, `edge://`, browser-store, PDF viewer, New Tab, or other protected browser pages.
- On the extension card, open **Details** and make sure site access is allowed.
- Check whether another page element is covering the lower-right corner.
- Open the extension card at `chrome://extensions` and inspect any red **Errors** button.

## Course references are not being used

- Set `COURSE_REFERENCE_DIR` in the project-root `.env` to the local folder containing the PDFs. Quote paths with spaces, for example `COURSE_REFERENCE_DIR='C:\Users\steen\Documents\Chemistry'`.
- Restart `start-tutorai.cmd` after changing the path or adding PDFs.
- At startup, the API prints how many PDFs and text passages it loaded. PDFs without extractable text (for example, image-only scans) need OCR before they can be searched.

## The result says “Checker is unavailable”

- Start `start-tutorai.cmd` and leave the window open.
- Open **http://127.0.0.1:8787/health**. If it does not load, the local API is not running.
- Confirm `.env` exists and contains a real key after `OPENAI_API_KEY=`.
- Check whether security software is blocking Node.js from making an outbound HTTPS connection.
- If port 8787 is already in use, close the other TutorAI window or other program using that port.

## The server reports that `OPENAI_API_KEY` is required

Open `.env` in the TutorAI root folder—not `.env.example`—and replace `replace_me` with your private key. Save the file, close the server window, and start it again.

## OpenAI authentication error or 401

The key is missing, mistyped, revoked, or belongs to the wrong API project.

1. Create a new key at **https://platform.openai.com/api-keys**.
2. Replace the value in `.env`.
3. Restart `start-tutorai.cmd`.

Never post the old or new key when asking for help.

## OpenAI billing, quota, or 429 error

Review API billing at **https://platform.openai.com/settings/organization/billing/overview**. A ChatGPT subscription does not fund API usage. New API accounts may need prepaid credits, and a new balance can take a few minutes to become available.

TutorAI also limits requests locally. Wait one minute if the checker was clicked repeatedly.

## Model-not-found error

Open `.env` and check:

```text
OPENAI_MODEL=gpt-5.4-mini
```

If that model is unavailable to the API project, replace it with a vision-capable model available to that project that supports Structured Outputs. Restart the server after saving.

## “Select an answer first” appears even though an answer is selected

The selected state may be too subtle in the screenshot. Try:

- Clicking the answer again.
- Making sure the selected option is visibly highlighted or checked.
- Scrolling so the full question and all choices are visible.
- Increasing browser zoom if the text is very small.

TutorAI intentionally refuses to guess when it cannot reliably see a selection.

## “Unable to check this question” appears

TutorAI currently supports one clearly visible multiple-choice question. Make sure:

- Only one question is prominent in the viewport.
- The question, choices, and selected state are all visible.
- The page is not showing a free-response, matching, drag-and-drop, handwritten, or multi-part problem.
- Pop-ups are not covering the question.

## The result seems wrong

Do not rely on TutorAI as an authoritative grading system. AI image interpretation can be incorrect.

- Verify that the correct question and selected choice were visible.
- Refresh and try once more.
- Check the result against course materials or an instructor.
- Stop using the result if the question is ambiguous or high-stakes.

TutorAI deliberately does not reveal the answer or explanation.

## The extension needs to be reloaded after an update

1. Run `setup-windows.cmd` after updating the files.
2. Open `chrome://extensions` or `edge://extensions`.
3. Select the circular reload button on the TutorAI card.
4. Refresh the assignment page.

## How to collect safe diagnostic information

When requesting help, send:

- Windows version.
- Chrome or Edge version.
- Output of `node --version`.
- The visible error message.
- A screenshot with names, grades, account information, and assignment content removed.

Never send `.env`, an API key, browser cookies, or an unredacted assignment screenshot.

