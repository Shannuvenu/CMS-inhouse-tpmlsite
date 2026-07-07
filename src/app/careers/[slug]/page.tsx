import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getJob(slug: string) {
  const job = await prisma.jobOpening.findUnique({ where: { slug } });
  if (!job || job.status !== "OPEN") return null;
  return job;
}

// JSON columns (responsibilities, candidateSpecs) store an array of strings,
// but Prisma types them as `unknown` JSON — narrow defensively before rendering.
function toStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Position not found" };

  return {
    title: job.position,
    description: `${job.position} — ${[job.brand, job.location].filter(Boolean).join(", ")}`,
  };
}

export default async function JobOpeningPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const responsibilities = toStringList(job.responsibilities);
  const candidateSpecs = toStringList(job.candidateSpecs);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {[job.brand, job.location].filter(Boolean).join(" · ")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900">
          {job.position}
        </h1>
      </header>

      <dl className="mt-8 grid grid-cols-1 gap-4 border-y border-zinc-200 py-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Experience
          </dt>
          <dd className="mt-1 text-sm text-zinc-700">{job.experience}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Qualification
          </dt>
          <dd className="mt-1 text-sm text-zinc-700">{job.qualification}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Positions available
          </dt>
          <dd className="mt-1 text-sm text-zinc-700">{job.numberOfPositions}</dd>
        </div>
      </dl>

      {responsibilities.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">Responsibilities</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {candidateSpecs.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">What we&rsquo;re looking for</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
            {candidateSpecs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {job.howToApply && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900">How to apply</h2>
          <p className="mt-3 text-sm text-zinc-700">{job.howToApply}</p>
        </section>
      )}

      {job.applyEmail && (
        <a
          href={`mailto:${job.applyEmail}`}
          className="mt-8 inline-block rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white"
        >
          Apply via {job.applyEmail}
        </a>
      )}
    </article>
  );
}
