"use client";

import Link from "next/link";
import { BookOpen, LogOut, Sparkles } from "lucide-react";

export default function Navbar({ userName, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-transparent bg-transparent px-5 py-3.5 backdrop-blur-sm sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 via-slate-300 to-slate-400 text-slate-900 border border-slate-300/80 shadow-[0_4px_14px_rgba(203,213,225,0.6)] transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <BookOpen className="h-4 w-4 text-slate-950" />
          </span>
          <span className="text-base font-bold uppercase tracking-[-0.06em] text-slate-700 transition group-hover:text-slate-950 sm:text-lg">Book Manager</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.12em] text-slate-500 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-slate-600 animate-pulse" /> {userName || "Reader"}&apos;s library
          </span>
          <button
            onClick={onLogout}
            className="group flex items-center gap-2 rounded-lg border border-[#E2DDD0] bg-white/70 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#062C19]/65 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
