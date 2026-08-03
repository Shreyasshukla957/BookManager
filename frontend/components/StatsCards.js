"use client";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#062C19] text-white p-6 rounded-2xl shadow-sm border border-[#062C19]">
        <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Total Books</p>
        <p className="text-4xl font-serif font-bold mt-2 text-[#D2F254]">{stats?.total || 0}</p>
      </div>

      <div className="bg-[#D8EBFF] text-[#0A2540] p-6 rounded-2xl shadow-sm border border-[#C2E0FF]">
        <p className="text-xs font-bold text-[#0A2540]/70 uppercase tracking-wider">Want to Read</p>
        <p className="text-4xl font-serif font-bold mt-2">{stats?.wantToRead || 0}</p>
      </div>

      <div className="bg-[#EEEBE1] text-[#062C19] p-6 rounded-2xl shadow-sm border border-[#E2DDD0]">
        <p className="text-xs font-bold text-[#062C19]/70 uppercase tracking-wider">Reading Now</p>
        <p className="text-4xl font-serif font-bold mt-2">{stats?.reading || 0}</p>
      </div>

      <div className="bg-[#C2CBBA] text-[#062C19] p-6 rounded-2xl shadow-sm border border-[#B1BCAA]">
        <p className="text-xs font-bold text-[#062C19]/70 uppercase tracking-wider">Completed</p>
        <p className="text-4xl font-serif font-bold mt-2">{stats?.completed || 0}</p>
      </div>
    </div>
  );
}
