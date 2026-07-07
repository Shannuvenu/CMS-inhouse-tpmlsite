"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-800">That save didn&rsquo;t go through</p>
      <p className="mt-2 text-sm text-red-700">{error.message || "Something went wrong."}</p>
      <button
        onClick={reset}
        className="mt-4 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
