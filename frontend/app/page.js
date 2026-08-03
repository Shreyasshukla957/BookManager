"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight, BookOpen, Tag, ShieldCheck, Search, Sparkles } from "lucide-react";
import { getMe } from "@/utils/api";

export default function HeroLandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await getMe();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleEnterDashboard = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#062C19] font-sans selection:bg-[#062C19] selection:text-white">
      {/* Editorial Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <span className="text-2xl font-black tracking-tighter uppercase text-[#062C19]">
            BOOK MANAGER
          </span>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-[#062C19]/80">
          <a href="#features" className="hover:text-[#062C19] transition">Features</a>
          <a href="#philosophy" className="hover:text-[#062C19] transition">Philosophy</a>
          <a href="#stats" className="hover:text-[#062C19] transition">Analytics</a>
        </nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-4"
        >
          {!loading && isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 text-sm font-bold text-white bg-[#062C19] hover:bg-[#0a4227] rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md shadow-[#062C19]/20"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-bold text-[#062C19] hover:opacity-80 transition px-3 py-2"
              >
                Login
              </Link>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#062C19] hover:bg-[#0a4227] rounded-xl transition flex items-center space-x-2 cursor-pointer shadow-md shadow-[#062C19]/20"
                >
                  <span>Try for free</span>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </header>

      {/* Main Hero Banner */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20 space-y-16">
        {/* Top Floating Tag Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block"
        >
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEEBE1] text-xs font-bold text-[#062C19]/90 border border-[#E2DDD0] shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#062C19]" />
            <span>Personal reading space for book lovers</span>
          </motion.span>
        </motion.div>

        {/* Hero Title & Checklist Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Large Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <h1 className="text-5xl sm:text-7xl font-black text-[#062C19] tracking-tight uppercase leading-[0.95]">
              LOG BOOKS. <br />
              TRACK HABITS. <br />
              KEEP READING.
            </h1>

            <p id="philosophy" className="text-base sm:text-lg font-medium text-[#062C19]/70 max-w-xl leading-relaxed">
              "Simple can be harder than complex. But it's worth it because once you get there, you can move mountains."
            </p>
          </motion.div>

          {/* Right Checklist & Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 space-y-8 pt-2"
          >
            <ul className="space-y-3.5 text-sm font-bold text-[#062C19]">
              <motion.li whileHover={{ x: 3 }} className="flex items-center space-x-3 transition cursor-default">
                <div className="w-5 h-5 rounded-full bg-[#062C19] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Track Want to Read, Reading & Completed</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} className="flex items-center space-x-3 transition cursor-default">
                <div className="w-5 h-5 rounded-full bg-[#062C19] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Instant custom tags & author search</span>
              </motion.li>
              <motion.li whileHover={{ x: 3 }} className="flex items-center space-x-3 transition cursor-default">
                <div className="w-5 h-5 rounded-full bg-[#062C19] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Private HTTP-only JWT reader security</span>
              </motion.li>
            </ul>

            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-4">
                {/* Main CTA Button with Glow & Arrow Pill */}
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleEnterDashboard}
                  className="px-7 py-4 bg-[#062C19] hover:bg-[#0a4227] text-white font-black text-base rounded-2xl transition flex items-center space-x-3 shadow-xl shadow-[#062C19]/30 hover:shadow-[#062C19]/40 cursor-pointer group"
                >
                  <span>Enter Dashboard</span>
                  <div className="w-7 h-7 rounded-full bg-[#D2F254] text-[#062C19] flex items-center justify-center font-bold text-sm group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </motion.button>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/register"
                    className="px-6 py-4 bg-[#EEEBE1] hover:bg-[#e4dfd2] text-[#062C19] font-bold text-base rounded-2xl border border-[#E2DDD0] transition text-center inline-block shadow-sm"
                  >
                    Create Account
                  </Link>
                </motion.div>
              </div>

              <div className="inline-block bg-[#D2F254] text-[#062C19] text-xs font-black px-3.5 py-1.5 rounded-lg tracking-wider shadow-sm">
                BOOK MANAGER PLATFORM
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero App Showcase UI Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="rounded-3xl bg-gradient-to-tr from-[#D9A18F] via-[#C98B8B] to-[#9C75A1] p-6 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Floating UI Mockup */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-black/5 space-y-6 text-[#062C19]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-400 ml-2">Book Manager Workspace</span>
              </div>
              <span className="text-xs font-bold bg-[#EEEBE1] px-3 py-1 rounded-md text-[#062C19]">
                Live Preview
              </span>
            </div>

            {/* Filter Bar Mockup */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F5EE] p-4 rounded-xl border border-[#E2DDD0]">
              <div className="flex items-center space-x-2 bg-white px-3.5 py-2 rounded-lg border border-slate-200 w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-medium">Search title or author...</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-[#062C19] text-white text-xs font-bold rounded-lg">All</span>
                <span className="px-3 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200">Reading</span>
                <span className="px-3 py-1.5 bg-white text-slate-600 text-xs font-bold rounded-lg border border-slate-200">Completed</span>
              </div>
            </div>

            {/* Book Cards Preview Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <motion.div
                whileHover={{ y: -3 }}
                className="bg-[#F7F5EE] p-5 rounded-xl border border-[#E2DDD0] space-y-3 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-[#062C19]">Atomic Habits</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                    Reading
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">by James Clear</p>
                <div className="flex space-x-1">
                  <span className="text-[10px] font-bold bg-white text-[#062C19] px-2 py-0.5 rounded border border-slate-200">#Productivity</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                className="bg-[#F7F5EE] p-5 rounded-xl border border-[#E2DDD0] space-y-3 transition"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-base text-[#062C19]">The Pragmatic Programmer</h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Completed
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">by Andrew Hunt</p>
                <div className="flex space-x-1">
                  <span className="text-[10px] font-bold bg-white text-[#062C19] px-2 py-0.5 rounded border border-slate-200">#Tech</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom 3 Editorial Metric Blocks */}
        <section id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {/* Card 1: Deep Forest Green */}
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#062C19] text-[#D2F254] rounded-3xl p-8 space-y-6 shadow-xl"
          >
            <span className="text-6xl sm:text-7xl font-serif font-bold tracking-tight block">
              100%
            </span>
            <p className="text-sm font-semibold text-white/90 leading-snug">
              private data isolation and JWT reader protection for your personal collection
            </p>
          </motion.div>

          {/* Card 2: Light Sky Blue */}
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#D8EBFF] text-[#0A2540] rounded-3xl p-8 space-y-6 shadow-xl"
          >
            <span className="text-6xl sm:text-7xl font-serif font-bold tracking-tight block">
              63%
            </span>
            <p className="text-sm font-semibold text-[#0A2540]/90 leading-snug">
              more books completed with active status tracking and tags
            </p>
          </motion.div>

          {/* Card 3: Sage Olive Green */}
          <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-[#C2CBBA] text-[#062C19] rounded-3xl p-8 space-y-6 shadow-xl"
          >
            <span className="text-6xl sm:text-7xl font-serif font-bold tracking-tight block">
              0%
            </span>
            <p className="text-sm font-semibold text-[#062C19]/90 leading-snug">
              clutter — focused purely on logging books, habits, and authors
            </p>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E2DDD0] py-8 text-center text-xs font-semibold text-[#062C19]/60">
        <p>Book Manager • Personal Book Collection Space</p>
      </footer>
    </div>
  );
}
