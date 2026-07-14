import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteCareerBanner } from "@/app/admin/actions";
import DeleteButton from "@/app/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminCareerBannersPage() {
  const banners = await prisma.careerBanner.findMany({
    orderBy: { sortOrder: "asc" },
    include: { image: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Career Page Banners</h1>
          <p className="mt-1 text-sm text-zinc-500">
            The logo carousel shown at the top of the public Careers page.
          </p>
        </div>
        <Link
          href="/admin/career-banners/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
        >
          + Add banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-400">No banners yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {banners.map((banner) => (
            <li key={banner.id} className="rounded-lg border border-zinc-200 p-3">
              <Image
                src={banner.image.url}
                alt={banner.image.altText ?? ""}
                width={160}
                height={90}
                className="h-20 w-full rounded object-contain"
              />
              <p className="mt-2 truncate text-xs text-zinc-500">
                {banner.linkUrl ?? "No link"}
              </p>
              <div className="mt-2 flex items-center justify-end">
                <DeleteButton
                  action={deleteCareerBanner.bind(null, banner.id)}
                  confirmMessage="Delete this banner? This can't be undone."
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}