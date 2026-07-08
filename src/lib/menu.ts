import { prisma } from "@/lib/prisma";

export type MenuLocation = "HEADER" | "FOOTER";

export async function getMenuItems(location: MenuLocation) {
  return prisma.menuItem.findMany({
    where: { location, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}