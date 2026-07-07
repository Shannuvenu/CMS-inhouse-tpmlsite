"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-zinc-900">This page couldn&rsquo;t load</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Something went wrong fetching this content — often that means the database is
        temporarily unreachable. Please try again in a moment.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </div>
  );
}
