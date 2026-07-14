import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteJobOpening } from "@/app/admin/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const jobs = await prisma.jobOpening.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Job Openings</h1>
        <Link href="/admin/careers/new" className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          + Add job opening
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {jobs.length === 0 && <p className="text-sm text-zinc-500">No job openings yet.</p>}
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
            <div>
              <span className="font-medium text-zinc-900">{job.position}</span>
              <span className="ml-2 text-xs text-zinc-400">{job.location} — {job.status}</span>
            </div>
            <DeleteButton
              action={deleteJobOpening.bind(null, job.id)}
              confirmMessage={`Delete "${job.position}"? This can't be undone.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}  