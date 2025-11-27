"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-6">
        {/* Logo Area */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-4 w-4 bg-white rounded-sm group-hover:bg-accent-green transition-colors duration-300" />
            <span className="font-mono font-bold tracking-tighter text-text-primary text-lg">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-8">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-mono uppercase tracking-wider transition-all duration-200",
                  "hover:text-accent-green hover:drop-shadow-[0_0_5px_rgba(0,255,148,0.5)]",
                  isActive ? "text-text-primary font-bold" : "text-text-muted"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
