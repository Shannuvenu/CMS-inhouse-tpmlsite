"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window !== "undefined") {
    console.error(error);
  }

  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Something went wrong</h1>
          <p className="mt-3 text-sm text-zinc-600">
            The page couldn&rsquo;t load — this is usually temporary (often the database
            being unreachable). Please try again in a moment.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
