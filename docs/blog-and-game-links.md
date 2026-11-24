# Blog posts and game links

Labels, routes, post types and limits live in `src/config/site.ts`. Content
schemas are in `src/content.config.ts`; data helpers are in `src/lib/`.

## Adding a blog post

1. Create `src/content/blog/<slug>.md`. The file name becomes the URL `/blog/<slug>`.
2. Put images in `public/images/blog/<slug>/` and reference them with absolute paths.
3. Fill in the frontmatter:

```yaml
---
title: "Post title"
description: "One or two sentences shown on cards and in meta tags."
date: 2026-11-23
type: technical          # a key of BLOG_TYPES in src/config/site.ts
tags:
  - Claim Earth          # a tag matching a game slug links the post to that game
  - Godot
cardImage: /images/blog/<slug>/cover.svg   # optional
cardFit: contain         # optional: "contain" for diagrams, "cover" (default) for artwork
crossPostUrl: https://…  # optional: where the article is also published
draft: false             # optional: true hides the post
---
```

When `cardImage` is omitted, the card (and the social preview) falls back to
the thumbnail of the post's first YouTube video, then to its first image hosted on the site, then
to the default card set in `BLOG_CARD` (`src/config/site.ts`). The
"Image not recovered" placeholder is never used as a card.

Posts are sorted newest first. The home page shows the latest
`HOME.recentPostCount` posts. The blog index filters by tag (an article must have every
selected tag; the tag list is in an expander, collapsed by default), type and
date range on the client, and keeps the filters in the URL (`/blog?tag=claim-earth`).

## Tags

Tags in frontmatter are free-form, but the blog only shows canonical tags from
the taxonomy in `src/config/tags.ts`:

- `TAGS` lists each canonical tag under a group (Topics, Engines & tools,
  Languages, Platforms & genres, Projects, Context). `aliases` fold other
  spellings or narrower tags into it (`HLSL` and `Cg` show as `Shaders`,
  `Ludum Dare` as `Game jam`).
- `HIDDEN_TAGS` are dropped from filters, cards and article pages.
- `TAG_UI` sets how many tags each filter group shows before "+N more", and how
  many tags a card shows.
- A tag that is in none of these lists still works (under Topics) but logs a
  build warning: add it to the taxonomy.

Old links that use an alias (`/blog?tag=ludum-dare`) select the canonical tag.

## Linking posts to a game

A post appears in a game's "Blog posts" section when one of its tags matches the
game's slug once normalized: the tag `Claim Earth` matches the game
`src/content/games/claim-earth.md`. No other configuration is needed.

## Game links

Game pages show one button per URL under `links`, in the order and with the
labels defined by `LINK_KINDS` (`src/config/site.ts`). Assets use the same
`links:` field; their `storeUrl` stays the main button:

```yaml
links:
  play: https://…    # primary "Play" button
  itch: https://…    # itch.io page
  source: https://…  # GitHub source
```

Older entries can keep `accessUrl` / `accessLabel`; it is shown after the
configured links. To add a new kind of link, add it to `LINK_KINDS`.

## Games page groups

The sections of `/games` are defined by `GAME_GROUPS` in `src/lib/games.ts`. A
game lands in the first group that matches it; the last group collects the rest.
Set `featured: true` on a game to show it in the home page's "Featured Games".
