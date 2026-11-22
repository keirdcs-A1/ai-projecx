# Vaelor export

The reviewed portfolio's complete browser bundle, campaign data, generated graphics, synthesised audio and local fonts are included. Gameplay and save code are unchanged. Absolute asset references and portfolio navigation were removed. The original export accidentally renamed three combat-doctrine `data-style` attributes; these attributes are restored so Precision, Force and Guard pass the intended values to the existing controls. The markup-to-CSSOM style adapter is preserved. CSP permits local scripts/styles/fonts and generated data/blob images, with no inline scripts, inline style attributes or remote connections.

## Data note

The live campaign, world, enemies, UI and local chat/log are held in tab memory. The chat input runs game commands and displays local messages; it does not send messages to another person or a service. Manual and automatic campaign saves use localStorage key `vaelor_starfall_save_v8`. The existing save migration reads older keys `vaelor_starfall_save_v3` through `vaelor_starfall_save_v7`. Saved data includes the character name entered by the visitor, position, health, currency, ammunition, equipment, inventory, bank, skills, world/quest state, discovered areas, lore, combat preferences, kills, waypoint and graphics/audio settings. Export places a base64 save code in a text box and attempts to copy it to the device clipboard. Import reads a pasted save code, validates/migrates it and writes it to localStorage. Export does not create a download or transmit the code. No IndexedDB, sessionStorage, cookies, analytics or runtime remote requests are used. App files and fonts are requested from the chosen static host, which receives normal request information. Generated images and sound stay local. No campaign, entered name, chat text or save code leaves the device unless the visitor separately shares it. Storage is shared with other pages on the same origin; saves on a different origin do not transfer automatically. The original private-host saves can be transferred with supported save-code export/import.

## Content and licences

Three.js r128 and its postprocessing examples are bundled in `app.js`, under the MIT licence in `vendor/THREE-LICENSE.txt`. The locally bundled Barlow, Chakra Petch and JetBrains Mono fonts use SIL Open Font Licence 1.1, with copyright and full licence texts in `vendor/OFL-*.txt`. They make no requests to a font provider. The remaining game code, campaign and procedural assets are original project content; no new public licence is granted by this export.

## Checks

JavaScript syntax checking passed. All relative HTML and CSS asset references resolve. Static text scan found no private file paths, email addresses, secret patterns or private hosted-domain references. No source maps are included. Browser and gameplay results are recorded in the top-level README. A short smoke test cannot establish complete campaign correctness or every historical save migration.
