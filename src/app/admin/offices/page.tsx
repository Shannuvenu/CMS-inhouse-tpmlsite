import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteOffice } from "@/app/admin/offices/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminOfficesPage() {
  const offices = await prisma.office.findMany({ include: { contacts: true }, orderBy: { city: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Offices & Branches</h1>
        <Link href="/admin/offices/new" className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          + Add office
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {offices.length === 0 && <p className="text-sm text-zinc-500">No offices yet.</p>}
        {offices.map((office) => (
          <div key={office.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
            <div>
              <span className="font-medium text-zinc-900">{office.city}</span>
              <span className="ml-2 text-xs text-zinc-400">
                {office.region} — {office.contacts.length} contact(s)
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/admin/offices/${office.id}/edit`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Edit
              </Link>
              <DeleteButton
                action={deleteOffice.bind(null, office.id)}
                confirmMessage={`Delete "${office.city}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}