import { getCollection, type CollectionEntry } from "astro:content";
import { GAME_LINK_KINDS, ROUTES } from "../config/site";
import { byDateDesc } from "./format";

export type Game = CollectionEntry<"games">;

export interface GameLink {
  label: string;
  url: string;
  primary: boolean;
}

export interface GameGroup {
  title?: string;
  games: Game[];
}

/**
 * Sections of the games page, in display order. Each game lands in the first
 * group whose `match` accepts it; a group without `match` collects the rest.
 */
const GAME_GROUPS: { title?: string; match?: (game: Game) => boolean }[] = [
  { title: "Latest", match: (game) => ["claim-earth", "beltwork"].includes(game.slug) },
  { match: (game) => game.slug === "core-fantasy-arena" },
  { title: "SupremApp", match: (game) => game.data.supremapp },
  { title: "Student", match: (game) => ["cursor-machina", "rocket", "chess-mate", "escape"].includes(game.slug) },
  { title: "Other" }
];

export const gameUrl = (game: Game) => `${ROUTES.games}/${game.slug}`;

export const getGames = async () => (await getCollection("games")).sort(byDateDesc);

export const getFeaturedGames = async () => (await getGames()).filter((game) => game.data.featured);

export const groupGames = (games: Game[]): GameGroup[] => {
  const remaining = new Set(games);
  return GAME_GROUPS.map(({ title, match }) => {
    const members = games.filter((game) => remaining.has(game) && (match ? match(game) : true));
    members.forEach((game) => remaining.delete(game));
    return { title, games: members };
  }).filter((group) => group.games.length > 0);
};

/** External links in configured order; the legacy `accessUrl` comes last. */
export const getGameLinks = (game: Game): GameLink[] => {
  const links: GameLink[] = GAME_LINK_KINDS.flatMap(({ key, label, primary }) => {
    const url = game.data.links[key];
    return url ? [{ label, url, primary }] : [];
  });
  if (game.data.accessUrl) {
    links.push({
      label: game.data.accessLabel ?? "Access game",
      url: game.data.accessUrl,
      primary: !links.some((link) => link.primary)
    });
  }
  return links;
};
