import { prisma } from "@/lib/prisma";
import { saveLegacyContent } from "@/app/admin/legacy/actions";

export const dynamic = "force-dynamic";

type LegacyData = { heading?: string; paragraphs?: string[] };

export default async function AdminLegacyPage() {
  const block = await prisma.pageContent.findUnique({ where: { key: "legacy" } });
  const data = (block?.data as LegacyData) ?? {};

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Legacy page</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Edits the &quot;Our Legacy&quot; page directly — no JSON needed.
      </p>

      <form action={saveLegacyContent} className="mt-6 max-w-2xl space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Heading</label>
          <input
            name="heading"
            required
            defaultValue={data.heading ?? "Our Legacy"}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Paragraphs <span className="text-zinc-400">(leave a blank line between each)</span>
          </label>
          <textarea
            name="paragraphs"
            required
            rows={14}
            defaultValue={(data.paragraphs ?? []).join("\n\n")}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <button type="submit" className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
          Save
        </button>
      </form>
    </div>
  );
}