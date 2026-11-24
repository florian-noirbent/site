/** Normalizes a display tag ("Claim Earth") to a stable key ("claim-earth"). */
export const slugifyTag = (tag: string) =>
  tag
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
