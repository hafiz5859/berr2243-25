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
