import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateOffice } from "@/app/admin/offices/actions";
import OfficeForm from "@/components/admin/OfficeForm";

export const dynamic = "force-dynamic";

export default async function EditOfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const office = await prisma.office.findUnique({ where: { id }, include: { contacts: true } });
  if (!office) notFound();

  const updateWithId = updateOffice.bind(null, office.id);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Edit office</h1>
      <div className="mt-6 max-w-2xl">
        <OfficeForm action={updateWithId} initial={office} />
      </div>
    </div>
  );
}