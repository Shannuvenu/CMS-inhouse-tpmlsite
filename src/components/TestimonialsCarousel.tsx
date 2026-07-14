"use client";

import { useState } from "react";
import type { Testimonial } from "@prisma/client";

export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const perPage = 3;
  const maxIndex = Math.max(0, items.length - perPage);

  function next() {
    setIndex((i) => Math.min(i + 1, maxIndex));
  }
  function prev() {
    setIndex((i) => Math.max(i - 1, 0));
  }

  if (items.length === 0) return null;

  const visible = items.slice(index, index + perPage);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {visible.map((t) => (
          <div key={t.id} className="rounded-lg bg-white/10 p-6 text-white">
            <p className="text-sm leading-relaxed">&ldquo;{t.quoteSummary}&rdquo;</p>
            <p className="mt-6 font-semibold">{t.name}</p>
            <p className="text-sm text-white/70">{t.title}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous testimonials"
          className="btn-press flex h-11 w-11 items-center justify-center rounded bg-white/20 text-white disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          onClick={next}
          disabled={index >= maxIndex}
          aria-label="Next testimonials"
          className="btn-press flex h-11 w-11 items-center justify-center rounded bg-white text-blue-600 disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}