import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ContactBrowser from "@/app/contact/ContactBrowser";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Offices and editorial contacts for The Printers (Mysore) Pvt. Ltd. across Karnataka and India.",
};

export default async function ContactPage() {
  const offices = await prisma.office.findMany({
    orderBy: { city: "asc" },
    include: { contacts: true },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Contact Us</h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Our offices and editorial contacts across Karnataka and beyond.
      </p>

      <ContactBrowser offices={offices} />
    </section>
  );
}