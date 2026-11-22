# AI Lab Tycoon export

The reviewed portfolio's production React bundle and CSS are included. Simulation and UI behaviour are unchanged. Host navigation was removed, asset references are relative and a restrictive CSP prevents remote connections and inline scripts/styles. React's existing runtime style-property updates are preserved; no static inline style attributes are added.

## Data note

The simulation seed, game state, allocation decisions, release/product names, market settings, feed log and tuning parameters live only in the tab's React state. Reloading or closing the page loses the run, as in the existing session-only prototype. The game has no browser-local save, save export/import, localStorage, sessionStorage, IndexedDB, cookies or downloads. It sends no network requests beyond loading its own JavaScript and CSS from the chosen static host. That host receives normal network request information. Game decisions and typed model names do not leave the device. No account, AI API, telemetry or third-party script is used.

## Content and licences

React, React DOM and Scheduler are bundled locally under MIT licences; full texts are included as `REACT-LICENSE.txt`, `REACT-DOM-LICENSE.txt` and `SCHEDULER-LICENSE.txt`. System fonts are used. The game is original project code; this export does not grant a new licence for it.

## Checks

JavaScript syntax checking passed. All HTML/CSS relative asset references resolve. Static text scan found no private file paths, email addresses, secret patterns or private hosted-domain references. No source maps are included. Browser interaction results are recorded in the top-level README. A smoke test does not validate every simulated ending or balancing choice.
