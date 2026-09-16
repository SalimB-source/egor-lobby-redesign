import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Crosshair,
  Gamepad2,
  Search,
  Sparkles,
  Swords,
  Trophy,
  Users,
  X,
} from "lucide-react";

export interface SearchItem {
  id: string;
  type: "game" | "tournament" | "scrim" | "arena" | "store";
  title: string;
  subtitle: string;
  badge?: string;
  tag?: string;
  tone?: string;
}

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: SearchItem) => void;
  games: Array<{ name: string; short: string; tone: string; players: string; icon: string }>;
  tournaments: Array<{ title: string; game: string; status: string; date: string; teams: string; prize: string; tone: string; icon: string }>;
  arenas: Array<{ name: string; tag: string; members: string; desc: string; tone: string; mark: string }>;
}

export function SearchDialog({
  isOpen,
  onClose,
  onSelect,
  games,
  tournaments,
  arenas,
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setFilterType("all");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Aggregate searchable items
  const allItems = useMemo<SearchItem[]>(() => {
    const list: SearchItem[] = [];

    // Games
    games.forEach((g) => {
      list.push({
        id: `game-${g.name}`,
        type: "game",
        title: g.name,
        subtitle: `${g.players} active competitors`,
        badge: g.short,
        tag: "Game Loadout",
        tone: g.tone,
      });
    });

    // Tournaments
    tournaments.forEach((t) => {
      list.push({
        id: `tournament-${t.title}`,
        type: "tournament",
        title: t.title,
        subtitle: `${t.game} · ${t.date} · Prize: ${t.prize}`,
        badge: t.status,
        tag: "Tournament",
        tone: t.tone,
      });
    });

    // Scrims
    list.push({
      id: "scrim-refuge-1",
      type: "scrim",
      title: "REFUGE ACADEMY SCRIM",
      subtitle: "Free Fire · The Refuge Academy · 12/15 Teams",
      badge: "FEATURED",
      tag: "Scrim",
      tone: "blue",
    });
    list.push({
      id: "scrim-refuge-2",
      type: "scrim",
      title: "REFUGE DZ TRNG D-4",
      subtitle: "Free Fire · 16 / 09 / 2026 · 14/15 Teams",
      badge: "START SOON",
      tag: "Scrim",
      tone: "lime",
    });

    // Arenas
    arenas.forEach((a) => {
      list.push({
        id: `arena-${a.name}`,
        type: "arena",
        title: a.name,
        subtitle: `${a.members} members · ${a.tag}`,
        badge: a.mark,
        tag: "Arena Hub",
        tone: a.tone,
      });
    });

    return list;
  }, [games, tournaments, arenas]);

  // Filtered items
  const filtered = useMemo(() => {
    let result = allItems;
    if (filterType !== "all") {
      result = result.filter((item) => item.type === filterType);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.tag?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [allItems, filterType, query]);

  if (!isOpen) return null;

  return (
    <div
      className="egor-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
    >
      <div className="egor-search-panel">
        {/* Header with Search Bar */}
        <div className="egor-search-header">
          <Search size={18} className="egor-search-icon" />
          <input
            ref={inputRef}
            type="text"
            className="egor-search-input"
            placeholder="Search tournaments, games, scrims, arenas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query ? (
            <button
              className="egor-search-clear"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear query"
            >
              <X size={15} />
            </button>
          ) : (
            <span className="egor-search-hint">ESC to close</span>
          )}
          <button className="egor-modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="egor-search-filters">
          {[
            { id: "all", label: "All Items" },
            { id: "tournament", label: "Tournaments", icon: Trophy },
            { id: "scrim", label: "Scrims", icon: Swords },
            { id: "game", label: "Games", icon: Gamepad2 },
            { id: "arena", label: "Arenas", icon: Users },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                className={`egor-filter-pill ${filterType === cat.id ? "is-active" : ""}`}
                onClick={() => setFilterType(cat.id)}
              >
                {Icon && <Icon size={12} />}
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div className="egor-search-results">
          {filtered.length === 0 ? (
            <div className="egor-search-empty">
              <Crosshair size={32} className="opacity-30 mb-2" />
              <p>No results found for &ldquo;{query}&rdquo;</p>
              <small>Try searching &ldquo;Free Fire&rdquo;, &ldquo;PUBG&rdquo;, or &ldquo;Amja&rdquo;</small>
            </div>
          ) : (
            <div className="egor-search-list">
              <div className="egor-search-count">
                <span>{filtered.length} RESULTS</span>
                <span className="text-muted">SELECT TO NAVIGATE</span>
              </div>
              {filtered.map((item) => (
                <button
                  key={item.id}
                  className={`egor-search-row egor-search-row--${item.tone || "lime"}`}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <div className="egor-search-row-lead">
                    <span className="egor-search-badge">{item.badge || "•"}</span>
                    <div>
                      <div className="egor-search-row-title">
                        <strong>{item.title}</strong>
                        <span className="egor-search-tag">{item.tag}</span>
                      </div>
                      <p className="egor-search-row-sub">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="egor-search-row-action">
                    <span>GO</span>
                    <ArrowRight size={14} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="egor-search-footer">
          <div className="egor-search-footer-info">
            <Sparkles size={13} className="text-lime" />
            <span>EGOR Search Engine · Live bracket & arena matching</span>
          </div>
          <a
            href="https://egorgaming.com/lobby"
            target="_blank"
            rel="noopener noreferrer"
            className="egor-search-external-link"
          >
            Visit egorgaming.com ↗
          </a>
        </div>
      </div>
    </div>
  );
}
