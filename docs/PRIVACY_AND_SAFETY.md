# Privacy, Permissions, and Appropriate Use

## What happens when `?` is clicked

1. The extension temporarily hides its own interface.
2. Chromium captures the currently visible tab viewport.
3. The local API sends that image to the configured OpenAI model.
4. The model privately analyzes one multiple-choice question and visible selection.
5. The local API returns only `correct` or `incorrect`, or a safe failure category.
6. This application does not write the screenshot or private answer analysis to disk.

No screenshot is taken while TutorAI is idle.

## Information that may be visible in a screenshot

The visible viewport can contain names, grades, course names, account details, notifications, or unrelated content. Before clicking `?`:

- Close pop-ups and notifications.
- Scroll so only the needed question is visible.
- Do not use TutorAI on pages containing sensitive personal, medical, financial, employment, or confidential information.
- Follow the site's rules and your school or organization's policies.

## Browser permissions

The extension's question-mark button runs only on ordinary `http://` and `https://` pages. Its host permission is `<all_urls>` because Chrome and Edge require that permission (or a toolbar click) before an extension can take a visible-tab screenshot. The screenshot is taken only after you click `?`. It does not run on protected browser pages such as `chrome://` or `edge://` URLs.

The extension does not request webcam, microphone, browsing-history, download, clipboard, notification, or incognito permissions.

## API key safety

- Each user should create their own key.
- The key belongs only in the local `.env` file.
- `.env` is excluded by `.gitignore`.
- Do not hard-code the key into the extension or source code.
- Do not send the key to another person.
- Revoke an exposed key immediately at https://platform.openai.com/api-keys.

The extension bundle does not contain the key. Only the local API process reads it.

## OpenAI processing

TutorAI sends screenshots to the OpenAI Responses API with `store: false`. OpenAI's current platform data controls and abuse-monitoring policies still apply. Review them before use:

- https://platform.openai.com/docs/models/default-usage-policies-by-endpoint
- https://openai.com/policies/privacy-policy/

## Appropriate use

Use TutorAI only where outside tools and screenshots are permitted. Do not use it to evade proctoring, monitoring, access controls, assessment rules, or academic-integrity requirements.

TutorAI is not guaranteed to be correct. It should not be used for high-stakes educational, employment, financial, legal, medical, certification, or safety decisions.

## Removing access

To stop TutorAI, close its server window. To remove it completely, remove the extension from the browser and delete the TutorAI folder. Revoke the API key if it is no longer needed.

