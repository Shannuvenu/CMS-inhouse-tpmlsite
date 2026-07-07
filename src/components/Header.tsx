"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/brands", label: "Brands" },
  { href: "/team", label: "Team" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/testimonials", label: "Testimonials" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-50 bg-transparent"
          : "relative border-b border-zinc-200 bg-white"
      }
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="The Printers (Mysore) Pvt. Ltd."
            width={141}
            height={45}
            className={isHome ? "" : "invert"}
          />
        </Link>
        <nav aria-label="Primary">
          <ul
            className={`flex gap-6 text-sm font-medium ${
              isHome ? "text-white/90" : "text-zinc-600"
            }`}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isHome ? "hover:text-white" : "hover:text-zinc-900"}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}