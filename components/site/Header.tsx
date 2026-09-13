import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [
  { href: "/calculator", label: "Solar Calculator" },
  { href: "/book", label: "Book Consultation" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
