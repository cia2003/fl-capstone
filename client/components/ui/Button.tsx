import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" };

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn("rounded-button px-button-x py-button-y text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60", variant === "primary" ? "bg-accent text-[#21170d] hover:bg-accent/85" : "border-[1.5px] border-primary bg-transparent text-primary hover:bg-primary/10", className)} {...props} />;
}
