"use client";

import { useState } from "react";

type Contact = { role: string; name: string; phone: string; email: string };

type InitialOffice = {
  id: string;
  city: string;
  address: string | null;
  phone: string | null;
  region: string | null;
  contacts: Array<{ role: string; name: string; phone: string | null; email: string | null }>;
};

export default function OfficeForm({
  action,
  initial,
}: {
  action: (formData: FormData) => void;
  initial?: InitialOffice;
}) {
  const [contacts, setContacts] = useState<Contact[]>(
    initial?.contacts.map((c) => ({
      role: c.role,
      name: c.name,
      phone: c.phone ?? "",
      email: c.email ?? "",
    })) ?? []
  );

  function addContact() {
    setContacts([...contacts, { role: "", name: "", phone: "", email: "" }]);
  }

  function removeContact(index: number) {
    setContacts(contacts.filter((_, i) => i !== index));
  }

  function updateContact(index: number, field: keyof Contact, value: string) {
    setContacts(contacts.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="contactsJson" value={JSON.stringify(contacts)} />

      <div>
        <label className="block text-sm font-medium text-zinc-700">City / Branch name</label>
        <input name="city" required defaultValue={initial?.city} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Address (optional)</label>
        <input name="address" defaultValue={initial?.address ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Main phone (optional)</label>
          <input name="phone" defaultValue={initial?.phone ?? ""} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Region</label>
          <select name="region" defaultValue={initial?.region ?? "karnataka"} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm">
            <option value="karnataka">Karnataka</option>
            <option value="national">National / Other cities</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-zinc-700">Branch heads / contacts</label>
          <button type="button" onClick={addContact} className="text-sm font-medium text-zinc-900 underline">
            + Add contact
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 rounded border border-zinc-200 p-3">
              <input
                placeholder="Role (e.g. Deccan Herald Editorial)"
                value={c.role}
                onChange={(e) => updateContact(i, "role", e.target.value)}
                className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="Name"
                value={c.name}
                onChange={(e) => updateContact(i, "name", e.target.value)}
                className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="Phone"
                value={c.phone}
                onChange={(e) => updateContact(i, "phone", e.target.value)}
                className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <input
                placeholder="Email"
                value={c.email}
                onChange={(e) => updateContact(i, "email", e.target.value)}
                className="rounded border border-zinc-300 px-2 py-1.5 text-sm"
              />
              <button type="button" onClick={() => removeContact(i)} className="text-sm text-red-600">
                Remove
              </button>
            </div>
          ))}
          {contacts.length === 0 && <p className="text-sm text-zinc-400">No contacts added yet.</p>}
        </div>
      </div>

      <button type="submit" className="rounded bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white">
        Save
      </button>
    </form>
  );
}