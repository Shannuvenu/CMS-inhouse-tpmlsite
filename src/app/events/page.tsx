import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EventsCarousel, { type EventSlide } from "@/components/EventsCarousel";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Events",
  description:
    "The Printers (Mysore) Pvt. Ltd. creates community spaces to engage with readers through events and partnerships across Karnataka.",
};

/** Small decorative blue tick marks flanking the intro text, matching the rest of the site */
function SectionTicks({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative px-7">
      <span className="absolute left-0 top-1 h-4 w-0.5 bg-blue-600" />
      <span className="absolute left-[-3px] top-[7px] h-0.5 w-3 bg-blue-600" />
      <span className="absolute right-0 top-1 h-4 w-0.5 bg-blue-600" />
      <span className="absolute right-[-3px] top-[7px] h-0.5 w-3 bg-blue-600" />
      {children}
    </div>
  );
}

const EVENT_SLIDES: EventSlide[] = [
  {
    id: "bhumika-club",
    title: "Bhumika Club",
    description:
      "A unique platform which celebrates womanhood and empowering the women of Karnataka in every aspect of their lives, where women from d…",
    fullDescription:
      "A unique platform which celebrates womanhood and empowering the women of Karnataka in every aspect of their lives, where women from diverse backgrounds come together to connect, learn, and grow through workshops, talks, and community gatherings hosted across the state.",
    image: "/events-bhumika-club.jpg",
  },
  {
    id: "prajavani-kannada-cine-sammana",
    title: "Prajavani Kannada Cine Sammana",
    description:
      "Prajavani Kannada Cine Sammana a true celebration of promoting Kannada identity - is a platform to recognize Sandalwood's talent and …",
    fullDescription:
      "Prajavani Kannada Cine Sammana a true celebration of promoting Kannada identity - is a platform to recognize Sandalwood's talent and honour the achievements of actors, directors, and technicians who have made an outstanding contribution to Kannada cinema over the year.",
    image: "/events-cine-sammana.jpg",
    imageBorderClass: "border-amber-300",
  },
];

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[600px] items-center bg-zinc-900 text-white">
        <Image
          src="/events-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <RevealOnScroll className="relative mx-auto max-w-6xl px-6">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Creating community spaces to engage with our readers
          </h1>
        </RevealOnScroll>
      </section>

      {/* Events and Partnerships intro */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <RevealOnScroll>
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">
            Events and Partnerships
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <SectionTicks>
            <div className="mx-auto max-w-3xl space-y-6 py-10 text-center">
              <p className="leading-relaxed text-zinc-600">
                The Printers Mysore is proud to be part of diverse communities in Karnataka, from
                public citizen forums to schools and colleges to theatre and cultural groups. We
                believe in engaging with our readers through direct dialogue in many ways. Over
                the years we have created multiple platforms that have gone on to create a
                meaningful impact on the society.
              </p>
              <p className="leading-relaxed text-zinc-600">
                Enhance your local influence through events and partnerships that help build
                relationships with communities. For more information:
              </p>
            </div>
          </SectionTicks>
        </RevealOnScroll>

        <RevealOnScroll delay={250}>
          <div className="mx-auto flex max-w-3xl justify-center pb-4">
            <Link
              href="/contact"
              className="btn-press inline-flex items-center gap-2 bg-blue-600 px-8 py-4 text-lg font-bold text-white hover:bg-blue-700"
            >
              Contact Us →
            </Link>
          </div>
        </RevealOnScroll>
      </section>

      {/* Slideshow */}
      <RevealOnScroll direction="none">
        <EventsCarousel slides={EVENT_SLIDES} />
      </RevealOnScroll>
    </>
  );
}