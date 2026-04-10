"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Brain, Menu, X, Coins } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/achievements", label: "Gallery" },
];

export function Navbar() {
  const pathname = usePathname();
  const { coins } = useShop();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-rose-line bg-background/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Brain className="w-6 h-6 text-primary" />
          <span className="font-pixel text-xs text-primary tracking-wider group-hover:text-accent transition-colors">
            ThinkFirst
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Coin balance */}
        <div className="hidden md:flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full">
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-pixel text-[10px] text-primary">{coins}</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-rose-line bg-background px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium py-2 ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full w-fit">
            <Coins className="w-4 h-4 text-primary" />
            <span className="font-pixel text-[10px] text-primary">{coins}</span>
          </div>
        </div>
      )}
    </nav>
  );
}
