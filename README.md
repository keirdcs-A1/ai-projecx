# AI ProjecX

The public portfolio of Keir Thompson: software, games and experiments built with AI coding agents.

Live site (once GitHub Pages is switched on): https://keirdcs-a1.github.io/ai-projecx/

## What is in here

- `index.html`, `about.html`, `archive.html`, `trust.html`, `privacy.html`, `terms.html`, `accessibility.html`: the site pages.
- `projects/`: one page per project.
- `play/` and `tools/`: standalone browser apps (Evolution Sandbox, Vaelor, AI Lab Tycoon, Wikipedia Sprint, Tidemark, Monthly Budget Planner, Iran Situation Monitor). Each has `EXPORT-NOTES.md` with its data notes and licences.

Everything is plain static files: no build step, no server, no accounts, cookies or analytics.

## Preview locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000/. The apps need a local server like this; double-clicking their files will not fully work.

## Iran Situation Monitor

The monitor shows a saved snapshot (`tools/iran-monitor/snapshot.json`). It does not update itself. `tools/iran-monitor/examples/snapshot-pages.yml` is an example scheduled job and is not switched on.
