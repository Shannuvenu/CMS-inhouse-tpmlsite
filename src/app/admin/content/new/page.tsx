import { prisma } from "@/lib/prisma";
import { saveContentBlock } from "@/app/admin/content/saveContent";
import { SYNC_HANDLERS } from "@/app/admin/content/syncHandlers";

export const dynamic = "force-dynamic";

export default async function ContentEditorPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  let existingJson = "";
  const handler = key ? SYNC_HANDLERS[key] : undefined;

  if (handler) {
    existingJson = JSON.stringify(await handler.fetchCurrent(), null, 2);
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
          <label htmlFor="key" className="block text-sm font-medium text-zinc-700">
            Key
          </label>
          <input
            id="key"
            name="key"
            required
            defaultValue={key ?? ""}
            placeholder="e.g. events, or one of: brands, team, careers, contact, testimonials"
            readOnly={Boolean(handler)}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
          />
          <p className="mt-1 text-xs text-zinc-400">
            A reserved key (brands, team, careers, contact, testimonials) syncs into the
            real table for that page. Any other key automatically creates a real page at{" "}
            <code>/that-key</code> — no code needed. Use this JSON shape for new pages:{" "}
            <code>{`{"title": "...", "sections": [{"type": "paragraph", "text": "..."}]}`}</code>.
            Section <code>type</code> can be &quot;heading&quot;, &quot;paragraph&quot;, or
            &quot;list&quot; (with an <code>items</code> array). Remember to also add a
            matching entry in /admin/menus so it shows up in the nav.
          </p>
        </div>

        <div>
          <label htmlFor="jsonData" className="block text-sm font-medium text-zinc-700">
            JSON data
          </label>
          <textarea
            id="jsonData"
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