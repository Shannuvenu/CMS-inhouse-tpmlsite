import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import type { MediaAsset } from "@prisma/client";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Saves an uploaded image File to Vercel Blob storage and returns the
 * metadata needed to create a MediaAsset row.
 *
 * Previously wrote to /public/uploads via fs.writeFile — worked locally
 * and would work on a real persistent server (EC2), but silently failed
 * on Vercel: its serverless functions run on a read-only, ephemeral
 * filesystem, so nothing written there ever actually persisted. Vercel
 * Blob is the correct managed storage for this deployment target.
 *
 * Requires the Blob store to be connected in the Vercel dashboard
 * (Project → Storage → Create Database → Blob), which auto-provisions
 * the BLOB_READ_WRITE_TOKEN environment variable used implicitly here.
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

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true, // avoids collisions between uploads with the same filename
  });

  return {
    url: blob.url,
    fileName: blob.pathname,
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