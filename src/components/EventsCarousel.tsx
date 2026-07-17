"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type EventSlide = {
  id: string | number;
  title: string;
  /** short, truncated version shown by default */
  description: string;
  /** full text revealed when "READ MORE" is clicked */
  fullDescription: string;
  image: string;
  /** optional accent border around the photo, e.g. "border-amber-300" */
  imageBorderClass?: string;
};

export default function EventsCarousel({ slides }: { slides: EventSlide[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [expanded, setExpanded] = useState(false);

  const goTo = (next: number, dir: "left" | "right") => {
    setDirection(dir);
    setExpanded(false);
    setIndex((current) => {
      const total = slides.length;
      return (next + total) % total;
    });
  };

  const goPrev = () => goTo(index - 1, "left");
  const goNext = () => goTo(index + 1, "right");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section className="bg-zinc-200 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 sm:px-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous event"
          className="flex h-14 w-14 shrink-0 items-center justify-center bg-white shadow-md transition hover:bg-zinc-50"
        >
          <ChevronLeft className="h-6 w-6 text-blue-600" />
        </button>

        <div
          key={slide.id}
          className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2"
          style={{
            animation: `${direction === "right" ? "slideInRight" : "slideInLeft"} 0.45s ease`,
          }}
        >
          <div className={`border-4 ${slide.imageBorderClass ?? "border-transparent"}`}>
            <Image
              src={slide.image}
              alt={slide.title}
              width={750}
              height={470}
              className="w-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-3xl font-bold text-zinc-800">{slide.title}</h3>
            <p className="mt-4 leading-relaxed text-zinc-600">
              {expanded ? slide.fullDescription : slide.description}{" "}
              {!expanded && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  READ MORE
                </button>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next event"
          className="flex h-14 w-14 shrink-0 items-center justify-center bg-white shadow-md transition hover:bg-zinc-50"
        >
          <ChevronRight className="h-6 w-6 text-blue-600" />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i, i > index ? "right" : "left")}
            className={`h-2 w-2 rounded-full transition ${
              i === index ? "bg-blue-600" : "bg-zinc-400"
            }`}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}