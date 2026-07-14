"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

type ContactInput = { role: string; name: string; phone?: string; email?: string };

function parseContacts(raw: string): ContactInput[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    throw new Error("Contacts data is corrupted — try re-adding them.");
  }
  if (!Array.isArray(parsed)) throw new Error("Contacts must be a list.");
  for (const c of parsed as ContactInput[]) {
    if (!c.role || !c.name) throw new Error("Every contact needs a role and a name.");
  }
  return parsed as ContactInput[];
}

export async function createOffice(formData: FormData) {
  await requireAdminUser();

  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const contacts = parseContacts(String(formData.get("contactsJson") ?? "[]"));

  if (!city) throw new Error("City is required.");

  await prisma.office.create({
    data: {
      city,
      address,
      phone,
      region,
      contacts: { create: contacts },
    },
  });

  revalidatePath("/contact");
  revalidatePath("/admin/offices");
  redirect("/admin/offices");
}

export async function updateOffice(id: string, formData: FormData) {
  await requireAdminUser();

  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const region = String(formData.get("region") ?? "").trim() || null;
  const contacts = parseContacts(String(formData.get("contactsJson") ?? "[]"));

  if (!city) throw new Error("City is required.");

  await prisma.$transaction([
    prisma.officeContact.deleteMany({ where: { officeId: id } }),
    prisma.office.update({
      where: { id },
      data: {
        city,
        address,
        phone,
        region,
        contacts: { create: contacts },
      },
    }),
  ]);

  revalidatePath("/contact");
  revalidatePath("/admin/offices");
  redirect("/admin/offices");
}

export async function deleteOffice(id: string) {
  await requireAdminUser();
  await prisma.officeContact.deleteMany({ where: { officeId: id } });
  await prisma.office.delete({ where: { id } });
  revalidatePath("/contact");
  revalidatePath("/admin/offices");
}