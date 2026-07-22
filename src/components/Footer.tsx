import Link from "next/link";
import Image from "next/image";
import { getMenuItems } from "@/lib/menu";

export default async function Footer() {
  const items = await getMenuItems("FOOTER");

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14 text-center">
        <Image
          src="/logo.svg"
          alt="The Printers (Mysore) Pvt. Ltd."
          width={141}
          height={45}
          className="mx-auto invert"
        />
        {items.length > 0 && (
          <nav className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-zinc-600">
            {items.map((item) => (
              <Link key={item.id} href={item.url} className="hover:text-zinc-900">
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <p className="mt-6 text-sm text-zinc-500">&copy; 2026 All Rights Reserved</p>
      </div>
    </footer>
  );
}