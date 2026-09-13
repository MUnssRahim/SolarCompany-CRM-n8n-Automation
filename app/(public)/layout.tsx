import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50">{children}</main>
      <Footer />
    </>
  );
}
