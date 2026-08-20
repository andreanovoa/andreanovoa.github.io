# Nóvoa Lab website

Source for <https://sciml-da.github.io/> — the group website of the
SciML-DA lab (Aeronautics Department & I-X Institute, Imperial College London).

Built with [Hugo](https://gohugo.io/) (extended, v0.152.1) using custom layouts —
no external theme. Pushing to `main` builds and deploys via GitHub Pages
(`.github/workflows/hugo.yml`).

## Local preview

```bash
hugo server
```

## Where things live

| Path | Contents |
| --- | --- |
| `data/publications.yml` | every publication: metadata, APA citation, BibTeX, DOI/arXiv/code links |
| `data/people.yml` | current members and alumni |
| `data/code.yml` | GitHub orgs, repositories, Zenodo records, datasets, collaborations |
| `content/publications/` | per-paper summary pages (page bundles with a cover image) |
| `content/research/` | the research-theme pages linked from the home page cards |
| `layouts/` | all templates and partials |
| `assets/css/main.css` | the entire stylesheet |
| `static/img/` | people photos and publication banners |

## Adding a publication

1. Add an entry to `data/publications.yml`. It appears in the table on
   `/publications/` automatically.
2. For a summary page, also add `cover:` and `blurb:` to that entry, drop the
   banner in `static/img/pubs/`, and create `content/publications/<key>/index.md`
   using an existing bundle as a template. The `key:` field is what links the
   two together.

## Upstream

This site is maintained as the `lab/` subtree of
[andreanovoa/andreanovoa-website](https://github.com/andreanovoa/andreanovoa-website)
and mirrored here with `git subtree push --prefix=lab`.
