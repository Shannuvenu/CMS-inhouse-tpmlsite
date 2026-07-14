import { requireAdmin } from "@/lib/access";

export default async function ContentAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}