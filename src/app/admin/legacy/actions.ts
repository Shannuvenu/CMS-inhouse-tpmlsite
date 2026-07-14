"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/access";

export async function saveLegacyContent(formData: FormData) {
  await requireSectionAccess("legacy");

  const heading = String(formData.get("heading") ?? "").trim();
  const paragraphsRaw = String(formData.get("paragraphs") ?? "");
  const paragraphs = paragraphsRaw
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  if (!heading) throw new Error("Heading is required.");
  if (paragraphs.length === 0) throw new Error("Add at least one paragraph.");

  await prisma.pageContent.upsert({
    where: { key: "legacy" },
    create: { key: "legacy", data: { heading, paragraphs } },
    update: { data: { heading, paragraphs } },
  });

  revalidatePath("/legacy");
  revalidatePath("/admin/legacy");
  redirect("/admin/legacy");
}