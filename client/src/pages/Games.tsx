import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  Bell,
  ChevronDown,
  Crosshair,
  Gamepad2,
  Lock,
  Radio,
  Search,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { AppShell } from "@/components/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { useToast } from "@/contexts/ToastContext";
import type { SearchItem } from "@/components/SearchDialog";
import {
  games,
  gameEventCounts,
  incomingGames,
  matchBelongsToGame,
  parsePlayerCount,
  scrims,
  tournaments,
  type GameItem,
} from "@/data/catalog";

const pad2 = (n: number) => String(n).padStart(2, "0");

type CatalogStatus = "LIVE" | "UPCOMING" | "IDLE";

/** Live slate per title, straight from the stadium lists. */
const gameStatusOf = (game: GameItem): CatalogStatus => {
  const matches = [...tournaments, ...scrims].filter(m =>
    matchBelongsToGame(m, game)
  );
  if (matches.some(m => m.status === "LIVE NOW")) return "LIVE";
  if (matches.some(m => m.status !== "FULL")) return "UPCOMING";
  return "IDLE";
};

/**
 * /games — the "See all games" destination.
 *
 * One page for the whole loadout: a catalog hero with the platform readout,
 * a search / status / sort toolbar, every live title as a large poster card
 * (the lobby's game-card language, scaled up) and the locked "incoming
 * titles" tiles for what's on the radar. Tapping a card drops you into that
 * title's stadium on the lobby, pre-filtered.
 */
export default function Games() {
  const [, navigate] = useLocation();
  const { notify } = useToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "upcoming">(
    "all"
  );
  const [sort, setSort] = useState<"players" | "az" | "events">("players");

  // Deep links: /games?game=Free Fire (+ ?jump=catalog) from search, lobby
  // cards and the topbar search dialog.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    if (game) {
      const found = games.find(
        g => g.name.toLowerCase() === game.toLowerCase()
      );
      if (found) setQuery(found.name);
    }
    if (params.get("jump") === "catalog") {
      window.setTimeout(() => {
        document
          .getElementById("catalog")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 250);
    }
  }, []);

  const visible = useMemo(() => {
    let list = games;
    if (statusFilter === "live") {
      list = list.filter(g => gameStatusOf(g) === "LIVE");
    } else if (statusFilter === "upcoming") {
      list = list.filter(g => gameStatusOf(g) !== "IDLE");
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.genre.toLowerCase().includes(q) ||
          g.short.toLowerCase().includes(q)
      );
    }
    const eventTotal = (g: GameItem) => {
      const c = gameEventCounts(g);
      return c.tournaments + c.scrims;
    };
    const sorted = [...list];
    if (sort === "players") {
      sorted.sort(
        (a, b) => parsePlayerCount(b.players) - parsePlayerCount(a.players)
      );
    } else if (sort === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => eventTotal(b) - eventTotal(a));
    }
    return sorted;
  }, [query, statusFilter, sort]);

  const filtersActive = query.trim() !== "" || statusFilter !== "all";
  const clearFilters = () => {
    setQuery("");
    setStatusFilter("all");
  };

  const scrollToCatalog = () =>
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  const openStadium = (game: GameItem) => {
    navigate(`/?game=${encodeURIComponent(game.name)}&jump=tournaments`);
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.type === "game") {
      setQuery(item.title);
      setStatusFilter("all");
      window.requestAnimationFrame(scrollToCatalog);
    } else if (item.type === "tournament" || item.type === "scrim") {
      navigate("/?jump=tournaments");
    } else if (item.type === "arena") {
      navigate("/?jump=arenas");
    } else {
      notify(`${item.title} preview coming soon`);
    }
  };

  return (
    <AppShell activeNav="Lobby" onSearchSelect={handleSearchSelect}>
      <main id="top">
        {/* ---- Catalog hero: same anatomy as the lobby hero, own readout ---- */}
        <section
          className="hero-section games-hero"
          style={
            {
              "--hero-image": `url(${import.meta.env.BASE_URL}organizer-arena-hero.webp)`,
            } as CSSProperties
          }
        >
          <div className="hero-image" />
          <div className="hero-grid" />
          <div className="hero-content container">
            <div className="hero-kicker">
              <span className="status-dot" /> EGOR · GAME CATALOG{" "}
              <span className="kicker-line" /> {pad2(games.length)} TITLES ·
              24/7
            </div>
            <div className="hero-copy">
              <p className="hero-index">002 / GAME CATALOG</p>
              <h1>
                PICK YOUR
                <br />
                <em>BATTLEGROUND.</em>
              </h1>
              <p className="hero-description">
                Every title running on EGOR — live competitor counts, the
                current tournament slate and the next scrim for each one. Tap a
                card to drop into its stadium.
              </p>
              <div className="hero-actions">
                <ActionButton onClick={scrollToCatalog}>
                  Browse the loadout
                </ActionButton>
                <button
                  className="hero-secondary"
                  onClick={() => navigate("/")}
                >
                  <span className="play-orb">↩</span> Back to the lobby
                </button>
              </div>
            </div>
            <div className="hero-readout">
              <div>
                <span>TITLES LIVE</span>
                <strong>{pad2(games.length)}</strong>
              </div>
              <div>
                <span>PLAYERS ONLINE</span>
                <strong>12,846</strong>
              </div>
              <div>
                <span>LIVE MATCHES</span>
                <strong>084</strong>
              </div>
              <div>
                <span>PRIZE POOL THIS MONTH</span>
                <strong>
                  2.4M <small>DZD</small>
                </strong>
              </div>
            </div>
          </div>
          <div className="hero-scroll">
            <span>SCROLL TO BROWSE</span>
            <div />
          </div>
        </section>

        {/* ---- The catalog: toolbar + poster grid ---- */}
        <section className="section container catalog-section" id="catalog">
          <div className="section-header">
            <div>
              <span className="eyebrow">02 / SELECT YOUR LOADOUT</span>
              <h2>
                ALL GAMES
                <small>
                  {pad2(games.length)} LIVE · {pad2(incomingGames.length)}{" "}
                  INCOMING
                </small>
              </h2>
            </div>
            <button className="text-link" onClick={() => navigate("/")}>
              Back to lobby
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Toolbar: title search · live/upcoming · sort */}
          <div className="catalog-toolbar">
            <div className="catalog-search">
              <Search size={15} />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Filter titles…"
                aria-label="Filter titles"
              />
              {query ? (
                <button
                  className="catalog-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear title filter"
                >
                  <X size={13} />
                </button>
              ) : null}
            </div>

            <div
              className="segmented catalog-segmented"
              role="group"
              aria-label="Slate filter"
            >
              <button
                type="button"
                className={statusFilter === "all" ? "is-active" : ""}
                onClick={() => setStatusFilter("all")}
              >
                <Gamepad2 size={15} /> All
              </button>
              <button
                type="button"
                className={statusFilter === "live" ? "is-active" : ""}
                onClick={() => setStatusFilter("live")}
              >
                <i className="catalog-seg-dot" /> Live now
              </button>
              <button
                type="button"
                className={statusFilter === "upcoming" ? "is-active" : ""}
                onClick={() => setStatusFilter("upcoming")}
              >
                <Radio size={15} /> Upcoming
              </button>
            </div>

            <div className="select-wrap catalog-sort">
              <ArrowDownUp size={14} />
              <select
                value={sort}
                onChange={e =>
                  setSort(e.target.value as "players" | "az" | "events")
                }
                aria-label="Sort titles"
              >
                <option value="players">MOST PLAYERS</option>
                <option value="az">A — Z</option>
                <option value="events">MOST EVENTS</option>
              </select>
              <ChevronDown size={14} />
            </div>
          </div>

          <div className="catalog-counts">
            <span>
              SHOWING {pad2(visible.length)} / {pad2(games.length)} TITLES
            </span>
            {filtersActive && (
              <button
                type="button"
                className="catalog-clear"
                onClick={clearFilters}
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {visible.length === 0 ? (
            <div className="stadium-empty-state catalog-empty">
              <Crosshair size={32} className="stadium-empty-icon" />
              <h4>NO TITLES ON THIS FREQUENCY</h4>
              <p>
                Nothing in the loadout matches those filters. Try another title,
                genre or slate — or clear the filters to see every game.
              </p>
              <button
                type="button"
                className="action-button action-button--ghost"
                onClick={clearFilters}
              >
                CLEAR FILTERS
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {visible.map(game => {
                const counts = gameEventCounts(game);
                const status = gameStatusOf(game);
                const isSelected =
                  query.trim().toLowerCase() === game.name.toLowerCase();
                return (
                  <button
                    key={game.name}
                    className={`game-card game-card--${game.tone} catalog-card${
                      isSelected ? " game-card--selected" : ""
                    }`}
                    onClick={() => openStadium(game)}
                    title={`Open the ${game.name} stadium`}
                  >
                    {/* Vertical thumbnail with official game artwork */}
                    <div className="game-card-media">
                      <img
                        src={`${import.meta.env.BASE_URL}${game.image}`}
                        alt={`${game.name} official artwork`}
                        className="game-card-thumb"
                        loading="lazy"
                      />
                      <div className="game-card-overlay" />
                      <span className="game-glow" />
                    </div>

                    {/* Card top badges */}
                    <div className="game-card-top">
                      <span className="game-tag-badge">{game.short}</span>
                      {status === "LIVE" ? (
                        <span className="catalog-live-flag">
                          <span className="game-live-dot" /> LIVE NOW
                        </span>
                      ) : (
                        <span className="game-live-badge">
                          <span className="game-live-dot" />
                          <span>{game.players}</span>
                        </span>
                      )}
                    </div>

                    {/* Card bottom details */}
                    <div className="game-card-bottom">
                      <span className="game-card-genre">{game.genre}</span>
                      <strong className="game-card-title">{game.name}</strong>
                      <div className="catalog-stats">
                        <span>
                          <strong>{pad2(counts.tournaments)}</strong>
                          <small>TOURNAMENTS</small>
                        </span>
                        <span>
                          <strong>{pad2(counts.scrims)}</strong>
                          <small>SCRIMS</small>
                        </span>
                        <span>
                          <strong>{game.players}</strong>
                          <small>PLAYERS</small>
                        </span>
                      </div>
                      <div className="game-card-action">
                        <span>
                          {isSelected ? "OPEN STADIUM" : "VIEW MATCHES"}
                        </span>
                        <ArrowRight size={13} className="game-card-arrow" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ---- Locked tiles: titles confirmed but not live yet ---- */}
        <section className="section container incoming-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">03 / ON THE RADAR</span>
              <h2>
                INCOMING TITLES
                <small>{pad2(incomingGames.length)} LOCKED</small>
              </h2>
            </div>
            <span className="incoming-note">
              <Lock size={12} /> Unlocks when each title goes live
            </span>
          </div>
          <div className="incoming-grid">
            {incomingGames.map(g => (
              <article
                key={g.name}
                className={`incoming-card game-card--${g.tone}`}
              >
                {/* Official key art, printed grayscale: the tile is locked */}
                <div className="incoming-card-media" aria-hidden="true">
                  <img
                    src={`${import.meta.env.BASE_URL}${g.image}`}
                    alt=""
                    className="incoming-card-thumb"
                    loading="lazy"
                  />
                  <div className="incoming-card-overlay" />
                </div>
                <div className="incoming-card-top">
                  <span className="game-tag-badge">{g.short}</span>
                  <span className="incoming-window">
                    <Lock size={10} /> {g.window}
                  </span>
                </div>
                <div className="incoming-copy">
                  <strong className="incoming-name">{g.name}</strong>
                  <span className="incoming-genre">{g.genre}</span>
                </div>
                <button
                  type="button"
                  className="play-button incoming-notify"
                  onClick={() =>
                    notify(`We'll ping you when ${g.name} goes live`)
                  }
                >
                  <Bell size={13} /> NOTIFY ME
                </button>
                <span className="incoming-glyph" aria-hidden="true">
                  {g.icon}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Close the loop: back into the lobby ---- */}
        <section className="section container catalog-cta-section">
          <div className="catalog-cta">
            <div>
              <span className="eyebrow">READY TO PLAY?</span>
              <h3>
                FIND YOUR NEXT MATCH <em>IN THE LOBBY.</em>
              </h3>
            </div>
            <div className="catalog-cta-actions">
              <ActionButton onClick={() => navigate("/?jump=tournaments")}>
                Browse the stadium
              </ActionButton>
              <button
                type="button"
                className="action-button action-button--ghost"
                onClick={() => navigate("/")}
              >
                Back to lobby
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
