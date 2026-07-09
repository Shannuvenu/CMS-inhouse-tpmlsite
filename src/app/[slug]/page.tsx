import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type Section =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

type GenericPageData = {
  title?: string;
  sections?: Section[];
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const block = await prisma.pageContent.findUnique({ where: { key: slug } });
  const data = block?.data as GenericPageData | undefined;
  return { title: data?.title ?? slug };
}

export default async function GenericContentPage({ params }: Props) {
  const { slug } = await params;
  const block = await prisma.pageContent.findUnique({ where: { key: slug } });

  if (!block) notFound();

  const data = block.data as GenericPageData;

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        {data.title ?? slug}
      </h1>

      <div className="mt-8 space-y-4">
        {data.sections?.map((section, i) => {
          if (section.type === "heading") {
            return (
              <h2 key={i} className="pt-4 text-xl font-semibold text-zinc-900">
                {section.text}
              </h2>
            );
          }
          if (section.type === "paragraph") {
            return (
              <p key={i} className="text-zinc-600 leading-relaxed">
                {section.text}
              </p>
            );
          }
          if (section.type === "list") {
            return (
              <ul key={i} className="list-disc space-y-1 pl-5 text-zinc-600">
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}