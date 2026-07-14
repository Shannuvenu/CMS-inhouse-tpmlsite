import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-sm text-zinc-500">
        <span>Admin panel</span>
        <UserButton />
      </div>

      <nav className="mt-4 flex flex-wrap gap-6 border-b border-zinc-200 pb-4 text-sm font-medium">
        <Link href="/admin" className="text-zinc-900 hover:underline">Dashboard</Link>
        <Link href="/admin/team" className="text-zinc-900 hover:underline">Team</Link>
        <Link href="/admin/careers" className="text-zinc-900 hover:underline">Careers</Link>
        <Link href="/admin/career-banners" className="text-zinc-900 hover:underline">Career Banners</Link>
        <Link href="/admin/offices" className="text-zinc-900 hover:underline">Offices</Link>
        <Link href="/admin/content" className="text-zinc-900 hover:underline">Content</Link>
        <Link href="/admin/menus" className="text-zinc-900 hover:underline">Menus</Link>
        <Link href="/" className="ml-auto text-zinc-500 hover:underline">← Back to public site</Link>
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}