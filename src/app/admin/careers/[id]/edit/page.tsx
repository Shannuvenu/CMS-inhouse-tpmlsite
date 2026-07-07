import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateJobOpening } from "@/app/admin/actions";
import JobOpeningForm from "@/app/admin/careers/JobOpeningForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditJobOpeningPage({ params }: Props) {
  const { id } = await params;
  const jobId = Number(id);

  const job = await prisma.jobOpening.findUnique({ where: { id: jobId } });
  if (!job) notFound();

  const boundAction = updateJobOpening.bind(null, jobId);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Edit job opening</h1>
      <div className="mt-6">
        <JobOpeningForm action={boundAction} job={job} />
      </div>
    </div>
  );
}
