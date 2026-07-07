import { createCareerBanner } from "@/app/admin/actions";

export default function NewCareerBannerPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Add career banner</h1>
      <form
        action={createCareerBanner}
        encType="multipart/form-data"
        className="mt-6 max-w-md space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-zinc-700">Image *</label>
          <input
            name="image"
            type="file"
            accept="image/*"
            required
            className="mt-2 block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
          />
          <p className="mt-1 text-xs text-zinc-400">JPG or PNG, up to 5MB.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Link URL (optional)
          </label>
          <input
            name="linkUrl"
            placeholder="https://deccanherald.com"
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          Upload banner
        </button>
      </form>
    </div>
  );
}
