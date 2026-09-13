import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-6", className)} {...props} />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  center = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-semibold uppercase tracking-wider",
            light ? "text-brand-400" : "text-brand-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight sm:text-4xl",
          light ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-lg", light ? "text-slate-300" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
