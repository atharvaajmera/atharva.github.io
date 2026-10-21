const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://atharva-portfolio-liart.vercel.app";

/** Canonical site URL without a trailing slash. */
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

/** Base path used when the site is hosted under a GitHub Pages project URL. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The contact API still runs on Vercel because GitHub Pages is static-only.
 * Falls back to a same-origin API route when deployed on Vercel.
 */
export const contactApiUrl =
  process.env.NEXT_PUBLIC_CONTACT_API_URL ?? "/api/contact";

/** Prefix a public asset path with the GitHub Pages base path. */
export function assetPath(path: string) {
  if (/^(https?:)?\/\//.test(path)) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
