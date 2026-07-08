import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { slugify } from "@/lib/slugify";
import { prisma } from "@/lib/prisma";
import type { MediaAsset } from "@prisma/client";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

/**
 * Saves an uploaded image File to /public/uploads and returns the metadata
 * needed to create a MediaAsset row. Local-disk storage only — fine for a
 * college project and for demoing locally, but this does NOT work if you
 * later deploy to Vercel (its filesystem is read-only/ephemeral in
 * production). If you deploy, this needs to point at S3/Cloudinary instead
 * — same function signature, different implementation inside.
 */
export async function saveUploadedFile(file: File): Promise<{
  url: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image is too large — max 5MB.");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name) || "";
  const base = slugify(path.basename(file.name, ext)) || "upload";
  const fileName = `${Date.now()}-${base}${ext}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${fileName}`,
    fileName,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

/** Saves an uploaded image and creates its MediaAsset row in one step. */
export async function saveUploadedImageAsset(file: File, altText: string | null): Promise<MediaAsset> {
  const saved = await saveUploadedFile(file);
  return prisma.mediaAsset.create({
    data: {
      fileName: saved.fileName,
      url: saved.url,
      mimeType: saved.mimeType,
      sizeBytes: saved.sizeBytes,
      altText,
    },
  });
}
