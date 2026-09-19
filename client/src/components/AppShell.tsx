import { useEffect, useState, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Radio,
  Search,
  Sun,
  Swords,
  Trophy,
  X,
} from "lucide-react";
import { useLocation } from "wouter";
import { SearchDialog, type SearchItem } from "@/components/SearchDialog";
import { BrandLockup, BrandMark } from "@/components/BrandLogo";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";
import {
  LoginModal,
  RegisterModal,
  type UserProfile,
} from "@/components/AuthModals";
import { arenas, games, tournaments } from "@/data/catalog";

const NAV_ITEMS = [
  { label: "Lobby", icon: LayoutGrid },
  { label: "Stadium", icon: Trophy },
  { label: "Board", icon: Swords },
  { label: "Store", icon: CircleDollarSign },
  { label: "Feed", icon: Radio },
];

/**
 * The chrome every EGOR page shares: the fixed topbar (brand, nav, search,
 * auth), the ⌘K search dialog, the login/register modals and the footer.
 *
 * Pages render their own <main> as `children` and may pass:
 *  - `onSearchSelect` — page-specific handling of a search-dialog pick
 *    (Home filters + scrolls, the catalog pre-fills its query). Without it a
 *    sensible default applies: games open the catalog, matches jump to the
 *    lobby stadium, arenas jump to the lobby arena wall.
 */
export function AppShell({
  activeNav = "Lobby",
  onSearchSelect,
  children,
}: {
  activeNav?: string;
  onSearchSelect?: (item: SearchItem) => void;
  children: ReactNode;
}) {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(activeNav);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { notify } = useToast();

  const goHome = () => {
    if (location !== "/") navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (label: string) => {
    setMobileOpen(false);
    if (label === "Lobby") {
      setActive("Lobby");
      goHome();
    } else {
      notify(`${label} preview coming soon`);
    }
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (onSearchSelect) {
      onSearchSelect(item);
      return;
    }
    switch (item.type) {
      case "game":
        navigate(`/games?game=${encodeURIComponent(item.title)}`);
        break;
      case "tournament":
      case "scrim":
        navigate("/?jump=tournaments");
        break;
      case "arena":
        navigate("/?jump=arenas");
        break;
      default:
        notify(`${item.title} preview coming soon`);
    }
  };

  // Global shortcut (Cmd+K / Ctrl+K) for search
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
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
    if (
      path.includes("/login") ||
      hash.includes("login") ||
      search.includes("login")
    ) {
      setLoginOpen(true);
    } else if (
      path.includes("/register") ||
      hash.includes("register") ||
      search.includes("register")
    ) {
      setRegisterOpen(true);
    }
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        {/* Brand Logo — symbol only, no wordmark */}
        <a
          className="brand"
          href="/"
          onClick={e => {
            e.preventDefault();
            goHome();
          }}
        >
          <BrandMark size="lg" />
        </a>

        {/* Center Navigation Links */}
        <nav className={mobileOpen ? "main-nav main-nav--open" : "main-nav"}>
          {NAV_ITEMS.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={
                active === label ? "nav-item nav-item--active" : "nav-item"
              }
              onClick={() => handleNav(label)}
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
        <div
          className={
            mobileOpen ? "top-actions top-actions--menu-open" : "top-actions"
          }
        >
          {/* Light / Dark Theme Toggle */}
          <button
            className="top-theme-btn"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

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
                        <span>
                          {user.rank} · {user.tag}
                        </span>
                      </div>
                    </div>
                    <div className="profile-dropdown-stats">
                      <div>
                        <span>XP</span>
                        <strong>{user.xp}</strong>
                      </div>
                      <div>
                        <span>TOURNAMENTS</span>
                        <strong>{user.tournamentsCount} ACTIVE</strong>
                      </div>
                    </div>
                    <div className="profile-dropdown-items">
                      <button
                        className="profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/?jump=tournaments");
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

      {children}

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <a
              className="brand"
              href="/"
              onClick={e => {
                e.preventDefault();
                goHome();
              }}
            >
              <BrandLockup />
            </a>
            <p>
              Built for competitive gamers
              <br />
              worldwide.
            </p>
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
            <span onClick={() => notify("Contact: contact@egorgaming.com")}>
              Contact
            </span>
          </div>
          <div className="footer-end">
            <span>© 2026 EGOR GAMING</span>
            <span>ALGIERS / DZ</span>
          </div>
        </div>
      </footer>

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
        onSuccess={u => setUser(u)}
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
        onSuccess={u => setUser(u)}
        notify={notify}
      />
    </div>
  );
}
