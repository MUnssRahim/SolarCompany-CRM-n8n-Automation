import Link from "next/link";
import { cn } from "@/lib/utils";
import { SunIcon } from "@/components/ui/icons";

export function Logo({
  href = "/",
  light = false,
  className,
}: {
  href?: string | null;
  light?: boolean;
  className?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-brand-400">
        <SunIcon className="h-4.5 w-4.5" />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          light ? "text-white" : "text-slate-900"
        )}
      >
        Solaris <span className="font-medium">Energy</span>
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="shrink-0">
      {content}
    </Link>
  );
}
