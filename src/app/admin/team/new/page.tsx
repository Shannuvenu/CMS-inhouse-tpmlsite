import { prisma } from "@/lib/prisma";
import { createTeamMember } from "@/app/admin/actions";
import TeamMemberForm from "@/app/admin/team/TeamMemberForm";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  const categories = await prisma.teamCategory.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add team member</h1>
      <div className="mt-6">
        <TeamMemberForm action={createTeamMember} categories={categories} />
      </div>
    </div>
  );
}
