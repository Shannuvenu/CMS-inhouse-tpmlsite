import { createMenuItem } from "@/app/admin/menus/actions";

export const dynamic = "force-dynamic";

export default async function NewMenuItemPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const { location } = await searchParams;

  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add menu item</h1>

      <form action={createMenuItem} className="mt-6 max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Menu</label>
          <select name="location" defaultValue={location ?? "HEADER"} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm">
            <option value="HEADER">Header</option>
            <option value="FOOTER">Footer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Label</label>
          <input name="label" required placeholder="e.g. Careers" className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">URL</label>
          <input name="url" required placeholder="/careers or https://..." className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Sort order</label>
          <input type="number" name="sortOrder" defaultValue={0} className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input type="checkbox" name="isActive" defaultChecked />
          Visible
        </label>

        <button type="submit" className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
          Save
        </button>
      </form>
    </div>
  );
}