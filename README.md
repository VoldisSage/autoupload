# StreamerTools AutoUploader

StreamerTools AutoUploader is a Windows-resident background service that automates uploading Twitch recordings to YouTube. This repository currently contains the initial scaffolding for the full system.

## Installation
1. Ensure Node.js 18+ and npm are installed.
2. Install dependencies with:
   ```
   npm install
   ```

## Configuration
Edit `config/config.json` and replace the placeholder values with your credentials and paths. The application exits with a clear configuration error if this file is missing or invalid.

## Build
Compile the TypeScript sources into `dist/`:
```
npm run build
```

## Run
Execute the compiled entrypoint:
```
npm run start
```

## Dev Test Script
Validate the scaffolding assumptions without touching external services:
```
npm run dev:test-scaffolding
```

## Dev Test Script (Config)
Validate configuration loading without touching external services:
```
npm run dev:test-0.2-config
```
