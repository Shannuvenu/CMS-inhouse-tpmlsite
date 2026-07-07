import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import BioText from "@/app/team/BioText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the leadership and editorial teams behind The Printers (Mysore) Pvt. Ltd.",
};

export default async function TeamPage() {
  const categories = await prisma.teamCategory.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      members: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        include: { photo: true },
      },
    },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Our Team</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        The people behind Deccan Herald, Prajavani, Sudha and Mayura.
      </p>

      <div className="mt-10 space-y-16">
        {categories.map((category) => (
          <div key={category.id}>
            <h2 className="border-t border-zinc-200 pt-8 text-xl font-semibold text-zinc-900">
              {category.name}
            </h2>

            {category.members.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">Team members coming soon.</p>
            ) : (
              <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
                {category.members.map((member) => (
                  <li key={member.id}>
                    <article>
                      {member.photo ? (
                        <Image src={member.photo.url} alt={member.photo.altText ?? member.fullName} width={140} height={140} className="h-[140px] w-[140px] rounded-full border-4 border-blue-500 object-cover" />
                      ) : (
                        <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full border-4 border-zinc-300 bg-zinc-100 text-3xl font-semibold text-zinc-400">{member.fullName.charAt(0)}</div>
                      )}

                      <h3 className="mt-4 text-xl font-bold text-zinc-900">{member.fullName}</h3>
                      <p className="text-sm text-zinc-500">{member.designation}</p>

                      {member.bio && <BioText bio={member.bio} />}

                      {member.email && <a href={`mailto:${member.email}`} className="mt-2 inline-block text-xs text-zinc-500 underline underline-offset-4">{member.email}</a>}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}