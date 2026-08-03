"use client";

import { motion } from "motion/react";
import { BookOpen, CheckCircle2, Clock3, Library } from "lucide-react";

export default function StatsCards({ stats }) {
  const items = [
    {
      label: "Total books",
      value: stats?.total || 0,
      note: "Entire collection",
      icon: Library,
      hoverClass: "hover:bg-slate-900 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
      badgeClass: "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
      valueColor: "text-slate-900 group-hover:text-white",
    },
    {
      label: "Want to read",
      value: stats?.wantToRead || 0,
      note: "Waiting on shelf",
      icon: Clock3,
      hoverClass: "hover:bg-slate-800 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
      badgeClass: "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
      valueColor: "text-slate-900 group-hover:text-white",
    },
    {
      label: "Reading now",
      value: stats?.reading || 0,
      note: "Currently active",
      icon: BookOpen,
      hoverClass: "hover:bg-zinc-900 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
      badgeClass: "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
      valueColor: "text-slate-900 group-hover:text-white",
    },
    {
      label: "Completed",
      value: stats?.completed || 0,
      note: "Stories finished",
      icon: CheckCircle2,
      hoverClass: "hover:bg-slate-950 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
      badgeClass: "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
      valueColor: "text-slate-900 group-hover:text-white",
    },
  ];

  return (
    <div className="w-full rounded-3xl border border-slate-300/80 bg-white/95 p-2 sm:p-3 shadow-[0_12px_40px_rgba(203,213,225,0.3)] backdrop-blur-md">
      <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-slate-200/80">
        {items.map(({ label, value, note, icon: Icon, hoverClass, badgeClass, valueColor }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ y: -3 }}
            className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 cursor-pointer ${hoverClass}`}
          >
            {/* Background Faded Icon */}
            <Icon className="absolute -right-3 -bottom-3 h-24 w-24 opacity-[0.05] transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:opacity-[0.15]" />

            <div className="relative flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.14em] opacity-60 group-hover:opacity-90">
                {label}
              </span>
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shadow-2xs transition-all duration-300 ${badgeClass}`}>
                <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
              </span>
            </div>

            <div className="relative mt-4">
              <p className={`text-3xl sm:text-4xl font-mono font-extrabold tracking-tight transition-colors duration-300 ${valueColor}`}>
                {String(value).padStart(2, "0")}
              </p>
              <p className="mt-1 text-[10px] font-mono font-medium opacity-50 group-hover:opacity-80">
                {note}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
