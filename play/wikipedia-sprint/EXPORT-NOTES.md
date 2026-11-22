# Wikipedia Sprint export

The existing HTML, CSS and JavaScript are preserved with local relative asset paths and local home navigation. Source, contributor/history and CC BY-SA licence links remain. CSP allows JavaScript and styles only from the static host and connections only to the English Wikipedia API. No third-party images, fonts, scripts or embedded media are loaded.

## Data note

The start and target titles, article cache/content, timer, route, backtracking stack, move count and result are held in tab memory only. Reloading or closing the page clears the run. No localStorage, sessionStorage, IndexedDB, cookies, save downloads or import/export features exist. No Wikipedia request is made before the visitor chooses **Load live challenge**. Loading a challenge calls `https://en.wikipedia.org/w/api.php` for random article titles and parsed article content/links. Following an in-game article link calls that same API with the selected title. Requests explicitly omit credentials and use `no-referrer`; Wikipedia still receives the visitor's IP/network information, normal browser request headers and the requested parameters/article titles. The complete route is not sent as a single payload, but the sequence of title requests can reveal the route to Wikipedia and network observers. Displayed article content is sanitised to text and safe local UI elements, without images or other embedded requests. Clicking source, history or licence links opens the relevant Wikipedia or Creative Commons website, which then receives normal navigation information. App files load from the chosen static host. No analytics or tracking code is included.

## Content and licences

Wikipedia article text and adaptations retain source/contributor links and the CC BY-SA 4.0 link, as in the original game. Articles are fetched live; they are not included in this export. Individual Wikipedia material may have additional attribution or licence information on its source page. The remaining game code is original project content; no new public licence is granted by the export. System fonts are used, with no external runtime libraries.

## Checks

JavaScript syntax checking passed. Relative HTML/CSS assets resolve. Static text scan found no private file paths, email addresses, secret patterns or private hosted-domain references. The only application fetch endpoint is the English Wikipedia API. Browser/live-network results are recorded in the top-level README. Successful live play depends on Wikipedia availability and the visitor's network.
