import { createBrand } from "@/app/admin/brands/actions";
import BrandForm from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add brand</h1>
      <div className="mt-6 max-w-2xl">
        <BrandForm action={createBrand} />
      </div>
    </div>
  );
}