import type { Metadata } from "next";
import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata: Metadata = {
  title: "Legacy",
  description:
    "Since 1948, The Printers (Mysore) Pvt. Ltd. has been Karnataka's thought leader — from founder K N Guruswamy's first bilingual newspaper to a diversified media group today.",
};

/** Small decorative blue tick marks that flank each text block, matching the brands page */
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

/**
 * A photo with a colored caption card peeking out behind it.
 * `capPosition="bottom"` = card sits behind/below the photo (caption reads at the bottom).
 * `capPosition="top"` = card sits behind/above the photo (caption reads at the top).
 */
function PhotoWithCaption({
  src,
  alt,
  caption,
  capPosition = "bottom",
}: {
  src: string;
  alt: string;
  caption: string;
  capPosition?: "top" | "bottom";
}) {
  return (
    <div className="relative">
      <div
        className={`absolute right-0 flex w-[85%] items-end bg-emerald-300 px-6 py-4 ${
          capPosition === "bottom" ? "-bottom-16 h-24" : "-top-16 h-24"
        }`}
      >
        <p className="text-lg font-medium text-zinc-800">{caption}</p>
      </div>
      <Image
        src={src}
        alt={alt}
        width={600}
        height={620}
        className={`relative w-full object-cover shadow-lg ${
          capPosition === "bottom" ? "" : "mt-16"
        }`}
      />
    </div>
  );
}

export default function LegacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex h-[600px] items-center bg-zinc-900 text-white">
        <Image
          src="/legacy-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/40" />
        <RevealOnScroll className="relative mx-auto max-w-6xl px-6">
          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Thought leaders for generations, we continue to innovate
          </h1>
        </RevealOnScroll>
      </section>

      {/* Our Journey */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <RevealOnScroll>
          <h2 className="text-4xl font-bold text-zinc-900 sm:text-5xl">Our Journey</h2>
        </RevealOnScroll>

        {/* Story block 1 — the founder */}
        <div className="mt-20 grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <RevealOnScroll direction="left">
            <SectionTicks>
              <p className="py-3 leading-relaxed text-zinc-600">
                Started after India&rsquo;s independence from the British, The Printers Mysore
                Limited emerged in 1948 as part of the new Indian identity. Founder K N Guruswamy
                had an ambitious idea: to give Bengaluru and the erstwhile Mysore State (now
                Karnataka) its first newspaper. While this was his first investment in media, his
                vision was unique; he wanted to start the first bilingual publishing company in
                the state. This foresight, along with his strong belief in acquiring the right
                talent to drive the company forward, made his venture a success. Many legendary
                writers, journalists, and editors found their mojo and built their careers with
                the reputed publications under The Printers Mysore.
              </p>
            </SectionTicks>
          </RevealOnScroll>

          <RevealOnScroll direction="right" className="pb-16">
            <PhotoWithCaption
              src="/legacy-founder.jpg"
              alt="Founder, Mr. Guruswamy K N, at his desk"
              caption="Founder, Mr.Guruswamy K N"
              capPosition="bottom"
            />
          </RevealOnScroll>
        </div>

        {/* Story block 2 — evolution */}
        <div className="mt-32 grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <RevealOnScroll direction="left">
            <SectionTicks>
              <p className="py-3 leading-relaxed text-zinc-600">
                The company has continued to evolve, changing alongside Bengaluru and Karnataka.
                This is reflected in its expanding readership. As it grew, it continued to set
                benchmarks in the industry, both in cutting-edge technology and in the diversity
                of its reach, to become one of the best newspaper and magazine publication
                companies in Karnataka. The Printers Mysore challenged the status quo by hiring
                women journalists and people from varying backgrounds, making efforts to be more
                representative of its society. The company knew that a good newsroom was the
                backbone of any media company and needed a spectrum of opinions and ideas to stay
                relevant. The Printers Mysore was the first to utilize foreign printing presses,
                web offset printing, and computer-to-plate (CTP) image-setting technology. Today,
                they continue to expand into the digital space with sleekly designed websites and
                mobile applications.
              </p>
            </SectionTicks>
          </RevealOnScroll>

          <RevealOnScroll direction="right" className="pt-16">
            <PhotoWithCaption
              src="/legacy-election.jpg"
              alt="Crowd gathered for Kerala assembly election results, 1965"
              caption="Kerala assembly election results 5th March 1965"
              capPosition="top"
            />
          </RevealOnScroll>
        </div>
      </section>

      {/* Our Impact — two full-bleed alternating split panels */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <RevealOnScroll direction="left" className="flex items-center bg-blue-600 px-8 py-20 text-white sm:px-16">
            <div>
              <h2 className="text-4xl font-bold sm:text-5xl">Our Impact</h2>
              <SectionTicks>
                <p className="py-3 leading-relaxed">
                  The Printers Mysore brands have left an indelible mark on the cultural,
                  political, and economic landscape of Karnataka. Since its inception, they have
                  endeavoured to foster an honest dialogue with its community through unbiased
                  news coverage, insightful columns, thought-provoking political cartoons, and
                  captivating photographs. Prajavani&rsquo;s editorial stance often guides readers
                  in making informed decisions, especially during elections, while Deccan Herald
                  remains a trusted source for sports coverage in Karnataka. These newspapers have
                  played an active role in nurturing institutions of quality journalism over the
                  years. Moreover, beyond their own publications, the company has made significant
                  contributions to the news media ecosystem by spearheading initiatives such as
                  the establishment and support of organizations like the Press Trust of India,
                  the Indian Newspaper Society, and the World Association of Newspaper and News
                  Publishers (India).
                </p>
              </SectionTicks>
            </div>
          </RevealOnScroll>

          <RevealOnScroll direction="right" className="relative min-h-[420px] lg:min-h-full">
            <Image
              src="/legacy-impact-1.jpg"
              alt="Boy reading a Deccan Herald newspaper on steps"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          <RevealOnScroll direction="left" className="relative order-2 min-h-[420px] lg:order-1 lg:min-h-full">
            <Image
              src="/legacy-impact-2.jpg"
              alt="Man reading a Kannada newspaper beside a green wall"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </RevealOnScroll>

          <RevealOnScroll
            direction="right"
            className="order-1 flex items-center bg-blue-600 px-8 py-20 text-white sm:px-16 lg:order-2"
          >
            <div>
              <SectionTicks>
                <p className="py-3 leading-relaxed">
                  The Printers Mysore is transitioning from being an integral part of the print
                  media ecosystem to a diversified media group. Our vision is to persist in
                  serving our community and partners through our journalism across various
                  platforms while upholding the highest ethical standards. We aspire to innovate
                  and adapt to the changing media landscape, leveraging technology and creativity
                  to deliver engaging content and meaningful experiences to our audience. With a
                  commitment to integrity and excellence, we aim to remain at the forefront of
                  media innovation, fostering informed discourse and contributing positively to
                  society.
                </p>
              </SectionTicks>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}