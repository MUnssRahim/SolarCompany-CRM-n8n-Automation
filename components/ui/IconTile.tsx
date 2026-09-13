import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small rounded-square icon badge used across service, agent, and stat cards. */
export function IconTile({
  children,
  tone = "navy",
  size = "md",
  className,
}: {
  children: ReactNode;
  tone?: "navy" | "brand" | "emerald";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const toneClasses = {
    navy: "bg-navy-900 text-white",
    brand: "bg-brand-500 text-white",
    emerald: "bg-emerald-100 text-emerald-600",
  }[tone];

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg [&_svg]:h-4 [&_svg]:w-4",
    md: "h-11 w-11 rounded-xl [&_svg]:h-5 [&_svg]:w-5",
    lg: "h-14 w-14 rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
  }[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        toneClasses,
        sizeClasses,
        className
      )}
    >
      {children}
    </div>
  );
}
