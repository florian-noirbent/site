import { defineCollection, z } from "astro:content";
import { BLOG_TYPE_KEYS, GAME_LINK_KINDS, type GameLinkKey } from "./config/site";

const assets = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cardImage: z.string().optional(),
    tags: z.array(z.string()).min(1),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    status: z.enum(["shipped", "in-progress", "planned"]),
    storeUrl: z.string().url().optional(),
    storeLabel: z.string().optional()
  })
});

/** One optional URL per configured link kind (play, itch, source, ...). */
const gameLinks = z
  .object(
    Object.fromEntries(GAME_LINK_KINDS.map(({ key }) => [key, z.string().url().optional()])) as Record<
      GameLinkKey,
      z.ZodOptional<z.ZodString>
    >
  )
  .strict()
  .default({});

const games = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cardImage: z.string(),
    date: z.coerce.date(),
    status: z.enum(["released", "unreleased"]),
    platforms: z.array(z.string()).min(1),
    engine: z.string(),
    genre: z.string(),
    cardStyle: z.enum(["cover", "icon"]).default("cover"),
    releaseNote: z.string().optional(),
    links: gameLinks,
    /** Generic external link, for games without a play/itch/source link. */
    accessUrl: z.string().url().optional(),
    accessLabel: z.string().optional(),
    highlighted: z.boolean().default(false),
    featured: z.boolean().default(false),
    supremapp: z.boolean().default(false)
  })
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    type: z.enum(BLOG_TYPE_KEYS),
    /** Free-form tags. A tag matching a game's slug (e.g. "Claim Earth") links the post to that game. */
    tags: z.array(z.string()).min(1),
    cardImage: z.string().optional(),
    /** "contain" shows the whole image (diagrams), "cover" fills the card (artwork). */
    cardFit: z.enum(["cover", "contain"]).default("cover"),
    /** Where the same article is also published (shown as a link, not used as canonical). */
    crossPostUrl: z.string().url().optional(),
    draft: z.boolean().default(false)
  })
});

export const collections = { assets, games, blog };
