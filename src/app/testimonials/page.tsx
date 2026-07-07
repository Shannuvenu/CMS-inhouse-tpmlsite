import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What readers and advertisers say about Deccan Herald and Prajavani.",
};

export default async function TestimonialsPage() {
  const [readers, advertisers] = await Promise.all([
    prisma.testimonial.findMany({ where: { category: "reader" } }),
    prisma.testimonial.findMany({ where: { category: "advertiser" } }),
  ]);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Testimonials</h1>

      <h2 className="mt-12 text-xl font-semibold text-zinc-900">From our readers</h2>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {readers.map((t) => (
          <li key={t.id} className="rounded-lg border border-zinc-200 p-5">
            <blockquote className="text-sm text-zinc-700">{t.quoteSummary}</blockquote>
            <p className="mt-3 text-sm font-medium text-zinc-900">{t.name}</p>
            <p className="text-xs text-zinc-500">{t.title}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-xl font-semibold text-zinc-900">From advertisers</h2>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {advertisers.map((t) => (
          <li key={t.id} className="rounded-lg border border-zinc-200 p-5">
            <blockquote className="text-sm text-zinc-700">{t.quoteSummary}</blockquote>
            <p className="mt-3 text-sm font-medium text-zinc-900">{t.name}</p>
            <p className="text-xs text-zinc-500">{t.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}