import type { JobOpening } from "@prisma/client";

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
      <div>
        <label className="block text-sm font-medium text-zinc-700">Position *</label>
        <input
          name="position"
          required
          defaultValue={job?.position ?? ""}
          placeholder="e.g. Video News Reporter"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      {!job && (
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Slug (leave blank to auto-generate from position)
          </label>
          <input
            name="slug"
            placeholder="video-news-reporter-dh"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700">Brand</label>
        <select
          name="brand"
          defaultValue={job?.brand ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="">— None —</option>
          <option value="DECCAN HERALD">Deccan Herald</option>
          <option value="PRAJAVANI">Prajavani</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Location *</label>
        <input
          name="location"
          required
          defaultValue={job?.location ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Experience *</label>
        <input
          name="experience"
          required
          defaultValue={job?.experience ?? ""}
          placeholder="2-6yrs with digital news platform"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Qualification *</label>
        <input
          name="qualification"
          required
          defaultValue={job?.qualification ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Number of positions</label>
        <input
          name="numberOfPositions"
          type="number"
          min={1}
          defaultValue={job?.numberOfPositions ?? 1}
          className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Responsibilities (one per line)
        </label>
        <textarea
          name="responsibilities"
          rows={5}
          defaultValue={responsibilities}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Candidate specs (one per line)
        </label>
        <textarea
          name="candidateSpecs"
          rows={5}
          defaultValue={candidateSpecs}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">How to apply</label>
        <textarea
          name="howToApply"
          rows={3}
          defaultValue={job?.howToApply ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Apply email</label>
        <input
          name="applyEmail"
          type="email"
          defaultValue={job?.applyEmail ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Status</label>
          <select
            name="status"
            defaultValue={job?.status ?? "DRAFT"}
            className="mt-1 rounded border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="DRAFT">Draft (hidden)</option>
            <option value="OPEN">Open (visible on site)</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={job?.sortOrder ?? 0}
            className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
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
