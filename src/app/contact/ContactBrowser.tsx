"use client";

import { useMemo, useState } from "react";
import type { Office, OfficeContact } from "@prisma/client";

type OfficeWithContacts = Office & { contacts: OfficeContact[] };

const REGION_TABS: { key: string; label: string }[] = [
  { key: "karnataka", label: "Offices in Karnataka" },
  { key: "national", label: "Across the country" },
];

export default function ContactBrowser({ offices }: { offices: OfficeWithContacts[] }) {
  const [region, setRegion] = useState(REGION_TABS[0].key);

  const officesInRegion = useMemo(
    () => offices.filter((o) => o.region === region),
    [offices, region]
  );

  const [selectedCity, setSelectedCity] = useState(officesInRegion[0]?.city ?? "");

  function handleRegionChange(newRegion: string) {
    setRegion(newRegion);
    const firstOffice = offices.find((o) => o.region === newRegion);
    setSelectedCity(firstOffice?.city ?? "");
  }

  const selectedOffice = officesInRegion.find((o) => o.city === selectedCity) ?? officesInRegion[0];

  if (offices.length === 0) {
    return <p className="mt-10 text-zinc-500">Office information coming soon.</p>;
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[220px_180px_1fr]">
      <div className="flex flex-row gap-2 md:flex-col md:gap-0">
        {REGION_TABS.map((tab) => (
          <button key={tab.key} onClick={() => handleRegionChange(tab.key)} className={`border-l-2 px-4 py-3 text-left text-sm font-medium ${region === tab.key ? "border-blue-500 text-zinc-900" : "border-zinc-200 text-zinc-500 hover:text-zinc-900"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-0">
        {officesInRegion.map((office) => (
          <button key={office.id} onClick={() => setSelectedCity(office.city)} className={`px-4 py-2.5 text-left text-sm ${selectedCity === office.city ? "border-l-2 border-blue-500 font-medium text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
            {office.city}
          </button>
        ))}
      </div>

      {selectedOffice && (
        <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-zinc-900">{selectedOffice.city === "Bengaluru" ? "Head Office" : selectedOffice.city}</h3>
            {selectedOffice.address && <address className="mt-1 text-sm not-italic text-zinc-600">{selectedOffice.address}</address>}
            {selectedOffice.phone && <p className="mt-2 text-sm text-zinc-600">(Reception): {selectedOffice.phone}</p>}
          </div>

          {selectedOffice.contacts.map((contact) => (
            <div key={contact.id}>
              <h4 className="font-semibold text-zinc-900">{contact.role}</h4>
              <p className="mt-1 text-sm text-zinc-700">{contact.name}</p>
              {contact.phone && <p className="text-sm text-zinc-600">{contact.phone}</p>}
              {contact.email && <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 underline underline-offset-4">{contact.email}</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}