import "server-only";
import { auth } from "@clerk/nextjs/server";

export async function requireAdminUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated.");
  return { id: userId };
}

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return { id: userId };
}