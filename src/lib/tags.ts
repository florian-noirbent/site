import { HIDDEN_TAGS, TAG_DISPLAY_ORDER, TAG_GROUPS, TAGS, type TagGroupKey } from "../config/tags";

/** Normalizes a display tag ("Claim Earth") to a stable URL key ("claim-earth"). */
export const slugifyTag = (tag: string) =>
  tag
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    // Keep programming languages apart: "C#" -> "c-sharp", "C++" -> "c-plus-plus".
    .replace(/#/g, "-sharp")
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export interface TagInfo {
  key: string;
  label: string;
  group: TagGroupKey;
}

/** Lookup from any spelling (canonical or alias, slugified) to its canonical tag; null when hidden. */
const lookup = new Map<string, TagInfo | null>();
for (const { key: group } of TAG_GROUPS) {
  for (const [label, definition] of Object.entries(TAGS[group])) {
    const info: TagInfo = { key: slugifyTag(label), label, group };
    for (const spelling of [label, ...(definition.aliases ?? [])]) lookup.set(slugifyTag(spelling), info);
  }
}
for (const tag of HIDDEN_TAGS) lookup.set(slugifyTag(tag), null);

/** Canonical key for any spelling, without warning (used to build links from game slugs). */
export const canonicalTagKey = (raw: string) => {
  const key = slugifyTag(raw);
  return lookup.get(key)?.key ?? key;
};

const warned = new Set<string>();

/** Canonical tag for a raw frontmatter tag, or null if the tag is hidden. */
export const resolveTag = (raw: string): TagInfo | null => {
  const key = slugifyTag(raw);
  const known = lookup.get(key);
  if (known !== undefined) return known;
  if (!warned.has(key)) {
    warned.add(key);
    console.warn(`[tags] "${raw}" is not in src/config/tags.ts; showing it under Topics.`);
  }
  return { key, label: raw, group: "topic" };
};

const displayRank = (tag: TagInfo) => TAG_DISPLAY_ORDER.indexOf(tag.group);

/** Canonical, de-duplicated tags in display order (project first, context last). */
export const resolveTags = (raws: string[]): TagInfo[] => {
  const byKey = new Map<string, TagInfo>();
  for (const raw of raws) {
    const tag = resolveTag(raw);
    if (tag && !byKey.has(tag.key)) byKey.set(tag.key, tag);
  }
  return [...byKey.values()].sort((a, b) => displayRank(a) - displayRank(b));
};

/** Every alias key mapped to its canonical key, for links using an old spelling. */
export const tagAliasMap = () =>
  Object.fromEntries([...lookup.entries()].filter(([alias, tag]) => tag && alias !== tag.key).map(([alias, tag]) => [alias, tag!.key]));
