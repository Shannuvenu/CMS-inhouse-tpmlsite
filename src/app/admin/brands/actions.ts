"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/access";

function linesToArray(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value.split("\n").map((l) => l.trim()).filter(Boolean);
}

export async function createBrand(formData: FormData) {
  await requireSectionAccess("brands");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Brand name is required.");

  await prisma.brand.create({
    data: {
      name,
      type: String(formData.get("type") ?? "").trim() || null,
      website: String(formData.get("website") ?? "").trim() || null,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      launched: String(formData.get("launched") ?? "").trim() || null,
      supplements: linesToArray(formData.get("supplements")),
    },
  });

  revalidatePath("/brands");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function updateBrand(id: string, formData: FormData) {
  await requireSectionAccess("brands");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Brand name is required.");

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      type: String(formData.get("type") ?? "").trim() || null,
      website: String(formData.get("website") ?? "").trim() || null,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      launched: String(formData.get("launched") ?? "").trim() || null,
      supplements: linesToArray(formData.get("supplements")),
    },
  });

  revalidatePath("/brands");
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

export async function deleteBrand(id: string) {
  await requireSectionAccess("brands");
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/brands");
  revalidatePath("/admin/brands");
}