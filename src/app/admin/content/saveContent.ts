"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";
import { SYNC_HANDLERS } from "@/app/admin/content/syncHandlers";

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

  const handler = SYNC_HANDLERS[key];

  if (handler) {
    await handler.sync(parsed);
    for (const path of handler.publicPaths) revalidatePath(path);
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