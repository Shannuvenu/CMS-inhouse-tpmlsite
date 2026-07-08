import { prisma } from "@/lib/prisma";
import { saveContentBlock } from "@/app/admin/content/saveContent";

export const dynamic = "force-dynamic";

export default async function ContentEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  let existingJson = "";
  if (key === "brands") {
    const brands = await prisma.brand.findMany({ orderBy: { createdAt: "asc" } });
    existingJson = JSON.stringify(
      brands.map((b) => ({
        name: b.name,
        type: b.type,
        website: b.website,
        tagline: b.tagline,
        description: b.description,
        launched: b.launched,
        supplements: b.supplements,
      })),
      null,
      2
    );
  } else if (key) {
    const block = await prisma.pageContent.findUnique({ where: { key } });
    existingJson = block ? JSON.stringify(block.data, null, 2) : "";
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">
        {key ? `Edit "${key}"` : "Add new content key"}
      </h1>

      <form action={saveContentBlock} className="mt-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Key</label>
          <input
            name="key"
            required
            defaultValue={key ?? ""}
            placeholder="e.g. legacy"
            readOnly={key === "brands"}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-400">
            Use &quot;brands&quot; to update the real Brands page. Any other key (e.g.
            &quot;legacy&quot;) creates freeform content read by a page with that name.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">JSON data</label>
          <textarea
            name="jsonData"
            required
            rows={16}
            defaultValue={existingJson}
            spellCheck={false}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 font-mono text-xs"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          Save
        </button>
      </form>
    </div>
  );
}