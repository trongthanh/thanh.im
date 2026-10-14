## Source code of my blog at [int3ractive.com](https://int3ractive.com)


**Note**: All blog posts remain **copyrighted** by Tran Trong Thanh (int3ractive.com).

My labs site is moved [over here](https://github.com/trongthanh/labs.int3ractive.com), with licenses as per each folder.

## To preview and build locally

```shell
$ npm install
$ npm start
```

## Independent static sites

Standalone sites live in their own repositories and are included here as Git submodules under `sites/`. `static-sites.json` defines each site's install/build commands; `npm run build` builds Eleventy first, then places each app in `_site/<path>` for the single Netlify deployment. Netlify publishes `_site` as the site root.

Initialize submodules after cloning with `git submodule update --init --recursive`. To publish an app update, check out the desired commit in its submodule and commit the updated submodule pointer in this repository. New apps should use their URL path as the build base (for example, `/city-weather/`) so assets resolve correctly when hosted below the domain root.

## Post's Front Matter Guide

- `title`: Post title, `h1` of the post page
- `tags`: A one-line list of tags (I'm indenting with tabs so multiline yaml list is not possible)
- `metaTitle`: Optional, set to override the `<title>` and `og:title`  at page's metadata
- `metaDesc`: Optional, set for meta descriptions
- `image`: Optional, set for `og:image` and social network sharing image
- `coverImage`: Optional, set for the post's cover photo, will also be used as social image if `image` is not provided.
- `coverCaption`: Optional, set the caption for post's cover photo
- `updated`: Optional, set to display an updated date

Some legacy front matter fields not currently in used but may be in the future:

- `author`: just me as author
- `subtitle`: previous theme has subtitle below title
- `cover-darken`: used to applied CSS darken overlay to cover photo, it's not needed anymore.

## The Theme: A modified Hylia 11ty blog starter

This new blog theme is based on [Hylia starter kit for Eleventy](https://github.com/hankchizljaw/hylia) (archived).

## CHANGELOG

- Again, change to use serif (**Lora**) as body text font and sans as heading / title font.
- Added `markdown-it-attrs` and use `{: ... }` delimiters (similar to Ruby Kramdown) to add custom attributes to generated HTML elements.
- Added **all tags** page and **other tags** under posts list by tag.
- Added archive view by year at `/blog/YYYY/` URL
- Re-configured markdown filter to enable smart quotes
- Fix few rendering issues

## New URL scheme from my previous Jekyll-based site:

```
int3ractive.com              -> Home page
int3ractive.com/blog/        -> Blog page containing all posts (was archive/)
int3ractive.com/blog/2019/   -> Posts list filtered for 2019 (new)
int3ractive.com/blog/2019/nhung-dieu-can-biet-ve-ecmascript/ -> post page
int3ractive.com/blog/tags/   -> all tags available (new)
int3ractive.com/blog/tags/javascript/ -> Posts list filtered by a tag (new)
int3ractive.com/about/       -> my full bio page (remove .html)
int3ractive.com/speaking/    -> speaking page (remove .html)
int3ractive.com/nau-tab/     -> nau-tab project pages (remove .html)
int3ractive.com/open-source/ -> open source page (remove .html)
int3ractive.com/slides/      -> map to all slides repo (WIP)
```

---

© 2015-current Tran Trong Thanh. All rights reserved.
