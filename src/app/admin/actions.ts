"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { saveUploadedImageAsset } from "@/lib/uploads";
import { requireSectionAccess } from "@/lib/access";

function toLines(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// ---------- Team Members ----------

type TeamMemberInput = {
  fullName: string;
  designation: string;
  categoryId: number;
  email: string | null;
  bio: string | null;
  sortOrder: number;
  isPublished: boolean;
};

function parseTeamMemberInput(formData: FormData): TeamMemberInput {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const designation = String(formData.get("designation") ?? "").trim();
  const categoryId = Number(formData.get("categoryId"));
  const email = String(formData.get("email") ?? "").trim() || null;
  const bio = String(formData.get("bio") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const isPublished = formData.get("isPublished") === "on";

  if (!fullName || !designation || !categoryId) {
    throw new Error("Full name, designation, and category are required.");
  }
  if (email && !isValidEmail(email)) {
    throw new Error("That email address doesn't look valid.");
  }

  return { fullName, designation, categoryId, email, bio, sortOrder, isPublished };
}

export async function createTeamMember(formData: FormData) {
  await requireSectionAccess("team");
  const input = parseTeamMemberInput(formData);
  const photo = formData.get("photo");

  if (input.email) {
    const existing = await prisma.teamMember.findFirst({ where: { email: input.email } });
    if (existing) {
      throw new Error(`${input.email} is already used by another team member.`);
    }
  }

  let photoId: number | null = null;
  if (photo instanceof File && photo.size > 0) {
    const asset = await saveUploadedImageAsset(photo, input.fullName);
    photoId = asset.id;
  }

  await prisma.teamMember.create({ data: { ...input, photoId } });

  revalidatePath("/team");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateTeamMember(id: number, formData: FormData) {
  await requireSectionAccess("team");
  const input = parseTeamMemberInput(formData);
  const photo = formData.get("photo");

  const current = await prisma.teamMember.findUnique({ where: { id } });
  if (!current) throw new Error("Team member not found.");

  if (input.email) {
    const duplicate = await prisma.teamMember.findFirst({ where: { email: input.email, NOT: { id } } });
    if (duplicate) {
      throw new Error(`${input.email} is already used by another team member.`);
    }
  }

  let photoId = current.photoId;
  if (photo instanceof File && photo.size > 0) {
    const asset = await saveUploadedImageAsset(photo, input.fullName);
    photoId = asset.id;
  }

  await prisma.teamMember.update({ where: { id }, data: { ...input, photoId } });

  revalidatePath("/team");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: number) {
  await requireSectionAccess("team");
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/team");
  revalidatePath("/admin/team");
}

// ---------- Job Openings ----------
// Per mam: create/delete only. No editing an existing posting — to change
// one, delete it and add a fresh one.

type JobOpeningInput = {
  position: string;
  brand: string | null;
  location: string;
  experience: string;
  qualification: string;
  numberOfPositions: number;
  howToApply: string | null;
  applyEmail: string | null;
  status: string;
  sortOrder: number;
  responsibilities: string[];
  candidateSpecs: string[];
};

function parseJobOpeningInput(formData: FormData): JobOpeningInput {
  const position = String(formData.get("position") ?? "").trim();
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim();
  const experience = String(formData.get("experience") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  const numberOfPositions = Number(formData.get("numberOfPositions") ?? 1);
  const howToApply = String(formData.get("howToApply") ?? "").trim() || null;
  const applyEmail = String(formData.get("applyEmail") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "DRAFT");
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const responsibilities = toLines(formData.get("responsibilities"));
  const candidateSpecs = toLines(formData.get("candidateSpecs"));

  if (!position || !location || !experience || !qualification) {
    throw new Error("Position, location, experience, and qualification are required.");
  }
  if (applyEmail && !isValidEmail(applyEmail)) {
    throw new Error("The apply email doesn't look valid.");
  }

  return {
    position,
    brand,
    location,
    experience,
    qualification,
    numberOfPositions,
    howToApply,
    applyEmail,
    status,
    sortOrder,
    responsibilities,
    candidateSpecs,
  };
}

export async function createJobOpening(formData: FormData) {
  await requireSectionAccess("careers");
  const input = parseJobOpeningInput(formData);

  const baseSlug = slugify(String(formData.get("slug") ?? "") || input.position);
  let slug = baseSlug;

  let attempt = 0;
  while (true) {
    const existing = await prisma.jobOpening.findUnique({ where: { slug } });
    if (!existing) break;
    attempt += 1;
    slug = `${baseSlug}-${attempt + 1}`;
    if (attempt > 20) throw new Error("Could not generate a unique slug.");
  }

  await prisma.jobOpening.create({
    data: {
      ...input,
      slug,
      publishedAt: input.status === "OPEN" ? new Date() : null,
    },
  });

  revalidatePath("/careers");
  revalidatePath("/admin/careers");
  redirect("/admin/careers");
}

export async function deleteJobOpening(id: number) {
  await requireSectionAccess("careers");
  const job = await prisma.jobOpening.delete({ where: { id } });
  revalidatePath("/careers");
  revalidatePath(`/careers/${job.slug}`);
  revalidatePath("/admin/careers");
}

// ---------- Career Banners ----------
// Per mam: create/delete only. No toggling an existing banner's active
// state — remove and re-add if you want it off, add a new one for on.

export async function createCareerBanner(formData: FormData) {
  await requireSectionAccess("career-banners");
  const linkUrl = String(formData.get("linkUrl") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0) {
    throw new Error("An image is required to create a career banner.");
  }

  const asset = await saveUploadedImageAsset(image, linkUrl ?? "Career banner");

  await prisma.careerBanner.create({
    data: { imageId: asset.id, linkUrl, sortOrder, isActive: true },
  });

  revalidatePath("/careers");
  revalidatePath("/admin/career-banners");
  redirect("/admin/career-banners");
}

export async function deleteCareerBanner(id: number) {
  await requireSectionAccess("career-banners");
  await prisma.careerBanner.delete({ where: { id } });
  revalidatePath("/careers");
  revalidatePath("/admin/career-banners");
}