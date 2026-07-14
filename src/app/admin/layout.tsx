import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getAccess } from "@/lib/access";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const access = await getAccess();
  const isAdmin = access?.role === "admin";
  const can = (section: string) => isAdmin || access?.sections.includes(section as never);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-sm text-zinc-500">
        <span>Admin panel {isAdmin ? "" : "— limited access"}</span>
        <UserButton />
      </div>

      <nav className="mt-4 flex flex-wrap gap-6 border-b border-zinc-200 pb-4 text-sm font-medium">
        <Link href="/admin" className="text-zinc-900 hover:underline">Dashboard</Link>
        {can("brands") && <Link href="/admin/brands" className="text-zinc-900 hover:underline">Brands</Link>}
        {can("team") && <Link href="/admin/team" className="text-zinc-900 hover:underline">Team</Link>}
        {can("careers") && <Link href="/admin/careers" className="text-zinc-900 hover:underline">Careers</Link>}
        {can("career-banners") && <Link href="/admin/career-banners" className="text-zinc-900 hover:underline">Career Banners</Link>}
        {can("offices") && <Link href="/admin/offices" className="text-zinc-900 hover:underline">Offices</Link>}
        {can("legacy") && <Link href="/admin/legacy" className="text-zinc-900 hover:underline">Legacy</Link>}
        {isAdmin && <Link href="/admin/content" className="text-zinc-900 hover:underline">Content</Link>}
        {isAdmin && <Link href="/admin/menus" className="text-zinc-900 hover:underline">Menus</Link>}
        <Link href="/" className="ml-auto text-zinc-500 hover:underline">← Back to public site</Link>
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}