import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div className={cn("animate-pulse rounded-md bg-slate-200", className)} style={style} />;
}
