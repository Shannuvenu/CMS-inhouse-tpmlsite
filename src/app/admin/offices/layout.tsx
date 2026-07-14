import { requireSectionAccess } from "@/lib/access";

export default async function OfficesAdminLayout({ children }: { children: React.ReactNode }) {
  await requireSectionAccess("offices");
  return <>{children}</>;
}