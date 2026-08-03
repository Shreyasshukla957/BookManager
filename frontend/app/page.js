"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  BookOpen,
  Check,
  Clock3,
  Flame,
  Layers,
  Library,
  LockKeyhole,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
  Zap,
} from "lucide-react";
import { getMe } from "@/utils/api";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import BookDetailModal from "@/components/BookDetailModal";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const featureRows = [
  {
    number: "01",
    eyebrow: "One clear home",
    title: "Turn your scattered reading list into a useful library.",
    copy: "Capture titles, authors, tags, and notes in a workspace that is easy to scan whenever you return.",
    icon: Library,
    items: ["Keep every title in one place", "Search by author or title", "Add notes while the idea is fresh"],
  },
  {
    number: "02",
    eyebrow: "A simple rhythm",
    title: "Know what you are reading now and what comes next.",
    copy: "Clear reading statuses make your collection feel active without adding another complicated system to maintain.",
    icon: TrendingUp,
    items: ["Move books through four statuses", "See your collection at a glance", "Keep your next read visible"],
  },
];

function StatusPill({ children, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50/70 text-blue-700 border-blue-200/80",
    green: "bg-emerald-50/70 text-emerald-700 border-emerald-200/80",
    neutral: "bg-slate-100/70 text-slate-700 border-slate-200/80",
  };

  return <span className={`rounded-md border px-2 py-0.5 text-[9px] font-mono font-medium uppercase tracking-wider ${tones[tone]}`}>{children}</span>;
}

function WorkspacePreview() {
  const [activeMetric, setActiveMetric] = useState("Total books");
  const [selectedBook, setSelectedBook] = useState("");
  const [previewDetailBook, setPreviewDetailBook] = useState(null);
  const [previewDetailBookIndex, setPreviewDetailBookIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [goalProgress, setGoalProgress] = useState(65);
  const [notice, setNotice] = useState("Select a tile or book to preview your workspace.");

  const metrics = [
    { label: "Total books", value: "48", icon: Library },
    { label: "Want to read", value: "15", icon: Clock3 },
    { label: "Reading now", value: "06", icon: BookOpen },
    { label: "Completed", value: "27", icon: TrendingUp },
  ];

  const books = [
    { title: "Atomic Habits", author: "James Clear", status: "Reading", tone: "blue", tag: "Productivity", progress: "68%", cover: "/atomic-habits.jpg", notes: "You do not rise to the level of your goals. You fall to the level of your systems." },
    { title: "The Creative Act", author: "Rick Rubin", status: "Want to read", tone: "neutral", tag: "Ideas", progress: "12%", cover: "/the-creative-act.jpg", notes: "To create is to bring into existence something that was not there before." },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", status: "Completed", tone: "green", tag: "Technology", progress: "100%", cover: "/the-pragmatic-programmer.jpg", notes: "Care about your craft. Why spend your life developing software unless you care about doing it well?" },
  ];

  const handleMetricClick = (label) => {
    setActiveMetric(label);
    setNotice(`${label} is ready to explore.`);
  };

  const handleBookClick = (bookObj, idx = 0) => {
    setSelectedBook(bookObj.title);
    setPreviewDetailBook(bookObj);
    setPreviewDetailBookIndex(idx);
    setNotice(`${bookObj.title} details opened.`);
  };

  const advanceGoal = () => {
    const nextProgress = goalProgress >= 95 ? 20 : goalProgress + 10;
    setGoalProgress(nextProgress);
    setNotice(`Reading goal updated to ${nextProgress}%.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 24 }} className="relative mx-auto w-[calc(100%-16px)] max-w-[1136px]">
      {/* Animated Moving Silver-Gray Gradient Outer Line on Dashboard */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="rounded-3xl p-[1px] bg-[linear-gradient(90deg,#e2e8f0,#94a3b8,#475569,#94a3b8,#e2e8f0)] bg-[length:200%_200%] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_4px_16px_-4px_rgba(15,23,42,0.04)]"
      >
        <div className="min-h-[650px] rounded-[23px] bg-white/80 p-2 sm:p-3.5 shadow-[inset_0_2px_4px_0_rgba(15,23,42,0.04)] backdrop-blur-xl">
          <div className="min-h-[630px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/90 shadow-xs" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90 shadow-xs" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90 shadow-xs" />
              </div>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Book Manager / Overview</span>
            </div>
            <motion.span animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.5, repeat: Infinity }} className="hidden items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200/70 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live workspace
            </motion.span>
          </div>

          <div className="bg-white p-4 sm:p-6 lg:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Good afternoon, reader</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Your reading room</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSearchFocused(!searchFocused)} className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[10px] font-bold transition shadow-2xs ${searchFocused ? "border-slate-800 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}>
                  <Search className="h-3 w-3" /> {searchFocused ? "Search active" : "Search"}
                </motion.button>
                <motion.button whileTap={{ scale: 0.96 }} onClick={() => { setQuickAddOpen(!quickAddOpen); setNotice(quickAddOpen ? "Quick add closed." : "Quick add is ready for your next book."); }} className="inline-flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-3.5 py-2 text-[10px] font-bold text-white shadow-xs transition hover:bg-slate-800">
                  <BookOpen className="h-3.5 w-3.5" /> Add a book
                </motion.button>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="space-y-5">
                {/* Metric Cards in Single Horizontal Div Bar */}
                <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                  <div className="grid grid-cols-2 divide-y divide-slate-100 sm:grid-cols-4 sm:divide-y-0 sm:divide-x sm:divide-slate-200/70">
                    {metrics.map(({ label, value, icon: Icon }, index) => {
                      const hoverClasses = [
                        "hover:bg-slate-900 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
                        "hover:bg-slate-800 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
                        "hover:bg-zinc-900 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
                        "hover:bg-slate-950 hover:text-white hover:shadow-[0_16px_36px_rgba(203,213,225,0.45)]",
                      ];
                      const badgeClasses = [
                        "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
                        "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
                        "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
                        "bg-gradient-to-tr from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-slate-300 group-hover:from-white group-hover:to-slate-100 group-hover:text-slate-950",
                      ];

                      const activeBgClasses = [
                        "bg-slate-900 text-white",
                        "bg-slate-800 text-white",
                        "bg-zinc-900 text-white",
                        "bg-slate-950 text-white",
                      ];

                      const isSelected = activeMetric === label;
                      return (
                        <motion.button
                          key={label}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMetricClick(label)}
                          className={`group relative overflow-hidden rounded-xl p-3.5 sm:p-4 text-left transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? `${activeBgClasses[index]} ${hoverClasses[index]}`
                              : `bg-white text-slate-800 ${hoverClasses[index]}`
                          }`}
                        >
                          <Icon className="absolute -right-3 -bottom-3 h-20 w-20 opacity-[0.04] transition-all duration-500 group-hover:rotate-12 group-hover:scale-125 group-hover:opacity-[0.14]" />
                          <div className="relative flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.12em] opacity-60 group-hover:opacity-90">
                              {label}
                            </span>
                            <span className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${badgeClasses[index]}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                          </div>
                          <div className="relative mt-3">
                            <p className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight">
                              {value}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Shelf Card with Silver-Gray Gradient Border */}
                <div className="rounded-2xl p-[1px] bg-gradient-to-r from-slate-200 via-slate-400/90 to-zinc-300 shadow-xs">
                  <div className="rounded-[15px] bg-white p-4 sm:p-5 shadow-[inset_0_2px_4px_0_rgba(15,23,42,0.04)]">
                    <div className="mb-4 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Your active shelf</p>
                        <p className="mt-1 text-sm font-black text-slate-900">Continue reading</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">3 books visible</span>
                    </div>

                    <div className="space-y-2.5">
                      {books.map((book, idx) => {
                        const isBookSelected = selectedBook === book.title;
                        return (
                          <motion.button
                            key={book.title}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleBookClick(book, idx)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 cursor-pointer ${
                              isBookSelected
                                ? "border-blue-400/70 bg-blue-50/40 shadow-xs ring-1 ring-blue-400/20"
                                : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-xs"
                            }`}
                          >
                            <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border border-slate-200/80 shadow-2xs">
                              <Image src={book.cover} alt={book.title} fill sizes="36px" className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-black text-slate-900">{book.title}</p>
                              <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">{book.author}</p>
                              <span className="mt-1.5 inline-flex items-center gap-1 rounded border border-slate-200/60 bg-slate-50 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-500"><Tag className="h-2.5 w-2.5 text-slate-400" /> {book.tag}</span>
                            </div>
                            <div className="hidden text-right sm:block">
                              <StatusPill tone={book.tone}>{book.status}</StatusPill>
                              <p className="mt-1 text-[9px] font-bold text-slate-400">{book.progress} tracked</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <AnimatePresence initial={false} mode="wait">
                      {quickAddOpen && (
                        <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 shadow-2xs"><BookOpen className="h-4 w-4" /></span>
                          <div className="flex-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">New book draft</p>
                            <p className="mt-0.5 text-xs font-bold text-slate-900">Start with a title and make it yours.</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Sidebar Section */}
              <aside className="space-y-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Today&apos;s goal</p>
                  <p className="mt-1 text-lg font-black text-slate-900">Read with intention</p>
                </div>
                <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={advanceGoal} className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-2xs transition-all hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{goalProgress}% complete</span>
                    <span className="text-[10px] font-bold text-blue-600">+10 min</span>
                  </div>
                  <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div animate={{ width: `${goalProgress}%` }} transition={{ type: "spring", stiffness: 180, damping: 22 }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" />
                  </div>
                  <p className="mt-3 text-[10px] font-bold text-slate-400">Tap to log a reading session</p>
                </motion.button>
                <div className="border-t border-slate-200/70 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">Recent activity</p>
                  <div className="mt-3 space-y-3">
                    {["Finished a note on Atomic Habits", "Added The Creative Act", "Moved Deep Work to completed"].map((activity, index) => (
                      <motion.div key={activity} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.08 }} className="flex gap-2.5">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${index === 0 ? "bg-blue-600 ring-2 ring-blue-100" : "bg-slate-300"}`} />
                        <p className="text-[10px] font-bold leading-4 text-slate-600">{activity}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
            <motion.p key={notice} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-[10px] font-bold text-slate-400">{notice}</motion.p>
          </div>
        </div>
      </div>

      <BookDetailModal
        book={previewDetailBook}
        index={previewDetailBookIndex}
        onClose={() => setPreviewDetailBook(null)}
      />
    </motion.div>
  </motion.div>
  );
}

function FeaturePreview({ index }) {
  const [selectedTitle, setSelectedTitle] = useState("The Psychology of Money");
  const [period, setPeriod] = useState("Week");
  const [activeDay, setActiveDay] = useState(5);
  const [goalDone, setGoalDone] = useState(false);

  const library = [
    { title: "The Psychology of Money", author: "Morgan Housel", tag: "Finance" },
    { title: "The Design of Everyday Things", author: "Don Norman", tag: "Design" },
    { title: "Tomorrow, and Tomorrow, and Tomorrow", author: "Gabrielle Zevin", tag: "Fiction" },
  ];
  const weeklyBars = [42, 64, 50, 78, 58, 94, 72];
  const monthlyBars = [32, 48, 60, 52, 80, 68, 90];
  const chartBars = period === "Week" ? weeklyBars : monthlyBars;
  const activeMinutes = Math.round(chartBars[activeDay] * 0.72);

  if (index === 0) {
    return (
      <div className="border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-950/45">Library view</p><p className="mt-1 text-sm font-black text-zinc-950">Keep every title reachable</p></div><motion.span whileHover={{ rotate: 8 }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-zinc-950"><Search className="h-3.5 w-3.5" /></motion.span></div>
        <div className="mt-4 space-y-2">{library.map((book, itemIndex) => <motion.button key={book.title} whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }} onClick={() => setSelectedTitle(book.title)} className={`flex w-full items-center gap-3 border p-2.5 text-left transition ${selectedTitle === book.title ? "border-zinc-950 bg-neutral-100" : "border-neutral-200/70 bg-white hover:border-zinc-950/30"}`}><span className="text-[10px] font-black text-zinc-950/35">0{itemIndex + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-zinc-950">{book.title}</p><p className="mt-0.5 truncate text-[10px] font-medium text-zinc-950/50">{book.author}</p></div><span className="hidden text-[9px] font-black uppercase tracking-[0.08em] text-zinc-950/45 sm:block">{book.tag}</span></motion.button>)}</div>
        <AnimatePresence mode="wait"><motion.div key={selectedTitle} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 border border-neutral-200 bg-neutral-100/80 p-3"><div><p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950/55">Selected book</p><p className="mt-1 text-xs font-black text-zinc-950">{selectedTitle}</p></div><span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-white"><Check className="h-3.5 w-3.5" /></span></motion.div></AnimatePresence>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-zinc-950/45">Reading momentum</p><p className="mt-1 text-sm font-black text-zinc-950">Your reading rhythm</p></div><div className="flex border border-neutral-200 bg-white p-0.5">{["Week", "Month"].map((option) => <motion.button key={option} whileTap={{ scale: 0.96 }} onClick={() => setPeriod(option)} className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.08em] transition ${period === option ? "bg-zinc-950 text-white" : "text-zinc-950/45"}`}>{option}</motion.button>)}</div></div>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-4"><div><p className="text-3xl font-black tracking-tight text-zinc-950">12.4h</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-950/45">tracked this {period.toLowerCase()}</p></div><motion.div animate={{ scale: goalDone ? 1.05 : 1 }} className="border border-neutral-200 bg-neutral-100/80 px-3 py-2 text-right"><p className="text-xs font-black text-zinc-700">+18.6%</p><p className="mt-0.5 text-[9px] font-bold text-zinc-700/70">steady growth</p></motion.div></div>
      <div className="mt-5"><div className="flex h-28 items-end gap-1.5 border-b border-neutral-200 pb-2">{chartBars.map((height, barIndex) => <motion.button key={barIndex} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveDay(barIndex)} className="group flex h-full flex-1 items-end"><motion.span animate={{ height: `${height}%`, opacity: activeDay === barIndex ? 1 : 0.68 }} transition={{ type: "spring", stiffness: 190, damping: 20 }} className={`w-full ${activeDay === barIndex ? "bg-zinc-950" : "bg-neutral-100 group-hover:bg-zinc-950/75"}`} /></motion.button>)}</div><div className="mt-2 grid grid-cols-7 text-center text-[8px] font-black uppercase tracking-[0.05em] text-zinc-950/35">{["M", "T", "W", "T", "F", "S", "S"].map((day, dayIndex) => <span key={`${day}-${dayIndex}`} className={activeDay === dayIndex ? "text-zinc-950" : ""}>{day}</span>)}</div></div>
      <motion.div layout className="mt-4 border border-neutral-200 bg-neutral-100/80 p-3"><div className="flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950/45">Selected session</p><p className="mt-1 text-xs font-black text-zinc-950">{activeMinutes} focused minutes</p></div><Clock3 className="h-4 w-4 text-zinc-950/45" /></div><motion.button whileTap={{ scale: 0.98 }} onClick={() => setGoalDone(!goalDone)} className={`mt-3 w-full border px-3 py-2 text-[10px] font-black transition ${goalDone ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-950/20 bg-white text-zinc-950 hover:bg-neutral-100"}`}>{goalDone ? "Goal logged" : "Mark today complete"}</motion.button></motion.div>
    </div>
  );
}
function BentoGridFeatures() {
  const [activeTab, setActiveTab] = useState("reading");
  const [sessionMins, setSessionMins] = useState(45);
  const [streakCount, setStreakCount] = useState(14);
  const goalTarget = 60;
  const progressPercent = Math.min(100, Math.round((sessionMins / goalTarget) * 100));
  const [bookmarked, setBookmarked] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const sampleBooks = [
    { title: "Atomic Habits", author: "James Clear", status: "Reading" },
    { title: "The Creative Act", author: "Rick Rubin", status: "Want to read" },
    { title: "Deep Work", author: "Cal Newport", status: "Completed" },
  ];

  const filteredBooks = sampleBooks.filter(b => {
    const matchesFilter = selectedFilter === "All" || b.status === selectedFilter;
    const matchesSearch = searchQuery === "" || b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <BentoGrid>
        {/* CARD 1: LIVE SHELF MATRIX */}
        <BentoCard
          name="Visual Shelf & Status Matrix"
          className="col-span-1 md:col-span-2 lg:col-span-2"
          eyebrow="01 // Shelf Management"
          Icon={Library}
          description="Group titles effortlessly across active reading statuses. Your shelf dynamically re-arranges with fluid spring animations."
          href="/register"
          cta="Explore shelf layout"
          background={
            <div className="w-full h-full flex flex-col justify-center">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2 mb-3">
                <div className="flex gap-1.5">
                  {["reading", "want-to-read", "completed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-md px-2.5 py-1 text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                        activeTab === tab ? "bg-slate-900 text-white shadow-xs" : "bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-100/80"
                      }`}
                    >
                      {tab.replace("-", " ")}
                    </button>
                  ))}
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-900 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {sampleBooks.map((b) => (
                  <div
                    key={b.title}
                    className={`rounded-xl border p-2.5 text-left transition-all ${
                      activeTab === b.status ? "border-slate-900 bg-slate-900 text-white shadow-md" : "border-slate-200/90 bg-white text-slate-800"
                    }`}
                  >
                    <div className="h-1 w-5 rounded-full bg-slate-400/80 mb-1.5" />
                    <p className="font-mono text-[11px] font-bold truncate">{b.title}</p>
                    <p className="font-mono text-[9px] opacity-70 truncate mt-0.5">{b.author}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* CARD 2: READING VELOCITY ENGINE */}
        <BentoCard
          name="Reading Velocity & Momentum"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          eyebrow="02 // Velocity Engine"
          Icon={Zap}
          description="Keep your daily habit glowing. Log reading sessions in real-time and watch your progress ring fill up."
          href="/register"
          cta="Start tracking session"
          background={
            <div className="w-full h-full flex flex-col items-center justify-center py-1 text-center">
              <div className="relative flex items-center justify-center">
                <svg className="h-20 w-20 -rotate-90 stroke-current">
                  <circle cx="40" cy="40" r="32" className="text-slate-200/80" strokeWidth="6" fill="transparent" />
                  <motion.circle
                    cx="40" cy="40" r="32"
                    className="text-slate-900"
                    strokeWidth="6"
                    strokeDasharray={201}
                    initial={{ strokeDashoffset: 201 }}
                    animate={{ strokeDashoffset: 201 - (201 * progressPercent) / 100 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-mono text-base font-black text-slate-900">{progressPercent}%</span>
                  <span className="font-mono text-[7px] font-bold text-slate-400 uppercase">{sessionMins}/{goalTarget}m</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSessionMins(prev => (prev >= goalTarget ? 15 : prev + 15));
                    if (sessionMins + 15 >= goalTarget) setStreakCount(prev => prev + 1);
                  }}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[9px] font-mono font-bold text-white shadow-xs transition hover:bg-slate-800 cursor-pointer"
                >
                  <Zap className="h-2.5 w-2.5 text-amber-400" /> +15m
                </button>

                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[8px] font-mono font-bold text-slate-800 border border-slate-200">
                  <Flame className="h-2.5 w-2.5 text-amber-500" /> {streakCount}d streak
                </span>
              </div>
            </div>
          }
        />

        {/* CARD 3: ZERO-LATENCY SEARCH RADAR */}
        <BentoCard
          name="Zero-Latency Search Radar"
          className="col-span-1 md:col-span-2 lg:col-span-2"
          eyebrow="03 // Instant Search"
          Icon={Search}
          description="Type or tap status filters to instantaneously search titles across your entire personal library."
          href="/register"
          cta="Try instant search"
          background={
            <div className="w-full h-full flex flex-col justify-center">
              <div className="flex gap-2 mb-2.5">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter titles..."
                    className="w-full rounded-md border border-slate-200/90 bg-white pl-8 pr-3 py-1.5 text-[10px] font-mono focus:border-slate-900 focus:outline-none text-slate-900 placeholder:text-slate-400 shadow-2xs"
                  />
                </div>
                <div className="flex gap-1">
                  {["All", "Reading", "Completed"].map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      className={`rounded-md px-2.5 py-1.5 text-[9px] font-mono font-bold transition cursor-pointer ${
                        selectedFilter === f ? "bg-slate-900 text-white shadow-xs" : "bg-white border border-slate-200/90 text-slate-600 hover:bg-slate-100/80"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {filteredBooks.slice(0, 2).map((b) => (
                  <div key={b.title} className="rounded-lg border border-slate-200/90 bg-white p-2 text-left flex items-center justify-between shadow-2xs">
                    <div className="truncate">
                      <p className="font-mono text-[10px] font-bold text-slate-900 truncate">{b.title}</p>
                      <p className="font-mono text-[8px] text-slate-500 truncate">{b.author}</p>
                    </div>
                    <span className="font-mono text-[8px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        {/* CARD 4: INFINITE REFLECTION NOTES */}
        <BentoCard
          name="Infinite Note Canvas"
          className="col-span-1 md:col-span-1 lg:col-span-1"
          eyebrow="04 // Note Canvas"
          Icon={Bookmark}
          description="Capture ideas while they are fresh with zero friction. Attach quotes and takeaways."
          href="/register"
          cta="Write a note"
          background={
            <div className="w-full h-full flex flex-col justify-center">
              <div className="rounded-xl border border-slate-200/90 bg-white p-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1 mb-1.5">
                  <span className="font-mono text-[9px] font-bold uppercase text-slate-400">Atomic Habits</span>
                  <button onClick={() => setBookmarked(!bookmarked)} className="text-slate-800 cursor-pointer">
                    <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-slate-900" : ""}`} />
                  </button>
                </div>
                <p className="font-mono text-[10px] text-slate-700 italic leading-snug">
                  &ldquo;You fall to the level of your systems.&rdquo;
                </p>
                <div className="mt-2 flex gap-1">
                  {["#Systems", "#Habits"].map(t => (
                    <span key={t} className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[8px] font-bold text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          }
        />
      </BentoGrid>
    </div>
  );
}

export default function HeroLandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try { await getMe(); setIsAuthenticated(true); } catch (err) { setIsAuthenticated(false); } finally { setLoading(false); }
    }
    checkAuth();
  }, []);

  const handleEnterDashboard = () => router.push(isAuthenticated ? "/dashboard" : "/login");

  return (
    <div className="min-h-screen overflow-hidden bg-white font-mono text-zinc-950 selection:bg-zinc-950 selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-slate-200 via-slate-300 to-slate-400 text-slate-900 border border-slate-300/80 shadow-xs"><BookOpen className="h-4 w-4" /></span><span className="relative py-0.5 text-base font-bold uppercase tracking-[-0.06em] text-slate-600 transition hover:text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-slate-800 after:transition-all after:duration-500 hover:after:w-full sm:text-lg">Book Manager</span></Link><nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.12em] text-zinc-950/60 md:flex"><a href="#features" className="relative py-1 transition hover:text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-zinc-950 after:transition-all after:duration-500 hover:after:w-full">Features</a><a href="#workflow" className="relative py-1 transition hover:text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-zinc-950 after:transition-all after:duration-500 hover:after:w-full">Workflow</a><a href="#security" className="relative py-1 transition hover:text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-zinc-950 after:transition-all after:duration-500 hover:after:w-full">Security</a></nav><div className="flex items-center gap-2 sm:gap-4">{!loading && isAuthenticated ? <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 sm:px-5">Workspace <ArrowUpRight className="h-3.5 w-3.5" /></motion.button> : <><Link href="/login" className="relative hidden px-2 py-1 text-xs font-black uppercase tracking-[0.12em] text-zinc-950/70 transition hover:text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-zinc-950 after:transition-all after:duration-500 hover:after:w-full sm:block">Log in</Link><Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 sm:px-5">Start reading <ArrowRight className="h-3.5 w-3.5" /></Link></>}</div></div>
      </header>

      <main>
        <section
          className="relative overflow-hidden bg-white px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36"
          style={{ background: "radial-gradient(ellipse 160% 1000px at 50% -5%, #ffffff 0%, #e2e8f0 18%, #cbd5e1 38%, #94a3b8 58%, #cbd5e1 78%, #f8fafc 90%, #ffffff 100%)" }}
        >
          <div className="mx-auto max-w-7xl text-center">
            <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.65 }} className="mx-auto max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/90 px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-slate-700 backdrop-blur-sm shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" /> Your reading workspace, refined
              </div>
              <h1 className="mt-6 text-3xl font-mono font-bold uppercase leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-[3.5rem]">
                Make room for what you want to read.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-xs font-mono font-medium leading-6 text-slate-700 sm:text-sm">
                Book Manager gives your personal library a simple operating system: capture the books that matter, track your momentum, and always know what comes next.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleEnterDashboard}
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-300 bg-white/95 px-4 py-2 text-xs font-mono font-bold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-white hover:text-slate-900 backdrop-blur-md"
                >
                  <span>Enter your workspace</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Dashboard Workspace Preview inside the semicircular gradient spread */}
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.2 }} className="relative z-10 mx-auto mt-12 w-[95%] sm:mt-16 sm:w-[85%] lg:w-[80%]">
              <WorkspacePreview />

              {/* Stats Bar directly below dashboard with generous gap */}
              {/* Stats Bar with Animated Moving Silver-Gray Gradient Border Line */}
              <motion.div
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="mt-10 sm:mt-12 rounded-2xl p-[1px] bg-[linear-gradient(90deg,#e2e8f0,#94a3b8,#475569,#94a3b8,#e2e8f0)] bg-[length:200%_200%] shadow-2xs"
              >
                <div className="rounded-[15px] bg-white/95 p-1.5 backdrop-blur-md">
                  <div className="grid grid-cols-2 divide-x divide-slate-100 sm:grid-cols-4">
                    {[
                      { value: "48", label: "books in one view", gradient: "text-slate-900", size: "text-base sm:text-lg" },
                      { value: "04", label: "clear statuses", gradient: "text-slate-900", size: "text-base sm:text-lg" },
                      { value: "∞", label: "room for notes", gradient: "bg-gradient-to-r from-pink-500 via-red-500 to-purple-600 bg-clip-text text-transparent", size: "text-2xl sm:text-3xl font-black leading-tight" },
                      { value: "100%", label: "your collection", gradient: "text-slate-900", size: "text-base sm:text-lg" },
                    ].map((item) => (
                      <div key={item.label} className="px-3 py-2 text-center sm:px-4 flex flex-col items-center justify-center">
                        <p className={`font-mono font-bold tracking-tight ${item.size} ${item.gradient}`}>
                          {item.value}
                        </p>
                        <p className="mt-0.5 font-mono text-[9px] font-medium uppercase tracking-wider text-slate-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="features" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-slate-600 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> A focused toolkit
            </span>
            <h2 className="mt-4 text-4xl font-mono font-bold uppercase leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-5xl">
              Everything you need to keep reading.
            </h2>
            <p className="mt-5 text-xs sm:text-sm font-mono font-medium leading-6 text-slate-600">
              A clear structure for the books you own, the books you are reading, and the ideas you do not want to lose.
            </p>
          </motion.div>

          <BentoGridFeatures />
        </section>

        <section id="workflow" className="mx-5 bg-zinc-950 text-white sm:mx-8 lg:mx-10"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">A simple rhythm</p><h2 className="mt-4 text-4xl font-black uppercase leading-[0.98] tracking-[-0.06em] sm:text-5xl">Capture, sort, return.</h2><p className="mt-6 max-w-md text-base font-medium leading-7 text-white/65">Book Manager is designed to make the next reading session easier to begin.</p><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-black text-zinc-950 transition hover:bg-neutral-100">Build your shelf <ArrowRight className="h-4 w-4" /></Link></div><div className="grid divide-y divide-white/15 border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-y-0">{[{ number: "01", title: "Capture", copy: "Add a title, author, tag, or note." }, { number: "02", title: "Sort", copy: "Keep the next step visible." }, { number: "03", title: "Return", copy: "Pick up exactly where you left off." }].map((step) => <div key={step.number} className="py-7 first:pt-7 sm:px-6 sm:py-0 sm:first:pl-0"><span className="text-sm font-black text-white">{step.number}</span><h3 className="mt-8 text-xl font-black text-white">{step.title}</h3><p className="mt-3 text-sm font-medium leading-6 text-white/55">{step.copy}</p></div>)}</div></div></div></section>

        <section id="security" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 border-y border-neutral-200 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20"><div><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white"><LockKeyhole className="h-5 w-5" /></div><p className="mt-7 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-950/55">Private by design</p><h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] text-zinc-950 sm:text-4xl">A personal library should feel personal.</h2><p className="mt-5 max-w-xl text-sm font-medium leading-6 text-zinc-950/60">Your account, notes, and collection stay behind a secure session. The interface stays quiet so the product never gets in the way of the habit.</p></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className="flex items-center gap-3 border border-neutral-200 bg-neutral-100 p-4"><Check className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black">Private collections</span></div><div className="flex items-center gap-3 border border-neutral-200 bg-white p-4"><Search className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black text-zinc-950">Fast, focused search</span></div><div className="flex items-center gap-3 border border-neutral-200 bg-neutral-100 p-4"><Tag className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black">Flexible tags</span></div></div></div></section>

        <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-12 text-zinc-950 sm:px-12 sm:py-16 lg:px-16 shadow-xl">
            <Image
              src="/bookshelf-hero.jpg"
              alt="Bookshelf Background"
              fill
              className="object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white drop-shadow-md">Start with one book</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl drop-shadow-lg">
                Make your next reading session easier to begin.
              </h2>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3.5 text-sm font-black text-zinc-950 transition hover:bg-neutral-100">
                  Create your account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/20">
                  I already have an account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 text-sm font-mono font-bold uppercase tracking-[-0.04em] text-slate-800 hover:text-slate-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
              <BookOpen className="h-3.5 w-3.5" />
            </span>
            Book Manager
          </Link>

          <p className="text-xs font-mono font-bold text-slate-600">
            Made with ❤️ by Shreyash
          </p>
        </div>
      </footer>
    </div>
  );
}