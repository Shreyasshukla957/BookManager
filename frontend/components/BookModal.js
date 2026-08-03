"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export default function BookModal({
  show,
  editingBook,
  formData,
  setFormData,
  onClose,
  onSave,
}) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white border border-[#E2DDD0] rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6 relative"
        >
          <div className="flex items-center justify-between border-b border-[#EEEBE1] pb-4">
            <h3 className="text-xl font-black text-[#062C19]">
              {editingBook ? "Edit Book Entry" : "Add New Book"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#062C19] mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Atomic Habits"
                className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-medium text-[#062C19] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#062C19] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#062C19] mb-1">Author Name *</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. James Clear"
                className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-medium text-[#062C19] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#062C19] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#062C19] mb-1">Reading Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-bold text-[#062C19] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#062C19] transition cursor-pointer"
                >
                  <option value="Want to Read">Want to Read</option>
                  <option value="Reading">Reading</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#062C19] mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Self-Help, Productivity"
                  className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-medium text-[#062C19] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#062C19] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#062C19] mb-1">Personal Notes / Thoughts</label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add key takeaways or personal thoughts..."
                className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-medium text-[#062C19] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#062C19] transition resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#EEEBE1]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-[#062C19] bg-[#EEEBE1] hover:bg-[#e4dfd2] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#062C19] hover:bg-[#0a4227] rounded-xl transition shadow-md cursor-pointer"
              >
                {editingBook ? "Save Changes" : "Add Book"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
