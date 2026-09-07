"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline" | "danger";

const base =
  "mono inline-flex items-center justify-center gap-2 border px-4 py-2.5 text-xs uppercase tracking-[0.16em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35";

const variants: Record<Variant, string> = {
  primary:
    "border-coral bg-coral text-void hover:bg-transparent hover:text-coral",
  outline:
    "border-hairline-bright text-parchment hover:border-coral hover:text-coral",
  ghost: "border-transparent text-muted hover:text-parchment",
  danger: "border-crimson/60 text-crimson hover:bg-crimson hover:text-void",
};

export function Button({
  variant = "outline",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
