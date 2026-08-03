"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

export default function Navbar({ userName, onLogout }) {
  return (
    <header className="bg-white border-b border-[#E2DDD0] py-4 px-6 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-tighter uppercase text-[#062C19]">
            BOOK MANAGER
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-[#062C19]/80 hidden sm:inline-block">
            Welcome, {userName || "Reader"}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
