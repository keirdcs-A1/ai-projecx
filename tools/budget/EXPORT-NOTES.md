# Monthly Budget Planner

Static adaptation of the version 4 portfolio component. Original calculations, categories, sample figures, add/remove controls, £10,000,000 input cap, 50-category cap, penny rounding and CSV formula escaping retained. Runs locally with React, React DOM, Scheduler and Lucide React bundled. No remote fonts; uses system fonts. React, React DOM and Scheduler use MIT licences; Lucide uses ISC with an MIT notice for Feather-derived icons. Full notices are in licences/.

Income, category names and amounts exist in tab memory only. Refreshing clears them. No localStorage, IndexedDB or cookies. CSV download is generated on the device using a Blob URL, then saved to the visitor’s download location. No inputs leave the device. The app makes only requests for its own HTML, JS and CSS from its static host. No API or external requests. Host access logging remains a hosting-provider matter.

Source TSX is included for review, alongside the ready-to-serve files. No server or build step needed to run.
