/**
 * Shared site configuration. Pages, components and content schemas read their
 * labels, ordering and limits from here instead of hard-coding them.
 */

export const SITE = {
  name: "Titan",
  url: "https://titan.nofl.uk",
  locale: "en-US"
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/assets", label: "Assets" },
  { href: "/games", label: "Games" },
  { href: "/blog", label: "Blog" },
  { href: "/art", label: "Art" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
] as const;

export const ROUTES = {
  games: "/games",
  blog: "/blog",
  assets: "/assets"
} as const;

export const HOME = {
  recentPostCount: 3
} as const;

/** Blog post types: the key is stored in frontmatter, the value is displayed. */
export const BLOG_TYPES = {
  technical: "Technical",
  "game-design": "Game design",
  devlog: "Devlog",
  postmortem: "Postmortem"
} as const;

export type BlogType = keyof typeof BLOG_TYPES;
export const BLOG_TYPE_KEYS = Object.keys(BLOG_TYPES) as [BlogType, ...BlogType[]];

/** Card images: used when a post has no explicit `cardImage` (see `postCardImage`). */
export const BLOG_CARD = {
  defaultImage: "/images/blog/default-card.svg",
  /** Placeholder shown in articles for lost images; never used as a card. */
  missingImage: "/images/blog/missing-image.svg",
  youtubeThumbnail: (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
} as const;

/** Query parameters understood by the blog index filters. */
export const BLOG_FILTER_PARAMS = {
  tag: "tag",
  type: "type",
  from: "from",
  to: "to",
  sort: "sort"
} as const;

/**
 * External links a game can expose, in display order. The key is the property
 * name under `links` in a game's frontmatter.
 */
export const GAME_LINK_KINDS = [
  { key: "play", label: "Play", primary: true },
  { key: "itch", label: "itch.io", primary: false },
  { key: "source", label: "GitHub source", primary: false }
] as const;

export type GameLinkKey = (typeof GAME_LINK_KINDS)[number]["key"];
