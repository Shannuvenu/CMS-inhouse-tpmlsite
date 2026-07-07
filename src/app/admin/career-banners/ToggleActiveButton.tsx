"use client";

import { useTransition } from "react";

export default function ToggleActiveButton({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onToggle())}
      className={`rounded px-2 py-1 text-xs font-medium disabled:opacity-50 ${
        isActive ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
      }`}
    >
      {isPending ? "…" : isActive ? "Active" : "Hidden"}
    </button>
  );
}
