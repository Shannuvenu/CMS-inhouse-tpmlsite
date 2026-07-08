"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

type BrandJson = {
  name: string;
  type?: string;
  website?: string;
  tagline?: string;
  description?: string;
  launched?: string;
  supplements?: string[];
};

export async function saveContentBlock(formData: FormData) {
  await requireAdminUser();

  const key = String(formData.get("key") ?? "").trim();
  const rawJson = String(formData.get("jsonData") ?? "");

  if (!key) throw new Error("Key is required.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error("That's not valid JSON — check for a missing comma or bracket.");
  }

  if (key === "brands") {
    if (!Array.isArray(parsed)) {
      throw new Error("Brands must be a JSON array of brand objects.");
    }
    const brands = parsed as BrandJson[];
    for (const b of brands) {
      if (!b.name) throw new Error("Every brand needs a 'name' field.");
    }

    // Sync into the real Brand table — wipe and recreate.
    // Safe because there's no separate admin CRUD for Brand yet;
    // if that gets built later, this needs to become smarter (upsert
    // by name instead of delete-all) so it doesn't clobber concurrent edits.
    await prisma.$transaction([
      prisma.brand.deleteMany(),
      prisma.brand.createMany({
        data: brands.map((b) => ({
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

    revalidatePath("/brands");
  } else {
    await prisma.pageContent.upsert({
      where: { key },
      create: { key, data: parsed as object },
      update: { data: parsed as object },
    });

    revalidatePath(`/${key}`);
  }

  revalidatePath("/admin/content");
  redirect("/admin/content");
}

export async function deleteContentBlock(key: string) {
  await requireAdminUser();
  await prisma.pageContent.delete({ where: { key } });
  revalidatePath("/admin/content");
}