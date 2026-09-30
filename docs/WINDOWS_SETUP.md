# TutorAI Windows Setup Guide

This guide is written for someone setting up TutorAI on a Windows 10 or Windows 11 computer for the first time. You do not need to be a programmer, but you will need an OpenAI API key and permission to load an unpacked browser extension.

## Before you begin

You need:

- Google Chrome or Microsoft Edge.
- Internet access.
- Permission to install Node.js on the computer.
- An OpenAI Platform account with API billing or credits.
- About 10 minutes for the initial installation.

Important: a ChatGPT Free, Plus, Pro, Team, or other ChatGPT subscription does not automatically provide paid API usage. OpenAI API billing is managed separately.

## Step 1: Download and install Node.js

1. Go to **https://nodejs.org/en/download**.
2. Download the current **LTS** Windows installer. On most Windows computers, choose the x64 `.msi` installer.
3. Run the installer.
4. Keep the default options selected, including the option that adds Node.js to `PATH`.
5. Finish the installation.
6. Close and reopen any PowerShell or Command Prompt windows that were already open.

TutorAI requires Node.js 22.13.0 or newer. The setup script checks this automatically.

## Step 2: Get the TutorAI files

### Easiest method: Download ZIP

1. Open **https://github.com/whynobro/tutorai**.
2. Select the green **Code** button.
3. Select **Download ZIP**.
4. Open your Downloads folder.
5. Right-click the downloaded ZIP and choose **Extract All**.
6. Choose a permanent location, such as `Documents\TutorAI`.
7. Open the extracted folder. The correct folder contains `README.md`, `setup-windows.cmd`, and `start-tutorai.cmd`.

Direct download: **https://github.com/whynobro/tutorai/archive/refs/heads/main.zip**

Do not run TutorAI from inside the ZIP preview. Extract all files first.

### Alternative method: Git

If Git is already installed, open PowerShell in the folder where you want TutorAI and run:

```powershell
git clone https://github.com/whynobro/tutorai.git
cd tutorai
```

GitHub Desktop can also clone the repository from the same URL.

## Step 3: Run the setup helper

1. Double-click `setup-windows.cmd`.
2. A Command Prompt window opens.
3. The script verifies Node.js, installs the exact project dependencies, creates a local `.env` settings file if needed, and builds the extension and API.
4. Wait until you see **Setup complete**.
5. Press any key to close the window.

The first setup may take several minutes. Warnings about packages requesting funding are informational and do not require payment.

If Windows SmartScreen appears, select **More info** and verify that the file is `setup-windows.cmd` inside the TutorAI folder before choosing **Run anyway**. The script is plain text and can be inspected in Notepad before running.

If the helper does not run, see [Troubleshooting](TROUBLESHOOTING_WINDOWS.md#the-setup-script-will-not-run).

## Step 4: Create an OpenAI API key

Each person should use their own key.

1. Sign in at **https://platform.openai.com/**.
2. Open the API key page: **https://platform.openai.com/api-keys**.
3. Create a new secret key.
4. Copy it immediately and keep it private. OpenAI displays the complete secret only when it is created.
5. If required, configure API billing at **https://platform.openai.com/settings/organization/billing/overview**.

New API accounts may use prepaid billing. API requests consume paid credits. Review OpenAI's current billing settings and set spending limits appropriate for your account.

Never paste the key into GitHub, an issue, an email, a chat message, or a screenshot. If a key is exposed, delete it from the OpenAI API key page and create a replacement.

## Step 5: Put the key in `.env`

1. In the TutorAI folder, find the file named `.env`.
2. If Windows hides the file, enable **View → Show → Hidden items** in File Explorer, or open Notepad and choose **File → Open**, then change the file filter to **All files**.
3. Open `.env` in Notepad.
4. Find:

```text
OPENAI_API_KEY=replace_me
```

5. Replace only `replace_me` with your key. Do not add quotation marks or spaces:

```text
OPENAI_API_KEY=your_private_key_here
```

6. Save and close Notepad.

The `.env` file is excluded from Git, so it will not be uploaded by normal Git commands.

## Step 6: Start TutorAI's local API

1. Double-click `start-tutorai.cmd`.
2. Leave the window open while using TutorAI.
3. Wait until the window reports that the server is listening on `http://127.0.0.1:8787`.
4. To confirm it is running, open **http://127.0.0.1:8787/health** in the browser. It should display:

```json
{"ok":true}
```

Closing the Command Prompt window stops TutorAI. The API listens only on the same computer; it is not exposed to other computers on the network.

## Step 7: Load the extension in Chrome

1. Enter `chrome://extensions` in Chrome's address bar.
2. Turn on **Developer mode** in the upper-right corner.
3. Select **Load unpacked**.
4. Browse to the extracted TutorAI folder.
5. Open `apps`, then `extension`, then select the `dist` folder.
6. Confirm that **TutorAI Answer Checker** appears and is enabled.
7. Refresh any assignment page that was already open.

The exact folder to select is:

```text
TutorAI\apps\extension\dist
```

Do not select the repository root or the `apps\extension` folder. Chrome needs the folder containing the built `manifest.json` file.

## Step 8: Load the extension in Microsoft Edge

Use this section instead of Step 7 if you use Edge:

1. Enter `edge://extensions` in Edge's address bar.
2. Turn on **Developer mode**.
3. Select **Load unpacked**.
4. Select `TutorAI\apps\extension\dist`.
5. Confirm that **TutorAI Answer Checker** is enabled.
6. Refresh any assignment page that was already open.

## Step 9: Use TutorAI

1. Open an ordinary `http://` or `https://` page containing one visible multiple-choice question.
2. Select an answer on the page itself.
3. Click the tiny white `?` in the lower-right corner.
4. TutorAI briefly captures the visible page and displays **Checking answer…**.
5. It then displays **Correct**, **Incorrect**, or a safe error such as **Select an answer first**.
6. Close the small result box. If the result is incorrect, change the page selection and check again.

TutorAI does not click the page's Submit or Next button.

## Everyday startup

After the one-time setup:

1. Open the TutorAI folder.
2. Double-click `start-tutorai.cmd`.
3. Leave that window open.
4. Open Chrome or Edge normally. The browser remembers the unpacked extension.

You do not need to rerun `setup-windows.cmd` every day.

## Updating TutorAI

### If you downloaded a ZIP

1. Download a new ZIP from **https://github.com/whynobro/tutorai**.
2. Extract it to a new folder.
3. Copy your old `.env` file into the new folder. Never upload or send this file.
4. Run `setup-windows.cmd` in the new folder.
5. Open the browser extensions page.
6. Remove the old unpacked TutorAI entry or select its reload button and point it to the new `apps\extension\dist` folder.

### If you cloned with Git

Close the running TutorAI server, open PowerShell in the repository, and run:

```powershell
git pull
.\setup-windows.cmd
```

Then select the reload button on the TutorAI card at `chrome://extensions` or `edge://extensions`.

## Removing TutorAI

1. Close the `start-tutorai.cmd` window.
2. Open `chrome://extensions` or `edge://extensions`.
3. Select **Remove** on TutorAI Answer Checker.
4. Delete the extracted TutorAI folder.
5. If you no longer need the API key, delete it at **https://platform.openai.com/api-keys**.

## Official references

- Node.js downloads: https://nodejs.org/en/download
- GitHub repository: https://github.com/whynobro/tutorai
- GitHub ZIP-download instructions: https://docs.github.com/en/repositories/working-with-files/using-files/downloading-files-from-github
- Chrome unpacked-extension instructions: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked
- OpenAI API quickstart: https://platform.openai.com/docs/quickstart
- OpenAI API keys: https://platform.openai.com/api-keys
- OpenAI API billing: https://platform.openai.com/settings/organization/billing/overview

