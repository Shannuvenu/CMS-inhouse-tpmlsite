import { prisma } from "@/lib/prisma";

/**
 * SiteSetting is stored as loose key/value rows (see prisma/schema.prisma).
 * This turns it into a plain object so pages/components can do
 * `settings.site_tagline` instead of hitting the DB shape directly.
 *
 * Missing keys resolve to `undefined` — callers should provide a fallback,
 * since content isn't guaranteed to exist yet (e.g. before mam finishes
 * filling in every setting).
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
