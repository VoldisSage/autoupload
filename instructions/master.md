# StreamerTools AutoUploader — Master Guidelines for Codex
This document defines the **authoritative global rules**, **coding standards**, **testing methodology**, **architecture**, and **expected behaviors** that Codex must follow when generating or modifying code in this project.

This file acts as a **permanent system-level guideline**.  
Codex must load and comply with this document **before executing any task**.

---

# 1. Project Overview

The **StreamerTools AutoUploader** is a Windows-resident background service built using **JavaScript/TypeScript**. It performs the following workflow:

1. Detect when a Twitch stream goes live.
2. Detect when the Twitch stream ends.
3. Retrieve Twitch metadata about the stream.
4. Detect the final OBS recording file.
5. Use OpenAI to generate YouTube metadata (title, description, tags, chapters, etc.).
6. Upload the video to YouTube with generated metadata.
7. Persist metadata into:
   - A Markdown file (`data/videos/*.md`).
   - A CSV log for analytics (`data/videos_metadata.csv`).
8. Send operational logs to Discord through a webhook.
9. Run automatically on Windows startup.

All code must be **modular, testable, clean, deterministic and maintainable by AI agents**.

---

# 2. Required Project Structure

Codex must respect and maintain the following structure:

```
streamertools-autoupload/
  config/
    config.json
  data/
    videos/
    videos_metadata.csv
  src/
    index.ts
    config.ts
    types/
      metadata.ts
    services/
      discordLogger.ts
      twitchService.ts
      streamWatcher.ts
      fileWatcher.ts
      openaiService.ts
      youtubeService.ts
      metadataStore.ts
  dev/
    testDiscordLogger.ts
    testTwitchLive.ts
    testStreamWatcher.ts
    testFileWatcher.ts
    testOpenaiMetadata.ts
    testMetadataMd.ts
    testMetadataCsv.ts
    testYoutubeDryRun.ts
README.md
package.json
tsconfig.json
```

Codex must **not create or modify files outside this structure** unless explicitly instructed.

---

# 3. Coding Standards

## 3.1 Language
- **TypeScript required** unless explicitly instructed otherwise.
- Use **ES modules** only.

## 3.2 Code Style
Codex must follow these rules:

- Always use **async/await** for async flows.
- Catch and handle errors at all network boundaries.
- Never crash the main process unnecessarily.
- Prefer small, modular, easily testable functions.
- No default exports — only **named exports**.
- Avoid complex abstractions.
- Keep code clear and readable for future AI agents.

## 3.3 Dependencies
Allowed libraries:

- `openai`
- `googleapis`
- `node-fetch` (or built-in fetch if available)
- Built-in Node modules: `fs`, `path`
- Lightweight utilities if justified

Avoid heavy dependencies unless required.

---

# 4. Testing Methodology

Every task must include a **manual dev test script** inside the `/dev/` directory.

Requirements:

- Each script must be runnable via:
  ```
  npm run dev:test-<task>
  ```
- Tests must produce clear, deterministic console output.
- Tests must not rely on external services unless explicitly required.
- Tests may write temporary output to `/data/` and nowhere else.

Example commands:
```
npm run dev:test-discord
npm run dev:test-openai
npm run dev:test-files
```

Codex is responsible for generating these scripts.

---

# 4.1 Fake Collaborators (Mandatory Testing Strategy)

To ensure reliability, determinism, and isolation of tests, **networked services must never be called directly in test scripts**.

Codex must implement **Fake Collaborators** for any network-dependent module.

## Fake Collaborator Requirements:

### Discord
During tests:
- Replace the real webhook call with a fake implementation.
- The fake must:
  - Simulate success instantly.
  - Not perform HTTP requests.
  - Store messages internally for test assertions.

### Twitch
- Tests must use fake responses unless the task explicitly requires a real integration test.

### OpenAI
- Tests focused on downstream logic must use fakes with predictable metadata.
- Real tests may only occur when a task explicitly demands them.

### YouTube
- All tests must use `dryRun = true`.
- No real uploads unless explicitly requested.

## Why this is required
- Prevents costs
- Enables determinism
- Enables offline testing
- Ensures reproducibility
- Avoids rate limits and failures

---

# 5. Universal Definition of Done

Codex must ensure **every task** satisfies:

### ✔ 5.1 Code compiles successfully
`npm run build` must run without TypeScript errors.

### ✔ 5.2 A test script exists
A `/dev/testXYZ.ts` file must be created or updated.

### ✔ 5.3 Tests run without throwing
`npm run dev:test-XYZ` must execute and show expected results.

### ✔ 5.4 Errors are meaningful
Every error must be thrown or logged with clear human-readable context.

### ✔ 5.5 Log format is exact
Logs sent to Discord must follow this exact wording:

```
1. Se ha detectado el final de un directo.
2. Iniciando recuperación de información de parte de twitch.
3. Realizando llamada a chatgpt con la información correcta.
4. Obtenida información, enviando información a youtube junto al vídeo.
5. Subida completada, enlace al vídeo: <URL>
```

### ✔ 5.6 Code cleanliness
No unused imports, dead code, commented-out blocks or unnecessary complexity.

### ✔ 5.7 Fake Collaborators must be used for tests
All network interactions must be replaced with fakes in test scripts.

---

# 6. Required Codex Behaviors

Codex MUST:

### 6.1 Treat `master.md` as authoritative
This file overrides all other inputs except direct user instructions.

### 6.2 Load the task file before generating code
Codex must extract:
- Description
- DoD
- Tests  
and satisfy them fully.

### 6.3 Ask for clarification when needed
Codex must say:
> "I need clarification on X before proceeding."

### 6.4 Maintain backward compatibility
Unless instructed, do not break existing files.

### 6.5 Refactor when tasks require it
Codex may reorganize code when logically required.

---

# 7. Functional Workflow Specification

Codex implementations must preserve the following sequence:

### When stream ends (`offline` event):
1. Discord log (“stream ended”)
2. Fetch Twitch metadata
3. Discord log (“preparing OpenAI prompt”)
4. Call OpenAI → metadata JSON
5. Find OBS recording file
6. Discord log (“uploading to YouTube”)
7. Upload video + metadata
8. Generate `.md` summary
9. Append CSV row
10. Discord log (“video uploaded, link: <URL>”)

### Error flow:
```
❌ Ha ocurrido un error: <detail>
```

---

# 8. Task Execution Protocol for Codex

When the user says:

> “Codex, implement task X”

Codex must:

1. Load `instructions/master.md`
2. Load the corresponding task file from `instructions/tasks/X.md`
3. Generate or modify code accordingly
4. Generate appropriate test script(s)
5. Provide a summary of file changes
6. Wait for confirmation

---

# 9. Future Compatibility

Codex should keep code modular to allow future expansions, including:

- Shorts generation
- Multi-platform uploading
- Local database (SQLite)
- Plugin architecture
- Stream analytics

---

# 10. Completion Criteria

The project is complete when:

- All tasks in `instructions/tasks/` are implemented
- All tests pass reliably
- A full Twitch → OpenAI → OBS → YouTube → Discord pipeline runs end-to-end
- `.md` and CSV logging works reliably
- Windows autostart is functional
- No uncaught exceptions remain
- Code is readable and easily modifiable by AI

---

# End of Master Guidelines
