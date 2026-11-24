import { LINK_KINDS, type LinkKey } from "../config/site";

export interface ExternalLink {
  label: string;
  url: string;
  primary: boolean;
}

/** Links from a `links:` frontmatter object, in the order and with the labels of LINK_KINDS. */
export const configuredLinks = (links: Partial<Record<LinkKey, string>>): ExternalLink[] =>
  LINK_KINDS.flatMap(({ key, label, primary }) => {
    const url = links[key];
    return url ? [{ label, url, primary }] : [];
  });

/** Appends an extra link (store, legacy access link), primary only when no other link is. */
export const withExtraLink = (links: ExternalLink[], url: string | undefined, label: string): ExternalLink[] =>
  url ? [...links, { label, url, primary: !links.some((link) => link.primary) }] : links;

/** Puts a main link (e.g. the store page) first as the only primary button. */
export const leadWith = (url: string | undefined, label: string, links: ExternalLink[]): ExternalLink[] =>
  url ? [{ label, url, primary: true }, ...links.map((link) => ({ ...link, primary: false }))] : links;
