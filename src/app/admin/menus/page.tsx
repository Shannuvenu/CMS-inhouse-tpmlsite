import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMenuItem } from "@/app/admin/menus/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminMenusPage() {
  const [headerItems, footerItems] = await Promise.all([
    prisma.menuItem.findMany({ where: { location: "HEADER" }, orderBy: { sortOrder: "asc" } }),
    prisma.menuItem.findMany({ where: { location: "FOOTER" }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">Menus</h1>
        <div className="flex gap-3">
          <Link href="/admin/menus/new?location=HEADER" className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            + Header item
          </Link>
          <Link href="/admin/menus/new?location=FOOTER" className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
            + Footer item
          </Link>
        </div>
      </div>

      {[{ title: "Header menu", items: headerItems }, { title: "Footer menu", items: footerItems }].map(
        (group) => (
          <div key={group.title} className="mt-8">
            <h2 className="font-semibold text-zinc-900">{group.title}</h2>
            <div className="mt-3 space-y-2">
              {group.items.length === 0 && (
                <p className="text-sm text-zinc-500">No items yet.</p>
              )}
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div>
                    <span className="font-medium text-zinc-900">{item.label}</span>
                    <span className="ml-2 text-xs text-zinc-400">{item.url}</span>
                    {!item.isActive && (
                      <span className="ml-2 rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">hidden</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/menus/${item.id}/edit`} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                      Edit
                    </Link>
                    <DeleteButton
                      action={deleteMenuItem.bind(null, item.id)}
                      confirmMessage={`Remove "${item.label}" from the menu?`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}