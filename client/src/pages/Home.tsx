import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Gamepad2,
  LayoutGrid,
  MonitorSmartphone,
  Radio,
  Search,
  Sparkles,
  Star,
  Swords,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import type { SearchItem } from "@/components/SearchDialog";
import { AppShell } from "@/components/AppShell";
import { ActionButton } from "@/components/ActionButton";
import { useToast } from "@/contexts/ToastContext";
import {
  EventPassIcon,
  GameKeyIcon,
  GiftCardIcon,
  InGameCoinIcon,
  SeasonRewardIcon,
  TopUpIcon,
  type RewardIconProps,
} from "@/components/RewardIcons";
import { assetUrl } from "@/lib/utils";
import {
  arenas,
  games,
  getGameForItem,
  scrims,
  tournaments,
} from "@/data/catalog";

// Section 06 / REWARDS BAY icons: colored 3D renders from 3dicons.co (CC0 license).
// The files live in `client/public/icons/gifts/` and are resolved through
// `assetUrl()` at render time, so they stay correct when the site is deployed
// under a base path. `fallback` is the hand-drawn SVG (see `RewardIcons.tsx`)
// used when a PNG fails to load, so a tile never shows up as an empty box.
const gifts: {
  label: string;
  img: string;
  fallback: React.ComponentType<RewardIconProps>;
}[] = [
  {
    label: "Gift Cards",
    img: "/icons/gifts/gift-cards.png",
    fallback: GiftCardIcon,
  },
  {
    label: "In-Game Coins",
    img: "/icons/gifts/in-game-coins.png",
    fallback: InGameCoinIcon,
  },
  {
    label: "Game Keys",
    img: "/icons/gifts/game-keys.png",
    fallback: GameKeyIcon,
  },
  {
    label: "Event Passes",
    img: "/icons/gifts/event-passes.png",
    fallback: EventPassIcon,
  },
  {
    label: "Season Rewards",
    img: "/icons/gifts/season-rewards.png",
    fallback: SeasonRewardIcon,
  },
  { label: "Top-Ups", img: "/icons/gifts/top-ups.png", fallback: TopUpIcon },
];

/**
 * One reward icon: the 3D PNG, or its SVG stand-in if the PNG cannot load.
 */
function GiftIcon({
  src,
  Fallback,
}: {
  src: string;
  Fallback: React.ComponentType<RewardIconProps>;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Fallback size={52} className="gift-icon-svg" aria-hidden="true" />;
  }

  return (
    <img
      src={assetUrl(src)}
      alt=""
      width="52"
      height="52"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

function SectionHeader({
  eyebrow,
  title,
  count,
  action,
  onAction,
}: {
  eyebrow: string;
  title: string;
  count?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>
          {title}
          {count && <small>{count}</small>}
        </h2>
      </div>
      {action && (
        <button className="text-link" onClick={onAction}>
          {action}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [gameFilter, setGameFilter] = useState("All games");
  const [mode, setMode] = useState<"tournaments" | "scrims">("tournaments");
  const { notify } = useToast();

  const filteredMatches = useMemo(() => {
    const list = mode === "tournaments" ? tournaments : scrims;
    if (gameFilter === "All games") return list;
    return list.filter(
      item =>
        item.game === gameFilter ||
        item.game.toLowerCase() === gameFilter.toLowerCase() ||
        (gameFilter === "Call of Duty" &&
          item.game.toLowerCase().includes("call of duty")) ||
        (gameFilter === "Free Fire" &&
          item.game.toLowerCase().includes("free fire")) ||
        (gameFilter === "PUBG Mobile" &&
          item.game.toLowerCase().includes("pubg")) ||
        (gameFilter === "Mobile Legends" &&
          item.game.toLowerCase().includes("mobile legends")) ||
        (gameFilter === "Clash Royale" &&
          item.game.toLowerCase().includes("clash royale")) ||
        (gameFilter === "Counter-Strike 2" &&
          item.game.toLowerCase().includes("counter-strike"))
    );
  }, [mode, gameFilter]);

  const totalStadiumCount = `${String(filteredMatches.length).padStart(2, "0")} TOTAL`;

  // Handle URL params: ?game=Free Fire (pre-filter from a catalog card) and
  // ?jump=tournaments|arenas (deep links from the shell / search dialog).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const game = params.get("game");
    const jump = params.get("jump");
    if (game) {
      const found = games.find(
        g => g.name.toLowerCase() === game.toLowerCase()
      );
      if (found) setGameFilter(found.name);
    }
    if (game || jump === "tournaments") {
      window.setTimeout(() => {
        document
          .getElementById("tournaments")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else if (jump === "arenas") {
      window.setTimeout(() => {
        document
          .querySelector(".arena-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  // Handle item selected in search dialog
  const handleSearchSelect = (item: SearchItem) => {
    if (item.type === "game") {
      setGameFilter(item.title);
      document
        .getElementById("tournaments")
        ?.scrollIntoView({ behavior: "smooth" });
      notify(`Filtered matches for ${item.title}`);
    } else if (item.type === "tournament") {
      setMode("tournaments");
      setGameFilter("All games");
      document
        .getElementById("tournaments")
        ?.scrollIntoView({ behavior: "smooth" });
      notify(`Selected ${item.title}`);
    } else if (item.type === "scrim") {
      setMode("scrims");
      document
        .getElementById("tournaments")
        ?.scrollIntoView({ behavior: "smooth" });
      notify(`Selected ${item.title}`);
    } else if (item.type === "arena") {
      document
        .querySelector(".arena-section")
        ?.scrollIntoView({ behavior: "smooth" });
      notify(`Viewing arena: ${item.title}`);
    }
  };

  return (
    <AppShell onSearchSelect={handleSearchSelect}>
      <main id="top">
        <section
          className="hero-section"
          style={
            {
              "--hero-image": `url(${import.meta.env.BASE_URL}egor-lobby-hero-red.jpg)`,
            } as CSSProperties
          }
        >
          <div className="hero-image" />
          <div className="hero-grid" />
          <div className="hero-content container">
            <div className="hero-kicker">
              <span className="status-dot" /> EGOR · ARENA SYSTEM{" "}
              <span className="kicker-line" /> 16 GAMES · 24/7
            </div>
            <div className="hero-copy">
              <p className="hero-index">001 / LOBBY</p>
              <h1>
                JOIN.
                <br />
                <em>COMPETE.</em>
                <br />
                WIN.
              </h1>
              <p className="hero-description">
                The home ground for competitive gaming. Find your next
                tournament, build your arena, and make your name impossible to
                ignore.
              </p>
              <div className="hero-actions">
                <ActionButton
                  onClick={() =>
                    document
                      .getElementById("tournaments")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Find your match
                </ActionButton>
                <button
                  className="hero-secondary"
                  onClick={() => notify("Trailer preview coming soon")}
                >
                  <span className="play-orb">▶</span> Watch the signal
                </button>
              </div>
            </div>
            <aside className="hero-live-panel" aria-label="Live match feed">
              <div className="hero-live-head">
                <span>
                  <span className="status-dot" /> LIVE FEED
                </span>
                <span className="hero-live-code">EGOR / 001</span>
              </div>
              <div className="hero-live-match">
                <span className="eyebrow">NOW PLAYING · FREE FIRE</span>
                <strong>REFUGE ACADEMY SCRIM</strong>
                <div className="hero-live-meta">
                  <span>12 / 16 TEAMS</span>
                  <span>LIVE NOW</span>
                </div>
              </div>
              <button
                className="hero-live-link"
                onClick={() => {
                  setMode("scrims");
                  document
                    .getElementById("tournaments")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Enter the stadium <ArrowRight size={14} />
              </button>
            </aside>
            <div className="hero-readout">
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
            <span>SCROLL TO EXPLORE</span>
            <div />
          </div>
        </section>

        <section className="signal-strip">
          <div className="container signal-inner">
            <span className="signal-live">
              <Radio size={14} /> LIVE SIGNAL
            </span>
            <span>YOUR NEXT WINNING RUN STARTS HERE</span>
            <b>✦</b>
            <span>JOIN · COMPETE · WIN</span>
            <b>✦</b>
            <span>ALGERIA’S GAMING HUB</span>
          </div>
        </section>

        <section className="section container game-section" id="games">
          <SectionHeader
            eyebrow="02 / SELECT YOUR LOADOUT"
            title="GAMES"
            count="16 TOTAL"
            action="See all games"
            onAction={() => navigate("/games")}
          />
          <div className="game-grid">
            {games.map(game => {
              const isSelected = gameFilter === game.name;
              return (
                <button
                  key={game.name}
                  className={`game-card game-card--${game.tone} ${isSelected ? "game-card--selected" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setGameFilter("All games");
                      notify("Cleared game filter");
                    } else {
                      setGameFilter(game.name);
                      document
                        .getElementById("tournaments")
                        ?.scrollIntoView({ behavior: "smooth" });
                      notify(`Filtered matches for ${game.name}`);
                    }
                  }}
                  aria-pressed={isSelected}
                  title={`Select ${game.name} to view matches`}
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
                    <span className="game-live-badge">
                      <span className="game-live-dot" />
                      <span>{game.players}</span>
                    </span>
                  </div>

                  {/* Card bottom details */}
                  <div className="game-card-bottom">
                    <span className="game-card-genre">{game.genre}</span>
                    <strong className="game-card-title">{game.name}</strong>
                    <div className="game-card-action">
                      <span>{isSelected ? "FILTERED" : "VIEW MATCHES"}</span>
                      <ArrowRight size={13} className="game-card-arrow" />
                    </div>
                  </div>

                  {/* Selected / Active Filter Pill */}
                  {isSelected && (
                    <span className="game-card-active-pill">ACTIVE</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section
          className="section container tournament-section"
          id="tournaments"
        >
          <SectionHeader
            eyebrow="03 / THE STADIUM"
            title={
              mode === "tournaments"
                ? "UPCOMING TOURNAMENTS"
                : "UPCOMING SCRIMS"
            }
            count={totalStadiumCount}
            action={
              gameFilter !== "All games"
                ? "Show all matches"
                : "See all matches"
            }
            onAction={() => {
              setGameFilter("All games");
              notify("Showing all stadium matches");
            }}
          />
          <div className="filter-bar">
            <div className="segmented">
              <button
                type="button"
                className={mode === "tournaments" ? "is-active" : ""}
                onClick={() => {
                  setMode("tournaments");
                  notify("Viewing upcoming tournaments");
                }}
              >
                <Trophy size={15} /> Tournaments
              </button>
              <button
                type="button"
                className={mode === "scrims" ? "is-active" : ""}
                onClick={() => {
                  setMode("scrims");
                  notify("Viewing upcoming scrims");
                }}
              >
                <Swords size={15} /> Scrims
              </button>
            </div>
            <div className="select-wrap">
              <Search size={15} />
              <select
                value={gameFilter}
                onChange={event => setGameFilter(event.target.value)}
              >
                <option>All games</option>
                {games.map(game => (
                  <option key={game.name}>{game.name}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Section 03 Stadium Game Filter Chips with Thumbnails */}
          <div className="stadium-game-chips-wrap">
            <div className="stadium-game-chips-header">
              <span className="stadium-game-chips-label">
                <i /> Filter by Game
              </span>
              {gameFilter !== "All games" && (
                <button
                  type="button"
                  className="stadium-clear-filter-btn"
                  onClick={() => {
                    setGameFilter("All games");
                    notify("Showing all stadium matches");
                  }}
                >
                  <X size={12} /> Clear Filter ({gameFilter})
                </button>
              )}
            </div>

            <div
              className="stadium-game-chips"
              role="tablist"
              aria-label="Stadium game selector"
            >
              <button
                type="button"
                className={`stadium-chip ${gameFilter === "All games" ? "stadium-chip--active" : ""}`}
                onClick={() => {
                  setGameFilter("All games");
                  notify("Showing all stadium matches");
                }}
                role="tab"
                aria-selected={gameFilter === "All games"}
              >
                <div className="stadium-chip-all-icon">
                  <LayoutGrid size={16} />
                </div>
                <div className="stadium-chip-info">
                  <span className="stadium-chip-title">ALL GAMES</span>
                  <span className="stadium-chip-meta">
                    {(mode === "tournaments" ? tournaments : scrims).length}{" "}
                    MATCHES
                  </span>
                </div>
              </button>

              {games.map(g => {
                const isSelected = gameFilter === g.name;
                const matchCount = (
                  mode === "tournaments" ? tournaments : scrims
                ).filter(
                  t =>
                    t.game.toLowerCase() === g.name.toLowerCase() ||
                    t.game.toLowerCase().includes(g.short.toLowerCase())
                ).length;

                return (
                  <button
                    key={g.name}
                    type="button"
                    className={`stadium-chip stadium-chip--${g.tone} ${isSelected ? "stadium-chip--active" : ""}`}
                    onClick={() => {
                      if (isSelected) {
                        setGameFilter("All games");
                        notify("Showing all stadium matches");
                      } else {
                        setGameFilter(g.name);
                        notify(`Filtered stadium for ${g.name}`);
                      }
                    }}
                    role="tab"
                    aria-selected={isSelected}
                    title={`Filter ${mode} by ${g.name}`}
                  >
                    <div className="stadium-chip-thumb-wrap">
                      <img
                        src={`${import.meta.env.BASE_URL}${g.image}`}
                        alt={`${g.name} thumbnail`}
                        className="stadium-chip-thumb"
                        loading="lazy"
                      />
                      <span className="stadium-chip-tag">{g.short}</span>
                    </div>
                    <div className="stadium-chip-info">
                      <strong className="stadium-chip-title">{g.name}</strong>
                      <span className="stadium-chip-meta">
                        {matchCount} {matchCount === 1 ? "EVENT" : "EVENTS"}
                      </span>
                    </div>
                    {isSelected && <span className="stadium-chip-indicator" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tournament-list">
            {filteredMatches.length === 0 ? (
              <div className="stadium-empty-state">
                <Sparkles size={32} className="stadium-empty-icon" />
                <h4>NO MATCHES FOUND FOR {gameFilter.toUpperCase()}</h4>
                <p>
                  There are no active {mode} scheduled for this game at this
                  moment. You can browse other games or view all stadium
                  matches.
                </p>
                <button
                  type="button"
                  className="action-button action-button--ghost"
                  onClick={() => {
                    setGameFilter("All games");
                    notify("Showing all stadium matches");
                  }}
                >
                  SHOW ALL MATCHES
                </button>
              </div>
            ) : (
              filteredMatches.map((item, index) => {
                const gameData = getGameForItem(item.game);
                const gameImage = item.image || gameData.image;
                const gameTone = gameData.tone || item.tone;

                return (
                  <article
                    className={`tournament-card tournament-card--${gameTone}`}
                    key={`${item.title}-${index}`}
                  >
                    {/* Game thumbnail with game name */}
                    <div
                      className="tour-game"
                      onClick={() => {
                        if (gameFilter === item.game) {
                          setGameFilter("All games");
                          notify("Showing all matches");
                        } else {
                          setGameFilter(item.game);
                          notify(`Filtered stadium for ${item.game}`);
                        }
                      }}
                      title={`Filter by ${item.game}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setGameFilter(item.game);
                          notify(`Filtered stadium for ${item.game}`);
                        }
                      }}
                    >
                      <div className="tour-game-thumb-container">
                        <img
                          src={`${import.meta.env.BASE_URL}${gameImage}`}
                          alt={`${item.game} thumbnail`}
                          className="tour-game-thumb"
                          loading="lazy"
                        />
                        <div className="tour-game-thumb-overlay" />
                        <span className="tour-game-thumb-badge">
                          {gameData.short}
                        </span>
                      </div>
                      <div className="tour-game-info">
                        <span className="tour-game-genre">
                          <span className="tour-game-genre-dot" />
                          {gameData.genre}
                        </span>
                        <strong className="tour-game-name">{item.game}</strong>
                      </div>
                    </div>

                    {/* Match title & status */}
                    <div className="tour-title">
                      <span className="tour-status">
                        <i /> {item.status}
                      </span>
                      <h3>{item.title}</h3>
                      <p>
                        <CalendarDays size={14} /> {item.date}
                      </p>
                    </div>

                    {/* Match meta (teams / prize) */}
                    <div className="tour-meta">
                      <div>
                        <span>TEAMS</span>
                        <strong>{item.teams}</strong>
                      </div>
                      <div>
                        <span>PRIZE</span>
                        <strong>{item.prize}</strong>
                      </div>
                    </div>

                    {/* Play action */}
                    <button
                      type="button"
                      className="play-button"
                      onClick={() => notify(`Opening ${item.title}`)}
                    >
                      PLAY <ArrowRight size={15} />
                    </button>
                  </article>
                );
              })
            )}
          </div>
        </section>

        <section className="organizer-section">
          {/* Full-bleed tournament arena hero image */}
          <div className="organizer-bg" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}organizer-arena-hero.webp`}
              alt=""
              className="organizer-bg-img"
              loading="lazy"
            />
            <div className="organizer-bg-overlay" />
          </div>
          <div className="container organizer-grid">
            <div className="organizer-copy">
              <span className="eyebrow">04 / BUILD THE FIELD</span>
              <h2>
                BECOME
                <br />
                <em>AN ORGANIZER.</em>
              </h2>
              <p>
                Run your own tournaments and scrims, build an arena around your
                community, and manage every bracket from one console.
              </p>
              <ActionButton
                onClick={() =>
                  notify("Organizer onboarding preview coming soon")
                }
              >
                Create your arena
              </ActionButton>
              <div className="organizer-stats">
                <span>
                  <strong>+250</strong>
                  <small>ACTIVE ORGANIZERS</small>
                </span>
                <span>
                  <strong>1.2k</strong>
                  <small>EVENTS CREATED</small>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section container arena-section">
          <SectionHeader
            eyebrow="05 / COMMUNITY SIGNAL"
            title="TOP ARENAS"
            count="08 TOTAL"
            action="See all arenas"
            onAction={() => notify("Showing all community arenas")}
          />
          <div className="arena-grid">
            {arenas.map((arena, index) => (
              <article
                className={`arena-card arena-card--${arena.tone}`}
                key={arena.name}
              >
                {/* Left strip: the arena emblem bled across the card's full
                    left edge — the panel is as tall as the card, and the
                    artwork backfills it (see .arena-emblem in index.css). */}
                <div
                  className={`arena-emblem${
                    arena.logo ? "" : " arena-emblem--empty"
                  }`}
                  style={
                    arena.logo
                      ? ({
                          "--arena-logo": `url(${assetUrl(arena.logo)})`,
                        } as CSSProperties)
                      : undefined
                  }
                >
                  {arena.logo ? (
                    <img
                      src={assetUrl(arena.logo)}
                      alt={`${arena.name} emblem`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    /* Original lobby fallback: white trophy on a solid tile. */
                    <Trophy size={40} strokeWidth={1.9} aria-hidden="true" />
                  )}
                </div>
                {/* Right rectangle: chips, name, blurb and the view button. */}
                <div className="arena-body">
                  <div className="arena-body-head">
                    {/* Same two chips as the original lobby footer. */}
                    <div className="arena-chips">
                      <span className="arena-chip arena-chip--platform">
                        <MonitorSmartphone size={12} strokeWidth={2} />
                        {arena.platform}
                      </span>
                      <span className="arena-chip arena-chip--category">
                        <Gamepad2 size={12} strokeWidth={2} />
                        {arena.category}
                      </span>
                    </div>
                    <div className="arena-top-meta">
                      {arena.featured && (
                        <span className="arena-featured">
                          <Star size={10} strokeWidth={2} fill="currentColor" />
                          Featured
                        </span>
                      )}
                      <span className="arena-rank">0{index + 1}</span>
                    </div>
                  </div>
                  <div className="arena-copy">
                    <h3>{arena.name}</h3>
                    <p>{arena.desc}</p>
                  </div>
                  <div className="arena-footer">
                    <span>
                      <Users size={14} /> {arena.members} members
                    </span>
                    <button
                      type="button"
                      onClick={() => notify(`Opening ${arena.name}`)}
                      aria-label={`View ${arena.name}`}
                    >
                      View
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section container store-section">
          <div className="store-head">
            <div>
              <span className="eyebrow">06 / REWARDS BAY</span>
              <h2>
                TOP <em>GIFTS.</em>
              </h2>
              <p>
                Gift cards, in-game currency, season rewards — landing with the
                store.
              </p>
            </div>
            <ActionButton
              variant="ghost"
              onClick={() => notify("Store preview coming soon")}
            >
              Visit store
            </ActionButton>
          </div>
          <div className="gift-grid">
            {gifts.map(({ label, img, fallback }) => (
              <button
                type="button"
                className="gift-card"
                key={label}
                onClick={() => notify(`${label} coming soon`)}
                aria-label={`${label} — coming soon`}
              >
                <span className="gift-icon" aria-hidden="true">
                  <GiftIcon src={img} Fallback={fallback} />
                </span>
                <span className="gift-label">{label}</span>
                <small>COMING SOON</small>
              </button>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
