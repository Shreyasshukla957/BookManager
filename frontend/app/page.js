"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Library,
  LockKeyhole,
  Search,
  Sparkles,
  Tag,
  TrendingUp,
} from "lucide-react";
import { getMe } from "@/utils/api";

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
    blue: "bg-white text-zinc-950 border-neutral-200",
    green: "bg-neutral-100 text-zinc-700 border-neutral-200",
    neutral: "bg-neutral-100 text-zinc-950 border-neutral-200",
  };

  return <span className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${tones[tone]}`}>{children}</span>;
}

function WorkspacePreview() {
  const [activeMetric, setActiveMetric] = useState("Total books");
  const [selectedBook, setSelectedBook] = useState("");
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
    { title: "Atomic Habits", author: "James Clear", status: "Reading", tone: "blue", tag: "Productivity", progress: "68%" },
    { title: "The Creative Act", author: "Rick Rubin", status: "Want to read", tone: "neutral", tag: "Ideas", progress: "12%" },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", status: "Completed", tone: "green", tag: "Technology", progress: "100%" },
  ];

  const handleMetricClick = (label) => {
    setActiveMetric(label);
    setNotice(`${label} is ready to explore.`);
  };

  const handleBookClick = (title) => {
    setSelectedBook(title);
    setNotice(`${title} selected from your shelf.`);
  };

  const advanceGoal = () => {
    const nextProgress = goalProgress >= 95 ? 20 : goalProgress + 10;
    setGoalProgress(nextProgress);
    setNotice(`Reading goal updated to ${nextProgress}%.`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 24 }} className="relative mx-auto w-[calc(100%-16px)] max-w-[1136px]">
      <div className="min-h-[650px] border border-white/70 bg-white/30 p-2 shadow-[0_28px_70px_rgba(6,44,25,0.18)] backdrop-blur-2xl sm:p-4">
        <div className="min-h-[630px] overflow-hidden border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-neutral-200/80 bg-white/45 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-2"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><span className="ml-2 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-950/45">Book Manager / Overview</span></div>
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }} className="hidden items-center gap-2 text-[10px] font-bold text-zinc-950/45 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-zinc-950" /> Live workspace</motion.span>
          </div>

          <div className="bg-white p-4 sm:p-6 lg:p-7">
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-5 sm:flex-row sm:items-end">
              <div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-950/45">Good afternoon, reader</p><h2 className="mt-1 text-2xl font-black tracking-tight text-zinc-950">Your reading room</h2></div>
              <div className="flex flex-wrap gap-2"><motion.button whileTap={{ scale: 0.96 }} onClick={() => setSearchFocused(!searchFocused)} className={`inline-flex items-center gap-2 border px-3 py-2 text-[10px] font-bold backdrop-blur transition ${searchFocused ? "border-zinc-950 bg-neutral-100/85 text-zinc-950" : "border-white/80 bg-white/55 text-zinc-950/55 hover:border-zinc-950/25"}`}><Search className="h-3 w-3" /> {searchFocused ? "Search active" : "Search"}</motion.button><motion.button whileTap={{ scale: 0.96 }} onClick={() => { setQuickAddOpen(!quickAddOpen); setNotice(quickAddOpen ? "Quick add closed." : "Quick add is ready for your next book."); }} className="inline-flex items-center gap-2 border border-zinc-950 bg-zinc-950 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-zinc-800"><BookOpen className="h-3.5 w-3.5" /> Add a book</motion.button></div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {metrics.map(({ label, value, icon: Icon }, index) => <motion.button key={label} whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} onClick={() => handleMetricClick(label)} layout="position" transition={{ type: "spring", stiffness: 420, damping: 28 }} className={`border p-3 text-left backdrop-blur transition sm:p-4 ${activeMetric === label ? "border-zinc-950 ring-2 ring-zinc-950/15" : "border-white/75 hover:border-zinc-950/35"} ${index === 0 ? "bg-zinc-950 text-white" : "bg-white/60 text-zinc-950"}`}><Icon className={`mb-4 h-3.5 w-3.5 ${index === 0 ? "text-white" : "text-zinc-950/45"}`} /><p className="text-2xl font-black">{value}</p><p className={`mt-1 text-[9px] font-black uppercase tracking-[0.08em] ${index === 0 ? "text-white/60" : "text-zinc-950/45"}`}>{label}</p></motion.button>)}
                </div>

                <div className="border border-white/80 bg-white/55 p-4 backdrop-blur-md sm:p-5">
                  <div className="mb-4 flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.12em] text-zinc-950/45">Your active shelf</p><p className="mt-1 text-sm font-black text-zinc-950">Continue reading</p></div><span className="text-[10px] font-bold text-zinc-950/40">3 books visible</span></div>
                  <div className="space-y-2.5">{books.map((book) => <motion.button key={book.title} whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }} onClick={() => handleBookClick(book.title)} className={`flex w-full items-center gap-3 border p-3 text-left transition ${selectedBook === book.title ? "border-zinc-950 bg-neutral-100/95 shadow-sm" : "border-white/80 bg-white/65 hover:border-zinc-950/35"}`}><div className="flex h-11 w-9 shrink-0 items-end justify-center bg-zinc-950 pb-1.5 text-[8px] font-black text-white">BM</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-zinc-950">{book.title}</p><p className="mt-0.5 truncate text-[10px] font-medium text-zinc-950/50">{book.author}</p><span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold text-zinc-950/45"><Tag className="h-2.5 w-2.5" /> {book.tag}</span></div><div className="hidden text-right sm:block"><StatusPill tone={book.tone}>{book.status}</StatusPill><p className="mt-1 text-[9px] font-bold text-zinc-950/45">{book.progress} tracked</p></div></motion.button>)}</div>
                  <AnimatePresence initial={false} mode="wait">{quickAddOpen && <motion.div initial={{ opacity: 0, height: 0, y: -8 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -8 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="mt-3 flex items-center gap-3 border border-dashed border-zinc-950/25 bg-neutral-100/80 p-3"><span className="flex h-8 w-8 items-center justify-center bg-white text-zinc-950"><BookOpen className="h-4 w-4" /></span><div className="flex-1"><p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950/55">New book draft</p><p className="mt-0.5 text-xs font-bold text-zinc-950">Start with a title and make it yours.</p></div><ArrowRight className="h-3.5 w-3.5 text-zinc-950/45" /></motion.div>}{selectedBook && <motion.div key={selectedBook} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ type: "spring", stiffness: 300, damping: 26 }} className="mt-3 flex items-center justify-between border border-zinc-950/15 bg-white/75 p-3 backdrop-blur"><div><p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-950/55">Selected title</p><p className="mt-0.5 text-xs font-black text-zinc-950">{selectedBook}</p></div><span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-white"><Check className="h-3.5 w-3.5" /></span></motion.div>}</AnimatePresence>
                </div>
              </div>

              <aside className="space-y-4 border border-white/80 bg-white/45 p-4 backdrop-blur-md">
                <div><p className="text-[10px] font-black uppercase tracking-[0.13em] text-zinc-950/45">Today&apos;s goal</p><p className="mt-1 text-lg font-black text-zinc-950">Read with intention</p></div>
                <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={advanceGoal} className="w-full border border-neutral-200 bg-neutral-100/70 p-4 text-left"><div className="flex items-center justify-between"><span className="text-xs font-black text-zinc-950">{goalProgress}% complete</span><span className="text-[10px] font-bold text-zinc-700">+10 min</span></div><div className="mt-4 h-2 overflow-hidden bg-white/80"><motion.div animate={{ width: `${goalProgress}%` }} transition={{ type: "spring", stiffness: 180, damping: 22 }} className="h-full bg-zinc-950" /></div><p className="mt-3 text-[10px] font-bold text-zinc-950/45">Tap to log a reading session</p></motion.button>
                <div className="border-t border-neutral-200 pt-4"><p className="text-[10px] font-black uppercase tracking-[0.13em] text-zinc-950/45">Recent activity</p><div className="mt-3 space-y-3">{["Finished a note on Atomic Habits", "Added The Creative Act", "Moved Deep Work to completed"].map((activity, index) => <motion.div key={activity} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.08 }} className="flex gap-2.5"><span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${index === 0 ? "bg-white ring-2 ring-zinc-950" : "bg-neutral-100"}`} /><p className="text-[10px] font-bold leading-4 text-zinc-950/60">{activity}</p></motion.div>)}</div></div>
              </aside>
            </div>
            <motion.p key={notice} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-[10px] font-bold text-zinc-950/45">{notice}</motion.p>
          </div>
        </div>
      </div>
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
    <div className="min-h-screen overflow-hidden bg-white font-sans text-zinc-950 selection:bg-zinc-950 selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10"><Link href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-white"><BookOpen className="h-4 w-4" /></span><span className="text-base font-black uppercase tracking-[-0.06em] sm:text-lg">Book Manager</span></Link><nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-[0.12em] text-zinc-950/60 md:flex"><a href="#features" className="transition hover:text-zinc-950">Features</a><a href="#workflow" className="transition hover:text-zinc-950">Workflow</a><a href="#security" className="transition hover:text-zinc-950">Security</a></nav><div className="flex items-center gap-2 sm:gap-4">{!loading && isAuthenticated ? <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} onClick={() => router.push("/dashboard")} className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 sm:px-5">Workspace <ArrowUpRight className="h-3.5 w-3.5" /></motion.button> : <><Link href="/login" className="hidden px-2 py-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-950/70 transition hover:text-zinc-950 sm:block">Log in</Link><Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-zinc-800 sm:px-5">Start reading <ArrowRight className="h-3.5 w-3.5" /></Link></>}</div></div>
      </header>

      <main>
        <section className="bg-white px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pb-16 lg:pt-36">
          <div className="mx-auto max-w-7xl">
            <div className="relative min-h-[560px] overflow-visible rounded-[26px] border border-white/80 bg-cover bg-center sm:min-h-[660px]" style={{ backgroundImage: "url('/bookshelf-hero.jpg')" }}>
              <div className="absolute inset-0 rounded-[26px] bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.28))]" />
              <div className="relative z-10 flex min-h-[560px] items-center justify-center px-5 py-16 text-center sm:min-h-[660px] sm:px-10">
                <motion.div initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.65 }} className="max-w-2xl text-center">
                  <div className="inline-flex items-center gap-2 border border-white/45 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm"><Sparkles className="h-3.5 w-3.5" /> Your reading workspace, refined</div>
                  <h1 className="mt-6 text-3xl font-black uppercase leading-[1.02] tracking-[-0.05em] text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-[3.75rem]">Make room for what you want to read.</h1>
                  <p className="mx-auto mt-5 max-w-xl text-xs font-medium leading-5 text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-sm">Book Manager gives your personal library a simple operating system: capture the books that matter, track your momentum, and always know what comes next.</p>
                  <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><motion.button whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} onClick={handleEnterDashboard} className="group inline-flex items-center justify-center gap-3 rounded-lg bg-white px-5 py-3 text-xs font-black text-zinc-950 transition hover:bg-neutral-200">Enter your workspace <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-white transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></span></motion.button></div>
                </motion.div>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.2 }} className="relative z-10 mx-auto -mt-20 w-[92%] [mask-image:linear-gradient(to_bottom,transparent_0px,black_68px,black_100%)] sm:-mt-28 sm:w-[78%]"><WorkspacePreview /></motion.div>
          </div>
        </section>
        <section className="bg-white px-5 sm:px-8 lg:px-10"><div className="mx-auto grid w-[calc(100%+16px)] max-w-[calc(80rem+16px)] -ml-[8px] grid-cols-2 divide-x divide-neutral-200 border-y border-dashed border-neutral-300/80 px-6 py-3 shadow-xs backdrop-blur-md mb-6 [mask-image:linear-gradient(to_right,transparent_0px,black_16px,black_calc(100%-16px),transparent_100%)] sm:grid-cols-4">{[{ value: "48", label: "books in one view" }, { value: "04", label: "clear statuses" }, { value: "∞", label: "room for notes" }, { value: "100%", label: "your collection" }].map((item) => <div key={item.label} className="px-4 py-6 first:pl-0 sm:px-7 sm:py-7 sm:first:pl-0"><p className="text-2xl font-black tracking-tight text-zinc-950 sm:text-3xl">{item.value}</p><p className="mt-1 text-[9px] font-black uppercase tracking-[0.13em] text-zinc-950/45 sm:text-[10px]">{item.label}</p></div>)}</div></section>

        <section id="features" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.6 }} className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-950/50">A focused toolkit</p><h2 className="mt-4 text-4xl font-black uppercase leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-5xl">Everything you need to keep reading.</h2><p className="mt-5 text-base font-medium leading-7 text-zinc-950/60">A clear structure for the books you own, the books you are reading, and the ideas you do not want to lose.</p></motion.div><div className="mx-auto mt-16 max-w-7xl divide-y divide-neutral-200 border-y border-neutral-200">{featureRows.map(({ number, eyebrow, title, copy, icon: Icon, items }, index) => <div key={number} className="grid gap-10 py-12 first:pt-10 last:pb-10 lg:grid-cols-[64px_0.9fr_1.1fr] lg:items-center lg:gap-12"><span className="text-sm font-black text-zinc-950/35">{number}</span><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.5 }}><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100 text-zinc-950"><Icon className="h-5 w-5" /></div><p className="mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-950/50">{eyebrow}</p><h3 className="mt-3 max-w-lg text-3xl font-black leading-tight tracking-[-0.04em] text-zinc-950">{title}</h3><p className="mt-5 max-w-lg text-sm font-medium leading-6 text-zinc-950/60">{copy}</p></motion.div><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reveal} transition={{ duration: 0.5, delay: 0.1 }}><FeaturePreview index={index} /><div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">{items.map((item) => <div key={item} className="flex items-center gap-2 text-xs font-bold text-zinc-950/60"><Check className="h-3.5 w-3.5 text-zinc-950" /> {item}</div>)}</div></motion.div></div>)}</div></section>

        <section id="workflow" className="mx-5 bg-zinc-950 text-white sm:mx-8 lg:mx-10"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24"><div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">A simple rhythm</p><h2 className="mt-4 text-4xl font-black uppercase leading-[0.98] tracking-[-0.06em] sm:text-5xl">Capture, sort, return.</h2><p className="mt-6 max-w-md text-base font-medium leading-7 text-white/65">Book Manager is designed to make the next reading session easier to begin.</p><Link href="/register" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-xs font-black text-zinc-950 transition hover:bg-neutral-100">Build your shelf <ArrowRight className="h-4 w-4" /></Link></div><div className="grid divide-y divide-white/15 border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-y-0">{[{ number: "01", title: "Capture", copy: "Add a title, author, tag, or note." }, { number: "02", title: "Sort", copy: "Keep the next step visible." }, { number: "03", title: "Return", copy: "Pick up exactly where you left off." }].map((step) => <div key={step.number} className="py-7 first:pt-7 sm:px-6 sm:py-0 sm:first:pl-0"><span className="text-sm font-black text-white">{step.number}</span><h3 className="mt-8 text-xl font-black text-white">{step.title}</h3><p className="mt-3 text-sm font-medium leading-6 text-white/55">{step.copy}</p></div>)}</div></div></div></section>

        <section id="security" className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-7xl gap-10 border-y border-neutral-200 py-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20"><div><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-zinc-950 text-white"><LockKeyhole className="h-5 w-5" /></div><p className="mt-7 text-[10px] font-black uppercase tracking-[0.18em] text-zinc-950/55">Private by design</p><h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-[-0.04em] text-zinc-950 sm:text-4xl">A personal library should feel personal.</h2><p className="mt-5 max-w-xl text-sm font-medium leading-6 text-zinc-950/60">Your account, notes, and collection stay behind a secure session. The interface stays quiet so the product never gets in the way of the habit.</p></div><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1"><div className="flex items-center gap-3 border border-neutral-200 bg-neutral-100 p-4"><Check className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black">Private collections</span></div><div className="flex items-center gap-3 border border-neutral-200 bg-white p-4"><Search className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black text-zinc-950">Fast, focused search</span></div><div className="flex items-center gap-3 border border-neutral-200 bg-neutral-100 p-4"><Tag className="h-4 w-4 text-zinc-950" /><span className="text-sm font-black">Flexible tags</span></div></div></div></section>

        <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28"><div className="mx-auto max-w-7xl border border-zinc-950 bg-white px-6 py-12 text-zinc-950 sm:px-12 sm:py-16 lg:px-16"><div className="mx-auto max-w-2xl text-center"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-950/60">Start with one book</p><h2 className="mt-4 text-4xl font-black uppercase leading-[0.96] tracking-[-0.06em] sm:text-5xl">Make your next reading session easier to begin.</h2><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3.5 text-sm font-black text-white transition hover:bg-zinc-800">Create your account <ArrowRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-zinc-950/20 bg-white/30 px-5 py-3.5 text-sm font-black transition hover:bg-neutral-100/45">I already have an account</Link></div></div></div></section>
      </main>

      <footer className="border-t border-neutral-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><Link href="/" className="flex items-center gap-2 text-sm font-black uppercase tracking-[-0.04em]"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-white"><BookOpen className="h-3.5 w-3.5" /></span>Book Manager</Link><div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.12em] text-zinc-950/45"><span>Personal reading, organized</span><span className="hidden sm:block">Built for your shelf</span></div></div></footer>
    </div>
  );
}