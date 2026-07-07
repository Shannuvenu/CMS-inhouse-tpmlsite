import Link from "next/link";
import Image from "next/image";

export default function Footer() {
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
        <p className="mt-6 text-sm text-zinc-500">&copy; 2018 All Rights Reserved</p>
      </div>

      <div className="border-t border-zinc-200">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 text-sm text-zinc-600 sm:grid-cols-3">
          <div className="space-y-2">
            <Link href="/contact" className="block hover:text-zinc-900">
              Contact us
            </Link>
            <a href="mailto:hello@printersmysore.co.in" className="block hover:text-zinc-900">
              Write to us
            </a>
          </div>

          <div className="space-y-2">
            <Link href="/careers" className="block hover:text-zinc-900">
              Careers
            </Link>
            <a href="#" className="block hover:text-zinc-900">
              Subscribe to our Paper
            </a>
          </div>

          <div className="space-y-2 sm:text-right">
            <p className="flex items-center gap-2 sm:justify-end">
              <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden />
              +91 90082 66666
            </p>
            <p className="flex gap-3 sm:justify-end">
              <a href="#" className="hover:text-zinc-900">
                Privacy policy
              </a>
              <a href="#" className="hover:text-zinc-900">
                Terms
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
