import { getCollection, type CollectionEntry } from "astro:content";
import { BLOG_CARD, BLOG_FILTER_PARAMS, BLOG_TYPES, ROUTES } from "../config/site";
import { byDateDesc } from "./format";
import type { Game } from "./games";
import { slugifyTag } from "./tags";

export type Post = CollectionEntry<"blog">;

export const postUrl = (post: Post) => `${ROUTES.blog}/${post.slug}`;

export const postTypeLabel = (post: Post) => BLOG_TYPES[post.data.type];

const YOUTUBE_EMBED = /youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/;
const MARKDOWN_IMAGE = /!\[[^\]]*\]\(([^)\s]+)\)/g;

export interface CardImage {
  src: string;
  fit: "cover" | "contain";
}

/**
 * Image shown on a post's card and in its social preview, in order of
 * preference: the frontmatter `cardImage`, the thumbnail of the first YouTube
 * video, the first image of the article hosted on this site (external images
 * may disappear), then the default blog card.
 */
export const postCardImage = (post: Post): CardImage => {
  if (post.data.cardImage) return { src: post.data.cardImage, fit: post.data.cardFit };
  const body = post.body ?? "";
  const video = body.match(YOUTUBE_EMBED)?.[1];
  if (video) return { src: BLOG_CARD.youtubeThumbnail(video), fit: "cover" };
  const image = [...body.matchAll(MARKDOWN_IMAGE)].map((match) => match[1]).find((src) => src.startsWith("/") && src !== BLOG_CARD.missingImage);
  if (image) return { src: image, fit: "cover" };
  return { src: BLOG_CARD.defaultImage, fit: "cover" };
};

/** Blog index pre-filtered on one tag, e.g. `/blog?tag=claim-earth`. */
export const tagUrl = (tag: string) => `${ROUTES.blog}?${BLOG_FILTER_PARAMS.tag}=${encodeURIComponent(slugifyTag(tag))}`;

/** Published posts, most recent first. */
export const getPosts = async () =>
  (await getCollection("blog", (post) => !post.data.draft)).sort(byDateDesc);

export const getRecentPosts = async (count: number) => (await getPosts()).slice(0, count);

export const postHasTag = (post: Post, tag: string) => {
  const key = slugifyTag(tag);
  return post.data.tags.some((postTag) => slugifyTag(postTag) === key);
};

/** Posts tagged with the game's name (matched through its slug). */
export const getPostsForGame = async (game: Game) =>
  (await getPosts()).filter((post) => postHasTag(post, game.slug));

/** Every tag used by published posts, with its key and post count. */
export const getTagIndex = (posts: Post[]) => {
  const tags = new Map<string, { key: string; label: string; count: number }>();
  for (const post of posts) {
    for (const label of post.data.tags) {
      const key = slugifyTag(label);
      const entry = tags.get(key) ?? { key, label, count: 0 };
      entry.count += 1;
      tags.set(key, entry);
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
};
