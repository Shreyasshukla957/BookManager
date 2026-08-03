"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "../../components/Navbar";
import StatsCards from "../../components/StatsCards";
import FilterBar from "../../components/FilterBar";
import BookCard from "../../components/BookCard";
import BookModal from "../../components/BookModal";
import { getMe, getBooks, logoutUser, createBook, updateBook, deleteBook } from "../../utils/api";
import { ArrowRight, BookOpen, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, wantToRead: 0, reading: 0, completed: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [formData, setFormData] = useState({
    title: "", author: "", tags: "", status: "Want to Read", notes: ""
  });

  useEffect(() => {
    fetchUserDataAndBooks();
  }, [selectedStatus]);

  async function fetchUserDataAndBooks(query = searchQuery) {
    try {
      setLoading(true);
      const userData = await getMe();
      setUser(userData);

      const booksData = await getBooks(selectedStatus, query);
      setBooks(booksData.books || []);
      if (booksData.stats) setStats(booksData.stats);
    } catch (err) {
      console.error("Auth / Load Error:", err);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUserDataAndBooks(searchQuery);
  };

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setFormData({ title: "", author: "", tags: "", status: "Want to Read", notes: "" });
    setShowModal(true);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      tags: Array.isArray(book.tags) ? book.tags.join(", ") : book.tags || "",
      status: book.status || "Want to Read",
      notes: book.notes || "",
    });
    setShowModal(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await updateBook(editingBook._id, formData);
      } else {
        await createBook(formData);
      }
      setShowModal(false);
      fetchUserDataAndBooks(searchQuery);
    } catch (err) {
      alert("Error saving book: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteBook = async (id) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      fetchUserDataAndBooks(searchQuery);
    } catch (err) {
      alert("Error deleting book: " + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBook(id, { status: newStatus });
      fetchUserDataAndBooks(searchQuery);
    } catch (err) {
      console.error("Quick Status Change Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login");
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#F7F5EE] flex items-center justify-center text-[#062C19]">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-[#062C19] border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold text-sm">Loading Book Manager Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#062C19] font-sans">
      <Navbar userName={user?.name} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl space-y-7 px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="grid gap-5 border-b border-[#E2DDD0] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#062C19]/45">Your personal reading room</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-[#062C19] sm:text-4xl">Hello, {user?.name?.split(" ")[0] || "Reader"}.</h1>
            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[#062C19]/60">A quiet place to collect the books you love, and keep the next one close.</p>
          </div>
          <div className="flex items-center gap-3 border border-[#B1BCAA] bg-[#C2CBBA] px-4 py-3 text-[#062C19] shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#062C19] text-[#D2F254]"><TrendingUp className="h-4 w-4" /></span>
            <div><p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#062C19]/55">Collection pulse</p><p className="mt-0.5 text-xs font-black">{stats?.reading || 0} book{stats?.reading === 1 ? "" : "s"} in progress</p></div>
            <ArrowRight className="ml-2 h-4 w-4 text-[#062C19]/45" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatsCards stats={stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            onOpenAddModal={handleOpenAddModal}
          />
        </motion.div>

        <div className="flex items-center justify-between pt-1">
          <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#062C19]/45">Your collection</p><h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-[#062C19]">{selectedStatus || "All books"} <span className="ml-1 text-sm text-[#062C19]/35">({books.length})</span></h2></div>
          <span className="hidden text-[10px] font-bold text-[#062C19]/45 sm:block">Manage the titles that shape your shelf</span>
        </div>

        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="border border-dashed border-[#E2DDD0] bg-white py-20 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EEEBE1] text-[#062C19] flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#062C19]">No books found in collection</h3>
            <p className="text-[#062C19]/60 text-sm mt-1">Start your reading log by clicking &quot;Add Book&quot;.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteBook}
                onStatusChange={handleStatusChange}
              />
            ))}
          </motion.div>
        )}
      </main>

      <BookModal
        show={showModal}
        editingBook={editingBook}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBook}
      />
    </div>
  );
}
