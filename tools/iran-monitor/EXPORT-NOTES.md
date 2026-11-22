# Iran Situation Monitor: standalone static export

## Status

Partly works. The original React monitor's time/topic/publisher/source-type/relevance/search filters, sorting, topic/publisher/timeline grouping, similar-headline grouping, automatic briefing and source-health directory are preserved. Live on-demand server RSS retrieval has been replaced with a local static `snapshot.json`. The browser has no feed-fetching proxy. This is an actual retrieved snapshot, not illustrative news data.

The delivered snapshot was built at **2026-11-22 00:45:04 UTC**. Nineteen feeds retrieved successfully; Human Rights Watch was unavailable. Four permitted matching headlines were published: three from The Jerusalem Post and one from UK FCDO. Other publishers' matching headlines were withheld under the conservative reuse policy. The default 24-hour time filter will show fewer items as they age; the seven-day filter exposes older eligible items. An empty view is not an all-clear.

No schedule or deployment was activated. The delivered file remains fixed until an operator runs the generator again and republishes the output. The page shows its snapshot timestamp down to seconds, distinguishes feed failures and stale copies, warns when it is over 20 minutes old, and clearly labels the snapshot mechanism. “Reload snapshot” downloads the current static file; it cannot fetch feeds or trigger a build. Source health reflects the build time, not the time the visitor opens the page.

## Recommended hosting option

Use **(a), a scheduled static snapshot**, for this portfolio.

| Option | Pros | Cons |
| --- | --- | --- |
| (a) Scheduled snapshot | Works on GitHub Pages and other static hosts; visitors contact only the portfolio host; no public feed proxy to maintain; one shared, inspectable dataset; predictable request volume; source failures and snapshot age can be shown explicitly. | Updates only when the job succeeds; scheduled jobs can be delayed; deployment is required for each update; rights still need checking; narrower default headline coverage; browser time filters continue ageing an old snapshot. |
| (b) Small serverless function | Can refresh more often/on demand; shared cache, timeouts and per-source failure handling; no browser RSS CORS problem. | Adds a backend, hosting/platform dependency, operational monitoring, rate limits and abuse controls; visitors make requests to the function host; still needs publisher permissions; it would not satisfy a strictly static-only delivery by itself. |

Both options need the same rights review. A serverless proxy does not grant permission to republish publishers' content.

## Rebuilding and example schedule

Run `python3 scripts/build_snapshot.py` inside this app folder, using Python 3.11 or later with ordinary HTTPS internet access. The generator uses only Python's standard library. It attempts the 20 fixed RSS/Atom addresses in `sources.json`, with five concurrent workers, 12-second request timeouts, bounded redirects, explicit publisher-host allowlists, a 1 MB feed limit, no cookies, no arbitrary URL inputs and rejection of DTD/entity declarations. It strips common tracking query parameters from published article URLs. Article descriptions are used in memory for relevance/topic matching and then discarded; no article bodies or images are downloaded. Only source-health counts and approved headline/link records are written.

The generator replaces the snapshot atomically. On a failed source, permitted headline records from a previous local snapshot may remain for up to 24 hours, labelled as stale. Reports older than seven days, more than five minutes in the future or without explicit timezones are excluded. On a clean scheduled runner there is no previous generated snapshot unless the repository already contains one, so cross-run stale retention is limited to the snapshot checked out with the source. The build prints only publisher IDs and counts, not raw exceptions or machine paths.

`examples/snapshot-pages.yml` is an **inert example**. In a repository with `portfolio-apps` at its root, copy it into `.github/workflows/` to rebuild hourly and deploy the whole `portfolio-apps` directory using GitHub Pages Actions. Set Pages to GitHub Actions in repository settings. Review the deployment path before activating: the example publishes that directory as the complete Pages site and must be adapted if the merged portfolio homepage should also be included. No credentials or personal account details are embedded. GitHub's own Actions manage their short-lived runtime credentials. The workflow has not been run on GitHub or end-to-end deployment-tested.

Run `python3 scripts/test_snapshot.py` for three offline parser tests. They passed: safe URLs/tracking removal, RSS relevance and invalid/future timestamps, and Atom alternate links/update timestamps. A real network build completed for all 20 sources with 19 successes and one failure. Browser testing is recorded in the top-level README.

## Exact visitor data note

The monitor keeps filters, search text, sort/group choices, displayed headlines and briefing state **in tab memory only**. Reloading resets them. It uses no localStorage, sessionStorage, IndexedDB, cookies, save files, imports or downloads. Ordinary browser HTTP caches may retain the app's static files; snapshot requests use `cache: no-store` and `credentials: omit`.

Loading the app requests `index.html`, `app.css`, `app.js` and `snapshot.json` from the same static host/subfolder. No third-party requests occur automatically. Search/filter text is never put into a URL or sent to a publisher, analytics service or AI provider. The static host still receives the visitor's IP address, user agent and requested paths as part of normal HTTP delivery and may keep its own access logs. Clicking an article, publisher or licence link opens that external site; the browser then sends ordinary network information to that site, governed by its own policies. External news links use `noreferrer`; the document also sets `no-referrer`.

Separately, an operator running the generator sends requests from the build machine to the feed domains listed in `sources.json` and any approved redirects on those same declared feed hosts. Publishers see the build machine's IP address and the fixed `StaticFeedSnapshot/1.0` user agent, not visitor data. GitHub Actions would run those requests on GitHub infrastructure. No visitor filters, budgets, game saves or identity reach the build job.

## Content and licences

The original project's monitor logic and styling have been adapted locally. React 19.2.6, React DOM 19.2.6 and Scheduler 0.27.0 are bundled under MIT; Lucide React 1.31.0 icons use ISC (with the included MIT notice for Feather-derived icons). Full notices are in `licences/`. No fonts are downloaded: the app uses the visitor's available Arial/Helvetica/system monospace and Georgia/Times fallbacks. The strict meta CSP allows same-origin scripts, CSS and snapshot requests; it forbids remote scripts, objects, forms and base URL changes. A host can add `frame-ancestors 'none'` as an HTTP header if needed because that directive cannot be enforced in a meta tag.

All 20 publishers and their checked reuse decisions are in [FEED-TERMS.md](./FEED-TERMS.md). FCDO material is Crown copyright under OGL v3.0; the page's method section credits that licence. Jerusalem Post headlines link to and identify their publisher. No full articles, feed descriptions, third-party image assets, tracking pixels or remote scripts are bundled.

## Remaining limits

The public example has much narrower headline coverage than the private 20-source reader because public reuse rights have not been established for 18 feeds. Publisher terms can change. Several terms pages were blocked/unavailable to the research tool and are explicitly marked unknown. No professional legal clearance, publisher notification, external licence or permission request has been obtained. The source list remains exactly the original 20 feeds; a failed URL is reported rather than silently replaced. No changes were made to published Sites or original folders.
