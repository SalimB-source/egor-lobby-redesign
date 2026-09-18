import { useState, type ReactNode } from "react";

import { assetUrl } from "@/lib/utils";

/**
 * EGOR brand assets — single source of truth.
 *
 * To swap in a new logo:
 *   1. Drop the file into `client/public/` (e.g. `egor-logo.svg` or `egor-logo.png`).
 *   2. Point `LOGO_MARK_SRC` at it below (e.g. `"/egor-logo.svg"`).
 *   3. Optional: if you also have a full "symbol + wordmark" lockup image, set
 *      `LOGO_LOCKUP_SRC` and the header/footer render that as one image instead of
 *      the mark + CSS wordmark.
 *
 * Every logo on the site (top bar, footer, auth modals) reads from here. Point the
 * favicon in `client/index.html` at the same file.
 *
 * Paths are resolved through `assetUrl()` (shared from `@/lib/utils`), which prefixes
 * Vite's `BASE_URL`. That matters for the GitHub Pages deploy, where the site lives
 * under `/egor-lobby-redesign/` — a bare `/egor-logo.svg` would resolve to the domain
 * root and 404. Absolute URLs (`https://…`, `data:…`) are passed through untouched.
 *
 * If an image fails to load (missing file, deploy hiccup), the original CSS-drawn
 * geometric mark is rendered instead so the site never shows a broken image.
 */
export const LOGO_MARK_SRC: string | null = "/egor-logo.svg";
export const LOGO_LOCKUP_SRC: string | null = null;
export const LOGO_ALT = "EGOR Gaming";

export type BrandMarkSize = "sm" | "md" | "lg";

interface BrandMarkProps {
  size?: BrandMarkSize;
  className?: string;
}

/** The EGOR symbol on its own — 58px in the top bar, 34px default, 20px in modals. */
export function BrandMark({ size = "md", className }: BrandMarkProps) {
  const [failed, setFailed] = useState(false);

  const classes = [`brand-logo-img`, `brand-logo-img--${size}`, className]
    .filter(Boolean)
    .join(" ");

  if (LOGO_MARK_SRC && !failed) {
    return (
      <img
        src={assetUrl(LOGO_MARK_SRC)}
        alt={LOGO_ALT}
        className={classes}
        onError={() => setFailed(true)}
      />
    );
  }

  // Fallback: the legacy CSS-drawn mark.
  return (
    <span
      className={size === "sm" ? "brand-mark sm" : "brand-mark"}
      aria-hidden="true"
    >
      <span />
    </span>
  );
}

interface BrandLockupProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Symbol + "EGOR / GAMING" wordmark, or the full lockup image when
 * `LOGO_LOCKUP_SRC` is set. Put it inside your own <a> / <button>.
 */
export function BrandLockup({
  className = "brand-lockup",
  children,
}: BrandLockupProps) {
  const [failed, setFailed] = useState(false);

  if (LOGO_LOCKUP_SRC && !failed) {
    return (
      <span className={className}>
        <img
          src={assetUrl(LOGO_LOCKUP_SRC)}
          alt={LOGO_ALT}
          className="brand-logo-lockup"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }

  return (
    <span className={className}>
      <BrandMark />
      <span className="brand-word">
        EGOR<small>GAMING</small>
      </span>
      {children}
    </span>
  );
}
