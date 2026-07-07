import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteJobOpening } from "@/app/admin/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

const statusColor: Record<string, string> = {
  OPEN: "text-green-700",
  DRAFT: "text-zinc-400",
  CLOSED: "text-red-600",
};

export default async function AdminCareersPage() {
  const jobs = await prisma.jobOpening.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Job Openings</h1>
        <Link
          href="/admin/careers/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Add job opening
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-400">No job openings yet.</p>
      ) : (
        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500">
              <th className="py-2">Position</th>
              <th className="py-2">Brand</th>
              <th className="py-2">Location</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-zinc-100">
                <td className="py-2 font-medium text-zinc-900">{job.position}</td>
                <td className="py-2 text-zinc-600">{job.brand ?? "—"}</td>
                <td className="py-2 text-zinc-600">{job.location}</td>
                <td className={`py-2 font-medium ${statusColor[job.status] ?? ""}`}>
                  {job.status}
                </td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/careers/${job.id}/edit`}
                    className="mr-4 text-xs font-medium text-zinc-700 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteJobOpening.bind(null, job.id)}
                    confirmMessage={`Delete "${job.position}"? This can't be undone.`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
