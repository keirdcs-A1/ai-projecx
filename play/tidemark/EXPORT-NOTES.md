# Tidemark static export

Status: complete local static export of the available deployment build. Browser smoke checks passed for island rendering, Settings and manual saving; JSON transfer remains unverified. The source single-file build and the HTML inside its local deployment archive were byte-identical (SHA-256 `f80deba6cd3f2d036da13ff60f523ea0604e8fcb6566a5f4583beb1562eab38a`). That build dates from October 2026. Access to the other account's current hosted source was not available, so parity with the currently published version is unverified.

## Files and changes

`index.html` loads `./style.css` and `./game.js`. The existing HTML, CSS and game code were separated from the portable build without changing the simulation or save format. The export adds a Content Security Policy and a no-referrer policy. All assets are local: scenery and icons are drawn by the game, sound is synthesised with Web Audio, and typography uses the visitor's installed system fonts. There is no service worker or automatic offline installation.

The CSP denies network connections, third-party resources, scripts embedded in HTML, frames, objects and form submissions. It permits local scripts and styles, a data-URL favicon and inline style attributes needed by existing generated progress bars. `style-src-attr` requires CSP Level 3 support, available in current mainstream browsers. The browser test must check for any CSP violations.

## Exact data note

- The game holds movement paths, the current interaction, open panels, particles, input state, sound state and simulation timers in tab memory.
- It reads and writes the localStorage key `tidemark_island_v1`. The stored JSON includes version, player position, health, coins, bag items, supply chest contents, equipment, proficiency XP, completed projects, visited landmarks, resource recovery timestamps, sound and label settings, recent game log messages and whether the introduction has been seen. There is no IndexedDB, cookie, account, database, analytics or remote save.
- The game saves after relevant interactions, on losing focus or hiding the tab, and periodically after changes (approximately every eight seconds of active simulation). The Settings menu also offers a manual save and a confirmed reset. Browser storage may be unavailable or cleared by browser settings.
- Export creates a JSON Blob on the visitor's device and downloads `tidemark-save.json`. Import reads a locally selected JSON file (maximum 100,000 bytes), validates its gameplay fields and asks before replacing the current island. Imported resource cooldowns and logs are cleared. The imported file is not uploaded.
- Saves belong to the website origin, not the subfolder. They do not migrate automatically from another website or browser. If two Tidemark copies share an origin, they share this same save key. Manual export/import can transfer progress.
- The browser requests only this app's HTML, CSS and JavaScript from the static host. There are no app-initiated external requests or external links. The host receives normal page/asset request metadata, such as the visitor's IP address and browser headers, according to that host's logging policy. Gameplay and saves do not leave the visitor's device unless they choose to share a downloaded save themselves.

## Content and licences

No third-party libraries, downloaded fonts, remote images or sound recordings are included. Canvas artwork, SVG interface icons, gameplay content and synthesised audio are supplied by the available Tidemark project. No explicit public source-code licence was present in that project, so this export does not grant a new licence for the project's original content or code. It makes no claim of rights beyond those of the portfolio owner.

## Verification performed here

- JavaScript syntax check: `node --check game.js` passed.
- Source comparison: the original portable HTML and the deployment archive's HTML were identical.
- Static inspection: no fetch/XHR/WebSocket, analytics, remote asset loading, third-party script, server code, database or authentication integration.
- Browser testing, interaction checks, console/network results and subpath serving are reported by the parent export README; they have not been independently performed in this subtask.
