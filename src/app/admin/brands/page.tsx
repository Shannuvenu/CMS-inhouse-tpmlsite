import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteBrand } from "@/app/admin/brands/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Brands</h1>
        <Link href="/admin/brands/new" className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
          + Add brand
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
            <span className="font-medium text-zinc-900">{b.name}</span>
            <div className="flex items-center gap-4">
              <Link href={`/admin/brands/${b.id}/edit`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">Edit</Link>
              <DeleteButton
                action={deleteBrand.bind(null, b.id)}
                confirmMessage={`Delete "${b.name}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}