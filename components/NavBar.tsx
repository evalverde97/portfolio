"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocaleStore } from "@/lib/locale-store";
import { dictionary } from "@/lib/i18n";
import { useMusicStore } from "@/lib/music-store";
import { exploreProjects } from "./HeadlineOverlay";

export default function NavBar() {
  const pathname = usePathname();
  const locale = useLocaleStore((s) => s.locale);
  const toggleLocale = useLocaleStore((s) => s.toggleLocale);
  const t = dictionary[locale];

  const entered = useMusicStore((s) => s.entered);
  const player = useMusicStore((s) => s.player);
  const muted = useMusicStore((s) => s.muted);
  const setMuted = useMusicStore((s) => s.setMuted);

  const toggleMuted = () => {
    if (!player) return;
    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const links = [
    { href: "/", label: t.nav.projects },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <nav
        className="portfolio-nav"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="portfolio-logo"
        >
          ev<span>.</span>
        </Link>
        <ul className="flex items-center gap-3 text-xs text-muted sm:gap-6 sm:text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href === "/" && pathname !== "/" ? "/?from=project" : link.href}
                  onClick={(e) => {
                    if (link.href === "/" && pathname === "/") { e.preventDefault(); exploreProjects(); }
                  }}
                  className={`transition-colors hover:text-white ${
                    active ? "text-white" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {entered && player && (
            <li>
              <button
                type="button"
                onClick={toggleMuted}
                aria-label={muted ? "Unmute music" : "Mute music"}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  muted
                    ? "border-white/15 text-muted hover:border-white/30 hover:text-white"
                    : "border-accent-soft/40 text-accent-soft hover:border-accent-soft/70"
                }`}
              >
                ♪
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={toggleLocale}
              aria-label="Toggle language"
              className="rounded-full border border-white/15 px-2.5 py-1 text-xs tracking-wider text-muted transition-colors hover:border-white/30 hover:text-white"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
