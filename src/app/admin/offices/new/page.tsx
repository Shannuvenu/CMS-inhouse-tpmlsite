import { createOffice } from "@/app/admin/offices/actions";
import OfficeForm from "@/components/admin/OfficeForm";

export default function NewOfficePage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add office</h1>
      <div className="mt-6 max-w-2xl">
        <OfficeForm action={createOffice} />
      </div>
    </div>
  );
}