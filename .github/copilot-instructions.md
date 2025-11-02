## Purpose
This file helps AI coding agents be productive in this small Express + MongoDB project. It documents the project layout, important patterns, developer workflows, and corpus-specific examples the agent can safely use or change.

## Big picture (what this repo is)
- Minimal Node.js app using CommonJS (`require`) with Express and the official `mongodb` driver.
- Single script of interest: `index.js` (at repo root). It creates a `drivers` array and performs DB operations (insert, update, delete) against `mongodb://localhost:27017` and `testDB`.`drivers`.

## Key files to read
- `index.js` — application entry; contains the data model examples and DB usage patterns. Use this file for examples when editing code or suggesting fixes.

## Architecture notes / why things are structured this way
- This is a single-file prototype rather than a multi-service app. There is no package.json or build step detected in the repo; edits should keep the app runnable with `node index.js` unless adding a package manifest.
- The code uses the MongoDB Node driver directly (no ODM like Mongoose). Expect raw collection operations (`insertOne`, `updateOne`, `deleteOne`).

## Project-specific conventions & patterns
- CommonJS modules (require/exports) — avoid converting to ESM unless you add/update `package.json` and test locally.
- Database: expects a local MongoDB at `mongodb://localhost:27017`. Do not change this connection string unless you also update documentation/run instructions.
- DB usage pattern in `index.js`:
  - drivers are stored in a local array literal `drivers`.
  - code currently uses `drivers.forEach(async (driver) => { await driversCollection.insertOne(driver) })` — this is an anti-pattern because `Array.forEach` doesn't await async callbacks. Prefer `for...of` or `insertMany` for bulk inserts.

## Common fixes and examples (copy/paste friendly)
- To insert the `drivers` array correctly (example):
  - Use `await driversCollection.insertMany(drivers)` or
  - Use `for (const d of drivers) { await driversCollection.insertOne(d) }`

- When incrementing a numeric field use the `$inc` operator as shown in `index.js` (example safe to reuse):
  - `db.collection('drivers').updateOne({ name: 'Afif Ikram' }, { $inc: { rating: 0.1 } })`

## Developer workflows (how to run/test/debug)
- Run: Ensure MongoDB is running locally (default port 27017), then run `node index.js` from the project root.
- Debug: The project is single-file — use VS Code launch configuration for Node or run `node --inspect-brk index.js` and attach a debugger.
- If you add dependencies (e.g., express, mongodb) create a `package.json` and use `npm install`. Do not modify runtime semantics without adding/updating `package.json` and documenting the change in the repo root.

## Integration points & external dependencies
- MongoDB server — local connection string used in `index.js` (`mongodb://localhost:27017`).
- No CI, tests, or external service credentials detected. Avoid adding secrets; use environment variables if you need to parameterize DB URIs.

## Safety & change guidance for AI agents
- Small, incremental changes are preferred. For changes that affect runtime (adding package.json, switching to ESM, or changing DB URI), always:
  1) Explain why the change is needed in one sentence in the PR description.
  2) Include steps to run the app after the change (example commands).
- Prefer fixing correctness/bug patterns (e.g., the `forEach` + `async` issue) over larger refactors.

## Examples from this repo to reference in suggestions
- `index.js` — demonstrates how drivers are inserted, updated and deleted. Use the existing field names (`name`, `vehicleType`, `isAvailable`, `rating`) when generating tests, fixtures, or sample data.

## When to ask for clarification
- If you cannot run MongoDB locally, or if the change requires adding CI, tests, or a package manifest, ask the repository owner before proceeding.

---
If any section is unclear or you want more detail (e.g., preferred tests, target Node version, or a package.json template), tell me which area to expand and I'll iterate.
This repository is a tiny Node.js demo that uses the official MongoDB Node driver to connect to a local MongoDB instance and perform a single insert + find.

Key points for an AI coding agent working here:

- Big picture
  - Single-entry script: `index.js` is the main app. It requires `mongodb` and performs: connect -> insertOne -> findOne -> close.
  - No server framework or routing; the project is intended as a local demo/script, not a long-running web service.

- How to run & debug (Windows PowerShell)
  - Install deps: `npm install` (already present in project root).
  - Start a local MongoDB server (default: mongodb://localhost:27017). The script assumes a running local server.
  - Run: `node index.js` from project root. The script logs driver names, then DB connect/insert/query results.

- Notable project conventions and patterns
  - Uses CommonJS modules (require/exports). Keep changes compatible with Node >=16.
  - The code is minimal and synchronous-appearing but uses async/await for Mongo operations in `main()`.
  - DB and collection names are hard-coded: `testDB` and `users`. Changes to those should update `index.js` accordingly.

- Integration points & external dependencies
  - `package.json` declares `mongodb` dependency (currently ^6.20.0). The project depends on a local MongoDB server.
  - No other external services or environment configuration files are present.

- Known repository quirks discovered during troubleshooting
  - The installed `mongodb` package in `node_modules` was missing `lib/operations/search_indexes/update.js` though its `.map` existed. This caused `MODULE_NOT_FOUND` when `require('mongodb')` loaded internal modules.
  - I added a minimal `update.js` shim under `node_modules/mongodb/lib/operations/search_indexes/update.js` to restore functionality. If you prefer a clean fix, remove `node_modules` and run `npm install` again; that should fetch a complete package from the registry.

- Examples from the codebase
  - Insert example: `await collection.insertOne({ name: "Razin", age: 22 });` in `index.js`.
  - Query example: `await collection.findOne({ name: "Razin" });` in `index.js`.

- When editing code, pay attention to:
  - Typos in standard APIs (I fixed `console,log` -> `console.log` and a missing semicolon in `index.js`).
  - Avoid modifying `node_modules` for long-term fixes — prefer reinstalling deps or pinning a working `mongodb` version in `package.json`.

- Recommended quick tasks for contributors
  - Add a `.env` or config file for Mongo URI and DB/collection names rather than hard-coding.
  - Add a simple test that runs `main()` against a local test DB and tears down inserted documents.

If any of the above is unclear or you want me to expand sections (examples, tests, or a clean `node_modules` reinstall), tell me which part and I'll update this file.
