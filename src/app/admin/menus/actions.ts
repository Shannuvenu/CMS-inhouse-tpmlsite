"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function createMenuItem(formData: FormData) {
  await requireAdminUser();

  const location = String(formData.get("location") ?? "HEADER");
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isActive = formData.get("isActive") === "on";

  if (!label || !url) throw new Error("Label and URL are required.");
  if (!url.startsWith("/") && !url.startsWith("http")) {
    throw new Error("URL should start with / (internal) or http (external).");
  }

  await prisma.menuItem.create({
    data: { location, label, url, sortOrder, isActive },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function updateMenuItem(id: number, formData: FormData) {
  await requireAdminUser();

  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isActive = formData.get("isActive") === "on";

  if (!label || !url) throw new Error("Label and URL are required.");

  await prisma.menuItem.update({
    where: { id },
    data: { label, url, sortOrder, isActive },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/menus");
  redirect("/admin/menus");
}

export async function deleteMenuItem(id: number) {
  await requireAdminUser();
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/menus");
}