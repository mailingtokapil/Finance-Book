# Finance Book

Front-end prototype for the vehicle finance / EMI collection console. Static
site, no build step — open `index.html` in a browser and it works.

## Structure

```
index.html        shell page, links css/style.css and js/script.js
css/style.css      all styling
js/script.js       all front-end JS — data, views, and the router in one file
```

`script.js` is organized top to bottom as: mock data → helpers/render
functions per screen → router + boot. Everything's just plain global
functions/consts, no bundler, no modules — easiest thing that could work
for a prototype this size.

## Running it locally

No build step, no dependencies to install. Two options:

**Option 1 — just open the file**
Double-click `index.html`, or open it directly in a browser. Needs an
internet connection for the fonts, Font Awesome and Chart.js (all loaded
from CDN).

**Option 2 — serve it** (avoids any local-file quirks in some browsers)
```bash
# from the project root
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

```bash
# 1. create a new repo on GitHub (skip the README/gitignore/license options),
#    then point this local repo at it:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main

# 2. on GitHub: Settings → Pages → Source → "Deploy from a branch"
#    → Branch: main, Folder: / (root) → Save
```

GitHub will publish the site at:
`https://<your-username>.github.io/<repo-name>/`

It usually takes a minute or two to go live after the first push — check
the Pages tab in Settings for the exact URL and deployment status.

## Notes / known gaps

- Data is all in-memory mock data in `js/script.js`. Nothing persists on
  refresh — there's no backend yet.
- New Finance / New Account / Settings forms show a toast on submit but
  don't actually write anywhere.
- Charts screen needs Chart.js to have loaded before it's clicked —
  fine in practice since it's a CDN `<script>` tag in `<head>`, just
  don't strip that tag out.
- A few report chips in the Reports menu just show a "not wired up yet"
  toast (only Balance Sheet, P&L and Day Report are actually built out).

## TODO

- [ ] Replace the mock data in `script.js` with real API calls once a backend exists
- [ ] Wire up the rest of the 50-ish reports listed in the reports menu
- [ ] Form validation on New Finance
- [ ] Pagination on the Finance's list once real record counts show up

