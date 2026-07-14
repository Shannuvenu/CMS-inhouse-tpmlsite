type InitialBrand = {
  id: string;
  name: string;
  type: string | null;
  website: string | null;
  tagline: string | null;
  description: string | null;
  launched: string | null;
  supplements: string[];
};

export default function BrandForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: InitialBrand;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Name</label>
        <input name="name" required defaultValue={initial?.name} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Type</label>
        <input name="type" defaultValue={initial?.type ?? ""} placeholder="e.g. English Newspaper" className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Website</label>
        <input name="website" defaultValue={initial?.website ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Tagline</label>
        <input name="tagline" defaultValue={initial?.tagline ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Description</label>
        <textarea name="description" rows={3} defaultValue={initial?.description ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Launched (optional)</label>
        <input name="launched" defaultValue={initial?.launched ?? ""} placeholder="e.g. 1948" className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Supplements (one per line)</label>
        <textarea name="supplements" rows={4} defaultValue={initial?.supplements.join("\n") ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
        Save
      </button>
    </form>
  );
}