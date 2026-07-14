import { requireSectionAccess } from "@/lib/access";

export default async function TeamAdminLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess("team");
  return <>{children}</>;
}