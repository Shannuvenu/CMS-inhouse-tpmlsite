import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteContentBlock } from "@/app/admin/content/saveContent";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const blocks = await prisma.pageContent.findMany({ orderBy: { key: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Page Content (JSON)</h1>
          <p className="mt-1 text-sm text-zinc-500">
            &quot;brands&quot; syncs directly into the real Brands table. Any other key
            (e.g. &quot;legacy&quot;) is stored as-is and read by that page.
          </p>
        </div>
        <Link
          href="/admin/content/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Add / Edit content
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        <Link
          href="/admin/content/new?key=brands"
          className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400"
        >
          <span className="font-semibold text-zinc-900">brands</span>
          <span className="ml-2 text-xs text-zinc-500">(synced to Brand table — always available)</span>
        </Link>

        {blocks.map((block) => (
          <div
            key={block.key}
            className="flex items-center justify-between rounded-lg border border-zinc-200 p-4"
          >
            <Link href={`/admin/content/new?key=${block.key}`} className="font-semibold text-zinc-900 hover:underline">
              {block.key}
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-400">
                Updated {block.updatedAt.toLocaleString()}
              </span>
              <DeleteButton
                action={deleteContentBlock.bind(null, block.key)}
                confirmMessage={`Delete content for "${block.key}"? This can't be undone.`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}