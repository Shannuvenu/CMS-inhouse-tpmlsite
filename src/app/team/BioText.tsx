"use client";

import { useState } from "react";

const TRUNCATE_LENGTH = 140;

export default function BioText({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false);

  if (bio.length <= TRUNCATE_LENGTH) {
    return <p className="mt-2 text-sm text-zinc-600">{bio}</p>;
  }

  return (
    <p className="mt-2 text-sm text-zinc-600">
      {expanded ? bio : `${bio.slice(0, TRUNCATE_LENGTH).trimEnd()}…`}{" "}
      <button type="button" onClick={() => setExpanded((v) => !v)} className="font-semibold text-blue-600 hover:underline">
        {expanded ? "SHOW LESS" : "READ MORE"}
      </button>
    </p>
  );
}