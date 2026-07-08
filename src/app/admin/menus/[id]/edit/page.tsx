import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMenuItem } from "@/app/admin/menus/actions";

export const dynamic = "force-dynamic";

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.menuItem.findUnique({ where: { id: Number(id) } });
  if (!item) notFound();

  const updateWithId = updateMenuItem.bind(null, item.id);

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Edit menu item</h1>

      <form action={updateWithId} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Label</label>
          <input name="label" required defaultValue={item.label} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">URL</label>
          <input name="url" required defaultValue={item.url} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Sort order</label>
          <input type="number" name="sortOrder" defaultValue={item.sortOrder} className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="isActive" defaultChecked={item.isActive} />
          Visible
        </label>

        <button type="submit" className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
          Save changes
        </button>
      </form>
    </div>
  );
}