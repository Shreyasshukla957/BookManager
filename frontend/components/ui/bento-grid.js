"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BentoGrid({ children, className = "" }) {
  return (
    <div className={`grid w-full grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto ${className}`}>
      {children}
    </div>
  );
}

export function BentoCard({
  name,
  className = "",
  background,
  Icon,
  description,
  href,
  cta = "Explore feature",
  eyebrow,
}) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-slate-400/80 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] ${className}`}
    >
      {/* Top Section: Refined Inset Visual Feature Canvas */}
      <div className="relative mb-4 min-h-[140px] w-full overflow-hidden rounded-xl border border-slate-200/60 bg-gradient-to-b from-slate-50/80 to-slate-100/50 p-3.5 transition-all duration-300 group-hover:border-slate-300 group-hover:from-slate-50 group-hover:to-slate-100/80 flex items-center justify-center">
        {background}
      </div>

      {/* Bottom Section: Clean Typography & Micro Actions */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          {eyebrow && (
            <div className="mb-1.5 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-100/80 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-[0.12em] text-slate-700">
                {Icon && <Icon className="h-2.5 w-2.5 text-slate-600" />} {eyebrow}
              </span>
            </div>
          )}

          <h3 className="text-sm font-mono font-bold tracking-tight text-slate-900 sm:text-base">
            {name}
          </h3>

          <p className="mt-1 text-[11px] font-mono font-medium leading-relaxed text-slate-600">
            {description}
          </p>
        </div>

        {href && (
          <div className="mt-3.5 flex items-center gap-1 text-[11px] font-mono font-bold text-slate-900">
            <Link href={href} className="inline-flex items-center gap-1.5 text-slate-900 transition hover:text-slate-600">
              {cta} <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}
      </div>

      {/* Subtle Monochrome Corner Glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-slate-900/[0.03] blur-xl transition duration-500 group-hover:bg-slate-900/[0.05]" />
    </div>
  );
}
