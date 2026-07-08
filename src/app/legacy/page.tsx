import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Legacy",
  description: "The history of The Printers (Mysore) Pvt. Ltd. since 1948.",
};

type LegacyData = {
  heading?: string;
  paragraphs?: string[];
};

export default async function LegacyPage() {
  const block = await prisma.pageContent.findUnique({ where: { key: "legacy" } });
  const data = (block?.data as LegacyData) ?? {};

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        {data.heading ?? "Our Legacy"}
      </h1>
      <div className="mt-8 space-y-4 text-zinc-600 leading-relaxed">
        {data.paragraphs?.length ? (
          data.paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p className="text-zinc-400">
            Content coming soon — add it via /admin/content with key &quot;legacy&quot;.
          </p>
        )}
      </div>
    </section>
  );
}