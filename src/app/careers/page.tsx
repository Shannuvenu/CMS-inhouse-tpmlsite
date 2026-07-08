import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Careers",
  description: "Current job openings at The Printers (Mysore) Pvt. Ltd.",
};

export default async function CareersPage() {
  const [openings, banners] = await Promise.all([
    prisma.jobOpening.findMany({
      where: { status: "OPEN" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.careerBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { image: true },
    }),
  ]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Careers</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Join the team behind Karnataka&rsquo;s most trusted news brands.
      </p>

      {banners.length > 0 && (
        <ul className="mt-8 flex flex-wrap items-center gap-8 border-y border-zinc-200 py-6">
          {banners.map((banner) => {
            const img = (
              <Image
                src={banner.image.url}
                alt={banner.image.altText ?? ""}
                width={120}
                height={48}
                className="h-10 w-auto object-contain grayscale"
              />
            );
            return (
              <li key={banner.id}>
                {banner.linkUrl ? (
                  <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      )}

      {openings.length === 0 ? (
        <p className="mt-10 text-zinc-500">No open positions right now. Check back soon.</p>
      ) : (
        <ul className="mt-10 divide-y divide-zinc-200 border-y border-zinc-200">
          {openings.map((job) => (
            <li key={job.id} className="py-5">
              <Link href={`/careers/${job.slug}`} className="block group">
                <h2 className="text-lg font-semibold text-zinc-900 group-hover:underline">
                  {job.position}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {[job.brand, job.location].filter(Boolean).join(" · ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}