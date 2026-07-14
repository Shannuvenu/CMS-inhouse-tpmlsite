import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Reveal from "@/components/Reveal";
import KarnatakaMap from "@/components/KarnatakaMap";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Home",
  description:
    "The Printers (Mysore) Pvt. Ltd. publishes Deccan Herald, Prajavani, Sudha and Mayura, reaching millions of readers across Karnataka.",
};

export default async function HomePage() {
  const [settings, testimonials, karnatakaOffices] = await Promise.all([
    getSiteSettings(),
    prisma.testimonial.findMany({ where: { category: "reader" } }),
    prisma.office.findMany({ where: { region: "karnataka" }, orderBy: { city: "asc" } }),
  ]);

  return (
    <>
      {/* Hero — full viewport height, larger type, staggered entrance */}
      <section className="relative flex min-h-screen items-center bg-zinc-900 text-white">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
        <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
          <Reveal delay={0}>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">
              {settings.site_founded ? `Since ${settings.site_founded}` : "The Printers (Mysore) Pvt. Ltd."}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="mt-4 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl lg:text-8xl">
              {settings.site_tagline ?? "The Storytellers of Karnataka"}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
              Publishers of Deccan Herald, Prajavani, Sudha and Mayura — reaching readers
              across every corner of Karnataka, in print and online.
            </p>
          </Reveal>
        </div>
        <a
          href="#reach"
          aria-label="Scroll to next section"
          className="btn-press absolute bottom-10 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded bg-blue-600 text-white animate-bounce"
        >
          ↓
        </a>
      </section>

      {/* Stats — row 1: readers + pageviews, alternating image/text */}
      <section id="reach" className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            One of the best media houses in India
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div className="relative">
              <div className="absolute -bottom-6 -left-6 h-full w-full rounded bg-red-400/80" />
              <Image
                src="/reader-bench.jpg"
                alt="Reader enjoying a newspaper on a park bench"
                width={600}
                height={450}
                className="relative rounded object-cover shadow-lg"
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <Reveal delay={100}>
              <div>
                <p className="text-4xl font-bold text-zinc-900">
                  {settings.readers_in_print ?? "10,691,000"}
                </p>
                <p className="mt-1 font-medium text-zinc-700">readers in print</p>
                <p className="mt-2 text-sm text-zinc-500">{settings.readers_in_print_note}</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div>
                <p className="text-4xl font-bold text-zinc-900">
                  {settings.pageviews_per_month ?? "90 million"}
                </p>
                <p className="mt-1 font-medium text-zinc-700">pageviews per month</p>
                <p className="mt-2 text-sm text-zinc-500">{settings.pageviews_note}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats — row 2: journalists/contributors + stories, mirrored layout */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-10 lg:order-1">
            <Reveal delay={0}>
              <div>
                <p className="text-4xl font-bold text-zinc-900">{settings.journalists ?? "383"}</p>
                <p className="mt-1 font-medium text-zinc-700">journalists</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <p className="text-4xl font-bold text-zinc-900">{settings.contributors ?? "404"}</p>
                <p className="mt-1 font-medium text-zinc-700">contributors</p>
              </div>
            </Reveal>
            <Reveal delay={200} className="col-span-2">
              <div>
                <p className="text-4xl font-bold text-zinc-900">
                  {settings.stories_published_per_day ?? "1200+"}
                </p>
                <p className="mt-1 font-medium text-zinc-700">stories published a day</p>
                <p className="mt-2 text-sm text-zinc-500">
                  We strive to create an honest dialogue with our community.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal direction="left" className="lg:order-2">
            <div className="relative">
              <div className="absolute -bottom-6 -right-6 h-full w-full rounded bg-red-400/80" />
              <Image
                src="/newspaper-boy.jpg"
                alt="Newspaper delivery in Karnataka"
                width={600}
                height={450}
                className="relative rounded object-cover shadow-lg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Full-bleed CTA — readers */}
      <section className="relative flex min-h-[560px] items-center bg-zinc-900 text-white">
        <Image
          src="/street-kids-newspaper.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="text-4xl font-bold sm:text-5xl">
              We understand our readers, we don&rsquo;t underestimate them
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <Link
              href="/brands"
              className="btn-press mt-6 inline-flex items-center gap-2 bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Our Brands →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Testimonials carousel */}
      <section className="bg-blue-600 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              For seven decades, we&rsquo;ve shaped thought leadership and created impact
            </h2>
          </Reveal>
          <div className="mt-12">
            <TestimonialsCarousel items={testimonials} />
          </div>
        </div>
      </section>

      {/* Market insight */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal direction="right">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
                Engaging with Karnataka&rsquo;s future
              </h2>
              <p className="mt-6 text-zinc-600 leading-relaxed">
                {settings.market_insight ??
                  "Bengaluru is India's only city attracting economic migrants predominantly for white-collar jobs, with purchasing power rivaling Mumbai and Delhi. It is the third-largest market in India by ad expenditure, driven by a growing upper-middle-class population and strong investment."}
              </p>
            </div>
          </Reveal>
          <Reveal direction="left">
            <div className="relative">
              <div className="absolute -right-6 top-0 h-2/3 w-2/3 rounded bg-amber-300" />
              <Image
                src="/bengaluru-garden.jpg"
                alt="Readers enjoying the outdoors in Bengaluru"
                width={600}
                height={450}
                className="relative ml-auto rounded object-cover shadow-lg"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Print footprint — Karnataka map with district markers */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Our Print Footprint
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10">
            <KarnatakaMap offices={karnatakaOffices} />
          </div>
        </Reveal>
      </section>

      {/* Full-bleed CTA — partners */}
      <section className="relative flex min-h-[560px] items-center bg-zinc-900 text-white">
        <Image src="/partner-tablet.jpg" alt="" fill sizes="100vw" quality={85} className="object-cover" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="text-4xl font-bold sm:text-5xl">
              Leveraging the integrity of print with the speed of digital
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <Link
              href="/contact"
              className="btn-press mt-6 inline-flex items-center gap-2 bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Partner with Us →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}