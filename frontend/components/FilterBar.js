"use client";

import { Search, Plus } from "lucide-react";

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  selectedStatus,
  setSelectedStatus,
  onOpenAddModal,
}) {
  const statuses = ["All", "Want to Read", "Reading", "Completed"];

  return (
    <div className="border border-[#E2DDD0] bg-white/80 p-3 shadow-sm backdrop-blur-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* Search Input with Search Button */}
      <form onSubmit={onSearchSubmit} className="flex items-center space-x-2 w-full md:w-auto flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-xs font-medium text-[#062C19] pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#062C19] transition"
          />
          <Search className="w-4 h-4 text-[#062C19]/40 absolute left-3 top-3" />
        </div>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#062C19] text-white text-xs font-bold hover:bg-[#0a4227] transition shrink-0 cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Filter Status Pills & Add Book Button */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
        <div className="flex items-center space-x-1 bg-[#F7F5EE] p-1 border border-[#E2DDD0]">
          {statuses.map((status) => {
            const isSelected =
              status === "All" ? selectedStatus === "" : selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status === "All" ? "" : status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#062C19] text-white shadow-sm"
                    : "text-[#062C19]/70 hover:text-[#062C19]"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 bg-[#062C19] hover:bg-[#0a4227] text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Book</span>
        </button>
      </div>
    </div>
  );
}
