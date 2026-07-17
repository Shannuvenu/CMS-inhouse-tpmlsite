"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

type MenuLink = { id: number; label: string; url: string };

export default function Header({ items }: { items: MenuLink[] }) {
  const visible = useHideOnScroll();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={`inset-x-0 top-0 z-50 transition-transform duration-300 ${
        isHome ? "fixed" : "sticky"
      } ${visible ? "translate-y-0" : "-translate-y-full"} ${
        isHome ? "bg-transparent" : "border-b border-zinc-200 bg-white"
      }`}
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
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className={isHome ? "hover:text-white" : "hover:text-zinc-900"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}