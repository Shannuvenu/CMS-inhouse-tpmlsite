import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";

export type Section =
  | "team"
  | "careers"
  | "career-banners"
  | "brands"
  | "offices"
  | "legacy";
export type AccessInfo = {
  role: "admin" | "editor";
  sections: Section[];
};

export async function getAccess(): Promise<AccessInfo | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = user.publicMetadata as { role?: string; sections?: string[] };

  return {
    role: meta.role === "admin" ? "admin" : "editor",
    sections: (meta.sections ?? []) as Section[],
  };
}

/** Use in Server Actions for a specific section (team, careers, etc.) */
export async function requireSectionAccess(section: Section): Promise<AccessInfo> {
  const access = await getAccess();
  if (!access) throw new Error("Not authenticated.");
  if (access.role === "admin") return access;
  if (!access.sections.includes(section)) {
    throw new Error(`You don't have access to the ${section} section. Ask an admin for access.`);
  }
  return access;
}

/** Use for admin-only areas (Content editor, Menus) — too cross-cutting to section off. */
export async function requireAdmin(): Promise<AccessInfo> {
  const access = await getAccess();
  if (!access) throw new Error("Not authenticated.");
  if (access.role !== "admin") {
    throw new Error("Only admins can access this section.");
  }
  return access;
}