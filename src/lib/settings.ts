import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * SiteSetting is stored as loose key/value rows (see prisma/schema.prisma).
 * This turns it into a plain object so pages/components can do
 * `settings.site_tagline` instead of hitting the DB shape directly.
 *
 * Wrapped in React's cache() so multiple components calling this in the
 * same request/render (e.g. Header + page content both needing settings)
 * share one DB query instead of firing it multiple times. Combined with
 * `revalidate` on the pages that call it, this becomes near-free after
 * the first hit.
 *
 * Missing keys resolve to `undefined` — callers should provide a fallback,
 * since content isn't guaranteed to exist yet (e.g. before mam finishes
 * filling in every setting).
 */
export const getSiteSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
});