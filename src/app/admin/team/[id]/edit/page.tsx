import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTeamMember } from "@/app/admin/actions";
import TeamMemberForm from "@/app/admin/team/TeamMemberForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditTeamMemberPage({ params }: Props) {
  const { id } = await params;
  const memberId = Number(id);

  const [member, categories] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id: memberId }, include: { photo: true } }),
    prisma.teamCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!member) notFound();

  const boundAction = updateTeamMember.bind(null, memberId);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Edit team member</h1>
      <div className="mt-6">
        <TeamMemberForm
          action={boundAction}
          categories={categories}
          member={member}
          currentPhotoUrl={member.photo?.url}
        />
      </div>
    </div>
  );
}
