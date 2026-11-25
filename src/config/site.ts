/**
 * Shared site configuration. Pages, components and content schemas read their
 * labels, ordering and limits from here instead of hard-coding them.
 */

/**
 * Two names, one person. `name` (with the photo) leads on the pages recruiters
 * and partners read: home, About, assets. `handle` (with the mecha) leads on
 * the pages players share: games, blog, art. See the `persona` prop of
 * BaseLayout and the Byline component.
 */
export const SITE = {
  name: "Florian Noirbent",
  handle: "Titan",
  /** Both, for the home title, the footer and search/social site name. */
  fullName: "Florian Noirbent (Titan)",
  avatar: "/images/avatar.jpg",
  portrait: "/images/portrait.jpg",
  handleAvatar: "/images/titan-avatar.jpg",
  handleArtwork: "/images/mecha-signature.jpg",
  url: "https://florian-noirbent.nofl.uk",
  locale: "en-US"
} as const;

/** Header navigation. The logo links home; contact lives on About and in the footer. */
export const NAV_LINKS = [
  { href: "/games", label: "Games" },
  { href: "/assets", label: "Assets" },
  { href: "/blog", label: "Blog" },
  { href: "/art", label: "Art" },
  { href: "/about", label: "About" }
] as const;

/**
 * Ways to reach me, in display order: all of them on About and in the footer,
 * those marked `intro` also under the home page introduction.
 */
export const CONTACT_LINKS = [
  { label: "Email", text: "florian.noirbent@gmail.com", href: "mailto:florian.noirbent@gmail.com", intro: true },
  { label: "GitHub", text: "github.com/florian-noirbent", href: "https://github.com/florian-noirbent", intro: true },
  { label: "itch.io", text: "titan-koyos.itch.io", href: "https://titan-koyos.itch.io", intro: true },
  { label: "LinkedIn", text: "linkedin.com/in/florian-noirbent", href: "https://www.linkedin.com/in/florian-noirbent/", intro: true },
  { label: "Discord", text: "titan8190", href: "https://discordapp.com/users/titan8190", intro: false }
] as const;

/**
 * Color theme. "system" follows the OS/browser setting live and is the default
 * (nothing stored); "light" and "dark" are stored under `storageKey`.
 */
export const THEME = {
  storageKey: "theme",
  options: [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" }
  ]
} as const;

export const ROUTES = {
  games: "/games",
  blog: "/blog",
  assets: "/assets",
  about: "/about",
  contact: "/about#contact"
} as const;

/**
 * Home page. The hero shows the most recent game with `featured: true`;
 * `moreGames` lists the slugs shown in the row below it, in order.
 */
export const HOME = {
  recentPostCount: 3,
  moreGames: ["beltwork", "core-fantasy-arena", "hopboy"],
  /** Game whose App Store ranking is quoted in the proof strip. */
  proofGame: "hopboy"
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
 * External links a game or an asset can expose, in display order. The key is
 * the property name under `links` in the frontmatter.
 */
export const LINK_KINDS = [
  { key: "play", label: "Play", primary: true },
  { key: "itch", label: "itch.io", primary: false },
  { key: "source", label: "GitHub source", primary: false }
] as const;

export type LinkKey = (typeof LINK_KINDS)[number]["key"];
