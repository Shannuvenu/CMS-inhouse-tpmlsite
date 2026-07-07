import Image from "next/image";
import type { TeamCategory, TeamMember } from "@prisma/client";

export default function TeamMemberForm({
  action,
  categories,
  member,
  currentPhotoUrl,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: TeamCategory[];
  member?: TeamMember | null;
  currentPhotoUrl?: string | null;
}) {
  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Full name *</label>
        <input
          name="fullName"
          required
          defaultValue={member?.fullName ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Designation *</label>
        <input
          name="designation"
          required
          defaultValue={member?.designation ?? ""}
          placeholder="e.g. Joint Managing Director"
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Category *</label>
        <select
          name="categoryId"
          required
          defaultValue={member?.categoryId ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Email</label>
        <input
          name="email"
          type="email"
          defaultValue={member?.email ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Bio</label>
        <textarea
          name="bio"
          rows={4}
          defaultValue={member?.bio ?? ""}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Photo</label>
        {currentPhotoUrl && (
          <div className="mt-2 flex items-center gap-3">
            <Image
              src={currentPhotoUrl}
              alt=""
              width={56}
              height={56}
              className="rounded-full object-cover"
            />
            <span className="text-xs text-zinc-500">Current photo — upload a new one to replace it</span>
          </div>
        )}
        <input
          name="photo"
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm text-zinc-600 file:mr-4 file:rounded file:border-0 file:bg-zinc-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
        <p className="mt-1 text-xs text-zinc-400">JPG or PNG, up to 5MB. Leave blank to keep the current photo.</p>
      </div>

      <div className="flex gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={member?.sortOrder ?? 0}
            className="mt-1 w-24 rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={member?.isPublished ?? true}
            />
            Published (visible on public site)
          </label>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          {member ? "Save changes" : "Create team member"}
        </button>
      </div>
    </form>
  );
}