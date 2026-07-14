import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateBrand } from "@/app/admin/brands/actions";
import BrandForm from "@/components/admin/BrandForm";

export const dynamic = "force-dynamic";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  const updateWithId = updateBrand.bind(null, brand.id);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Edit brand</h1>
      <div className="mt-6 max-w-2xl">
        <BrandForm action={updateWithId} initial={brand} />
      </div>
    </div>
  );
}