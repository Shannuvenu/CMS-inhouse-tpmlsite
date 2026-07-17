import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import RevealOnScroll from "@/components/RevealOnScroll";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Deccan Herald, Prajavani, Sudha and Mayura — the publications of The Printers (Mysore) Pvt. Ltd.",
};

/** Cycles behind each brand's hero photo — matches the live site's green / amber / red pattern */
const ACCENT_COLORS = ["bg-emerald-300", "bg-amber-300", "bg-red-400"];

/** Only these two brands show a laptop-mockup website screenshot on the live site */
const NEWS_SCREENSHOTS: Record<string, string> = {
  "deccan-herald": "deccan-herald-news",
  prajavani: "prajavani-news",
};

/** Only these two brands show social icons on the live site */
const SOCIAL_LINKS: Record<string, { icon: string; href: string; alt: string }[]> = {
  "deccan-herald": [
    { icon: "/icons-facebook.png", href: "https://www.facebook.com/deccanherald/", alt: "Facebook" },
    { icon: "/icons-twitter.png", href: "https://twitter.com/deccanherald", alt: "Twitter" },
    { icon: "/icons-googleplus.png", href: "https://plus.google.com/+deccanherald", alt: "Google+" },
    { icon: "/icons-youtube.png", href: "https://www.youtube.com/user/deccanads", alt: "YouTube" },
  ],
  prajavani: [
    { icon: "/icons-facebook.png", href: "https://www.facebook.com/prajavani.net", alt: "Facebook" },
    { icon: "/icons-twitter.png", href: "https://twitter.com/prajavani", alt: "Twitter" },
    { icon: "/icons-googleplus.png", href: "https://plus.google.com/+prajavani", alt: "Google+" },
    { icon: "/icons-youtube.png", href: "https://www.youtube.com/user/videoprajavani", alt: "YouTube" },
  ],
};

/** Exact copy from the live site, keyed by slug. Falls back to the DB description if a slug isn't listed here. */
const FALLBACK_PARAGRAPHS: Record<string, string[]> = {
  "deccan-herald": [
    "Deccan Herald serves as Karnataka's compass in navigating contemporary times and is considered to be the authentic voice of the community. While the newspaper holds Karnataka and Bengaluru close to its heart, its coverage of national and global events is equally thorough and expansive. The opinion pages offer a rich array of viewpoints on national, state, and international issues, complemented by editorials renowned for their insightful commentary. Feature sections not only present diverse perspectives but also capture the underlying emotions of the stories.",
    "Deccan Herald is widely regarded as the newspaper that inspires trust — one that is consistently setting benchmarks in journalism in Bengaluru and Karnataka.",
  ],
  prajavani: [
    "Prajavani is widely regarded as the most trusted and credible news brand across Karnataka, consistently leading coverage on major stories and significantly influencing public policy and current affairs. Over the years, Prajavani has expanded its reach to all regions of Karnataka, including Bengaluru, Hubballi, Mangaluru, Kalaburagi, Davanagere, Mysuru, and Hosapete, offering local reports and multiple editions with zonal (district-level) splits. To ensure comprehensive news and analysis from the entire state, Prajavani employs a large team of highly qualified journalists.",
    "Prajavani has become an integral part of Karnataka's communities, contributing significantly to local politics, literature, and culture. Many eminent Kannada writers have been honoured with the Prajavani Deepavali Visheshanka Award, one of the most prestigious literary awards in Karnataka, underscoring the brand's impact and legacy in the region.",
  ],
  sudha: [
    'The esteemed Kannada weekly Sudha was launched on January 11, 1965, and since then, over 2,700 issues have reached the doorsteps of its loyal readers. Sudha caters to a diverse audience across Karnataka, emerging as a comprehensive lifestyle magazine. It covers a wide range of topics including literature, culture, health, food, travel, women\'s issues, cinema, beauty, fashion, and contemporary matters. The magazine is renowned for publishing serials and short stories penned by well-known Kannada writers.',
    'Sudha\'s editorials focus on contemporary issues and are crafted by in-house journalists, freelancers, and well-known columnists. The magazine is known for its high-quality articles and an array of photographs, ranging from wildlife landscapes to film stars. Notably, Sudha is the first magazine to introduce a complete "Hasya" (humour) edition, published every April. Additionally, on the auspicious occasion of Ugadi (Kannada New Year), a special issue is released along with a bonus issue, making it a cherished part of Karnataka\'s literary and cultural landscape.',
  ],
  mayura: [
    "Mayura has left a unique footprint in Kannada journalism, standing out as both a popular and serious literary magazine. It publishes a variety of quality stories across genres such as detective, scientific, and secular tales. To enhance its content variety, stories are translated from Telugu, Tamil, Malayalam, Hindi, Marathi, English, and other languages. Mayura has featured works from Kannada's great writers, including P Lankesh, K P Poornachandra Tejaswi, Goruru Ramaswamy Iyengar, Anupama Niranjana, M K Indira, Jayanth Kaikini, Besagarahalli Ramanna, T K Ramrao, Fakir Mohammad Katpadi, Bolwar Mahammad Kunhi, Veerabhadrappa, Baraguru Ramachandrappa, Beechi, Nagathihalli Chandrashekhar, M H Nayak Baada, Na D'Souza, Gopalakrishna Pai, and others.",
  ],
};

/** Only Deccan Herald and Prajavani show the blue supplements band on the live site */
const SUPPLEMENT_DETAILS: Record<
  string,
  { name: string; description: string }[]
> = {
  "deccan-herald": [
    {
      name: "Metrolife",
      description:
        "offers a vibrant mix of food, fashion, culture, theatre, events, and all the local happenings around Bengaluru.",
    },
    {
      name: "Spectrum",
      description:
        "provides a treasure trove of information on Karnataka's heritage, environment, science, and technology.",
    },
    {
      name: "DH on Sunday and DH on Saturday",
      description:
        "feature a medley of thought-provoking articles on art, culture, gender, design, books, food, entertainment, a dedicated section for children, wellness and passion pursuits, not to mention long reads and experiential stories.",
    },
  ],
  prajavani: [
    {
      name: "Bhanuvarada Puravani",
      description:
        "offers a veritable collection of engaging and entertaining articles on various topics, ensuring readers are thoroughly engrossed.",
    },
    {
      name: "Bhoomika",
      description:
        "stands out as one of the most sought-after supplements, celebrating womanhood with insightful and empowering content.",
    },
    {
      name: "The cinema supplement 'Cine Puravani'",
      description:
        "is a Friday treat for all movie enthusiasts, offering insights into the latest releases in Sandalwood, film reviews, box office updates, introductions to new stars, and the latest buzz from the small screen. It serves as the ultimate go-to source for everything related to the Kannada film industry.",
    },
  ],
};

const SUPPLEMENT_INTRO: Record<string, string> = {
  "deccan-herald":
    "Deccan Herald's wide variety of feature sections that cater to its diverse readership is one of the most cherished and unique aspects of the newspaper.",
  prajavani: "Prajavani boasts a range of popular supplements, each catering to diverse reader interests.",
};

const OTHER_SUPPLEMENTS: Record<string, string[]> = {
  prajavani: ["Shikshana", "Kshema-Kushala", "Tantrajnana", "Spardhavani"],
};

/** Small decorative blue tick marks that flank each brand's text block on the live site */
function SectionTicks({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative pl-7">
      <span className="absolute left-0 top-1 h-4 w-0.5 bg-blue-600" />
      <span className="absolute left-[-3px] top-[7px] h-0.5 w-3 bg-blue-600" />
      {children}
      <span className="absolute bottom-1 left-0 h-4 w-0.5 bg-blue-600" />
      <span className="absolute bottom-[7px] left-[-3px] h-0.5 w-3 bg-blue-600" />
    </div>
  );
}

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <section className="relative flex h-[420px] items-center bg-zinc-900 text-white">
        <Image src="/brands-hero.jpg" alt="" fill priority sizes="100vw" quality={75} className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative mx-auto max-w-5xl px-6 text-4xl font-bold leading-tight sm:text-5xl">
          News from around the world reaching you everyday
        </h1>
      </section>

      {brands.length === 0 ? (
        <p className="mx-auto max-w-5xl px-6 py-16 text-zinc-500">No brands published yet.</p>
      ) : (
        brands.map((brand, i) => {
          const photoSlug = slugify(brand.name);
          const newsScreenshot = NEWS_SCREENSHOTS[photoSlug];
          const socials = SOCIAL_LINKS[photoSlug];
          const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];

          const paragraphs =
            FALLBACK_PARAGRAPHS[photoSlug] ??
            (brand.description ? [brand.description] : []);

          const supplementDetails = SUPPLEMENT_DETAILS[photoSlug];
          const supplementIntro = SUPPLEMENT_INTRO[photoSlug];
          const otherSupplements = OTHER_SUPPLEMENTS[photoSlug];

          return (
            <div key={brand.id}>
              <section className="mx-auto max-w-6xl px-6 py-20">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                  <RevealOnScroll direction="left">
                    <h2 className="text-4xl font-bold text-zinc-900">{brand.name}</h2>
                    <SectionTicks>
                      <div className="space-y-4 py-3">
                        {paragraphs.map((p, idx) => (
                          <p key={idx} className="leading-relaxed text-zinc-600">
                            {p}
                          </p>
                        ))}
                      </div>
                    </SectionTicks>
                    {brand.launched && (
                      <p className="mt-4 text-sm text-zinc-500">Launched {brand.launched}</p>
                    )}
                  </RevealOnScroll>

                  <RevealOnScroll direction="right">
                    <div className="relative">
                      <div className={`absolute -bottom-6 -right-6 h-2/3 w-2/3 ${accent}`} />
                      <Image
                        src={`/brand-photos/${photoSlug}.jpg`}
                        alt={`${brand.name} newspaper`}
                        width={600}
                        height={450}
                        className="relative object-cover shadow-lg"
                      />
                    </div>
                  </RevealOnScroll>
                </div>
              </section>

              {newsScreenshot && (
                <section className="mx-auto max-w-6xl px-6 pb-20">
                  <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
                    <RevealOnScroll direction="up" className="lg:col-span-2">
                      {/* CSS laptop mockup frame around the site screenshot */}
                      <div className="mx-auto max-w-2xl">
                        <div className="rounded-t-xl border-[10px] border-zinc-800 bg-zinc-800">
                          <Image
                            src={`/brand-photos/${newsScreenshot}.jpg`}
                            alt={`${brand.name} website screenshot`}
                            width={800}
                            height={500}
                            className="w-full bg-white"
                          />
                        </div>
                        <div className="mx-auto h-3 w-[104%] -translate-x-[2%] rounded-b-lg bg-zinc-300" />
                        <div className="mx-auto h-1 w-1/4 rounded-b bg-zinc-400" />
                      </div>
                    </RevealOnScroll>

                    {brand.website && (
                      <RevealOnScroll direction="up">
                        <p className="text-sm text-zinc-500">Visit the website:</p>
                        <a
                          href={brand.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-press mt-1 inline-block text-lg font-semibold text-blue-600 underline underline-offset-4"
                        >
                          {brand.website.replace(/^https?:\/\//, "")}
                        </a>

                        {socials && (
                          <div className="mt-6 flex gap-3">
                            {socials.map((s) => (
                              <a
                                key={s.alt}
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-press flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700"
                              >
                                <Image src={s.icon} alt={s.alt} width={18} height={18} />
                              </a>
                            ))}
                          </div>
                        )}
                      </RevealOnScroll>
                    )}
                  </div>
                </section>
              )}

              {/* Sudha and Mayura have no mockup — just a plain website link under the text */}
              {!newsScreenshot && brand.website && (
                <section className="mx-auto max-w-6xl px-6 pb-20">
                  <p className="text-sm text-zinc-500">Visit the website:</p>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-press mt-1 inline-block text-lg font-semibold text-blue-600 underline underline-offset-4"
                  >
                    {brand.website.replace(/^https?:\/\//, "")}
                  </a>
                </section>
              )}

              {supplementDetails && (
                <section className="bg-blue-600 px-6 py-16 text-white">
                  <RevealOnScroll className="mx-auto max-w-6xl">
                    <p className="max-w-2xl text-xl font-medium">{supplementIntro}</p>
                    <ul className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                      {supplementDetails.map((s) => (
                        <li key={s.name} className="text-sm leading-relaxed">
                          <span className="font-semibold">{s.name}</span> {s.description}
                        </li>
                      ))}
                    </ul>
                    {otherSupplements && (
                      <p className="mt-8 text-sm text-white/80">
                        Other Supplements - {otherSupplements.join(", ")}
                      </p>
                    )}
                  </RevealOnScroll>
                </section>
              )}
            </div>
          );
        })
      )}
    </>
  );
}