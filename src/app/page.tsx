import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "The Printers (Mysore) Pvt. Ltd. publishes Deccan Herald, Prajavani, Sudha and Mayura, reaching millions of readers across Karnataka.",
};

export default async function HomePage() {
  const settings = await getSiteSettings();

  const stats: { label: string; value: string; note?: string }[] = [
    {
      label: "Readers in print",
      value: settings.readers_in_print ?? "—",
      note: settings.readers_in_print_note,
    },
    {
      label: "Pageviews per month",
      value: settings.pageviews_per_month ?? "—",
      note: settings.pageviews_note,
    },
    { label: "Journalists", value: settings.journalists ?? "—" },
    { label: "Contributors", value: settings.contributors ?? "—" },
    { label: "Stories published per day", value: settings.stories_published_per_day ?? "—" },
  ];

  return (
    <>
      <section className="relative bg-zinc-900 bg-[url('/hero.jpg')] bg-cover bg-center text-white">
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto max-w-5xl px-6 py-40 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
            {settings.site_founded ? `Since ${settings.site_founded}` : "The Printers (Mysore) Pvt. Ltd."}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {settings.site_tagline ?? "The Storytellers of Karnataka"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Publishers of Deccan Herald, Prajavani, Sudha and Mayura — reaching readers
            across every corner of Karnataka, in print and online.
          </p>
        </div>
      </section>

      <section aria-labelledby="stats-heading" className="mx-auto max-w-5xl px-6 py-16">
        <h2 id="stats-heading" className="text-2xl font-semibold text-zinc-900">
          Our reach, by the numbers
        </h2>
        <dl className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-zinc-900 pl-4">
              <dt className="text-sm font-medium text-zinc-500">{stat.label}</dt>
              <dd className="mt-1 text-3xl font-bold text-zinc-900">{stat.value}</dd>
              {stat.note && <p className="mt-1 text-xs text-zinc-500">{stat.note}</p>}
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}