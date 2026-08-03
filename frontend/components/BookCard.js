"use client";

import { motion } from "motion/react";
import { Edit3, Trash2, Tag } from "lucide-react";

export default function BookCard({ book, onEdit, onDelete, onStatusChange, onCardClick }) {
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Reading":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={() => onCardClick && onCardClick(book)}
      className="group relative overflow-hidden border border-[#E2DDD0] bg-white p-5 rounded-2xl shadow-xs transition hover:border-[#062C19]/30 hover:shadow-md flex flex-col justify-between space-y-4 cursor-pointer"
    >
      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-lg text-[#062C19] leading-snug line-clamp-2 group-hover:text-emerald-950 transition">
            {book.title}
          </h3>
          <select
            value={book.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(book._id, e.target.value);
            }}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeStyle(
              book.status
            )}`}
          >
            <option value="Want to Read">Want to Read</option>
            <option value="Reading">Reading</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <p className="text-xs font-semibold text-[#062C19]/70">
          by <span className="text-[#062C19] font-bold">{book.author || "Unknown Author"}</span>
        </p>

        {book.notes && (
          <p className="text-xs text-[#062C19]/60 font-medium bg-[#F7F5EE] p-3 rounded-xl border border-[#E2DDD0]/60 italic line-clamp-3">
            &ldquo;{book.notes}&rdquo;
          </p>
        )}
      </div>

      <div className="space-y-3 pt-2 border-t border-[#EEEBE1]">
        {/* Tags list */}
        {Array.isArray(book.tags) && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {book.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 text-[10px] font-bold bg-[#F7F5EE] text-[#062C19] px-2 py-0.5 rounded-md border border-[#E2DDD0]"
              >
                <Tag className="w-2.5 h-2.5 text-[#062C19]/50" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
            className="p-2 text-[#062C19]/70 hover:text-[#062C19] hover:bg-[#F7F5EE] rounded-lg transition cursor-pointer"
            title="Edit book"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition cursor-pointer"
            title="Delete book"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
