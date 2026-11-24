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
`HOME.recentPostCount` posts. The blog index filters by tag, type and date range
on the client, and keeps the filters in the URL (`/blog?tag=claim-earth`).

## Linking posts to a game

A post appears in a game's "Blog posts" section when one of its tags matches the
game's slug once normalized: the tag `Claim Earth` matches the game
`src/content/games/claim-earth.md`. No other configuration is needed.

## Game links

Game pages show one button per URL under `links`, in the order and with the
labels defined by `GAME_LINK_KINDS`:

```yaml
links:
  play: https://…    # primary "Play" button
  itch: https://…    # itch.io page
  source: https://…  # GitHub source
```

Older entries can keep `accessUrl` / `accessLabel`; it is shown after the
configured links. To add a new kind of link, add it to `GAME_LINK_KINDS`.

## Games page groups

The sections of `/games` are defined by `GAME_GROUPS` in `src/lib/games.ts`. A
game lands in the first group that matches it; the last group collects the rest.
Set `featured: true` on a game to show it in the home page's "Featured Games".
