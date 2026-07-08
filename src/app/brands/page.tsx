import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Deccan Herald, Prajavani, Sudha and Mayura — the publications of The Printers (Mysore) Pvt. Ltd.",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Our Brands</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Four publications, one mission — telling Karnataka&rsquo;s stories with credibility
        and reach.
      </p>

      {brands.length === 0 ? (
        <p className="mt-10 text-zinc-500">No brands published yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {brands.map((brand) => (
            <li key={brand.id} className="rounded-lg border border-zinc-200 p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              <article>
                <h2 className="text-xl font-semibold text-zinc-900">{brand.name}</h2>
                {brand.type && <p className="mt-1 text-sm text-zinc-500">{brand.type}</p>}
                {brand.tagline && (
                  <p className="mt-3 text-sm font-medium italic text-zinc-700">
                    &ldquo;{brand.tagline}&rdquo;
                  </p>
                )}
                {brand.description && (
                  <p className="mt-3 text-sm text-zinc-600">{brand.description}</p>
                )}
                {brand.launched && (
                  <p className="mt-3 text-xs text-zinc-500">Launched {brand.launched}</p>
                )}
                {brand.supplements.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Supplements
                    </h3>
                    <ul className="mt-1 flex flex-wrap gap-2">
                      {brand.supplements.map((supplement) => (
                        <li
                          key={supplement}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                        >
                          {supplement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4"
                  >
                    Visit website
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
