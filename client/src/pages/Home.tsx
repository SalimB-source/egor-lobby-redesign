import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Crosshair,
  Gamepad2,
  LayoutGrid,
  LogOut,
  Map,
  Menu,
  Radio,
  Search,
  Shield,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { SearchDialog, type SearchItem } from "@/components/SearchDialog";
import { LoginModal, RegisterModal, type UserProfile } from "@/components/AuthModals";

const games = [
  { name: "Free Fire", short: "FF", tone: "lime", players: "12.8k", icon: "◈" },
  { name: "PUBG Mobile", short: "PUBG", tone: "blue", players: "8.4k", icon: "▦" },
  { name: "Mobile Legends", short: "ML", tone: "violet", players: "6.2k", icon: "✦" },
  { name: "Call of Duty", short: "COD", tone: "orange", players: "4.9k", icon: "⌁" },
  { name: "Clash Royale", short: "CR", tone: "red", players: "3.1k", icon: "♜" },
  { name: "Counter-Strike 2", short: "CS2", tone: "cyan", players: "2.7k", icon: "⊙" },
];

const tournaments = [
  { title: "بطولة للاستمتاع فقط", game: "Free Fire", status: "START SOON", date: "17 MAR 2026", teams: "01 / 40", prize: "0 DZD", tone: "lime", icon: "◈" },
  { title: "Killerdrk", game: "PUBG Mobile", status: "START SOON", date: "17 MAR 2026", teams: "00 / 200", prize: "0 DZD", tone: "blue", icon: "▦" },
  { title: "Amja Championship", game: "Free Fire", status: "START SOON", date: "05 AUG 2026", teams: "00 / 90", prize: "1,000 DZD", tone: "lime", icon: "◈" },
  { title: "COD MOB", game: "Call of Duty Mobile", status: "FULL", date: "13 AUG 2026", teams: "32 / 32", prize: "0 DZD", tone: "orange", icon: "⌁" },
];

const arenas = [
  { name: "ALGERIAN ESPORTS FEDERATION", tag: "cross platform", members: "2.4k", desc: "Driving the future of gaming in Algeria. Official tournaments, talent, and community.", tone: "lime", mark: "AEF" },
  { name: "THE REFUGE ACADEMY", tag: "esports club", members: "1.8k", desc: "Home for ambitious players and future champions. Powered by EGOR Gaming.", tone: "blue", mark: "RA" },
  { name: "MLBB ALGERIA", tag: "mobile community", members: "1.1k", desc: "Official competitive hub for Mobile Legends: Bang Bang in Algeria.", tone: "violet", mark: "ML" },
  { name: "7OUMA ARENA", tag: "mobile organizers", members: "980", desc: "A competitive home for mobile gaming, local events, and the next generation.", tone: "orange", mark: "7A" },
];

const gifts = [
  { label: "Gift Cards", icon: CircleDollarSign },
  { label: "In-Game Coins", icon: Zap },
  { label: "Game Keys", icon: Gamepad2 },
  { label: "Event Passes", icon: CalendarDays },
  { label: "Season Rewards", icon: Trophy },
  { label: "Top-Ups", icon: Sparkles },
];

function ActionButton({ children, onClick, variant = "primary", icon = true }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "dark"; icon?: boolean }) {
  return <button className={`action-button action-button--${variant}`} onClick={onClick}>{children}{icon && <ArrowRight size={15} />}</button>;
}

function SectionHeader({ eyebrow, title, count, action }: { eyebrow: string; title: string; count?: string; action?: string }) {
  return <div className="section-header"><div><span className="eyebrow">{eyebrow}</span><h2>{title}{count && <small>{count}</small>}</h2></div>{action && <button className="text-link">{action}<ArrowRight size={15} /></button>}</div>;
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Lobby");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [gameFilter, setGameFilter] = useState("All games");
  const [mode, setMode] = useState<"tournaments" | "scrims">("tournaments");
  const [notice, setNotice] = useState("");

  // Modals & Authentication State
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredTournaments = useMemo(() => gameFilter === "All games" ? tournaments : tournaments.filter((item) => item.game === gameFilter), [gameFilter]);
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };

  // Listen to global shortcut (Cmd+K / Ctrl+K) for search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Handle URL paths / hash for deep linking to login or register
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const search = window.location.search;
    if (path.includes("/login") || hash.includes("login") || search.includes("login")) {
      setLoginOpen(true);
    } else if (path.includes("/register") || hash.includes("register") || search.includes("register")) {
      setRegisterOpen(true);
    }
  }, []);

  // Handle item selected in search dialog
  const handleSearchSelect = (item: SearchItem) => {
    if (item.type === "game") {
      setGameFilter(item.title);
      document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" });
      notify(`Filtered matches for ${item.title}`);
    } else if (item.type === "tournament") {
      setMode("tournaments");
      setGameFilter("All games");
      document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" });
      notify(`Selected ${item.title}`);
    } else if (item.type === "scrim") {
      setMode("scrims");
      document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" });
      notify(`Selected ${item.title}`);
    } else if (item.type === "arena") {
      document.querySelector(".arena-section")?.scrollIntoView({ behavior: "smooth" });
      notify(`Viewing arena: ${item.title}`);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        {/* Brand Logo */}
        <a className="brand" href="#top" onClick={() => setActiveNav("Lobby")}>
          <span className="brand-mark"><span /></span>
          <span className="brand-word">EGOR<small>GAMING</small></span>
        </a>

        {/* Center Navigation Links */}
        <nav className={mobileOpen ? "main-nav main-nav--open" : "main-nav"}>
          {[
            { label: "Lobby", icon: LayoutGrid },
            { label: "Stadium", icon: Trophy },
            { label: "Board", icon: Swords },
            { label: "Store", icon: CircleDollarSign },
            { label: "Feed", icon: Radio },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? "nav-item nav-item--active" : "nav-item"}
              onClick={() => {
                setActiveNav(label);
                setMobileOpen(false);
                notify(`${label} preview coming soon`);
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}

          {/* Mobile menu action buttons */}
          <div className="mobile-nav-actions">
            <button
              className="mobile-search-btn"
              onClick={() => {
                setMobileOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search size={16} />
              <span>Search Tournaments & Games</span>
            </button>
            {!user ? (
              <div className="mobile-auth-row">
                <button
                  className="mobile-login-btn"
                  onClick={() => {
                    setMobileOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Log In
                </button>
                <button
                  className="mobile-register-btn"
                  onClick={() => {
                    setMobileOpen(false);
                    setRegisterOpen(true);
                  }}
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                className="profile-logout-btn"
                onClick={() => {
                  setUser(null);
                  setMobileOpen(false);
                  notify("Logged out successfully");
                }}
              >
                <LogOut size={13} />
                <span>LOG OUT ({user.name})</span>
              </button>
            )}
          </div>
        </nav>

        {/* Top Right Action Buttons: Search, Log in, Register
            (hidden on mobile while the drawer is open — the drawer has its own set) */}
        <div className={mobileOpen ? "top-actions top-actions--menu-open" : "top-actions"}>
          {/* Search Button */}
          <button
            className="top-search-btn"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            title="Search (⌘K)"
          >
            <Search size={15} />
            <span className="search-text">Search</span>
            <kbd className="top-search-kbd">⌘K</kbd>
          </button>

          {user ? (
            /* Authenticated User View */
            <>
              <button
                className="icon-button"
                onClick={() => notify("No new alerts right now")}
                aria-label="Notifications"
              >
                <Bell size={17} />
                <i />
              </button>
              <div className="profile-menu-container">
                <button
                  className="profile-button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                >
                  <span className="avatar">{user.name.slice(0, 2)}</span>
                  <span className="profile-name">{user.name}</span>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-head">
                      <span className="avatar">{user.name.slice(0, 2)}</span>
                      <div className="profile-dropdown-info">
                        <strong>{user.name}</strong>
                        <span>{user.rank} · {user.tag}</span>
                      </div>
                    </div>
                    <div className="profile-dropdown-stats">
                      <div><span>XP</span><strong>{user.xp}</strong></div>
                      <div><span>TOURNAMENTS</span><strong>{user.tournamentsCount} ACTIVE</strong></div>
                    </div>
                    <div className="profile-dropdown-items">
                      <button
                        className="profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        <span>My Tournaments</span>
                        <ChevronRight size={13} />
                      </button>
                      <button
                        className="profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          notify("Arena manager opening soon");
                        }}
                      >
                        <span>Arena Management</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <button
                      className="profile-logout-btn"
                      onClick={() => {
                        setUser(null);
                        setProfileOpen(false);
                        notify("Logged out successfully");
                      }}
                    >
                      <LogOut size={13} />
                      <span>LOG OUT</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Unauthenticated Visitor View: Log in & Register */
            <>
              <button
                className="top-login-btn"
                onClick={() => setLoginOpen(true)}
                aria-label="Log in"
              >
                Log in
              </button>
              <button
                className="top-register-btn"
                onClick={() => setRegisterOpen(true)}
                aria-label="Register"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section" style={{ "--hero-image": `url(${import.meta.env.BASE_URL}egor-lobby-hero-red.jpg)` } as CSSProperties}>
          <div className="hero-image" />
          <div className="hero-grid" />
          <div className="hero-content container">
            <div className="hero-kicker"><span className="status-dot" /> EGOR · ARENA SYSTEM <span className="kicker-line" /> 16 GAMES · 24/7</div>
            <div className="hero-copy">
              <p className="hero-index">001 / LOBBY</p>
              <h1>JOIN.<br /><em>COMPETE.</em><br />WIN.</h1>
              <p className="hero-description">The home ground for competitive gaming. Find your next tournament, build your arena, and make your name impossible to ignore.</p>
              <div className="hero-actions">
                <ActionButton onClick={() => document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" })}>Find your match</ActionButton>
                <button className="hero-secondary" onClick={() => notify("Trailer preview coming soon")}>
                  <span className="play-orb">▶</span> Watch the signal
                </button>
              </div>
            </div>
            <div className="hero-readout">
              <div><span>PLAYERS ONLINE</span><strong>12,846</strong></div>
              <div><span>LIVE MATCHES</span><strong>084</strong></div>
              <div><span>PRIZE POOL THIS MONTH</span><strong>2.4M <small>DZD</small></strong></div>
            </div>
          </div>
          <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><div /></div>
        </section>

        <section className="signal-strip">
          <div className="container signal-inner">
            <span className="signal-live"><Radio size={14} /> LIVE SIGNAL</span>
            <span>YOUR NEXT WINNING RUN STARTS HERE</span>
            <b>✦</b>
            <span>JOIN · COMPETE · WIN</span>
            <b>✦</b>
            <span>ALGERIA’S GAMING HUB</span>
          </div>
        </section>

        <section className="section container game-section">
          <SectionHeader eyebrow="02 / SELECT YOUR LOADOUT" title="GAMES" count="16 TOTAL" action="See all games" />
          <div className="game-grid">
            {games.map((game) => (
              <button
                key={game.name}
                className={`game-card game-card--${game.tone}`}
                onClick={() => {
                  setGameFilter(game.name);
                  document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="game-glow" />
                <span className="game-icon">{game.icon}</span>
                <span className="game-info">
                  <strong>{game.name}</strong>
                  <small><i /> {game.players} active</small>
                </span>
                <span className="game-arrow"><ArrowRight size={16} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="section container tournament-section" id="tournaments">
          <SectionHeader
            eyebrow="03 / THE STADIUM"
            title={mode === "tournaments" ? "UPCOMING TOURNAMENTS" : "UPCOMING SCRIMS"}
            count={mode === "tournaments" ? "05 TOTAL" : "02 TOTAL"}
            action="See all matches"
          />
          <div className="filter-bar">
            <div className="segmented">
              <button className={mode === "tournaments" ? "is-active" : ""} onClick={() => setMode("tournaments")}>
                <Trophy size={15} /> Tournaments
              </button>
              <button className={mode === "scrims" ? "is-active" : ""} onClick={() => setMode("scrims")}>
                <Swords size={15} /> Scrims
              </button>
            </div>
            <div className="select-wrap">
              <Search size={15} />
              <select value={gameFilter} onChange={(event) => setGameFilter(event.target.value)}>
                <option>All games</option>
                {games.map((game) => (
                  <option key={game.name}>{game.name}</option>
                ))}
              </select>
              <ChevronDown size={14} />
            </div>
          </div>
          <div className="tournament-list">
            {(mode === "scrims"
              ? tournaments.slice(0, 2).map((item) => ({ ...item, title: item.title === "Killerdrk" ? "REFUGE ACADEMY SCRIM" : "REFUGE DZ TRNG D-4", status: "FEATURED", prize: "—" }))
              : filteredTournaments
            ).map((item, index) => (
              <article className={`tournament-card tournament-card--${item.tone}`} key={`${item.title}-${index}`}>
                <div className="tour-game">
                  <span className="mini-game-icon">{item.icon}</span>
                  <span>{item.game}</span>
                </div>
                <div className="tour-title">
                  <span className="tour-status"><i /> {item.status}</span>
                  <h3>{item.title}</h3>
                  <p><CalendarDays size={14} /> {item.date}</p>
                </div>
                <div className="tour-meta">
                  <div><span>TEAMS</span><strong>{item.teams}</strong></div>
                  <div><span>PRIZE</span><strong>{item.prize}</strong></div>
                </div>
                <button className="play-button" onClick={() => notify(`Opening ${item.title}`)}>
                  PLAY <ArrowRight size={15} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="organizer-section">
          <div className="container organizer-grid">
            <div className="organizer-art">
              <div className="radar">
                <div className="radar-ring radar-ring--one" />
                <div className="radar-ring radar-ring--two" />
                <div className="radar-sweep" />
                <Crosshair size={78} strokeWidth={1} />
                <span className="radar-label radar-label--one">BRACKET CONTROL</span>
                <span className="radar-label radar-label--two">LIVE // 24</span>
                <span className="radar-label radar-label--three">ARENA 07</span>
              </div>
            </div>
            <div className="organizer-copy">
              <span className="eyebrow">04 / BUILD THE FIELD</span>
              <h2>BECOME<br /><em>AN ORGANIZER.</em></h2>
              <p>Run your own tournaments and scrims, build an arena around your community, and manage every bracket from one console.</p>
              <ActionButton onClick={() => notify("Organizer onboarding preview coming soon")}>Create your arena</ActionButton>
              <div className="organizer-stats">
                <span><strong>+250</strong><small>ACTIVE ORGANIZERS</small></span>
                <span><strong>1.2k</strong><small>EVENTS CREATED</small></span>
              </div>
            </div>
          </div>
        </section>

        <section className="section container arena-section">
          <SectionHeader eyebrow="05 / COMMUNITY SIGNAL" title="TOP ARENAS" count="08 TOTAL" action="See all arenas" />
          <div className="arena-grid">
            {arenas.map((arena, index) => (
              <article className={`arena-card arena-card--${arena.tone}`} key={arena.name}>
                <div className="arena-top">
                  <span className="arena-badge">{arena.mark}</span>
                  <span className="arena-rank">0{index + 1}</span>
                </div>
                <div className="arena-copy">
                  <span className="arena-tag"><i /> {arena.tag}</span>
                  <h3>{arena.name}</h3>
                  <p>{arena.desc}</p>
                </div>
                <div className="arena-footer">
                  <span><Users size={14} /> {arena.members} members</span>
                  <button onClick={() => notify(`Opening ${arena.name}`)} aria-label={`View ${arena.name}`}>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section container store-section">
          <div className="store-head">
            <div>
              <span className="eyebrow">06 / REWARDS BAY</span>
              <h2>TOP <em>GIFTS.</em></h2>
              <p>Gift cards, in-game currency, season rewards — landing with the store.</p>
            </div>
            <ActionButton variant="ghost" onClick={() => notify("Store preview coming soon")}>Visit store</ActionButton>
          </div>
          <div className="gift-grid">
            {gifts.map(({ label, icon: Icon }) => (
              <button className="gift-card" key={label} onClick={() => notify(`${label} coming soon`)}>
                <span className="gift-icon"><Icon size={21} /></span>
                <span>{label}</span>
                <small>COMING SOON</small>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="brand-mark"><span /></span>
              <span className="brand-word">EGOR<small>GAMING</small></span>
            </a>
            <p>Built for competitive gamers<br />worldwide.</p>
          </div>
          <div className="footer-links">
            <span onClick={() => notify("FAQ section coming soon")}>FAQ</span>
            <a
              href="https://egorgaming.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit" }}
            >
              Terms &amp; Privacy
            </a>
            <span onClick={() => notify("Contact: contact@egorgaming.com")}>Contact</span>
          </div>
          <div className="footer-end">
            <span>© 2026 EGOR GAMING</span>
            <span>ALGIERS / DZ</span>
          </div>
        </div>
      </footer>

      {notice && <div className="toast"><span className="status-dot" /> {notice}</div>}

      {/* Interactive Search Modal */}
      <SearchDialog
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={handleSearchSelect}
        games={games}
        tournaments={tournaments}
        arenas={arenas}
      />

      {/* Interactive Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onSuccess={(u) => {
          setUser(u);
        }}
        notify={notify}
      />

      {/* Interactive Register Modal */}
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
        onSuccess={(u) => {
          setUser(u);
        }}
        notify={notify}
      />
    </div>
  );
}
