import { requireSectionAccess } from "@/lib/access";

export default async function LegacyAdminLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess("legacy");
  return <>{children}</>;
}