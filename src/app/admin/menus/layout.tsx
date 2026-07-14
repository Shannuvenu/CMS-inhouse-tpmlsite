import { requireAdmin } from "@/lib/access";

export default async function MenusAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}