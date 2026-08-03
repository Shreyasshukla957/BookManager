"use client";

import { motion } from "motion/react";
import { BookOpen, CheckCircle2, Clock3, Library } from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    { label: "Total books", value: stats?.total || 0, note: "Your entire collection", icon: Library, className: "bg-[#062C19] text-white border-[#062C19]", valueClass: "text-[#D2F254]", noteClass: "text-white/55" },
    { label: "Want to read", value: stats?.wantToRead || 0, note: "Waiting on your shelf", icon: Clock3, className: "bg-[#D8EBFF] text-[#0A2540] border-[#C2E0FF]", valueClass: "text-[#0A2540]", noteClass: "text-[#0A2540]/55" },
    { label: "Reading now", value: stats?.reading || 0, note: "Currently in progress", icon: BookOpen, className: "bg-[#EEEBE1] text-[#062C19] border-[#E2DDD0]", valueClass: "text-[#062C19]", noteClass: "text-[#062C19]/55" },
    { label: "Completed", value: stats?.completed || 0, note: "Stories carried with you", icon: CheckCircle2, className: "bg-[#C2CBBA] text-[#062C19] border-[#B1BCAA]", valueClass: "text-[#062C19]", noteClass: "text-[#062C19]/55" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, note, icon: Icon, className, valueClass, noteClass }, index) => (
        <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -3 }} className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}>
          <Icon className="absolute -right-2 -top-2 h-20 w-20 opacity-[0.08] transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          <div className="relative flex items-start justify-between"><p className="text-[10px] font-black uppercase tracking-[0.13em] opacity-65">{label}</p><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-current/10 bg-white/10"><Icon className="h-3.5 w-3.5" /></span></div>
          <p className={`relative mt-5 text-4xl font-black tracking-[-0.06em] ${valueClass}`}>{String(value).padStart(2, "0")}</p>
          <p className={`relative mt-1 text-[10px] font-bold ${noteClass}`}>{note}</p>
        </motion.div>
      ))}
    </div>
  );
}
