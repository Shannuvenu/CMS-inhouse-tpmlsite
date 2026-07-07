import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/admin/auth-actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // middleware.ts already blocks unauthenticated requests to /admin/* (cheap,
  // signature-only check). This is the real check: confirms the session
  // hasn't expired/been revoked and the user account is still active.
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-sm text-zinc-500">
        <span>
          Signed in as <span className="font-medium text-zinc-900">{user.email}</span>
        </span>
        <form action={logoutAction}>
          <button type="submit" className="font-medium text-zinc-600 hover:text-zinc-900">
            Sign out
          </button>
        </form>
      </div>

      <nav className="mt-4 flex gap-6 border-b border-zinc-200 pb-4 text-sm font-medium">
        <Link href="/admin" className="text-zinc-900 hover:underline">
          Dashboard
        </Link>
        <Link href="/admin/team" className="text-zinc-900 hover:underline">
          Team
        </Link>
        <Link href="/admin/careers" className="text-zinc-900 hover:underline">
          Careers
        </Link>
        <Link href="/admin/career-banners" className="text-zinc-900 hover:underline">
          Career Banners
        </Link>
        <Link href="/" className="ml-auto text-zinc-500 hover:underline">
          ← Back to public site
        </Link>
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
