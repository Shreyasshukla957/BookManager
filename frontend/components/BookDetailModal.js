"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, Tag, Calendar, Edit3, Trash2, Bookmark } from "lucide-react";

export default function BookDetailModal({ book, index = 0, onClose, onEdit, onDelete, onStatusChange }) {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Reading":
        return "bg-sky-100 text-sky-800 border-sky-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  const coverImages = {
    "Atomic Habits": "/atomic-habits.jpg",
    "The Creative Act": "/the-creative-act.jpg",
    "The Pragmatic Programmer": "/the-pragmatic-programmer.jpg",
  };

  const defaultCover = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
  const bookCover = book ? (coverImages[book.title] || book.coverImage || defaultCover) : defaultCover;

  // Determine popup position & animation based on book index:
  // index % 3 === 0 -> Right side
  // index % 3 === 1 -> Left side
  // index % 3 === 2 -> Bottom center
  const posMode = Math.abs((index ?? 0) % 3);

  const positionClasses = posMode === 1
    ? "fixed top-20 left-4 sm:left-8 z-50"
    : posMode === 2
    ? "fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    : "fixed top-20 right-4 sm:right-8 z-50";

  const motionProps = posMode === 1
    ? { initial: { opacity: 0, x: "-100vw", scale: 0.9 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: "-100vw", scale: 0.9 } }
    : posMode === 2
    ? { initial: { opacity: 0, y: "100vh", scale: 0.9 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: "100vh", scale: 0.9 } }
    : { initial: { opacity: 0, x: "100vw", scale: 0.9 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: "100vw", scale: 0.9 } };

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          {...motionProps}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className={`${positionClasses} w-[88vw] max-w-[340px] sm:w-[360px] overflow-hidden rounded-2xl border border-slate-300/90 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)]`}
        >
          {/* Top Bar with Title & Close Button */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-2xs">
                <BookOpen className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {posMode === 0 ? "Right Drawer" : posMode === 1 ? "Left Drawer" : "Bottom Drawer"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Book Content Section */}
          <div className="mt-3.5 space-y-3.5">
            {/* Book Cover + Basic Info */}
            <div className="flex gap-3.5">
              <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 shadow-xs">
                <img
                  src={bookCover}
                  alt={book.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultCover;
                  }}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h3 className="text-sm font-mono font-bold text-slate-900 leading-snug line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-[11px] font-mono font-medium text-slate-500 truncate">
                  by <span className="text-slate-800 font-bold">{book.author || "Unknown Author"}</span>
                </p>

                {/* Status selector */}
                {onStatusChange ? (
                  <select
                    value={book.status || "Want to Read"}
                    onChange={(e) => onStatusChange(book._id, e.target.value)}
                    className={`mt-1 rounded-lg border px-2 py-0.5 text-[10px] font-mono font-bold focus:outline-none cursor-pointer transition ${getStatusBadgeStyle(
                      book.status
                    )}`}
                  >
                    <option value="Want to Read">Want to Read</option>
                    <option value="Reading">Reading</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <span className={`mt-1 inline-block rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${getStatusBadgeStyle(book.status)}`}>
                    {book.status || "Want to Read"}
                  </span>
                )}
              </div>
            </div>

            {/* Tag Pills */}
            {((Array.isArray(book.tags) && book.tags.length > 0) || book.tag) && (
              <div className="flex flex-wrap gap-1">
                {Array.isArray(book.tags)
                  ? book.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        <Tag className="h-2.5 w-2.5 text-slate-400" />
                        {tag}
                      </span>
                    ))
                  : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                        <Tag className="h-2.5 w-2.5 text-slate-400" />
                        {book.tag}
                      </span>
                    )}
              </div>
            )}

            {/* Notes / Takeaways */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/90 p-2.5 space-y-1">
              <div className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                <Bookmark className="h-3 w-3 text-slate-600" />
                <span>Notes & Takeaways</span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 italic leading-snug line-clamp-3">
                &ldquo;{book.notes || book.description || "A focused read stored in your library."}&rdquo;
              </p>
            </div>

            {/* Created Timestamp */}
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
              <Calendar className="h-3 w-3" />
              <span>Added {new Date(book.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(book);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-mono font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <Edit3 className="h-3 w-3 text-slate-600" /> Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onClose();
                    onDelete(book._id);
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[10px] font-mono font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                >
                  <Trash2 className="h-3 w-3 text-rose-600" /> Delete
                </button>
              )}
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-mono font-bold text-white transition hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
