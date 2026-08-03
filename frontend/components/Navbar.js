"use client";

import Link from "next/link";
import { BookOpen, LogOut, Sparkles } from "lucide-react";

export default function Navbar({ userName, onLogout }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E2DDD0]/80 bg-[#F7F5EE]/90 px-5 py-3.5 backdrop-blur-xl sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#062C19] text-[#D2F254] transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <BookOpen className="h-4 w-4" />
          </span>
          <span className="text-base font-black uppercase tracking-[-0.06em] text-[#062C19] sm:text-lg">Book Manager</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#062C19]/50 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-[#062C19]" /> {userName || "Reader"}&apos;s library
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
