import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolve a `client/public` path against the deploy base path.
 *
 * Vite only rewrites the asset URLs it can see (imports, `index.html`, CSS).
 * Paths that are plain strings in our data — game artwork, reward icons, the
 * logo — are passed straight to the DOM, so they have to pick up the base
 * themselves. `BASE_URL` is `"/"` locally and `"/egor-lobby-redesign/"` on
 * GitHub Pages: without this a bare `"/icons/gifts/top-ups.png"` resolves to
 * `https://<user>.github.io/icons/...` and 404s on the deployed site.
 *
 * Absolute URLs (`https://…`, `data:…`, `blob:…`) are passed through untouched.
 */
export function assetUrl(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
