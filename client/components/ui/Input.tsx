import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("w-full rounded-button border border-primary/35 bg-background px-4 py-3 text-text outline-none placeholder:text-text/55 focus:border-primary focus:ring-2 focus:ring-primary/20", className)} {...props} />;
}
