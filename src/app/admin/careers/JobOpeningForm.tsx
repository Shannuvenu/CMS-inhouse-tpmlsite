import type { JobOpening } from "@prisma/client";
import { TextField, TextAreaField, SelectField } from "@/app/admin/FormField";

function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export default function JobOpeningForm({
  action,
  job,
}: {
  action: (formData: FormData) => Promise<void>;
  job?: JobOpening | null;
}) {
  const responsibilities = job ? toStringList(job.responsibilities).join("\n") : "";
  const candidateSpecs = job ? toStringList(job.candidateSpecs).join("\n") : "";

  return (
    <form action={action} className="max-w-xl space-y-5">
      <TextField
        label="Position *"
        name="position"
        required
        defaultValue={job?.position ?? ""}
        placeholder="e.g. Video News Reporter"
      />

      {!job && (
        <TextField
          label="Slug (leave blank to auto-generate from position)"
          name="slug"
          placeholder="video-news-reporter-dh"
        />
      )}

      <SelectField label="Brand" name="brand" defaultValue={job?.brand ?? ""}>
        <option value="">— None —</option>
        <option value="DECCAN HERALD">Deccan Herald</option>
        <option value="PRAJAVANI">Prajavani</option>
      </SelectField>

      <TextField label="Location *" name="location" required defaultValue={job?.location ?? ""} />

      <TextField
        label="Experience *"
        name="experience"
        required
        defaultValue={job?.experience ?? ""}
        placeholder="2-6yrs with digital news platform"
      />

      <TextField
        label="Qualification *"
        name="qualification"
        required
        defaultValue={job?.qualification ?? ""}
      />

      <TextField
        label="Number of positions"
        name="numberOfPositions"
        type="number"
        min={1}
        defaultValue={job?.numberOfPositions ?? 1}
        className="w-24"
      />

      <TextAreaField
        label="Responsibilities (one per line)"
        name="responsibilities"
        rows={5}
        defaultValue={responsibilities}
      />

      <TextAreaField
        label="Candidate specs (one per line)"
        name="candidateSpecs"
        rows={5}
        defaultValue={candidateSpecs}
      />

      <TextAreaField label="How to apply" name="howToApply" rows={3} defaultValue={job?.howToApply ?? ""} />

      <TextField label="Apply email" name="applyEmail" type="email" defaultValue={job?.applyEmail ?? ""} />

      <div className="flex gap-6">
        <SelectField label="Status" name="status" defaultValue={job?.status ?? "DRAFT"} className="w-auto">
          <option value="DRAFT">Draft (hidden)</option>
          <option value="OPEN">Open (visible on site)</option>
          <option value="CLOSED">Closed</option>
        </SelectField>

        <TextField
          label="Sort order"
          name="sortOrder"
          type="number"
          defaultValue={job?.sortOrder ?? 0}
          className="w-24"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          {job ? "Save changes" : "Create job opening"}
        </button>
      </div>
    </form>
  );
}
