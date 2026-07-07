import { createJobOpening } from "@/app/admin/actions";
import JobOpeningForm from "@/app/admin/careers/JobOpeningForm";

export default function NewJobOpeningPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add job opening</h1>
      <div className="mt-6">
        <JobOpeningForm action={createJobOpening} />
      </div>
    </div>
  );
}
