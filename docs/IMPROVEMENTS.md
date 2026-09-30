# TutorAI improvement roadmap

This list tracks follow-up work identified during troubleshooting. Items are proposals, not claims that work is already implemented.

## Highest value

- **Build a representative answer-check evaluation set.** Include single-select questions, close distractors, chemistry notation, cropped or blurry screenshots, and problems with changed numbers. Compare the extracted question, selected option, canonical answer, and abstention behavior against a trusted key before changing prompts or models.
- **Validate answers against course keys and worked examples.** Course PDFs are currently searched by lexical overlap. A related passage can be useful but may not cover a new numerical variant; retrieval should show its source and should not be treated as proof that the answer is correct.
- **Make answer caching safer.** The API caches high-confidence canonical answers for identical normalized questions and choices until restart. A confidently wrong answer can therefore be reused during that run. Consider a shorter lifetime, an operator-visible cache reset, and only caching answers validated against trusted material or evaluation data.

## Reliability and usability

- **Improve screenshot recovery.** Users report that zooming in or revisiting a question can turn an unable-to-check result into a successful check. Add clearer guidance for unreadable text, multiple visible questions, and selection ambiguity; consider a crop/retry flow.
- **Support scanned reference PDFs.** The current loader extracts embedded PDF text and skips image-only pages. Add optional OCR with clear startup reporting for pages that could not be indexed.
- **Improve reference search.** Compare the current lexical ranking with chemistry-aware tokenization or embeddings, and test whether retrieved excerpts actually help on held-out problems with new values.
- **Expose operational diagnostics safely.** Preserve actionable capture/network errors while avoiding disclosure of API keys, full screenshots, or unnecessary course content in logs.

## Cost and response time

- **Measure model and reasoning settings.** Medium reasoning is now used for the answer-solving request, while screenshot transcription stays at the default. Benchmark accuracy, abstention rate, latency, and API cost on the same evaluation set before trying higher effort or another model.
- **Review image and context size.** Track request latency and token usage, then tune image detail and the number/size of retrieved excerpts based on measured accuracy rather than intuition.

## Release checks

- Run the extension build in a normal Windows Node environment; the last full build attempt completed type checking and the API build but the extension bundler failed with a transient `uv_os_get_passwd returned ENOMEM` error.
- After release, reload the unpacked extension after extension changes and restart the local API after server changes or reference-folder updates.
