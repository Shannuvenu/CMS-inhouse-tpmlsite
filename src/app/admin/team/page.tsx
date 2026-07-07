import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTeamMember } from "@/app/admin/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const categories = await prisma.teamCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      members: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Team Members</h1>
        <Link
          href="/admin/team/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Add team member
        </Link>
      </div>

      <div className="mt-8 space-y-10">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {category.name}{" "}
              <span className="font-normal normal-case">({category.slug})</span>
            </h2>

            {category.members.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">No members in this category yet.</p>
            ) : (
              <table className="mt-3 w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs text-zinc-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Designation</th>
                    <th className="py-2">Published</th>
                    <th className="py-2">Order</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {category.members.map((member) => (
                    <tr key={member.id} className="border-b border-zinc-100">
                      <td className="py-2 font-medium text-zinc-900">{member.fullName}</td>
                      <td className="py-2 text-zinc-600">{member.designation}</td>
                      <td className="py-2">
                        {member.isPublished ? (
                          <span className="text-green-700">Yes</span>
                        ) : (
                          <span className="text-zinc-400">No</span>
                        )}
                      </td>
                      <td className="py-2 text-zinc-500">{member.sortOrder}</td>
                      <td className="py-2 text-right">
                        <Link
                          href={`/admin/team/${member.id}/edit`}
                          className="mr-4 text-xs font-medium text-zinc-700 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          action={deleteTeamMember.bind(null, member.id)}
                          confirmMessage={`Delete ${member.fullName}? This can't be undone.`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
