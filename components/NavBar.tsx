"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <nav
        className="mt-4 flex w-[min(92%,720px)] items-center justify-between rounded-full border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="text-sm font-medium tracking-[0.2em] text-white transition-colors hover:text-accent"
        >
          EV
        </Link>
        <ul className="flex items-center gap-6 text-sm text-muted">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-white ${
                    active ? "text-white" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
