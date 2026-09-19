/**
 * Shared EGOR catalog data.
 *
 * The lobby (Home) and the all-games catalog page both render from these
 * arrays, so the numbers on one screen never drift from the other:
 *
 *  - `games`       — the titles live on the platform right now (artwork in
 *    `client/public/games/`), in the same order the lobby prints them.
 *  - `tournaments` / `scrims` — the section 03 stadium lists.
 *  - `arenas`      — the community hubs (section 05).
 *
 * `getGameForItem` resolves a match's `game` string back to its `GameItem`
 * (exact name first, then a contains-fallback, then a neutral default) so any
 * list can print a thumbnail, tone and genre for a title.
 */

export interface GameItem {
  name: string;
  short: string;
  tone: string;
  players: string;
  icon: string;
  image: string;
  genre: string;
}

export interface MatchItem {
  title: string;
  game: string;
  status: string;
  date: string;
  teams: string;
  prize: string;
  tone: string;
  icon: string;
  image?: string;
}

export interface ArenaItem {
  name: string;
  /** Two-to-four letter code, used by the search dialog badge. */
  short: string;
  platform: string;
  category: string;
  members: string;
  desc: string;
  tone: string;
  featured?: boolean;
  logo?: string;
}

export const games: GameItem[] = [
  {
    name: "Free Fire",
    short: "FF",
    tone: "lime",
    players: "12.8k",
    icon: "◈",
    image: "games/free-fire.jpg",
    genre: "Battle Royale",
  },
  {
    name: "PUBG Mobile",
    short: "PUBG",
    tone: "blue",
    players: "8.4k",
    icon: "▦",
    image: "games/pubg-mobile.jpg",
    genre: "Battle Royale",
  },
  {
    name: "Mobile Legends",
    short: "ML",
    tone: "violet",
    players: "6.2k",
    icon: "✦",
    image: "games/mobile-legends.jpg",
    genre: "MOBA 5v5",
  },
  {
    name: "Call of Duty",
    short: "COD",
    tone: "orange",
    players: "4.9k",
    icon: "⌁",
    image: "games/call-of-duty.jpg",
    genre: "Tactical FPS",
  },
  {
    name: "Clash Royale",
    short: "CR",
    tone: "red",
    players: "3.1k",
    icon: "♜",
    image: "games/clash-royale.jpg",
    genre: "Tower Strategy",
  },
  {
    name: "Counter-Strike 2",
    short: "CS2",
    tone: "cyan",
    players: "2.7k",
    icon: "⊙",
    image: "games/counter-strike-2.jpg",
    genre: "Competitive FPS",
  },
];

export const tournaments: MatchItem[] = [
  {
    title: "بطولة للاستمتاع فقط",
    game: "Free Fire",
    status: "START SOON",
    date: "17 MAR 2026",
    teams: "01 / 40",
    prize: "0 DZD",
    tone: "lime",
    icon: "◈",
    image: "games/free-fire.jpg",
  },
  {
    title: "Killerdrk",
    game: "PUBG Mobile",
    status: "START SOON",
    date: "17 MAR 2026",
    teams: "00 / 200",
    prize: "0 DZD",
    tone: "blue",
    icon: "▦",
    image: "games/pubg-mobile.jpg",
  },
  {
    title: "Amja Championship",
    game: "Free Fire",
    status: "START SOON",
    date: "05 AUG 2026",
    teams: "00 / 90",
    prize: "1,000 DZD",
    tone: "lime",
    icon: "◈",
    image: "games/free-fire.jpg",
  },
  {
    title: "COD MOB",
    game: "Call of Duty",
    status: "FULL",
    date: "13 AUG 2026",
    teams: "32 / 32",
    prize: "0 DZD",
    tone: "orange",
    icon: "⌁",
    image: "games/call-of-duty.jpg",
  },
  {
    title: "MLBB DZ OPEN CUP",
    game: "Mobile Legends",
    status: "START SOON",
    date: "24 AUG 2026",
    teams: "16 / 32",
    prize: "25,000 DZD",
    tone: "violet",
    icon: "✦",
    image: "games/mobile-legends.jpg",
  },
  {
    title: "ROYAL CROWN SERIES",
    game: "Clash Royale",
    status: "REGISTERING",
    date: "02 SEP 2026",
    teams: "48 / 64",
    prize: "15,000 DZD",
    tone: "red",
    icon: "♜",
    image: "games/clash-royale.jpg",
  },
  {
    title: "CS2 ALGIERS MASTERS",
    game: "Counter-Strike 2",
    status: "START SOON",
    date: "18 SEP 2026",
    teams: "08 / 16",
    prize: "50,000 DZD",
    tone: "cyan",
    icon: "⊙",
    image: "games/counter-strike-2.jpg",
  },
];

export const scrims: MatchItem[] = [
  {
    title: "REFUGE ACADEMY SCRIM",
    game: "Free Fire",
    status: "FEATURED",
    date: "18 MAR 2026",
    teams: "12 / 16",
    prize: "—",
    tone: "lime",
    icon: "◈",
    image: "games/free-fire.jpg",
  },
  {
    title: "REFUGE DZ TRNG D-4",
    game: "PUBG Mobile",
    status: "LIVE NOW",
    date: "18 MAR 2026",
    teams: "18 / 20",
    prize: "—",
    tone: "blue",
    icon: "▦",
    image: "games/pubg-mobile.jpg",
  },
  {
    title: "WARZONE DZ PROTOCOL",
    game: "Call of Duty",
    status: "REGISTERING",
    date: "20 MAR 2026",
    teams: "08 / 12",
    prize: "—",
    tone: "orange",
    icon: "⌁",
    image: "games/call-of-duty.jpg",
  },
  {
    title: "MLBB DAWN SHOWDOWN",
    game: "Mobile Legends",
    status: "START SOON",
    date: "22 MAR 2026",
    teams: "06 / 08",
    prize: "—",
    tone: "violet",
    icon: "✦",
    image: "games/mobile-legends.jpg",
  },
  {
    title: "ROYAL DUEL DZ NIGHT",
    game: "Clash Royale",
    status: "FEATURED",
    date: "25 MAR 2026",
    teams: "14 / 16",
    prize: "—",
    tone: "red",
    icon: "♜",
    image: "games/clash-royale.jpg",
  },
  {
    title: "ALGIERS 5v5 PROTOCOL",
    game: "Counter-Strike 2",
    status: "START SOON",
    date: "28 MAR 2026",
    teams: "04 / 08",
    prize: "—",
    tone: "cyan",
    icon: "⊙",
    image: "games/counter-strike-2.jpg",
  },
];

/**
 * Section 05 / TOP ARENAS — all eight arenas the live lobby at
 * https://egorgaming.com/lobby prints under "Top Arenas", in its order
 * (arena ids 42, 41, 39, 34, 33, 26, 25, 24), icon for icon. `platform` and
 * `category` are the two chips each card carries upstream, and `featured`
 * follows the ★ Featured flag on arena 42, 39, 33 and 24.
 *
 * `logo` holds the arena's own emblem (alpha-cut, shipped from
 * `client/public/arenas/`); arenas without an avatar of their own render the
 * same trophy fallback the original does. The live lobby serves an avatar for
 * arena 33 too — drop it at `client/public/arenas/arena-33.webp` and add the
 * `logo` line to swap the fallback out.
 */
export const arenas: ArenaItem[] = [
  {
    name: "ALGERIAN ESPORTS FEDERATION",
    short: "AEF",
    platform: "cross platform",
    category: "organizers",
    members: "2.4k",
    desc: "Driving the future of gaming in Algeria. Official tournaments, talent, and community.",
    tone: "lime",
    featured: true,
    logo: "/arenas/arena-42.webp",
  },
  {
    name: "BLACK OPS",
    short: "BO",
    platform: "mobile",
    category: "organizers",
    members: "1.6k",
    // The upstream blurb is literally just "Yes" — the line below restates the
    // arena's own two chips (mobile / organizers) instead of printing that.
    desc: "Mobile arena run by its own organizers — scrims, brackets and daily lobbies.",
    tone: "blue",
    // No avatar upstream either — it shows the trophy fallback.
  },
  {
    name: "THE REFUGE ACADEMY",
    short: "RA",
    platform: "cross platform",
    category: "esports club",
    members: "1.8k",
    desc: "Home for ambitious players and future champions. Powered by EGOR Gaming.",
    tone: "blue",
    featured: true,
    logo: "/arenas/arena-39.webp",
  },
  {
    name: "MLBB ALGERIA",
    short: "MLBB",
    platform: "mobile",
    category: "community",
    members: "1.1k",
    desc: "Official competitive hub for Mobile Legends: Bang Bang in Algeria.",
    tone: "violet",
    // No avatar on the original either — it shows the trophy fallback.
  },
  {
    name: "ESPORT SUPER COMPETITIVE ARENA",
    short: "ESCA",
    platform: "cross platform",
    category: "community",
    members: "1.3k",
    desc: "Defining the future of Algerian competitive gaming. Standardizing excellence, elevating talent.",
    tone: "violet",
    featured: true,
  },
  {
    name: "POWER FOR KILL",
    short: "PFK",
    platform: "mobile",
    category: "organizers",
    members: "840",
    desc: "Force, strategy and intensity — a competitive, immersive mobile arena.",
    tone: "orange",
    // No avatar on the original either — it shows the trophy fallback.
  },
  {
    name: "FF DZ ESPORT",
    short: "FFDZ",
    platform: "mobile",
    category: "community",
    members: "760",
    desc: "All FF DZ Esport teams join here — the mobile community's registration hub.",
    tone: "lime",
    // No avatar on the original either — it shows the trophy fallback.
  },
  {
    name: "7OUMA ARENA",
    short: "7A",
    platform: "mobile",
    category: "organizers",
    members: "980",
    desc: "A competitive home for mobile gaming, local events, and the next generation.",
    tone: "orange",
    featured: true,
    logo: "/arenas/7ouma-arena.png",
  },
];

export const getGameForItem = (gameName: string): GameItem => {
  const normalized = gameName.toLowerCase();
  const found =
    games.find(g => g.name.toLowerCase() === normalized) ||
    games.find(g => normalized.includes(g.name.toLowerCase())) ||
    games.find(g => normalized.includes(g.short.toLowerCase()));

  return (
    found || {
      name: gameName,
      short: "DZ",
      tone: "lime",
      players: "1.0k",
      icon: "◈",
      image: "games/free-fire.jpg",
      genre: "Esports",
    }
  );
};

/**
 * True when a stadium match belongs to the given title — exact name first,
 * then the short code ("PUBG Mobile" contains "PUBG"), the same rule the
 * lobby's filter chips use, so counts on the catalog match the lobby grid.
 */
export const matchBelongsToGame = (
  match: MatchItem,
  game: GameItem
): boolean => {
  const title = match.game.toLowerCase();
  return (
    title === game.name.toLowerCase() ||
    title.includes(game.short.toLowerCase())
  );
};

/** Per-title event counts straight out of the stadium lists. */
export const gameEventCounts = (
  game: GameItem
): {
  tournaments: number;
  scrims: number;
} => ({
  tournaments: tournaments.filter(m => matchBelongsToGame(m, game)).length,
  scrims: scrims.filter(m => matchBelongsToGame(m, game)).length,
});

/** Titles confirmed for the platform but not live yet (locked catalog tiles). */
export const incomingGames: {
  name: string;
  short: string;
  tone: string;
  genre: string;
  icon: string;
  window: string;
}[] = [
  {
    name: "Valorant",
    short: "VAL",
    tone: "red",
    genre: "Tactical FPS",
    icon: "⌖",
    window: "Q4 2026",
  },
  {
    name: "Fortnite",
    short: "FN",
    tone: "cyan",
    genre: "Battle Royale",
    icon: "▣",
    window: "Q4 2026",
  },
  {
    name: "Brawl Stars",
    short: "BS",
    tone: "orange",
    genre: "MOBA 3v3",
    icon: "✷",
    window: "Q1 2027",
  },
  {
    name: "Rocket League",
    short: "RL",
    tone: "blue",
    genre: "Sports 3v3",
    icon: "◉",
    window: "Q1 2027",
  },
  {
    name: "Tekken 8",
    short: "TK8",
    tone: "violet",
    genre: "Fighting 1v1",
    icon: "⚔",
    window: "Q2 2027",
  },
  {
    name: "EA Sports FC",
    short: "FC",
    tone: "lime",
    genre: "Sports 11v11",
    icon: "⬢",
    window: "Q2 2027",
  },
];

/** "12.8k" -> 12800 — used for the "most players" catalog sort. */
export const parsePlayerCount = (players: string): number => {
  const cleaned = players.toLowerCase().replace(/[^0-9.]/g, "");
  const value = Number.parseFloat(cleaned);
  if (Number.isNaN(value)) return 0;
  return players.toLowerCase().includes("k") ? value * 1000 : value;
};
