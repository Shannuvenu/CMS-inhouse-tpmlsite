import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [teamCount, publishedTeamCount, jobCount, openJobCount] = await Promise.all([
    prisma.teamMember.count(),
    prisma.teamMember.count({ where: { isPublished: true } }),
    prisma.jobOpening.count(),
    prisma.jobOpening.count({ where: { status: "OPEN" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Edit Team and Careers content. Changes go live on the public site immediately.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/team"
          className="rounded-lg border border-zinc-200 p-6 hover:border-zinc-400"
        >
          <h2 className="font-semibold text-zinc-900">Team Members</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {publishedTeamCount} published · {teamCount} total
          </p>
        </Link>

        <Link
          href="/admin/careers"
          className="rounded-lg border border-zinc-200 p-6 hover:border-zinc-400"
        >
          <h2 className="font-semibold text-zinc-900">Job Openings</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {openJobCount} open · {jobCount} total
          </p>
        </Link>
      </div>
    </div>
  );
}
