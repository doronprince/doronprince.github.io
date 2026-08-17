# doronlintonprince.me

Personal portfolio for **Doron Linton Prince** — AI/ML engineer.

Live at **[doronlintonprince.me](https://doronlintonprince.me)**, served by GitHub Pages
from the `main` branch of this repository.

## Structure

```
index.html                        the entire site (single page)
404.html                          custom not-found page
assets/styles.css                 all styling
assets/main.js                    animations, project data, interactions
CNAME                             custom domain binding — do not edit or delete
.nojekyll                         serve files as-is, skip Jekyll processing
```

## Editing

No build step, no dependencies. Edit the files, commit, push to `main` —
GitHub Pages redeploys in about a minute.

**To add or change a project:** edit the `PROJECTS` array near the top of
`assets/main.js`. Each entry takes a `title`, `sub`, `desc`, `stack` array,
`tags` array (`ai`, `cv`, `robotics`, `fullstack`, `creative`), an optional
`badge`, and a `url` (use `null` for private repositories).

**To change colours:** edit the CSS custom properties in the `:root` block at
the top of `assets/styles.css`.

**The résumé is deliberately not hosted here.** Anything served from this repo
is publicly downloadable by anyone, so the site links to a "Request résumé"
mailto instead. Don't commit the PDF back in unless you want it public.

## Local preview

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

> ⚠️ Never delete or modify `CNAME`. It binds the custom domain; removing it
> reverts the site to `doronprince.github.io`.
