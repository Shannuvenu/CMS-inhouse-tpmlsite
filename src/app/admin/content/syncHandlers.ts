import { prisma } from "@/lib/prisma";

export type SyncHandler = {
  label: string;
  publicPaths: string[];
  fetchCurrent: () => Promise<unknown>;
  sync: (parsed: unknown) => Promise<void>;
};

function requireArray(parsed: unknown, key: string): unknown[] {
  if (!Array.isArray(parsed)) {
    throw new Error(`"${key}" must be a JSON array.`);
  }
  return parsed;
}

// To add a new synced content type later: add one entry here.
// Nothing else in the content editor needs to change.
export const SYNC_HANDLERS: Record<string, SyncHandler> = {
  brands: {
    label: "Brands",
    publicPaths: ["/brands"],
    fetchCurrent: async () => {
      const brands = await prisma.brand.findMany({ orderBy: { createdAt: "asc" } });
      return brands.map((b) => ({
        name: b.name,
        type: b.type,
        website: b.website,
        tagline: b.tagline,
        description: b.description,
        launched: b.launched,
        supplements: b.supplements,
      }));
    },
    sync: async (parsed) => {
      const items = requireArray(parsed, "brands") as Array<{
        name: string;
        type?: string;
        website?: string;
        tagline?: string;
        description?: string;
        launched?: string;
        supplements?: string[];
      }>;
      for (const b of items) {
        if (!b.name) throw new Error("Every brand needs a 'name' field.");
      }
      await prisma.$transaction([
        prisma.brand.deleteMany(),
        prisma.brand.createMany({
          data: items.map((b) => ({
            name: b.name,
            type: b.type ?? null,
            website: b.website ?? null,
            tagline: b.tagline ?? null,
            description: b.description ?? null,
            launched: b.launched ?? null,
            supplements: b.supplements ?? [],
          })),
        }),
      ]);
    },
  },

  team: {
    label: "Team members",
    publicPaths: ["/team"],
    fetchCurrent: async () => {
      const members = await prisma.teamMember.findMany({
        include: { category: true },
        orderBy: { sortOrder: "asc" },
      });
      return members.map((m) => ({
        category: m.category.slug,
        fullName: m.fullName,
        designation: m.designation,
        email: m.email,
        bio: m.bio,
        sortOrder: m.sortOrder,
        isPublished: m.isPublished,
      }));
    },
    sync: async (parsed) => {
      const items = requireArray(parsed, "team") as Array<{
        category: string;
        fullName: string;
        designation: string;
        email?: string;
        bio?: string;
        sortOrder?: number;
        isPublished?: boolean;
      }>;

      const categories = await prisma.teamCategory.findMany();
      const bySlug = new Map(categories.map((c) => [c.slug, c.id]));
      const validSlugs = categories.map((c) => c.slug).join(", ");

      for (const m of items) {
        if (!m.fullName || !m.designation) {
          throw new Error("Every team member needs 'fullName' and 'designation'.");
        }
        if (!bySlug.has(m.category)) {
          throw new Error(
            `Unknown category "${m.category}" for ${m.fullName}. Valid categories: ${validSlugs}`
          );
        }
      }

      // NOTE: this wipes photoId on every existing member — see the warning
      // in the chat message this code came with. Use /admin/team for
      // single-person edits that need a photo attached.
      await prisma.$transaction([
        prisma.teamMember.deleteMany(),
        prisma.teamMember.createMany({
          data: items.map((m) => ({
            categoryId: bySlug.get(m.category)!,
            fullName: m.fullName,
            designation: m.designation,
            email: m.email ?? null,
            bio: m.bio ?? null,
            sortOrder: m.sortOrder ?? 0,
            isPublished: m.isPublished ?? true,
          })),
        }),
      ]);
    },
  },

  careers: {
    label: "Job openings",
    publicPaths: ["/careers"],
    fetchCurrent: async () => {
      const jobs = await prisma.jobOpening.findMany({ orderBy: { sortOrder: "asc" } });
      return jobs.map((j) => ({
        slug: j.slug,
        position: j.position,
        brand: j.brand,
        location: j.location,
        experience: j.experience,
        qualification: j.qualification,
        numberOfPositions: j.numberOfPositions,
        responsibilities: j.responsibilities,
        candidateSpecs: j.candidateSpecs,
        howToApply: j.howToApply,
        applyEmail: j.applyEmail,
        status: j.status,
        sortOrder: j.sortOrder,
      }));
    },
    sync: async (parsed) => {
      const items = requireArray(parsed, "careers") as Array<{
        slug: string;
        position: string;
        brand?: string;
        location: string;
        experience: string;
        qualification: string;
        numberOfPositions?: number;
        responsibilities?: string[];
        candidateSpecs?: string[];
        howToApply?: string;
        applyEmail?: string;
        status?: string;
        sortOrder?: number;
      }>;

      for (const j of items) {
        if (!j.slug || !j.position || !j.location || !j.experience || !j.qualification) {
          throw new Error(
            "Every job needs 'slug', 'position', 'location', 'experience', and 'qualification'."
          );
        }
      }
      const slugs = items.map((j) => j.slug);
      if (new Set(slugs).size !== slugs.length) {
        throw new Error("Duplicate slugs found — every job needs a unique slug.");
      }

      await prisma.$transaction([
        prisma.jobOpening.deleteMany(),
        prisma.jobOpening.createMany({
          data: items.map((j) => ({
            slug: j.slug,
            position: j.position,
            brand: j.brand ?? null,
            location: j.location,
            experience: j.experience,
            qualification: j.qualification,
            numberOfPositions: j.numberOfPositions ?? 1,
            responsibilities: j.responsibilities ?? [],
            candidateSpecs: j.candidateSpecs ?? [],
            howToApply: j.howToApply ?? null,
            applyEmail: j.applyEmail ?? null,
            status: j.status ?? "DRAFT",
            sortOrder: j.sortOrder ?? 0,
            publishedAt: j.status === "OPEN" ? new Date() : null,
          })),
        }),
      ]);
    },
  },

  contact: {
    label: "Contact offices",
    publicPaths: ["/contact"],
    fetchCurrent: async () => {
      const offices = await prisma.office.findMany({ include: { contacts: true } });
      return offices.map((o) => ({
        city: o.city,
        address: o.address,
        phone: o.phone,
        region: o.region,
        contacts: o.contacts.map((c) => ({
          role: c.role,
          name: c.name,
          phone: c.phone,
          email: c.email,
        })),
      }));
    },
    sync: async (parsed) => {
      const items = requireArray(parsed, "contact") as Array<{
        city: string;
        address?: string;
        phone?: string;
        region?: string;
        contacts?: Array<{ role: string; name: string; phone?: string; email?: string }>;
      }>;

      for (const o of items) {
        if (!o.city) throw new Error("Every office needs a 'city'.");
      }

      await prisma.officeContact.deleteMany();
      await prisma.office.deleteMany();
      for (const o of items) {
        await prisma.office.create({
          data: {
            city: o.city,
            address: o.address ?? null,
            phone: o.phone ?? null,
            region: o.region ?? null,
            contacts: {
              create: (o.contacts ?? []).map((c) => ({
                role: c.role,
                name: c.name,
                phone: c.phone ?? null,
                email: c.email ?? null,
              })),
            },
          },
        });
      }
    },
  },

  testimonials: {
    label: "Testimonials",
    publicPaths: ["/testimonials"],
    fetchCurrent: async () => {
      const items = await prisma.testimonial.findMany();
      return items.map((t) => ({
        quoteSummary: t.quoteSummary,
        name: t.name,
        title: t.title,
        category: t.category,
      }));
    },
    sync: async (parsed) => {
      const items = requireArray(parsed, "testimonials") as Array<{
        quoteSummary: string;
        name: string;
        title: string;
        category?: string;
      }>;

      for (const t of items) {
        if (!t.quoteSummary || !t.name || !t.title) {
          throw new Error("Every testimonial needs 'quoteSummary', 'name', and 'title'.");
        }
      }

      await prisma.$transaction([
        prisma.testimonial.deleteMany(),
        prisma.testimonial.createMany({
          data: items.map((t) => ({
            quoteSummary: t.quoteSummary,
            name: t.name,
            title: t.title,
            category: t.category ?? "reader",
          })),
        }),
      ]);
    },
  },
};