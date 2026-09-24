# AGENTS rules

This file provides guidance to AI harness and agents when working with code in this repository.

## Project Overview

Personal blog at [int3ractive.com](https://int3ractive.com), built with **Eleventy (11ty) v2** static site generator. Templates use **Nunjucks** (`.njk`), content is written in **Markdown**, and styles are compiled from **Sass/SCSS**.

## Commands

```shell
npm install        # Install dependencies
npm start          # Dev server with Sass watch + Eleventy watch + live reload
npm run build      # Production build: sass + eslint + eleventy
npm test           # Run ESLint only
```

- Dev server runs at `http://localhost:8080` with incremental builds.
- `ELEVENTY_ENV=development` is set during `npm start`/`npm run dev`; HTML minification is disabled in dev mode.
- `_site/` is the output directory (deleted on `npm start` via `prestart`).

## Architecture

### Content Pipeline

- **Posts**: `posts/YYYY/*.md` → compiled to `/blog/YYYY/slug/` URLs
- **Pages**: `*.md` / `pages/*.md` → compiled to their respective URLs
- **Writing**: `writing/*.md` → separate long-form writing section
- **Drafts**: `_drafts/` is ignored by Eleventy (`.eleventyignore`); front matter `draft: true` also suppresses a post from collections

### Eleventy Configuration (`eleventy.config.js`)

- Custom filters in `_11ty/filters/` (date formatting, markdown rendering, tag utilities)
- Custom transforms in `_11ty/transforms/` (HTML minification in prod, parse transform)
- Layout aliases: `home`, `post`, `page`, `archive` → map to `_includes/layouts/*.njk`
- Two collections: `posts` (all live posts reversed) and `postFeed` (limited to `site.maxPostsPerPage`)
- `slides/` is a **git submodule** passed through as-is to output

### Templates & Styles

- Layouts in `_includes/layouts/`, partials in `_includes/partials/`, macros in `_includes/macros/`
- Sass entry point: `_includes/scss/global.scss` → compiled to `_site/css/global.css`
- Site-wide data (name, author, social handles, analytics IDs) in `_data/site.json`

### URL Scheme

```
/blog/              → all posts
/blog/YYYY/         → posts by year
/blog/tags/TAG/     → posts by tag
/about/             → bio page
/speaking/          → speaking page
/slides/            → slides submodule
```

## Post Front Matter

```yaml
title: Post title          # required — becomes the h1
tags: [tag1, tag2]         # single-line list (tabs used for indentation)
metaTitle: ...             # optional, overrides <title> and og:title
metaDesc: ...              # optional meta description
image: ...                 # optional og:image URL
coverImage: ...            # optional cover photo (also used as og:image if image not set)
coverCaption: ...          # optional caption for cover photo
updated: YYYY-MM-DD        # optional, displays updated date
draft: true                # keeps post out of collections during build
```

## Markdown

Uses `markdown-it` with `markdown-it-attrs` plugin. Custom attributes can be applied to generated HTML elements using `{: ... }` syntax (similar to Ruby Kramdown):

```markdown
![Alt text](image.png){: .my-class}
```
