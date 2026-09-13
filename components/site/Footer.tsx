import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/ui/Container";
import { MailIcon, MapPinIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo href={null} light />
          <p className="mt-4 text-sm text-slate-400">
            © {new Date().getFullYear()} Solaris Energy Systems.
            <br />
            Engineering a sustainable future.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Company</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="#" className="hover:text-brand-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-brand-400">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Resources</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <Link href="#" className="hover:text-brand-400">
                Installation Guide
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-brand-400">
                Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5 text-sm text-slate-400">
          <p className="mb-1 flex items-start gap-2">
            <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
            123 Innovation Drive, Tech Park, Karachi
          </p>
          <p className="flex items-center gap-2">
            <MailIcon className="h-4 w-4 shrink-0 text-brand-400" />
            contact@solarisenergy.com
          </p>
        </div>
      </Container>
    </footer>
  );
}
