import { getCollection, type CollectionEntry } from "astro:content";
import { BLOG_CARD, BLOG_FILTER_PARAMS, BLOG_TYPES, ROUTES } from "../config/site";
import { byDateDesc } from "./format";
import type { Game } from "./games";
import { TAG_GROUPS, type TagGroupKey } from "../config/tags";
import { canonicalTagKey, resolveTags, slugifyTag, type TagInfo } from "./tags";

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

/** Blog index pre-filtered on one tag, e.g. `/blog?tag=claim-earth`. Aliases link to their canonical tag. */
export const tagUrl = (tag: string) =>
  `${ROUTES.blog}?${BLOG_FILTER_PARAMS.tag}=${encodeURIComponent(canonicalTagKey(tag))}`;

/** The post's canonical tags (aliases folded, hidden tags removed), most specific first. */
export const postTags = (post: Post): TagInfo[] => resolveTags(post.data.tags);

/** Published posts, most recent first. */
export const getPosts = async () =>
  (await getCollection("blog", (post) => !post.data.draft)).sort(byDateDesc);

export const getRecentPosts = async (count: number) => (await getPosts()).slice(0, count);

/** True when the post carries the tag, either as written or through its canonical tag. */
export const postHasTag = (post: Post, tag: string) => {
  const key = slugifyTag(tag);
  return post.data.tags.some((postTag) => slugifyTag(postTag) === key) || postTags(post).some((t) => t.key === key);
};

/** Posts tagged with the game's name (matched through its slug). */
export const getPostsForGame = async (game: Game) =>
  (await getPosts()).filter((post) => postHasTag(post, game.slug));

export interface TagCount extends TagInfo {
  count: number;
}

export interface TagGroup {
  key: TagGroupKey;
  label: string;
  tags: TagCount[];
}

/** Canonical tags used by the posts, grouped as in the taxonomy and sorted by post count. */
export const getTagGroups = (posts: Post[]): TagGroup[] => {
  const counts = new Map<string, TagCount>();
  for (const post of posts) {
    for (const tag of postTags(post)) {
      const entry = counts.get(tag.key) ?? { ...tag, count: 0 };
      entry.count += 1;
      counts.set(tag.key, entry);
    }
  }
  return TAG_GROUPS.map(({ key, label }) => ({
    key,
    label,
    tags: [...counts.values()]
      .filter((tag) => tag.group === key)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  })).filter((group) => group.tags.length > 0);
};
