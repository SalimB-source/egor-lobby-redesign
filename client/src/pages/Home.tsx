import { useMemo, useState } from "react";
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

  const filteredTournaments = useMemo(() => gameFilter === "All games" ? tournaments : tournaments.filter((item) => item.game === gameFilter), [gameFilter]);
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 2600); };

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top" onClick={() => setActiveNav("Lobby")}><span className="brand-mark"><span /></span><span className="brand-word">EGOR<small>GAMING</small></span></a>
      <nav className={mobileOpen ? "main-nav main-nav--open" : "main-nav"}>
        {[{ label: "Lobby", icon: LayoutGrid }, { label: "Stadium", icon: Trophy }, { label: "Board", icon: Swords }, { label: "Store", icon: CircleDollarSign }, { label: "Feed", icon: Radio }].map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? "nav-item nav-item--active" : "nav-item"} onClick={() => { setActiveNav(label); setMobileOpen(false); notify(`${label} preview coming soon`); }}><Icon size={15} />{label}</button>)}
      </nav>
      <div className="top-actions"><button className="icon-button" onClick={() => notify("No new alerts right now")} aria-label="Notifications"><Bell size={17} /><i /></button><button className="profile-button" onClick={() => notify("Profile preview coming soon")}><span className="avatar">AK</span><span className="profile-name">AKRAM</span><ChevronDown size={14} /></button></div>
      <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <main id="top">
      <section className="hero-section">
        <div className="hero-image" />
        <div className="hero-grid" />
        <div className="hero-content container">
          <div className="hero-kicker"><span className="status-dot" /> EGOR · ARENA SYSTEM <span className="kicker-line" /> 16 GAMES · 24/7</div>
          <div className="hero-copy"><p className="hero-index">001 / LOBBY</p><h1>JOIN.<br /><em>COMPETE.</em><br />WIN.</h1><p className="hero-description">The home ground for competitive gaming. Find your next tournament, build your arena, and make your name impossible to ignore.</p><div className="hero-actions"><ActionButton onClick={() => document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" })}>Find your match</ActionButton><button className="hero-secondary" onClick={() => notify("Trailer preview coming soon")}><span className="play-orb">▶</span> Watch the signal</button></div></div>
          <div className="hero-readout"><div><span>PLAYERS ONLINE</span><strong>12,846</strong></div><div><span>LIVE MATCHES</span><strong>084</strong></div><div><span>PRIZE POOL THIS MONTH</span><strong>2.4M <small>DZD</small></strong></div></div>
        </div>
        <div className="hero-scroll"><span>SCROLL TO EXPLORE</span><div /></div>
      </section>

      <section className="signal-strip"><div className="container signal-inner"><span className="signal-live"><Radio size={14} /> LIVE SIGNAL</span><span>YOUR NEXT WINNING RUN STARTS HERE</span><b>✦</b><span>JOIN · COMPETE · WIN</span><b>✦</b><span>ALGERIA’S GAMING HUB</span></div></section>

      <section className="section container game-section"><SectionHeader eyebrow="02 / SELECT YOUR LOADOUT" title="GAMES" count="16 TOTAL" action="See all games" /><div className="game-grid">{games.map((game) => <button key={game.name} className={`game-card game-card--${game.tone}`} onClick={() => { setGameFilter(game.name); document.getElementById("tournaments")?.scrollIntoView({ behavior: "smooth" }); }}><span className="game-glow" /><span className="game-icon">{game.icon}</span><span className="game-info"><strong>{game.name}</strong><small><i /> {game.players} active</small></span><span className="game-arrow"><ArrowRight size={16} /></span></button>)}</div></section>

      <section className="section container tournament-section" id="tournaments"><SectionHeader eyebrow="03 / THE STADIUM" title={mode === "tournaments" ? "UPCOMING TOURNAMENTS" : "UPCOMING SCRIMS"} count={mode === "tournaments" ? "05 TOTAL" : "02 TOTAL"} action="See all matches" /><div className="filter-bar"><div className="segmented"><button className={mode === "tournaments" ? "is-active" : ""} onClick={() => setMode("tournaments")}><Trophy size={15} /> Tournaments</button><button className={mode === "scrims" ? "is-active" : ""} onClick={() => setMode("scrims")}><Swords size={15} /> Scrims</button></div><div className="select-wrap"><Search size={15} /><select value={gameFilter} onChange={(event) => setGameFilter(event.target.value)}><option>All games</option>{games.map((game) => <option key={game.name}>{game.name}</option>)}</select><ChevronDown size={14} /></div></div><div className="tournament-list">{(mode === "scrims" ? tournaments.slice(0, 2).map((item) => ({ ...item, title: item.title === "Killerdrk" ? "REFUGE ACADEMY SCRIM" : "REFUGE DZ TRNG D-4", status: "FEATURED", prize: "—" })) : filteredTournaments).map((item, index) => <article className={`tournament-card tournament-card--${item.tone}`} key={`${item.title}-${index}`}><div className="tour-game"><span className="mini-game-icon">{item.icon}</span><span>{item.game}</span></div><div className="tour-title"><span className="tour-status"><i /> {item.status}</span><h3>{item.title}</h3><p><CalendarDays size={14} /> {item.date}</p></div><div className="tour-meta"><div><span>TEAMS</span><strong>{item.teams}</strong></div><div><span>PRIZE</span><strong>{item.prize}</strong></div></div><button className="play-button" onClick={() => notify(`Opening ${item.title}`)}>PLAY <ArrowRight size={15} /></button></article>)}</div></section>

      <section className="organizer-section"><div className="container organizer-grid"><div className="organizer-art"><div className="radar"><div className="radar-ring radar-ring--one" /><div className="radar-ring radar-ring--two" /><div className="radar-sweep" /><Crosshair size={78} strokeWidth={1} /><span className="radar-label radar-label--one">BRACKET CONTROL</span><span className="radar-label radar-label--two">LIVE // 24</span><span className="radar-label radar-label--three">ARENA 07</span></div></div><div className="organizer-copy"><span className="eyebrow">04 / BUILD THE FIELD</span><h2>BECOME<br /><em>AN ORGANIZER.</em></h2><p>Run your own tournaments and scrims, build an arena around your community, and manage every bracket from one console.</p><ActionButton onClick={() => notify("Organizer onboarding preview coming soon")}>Create your arena</ActionButton><div className="organizer-stats"><span><strong>+250</strong><small>ACTIVE ORGANIZERS</small></span><span><strong>1.2k</strong><small>EVENTS CREATED</small></span></div></div></div></section>

      <section className="section container arena-section"><SectionHeader eyebrow="05 / COMMUNITY SIGNAL" title="TOP ARENAS" count="08 TOTAL" action="See all arenas" /><div className="arena-grid">{arenas.map((arena, index) => <article className={`arena-card arena-card--${arena.tone}`} key={arena.name}><div className="arena-top"><span className="arena-badge">{arena.mark}</span><span className="arena-rank">0{index + 1}</span></div><div className="arena-copy"><span className="arena-tag"><i /> {arena.tag}</span><h3>{arena.name}</h3><p>{arena.desc}</p></div><div className="arena-footer"><span><Users size={14} /> {arena.members} members</span><button onClick={() => notify(`Opening ${arena.name}`)}><ChevronRight size={16} /></button></div></article>)}</div></section>

      <section className="section container store-section"><div className="store-head"><div><span className="eyebrow">06 / REWARDS BAY</span><h2>TOP <em>GIFTS.</em></h2><p>Gift cards, in-game currency, season rewards — landing with the store.</p></div><ActionButton variant="ghost" onClick={() => notify("Store preview coming soon")}>Visit store</ActionButton></div><div className="gift-grid">{gifts.map(({ label, icon: Icon }) => <button className="gift-card" key={label} onClick={() => notify(`${label} coming soon`)}><span className="gift-icon"><Icon size={21} /></span><span>{label}</span><small>COMING SOON</small></button>)}</div></section>
    </main>

    <footer className="footer"><div className="container footer-inner"><div className="footer-brand"><a className="brand" href="#top"><span className="brand-mark"><span /></span><span className="brand-word">EGOR<small>GAMING</small></span></a><p>Built for competitive gamers<br />worldwide.</p></div><div className="footer-links"><span>FAQ</span><span>Terms & Privacy</span><span>Contact</span></div><div className="footer-end"><span>© 2026 EGOR GAMING</span><span>ALGIERS / DZ</span></div></div></footer>
    {notice && <div className="toast"><span className="status-dot" /> {notice}</div>}
  </div>;
}
