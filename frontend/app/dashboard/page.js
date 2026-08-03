"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import StatsCards from "@/components/StatsCards";
import FilterBar from "@/components/FilterBar";
import BookCard from "@/components/BookCard";
import BookModal from "@/components/BookModal";
import BookDetailModal from "@/components/BookDetailModal";
import { getMe, getBooks, logoutUser, createBook, updateBook, deleteBook } from "@/utils/api";
import { BookOpen } from "lucide-react";

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
  const [detailBook, setDetailBook] = useState(null);
  const [detailBookIndex, setDetailBookIndex] = useState(0);

  const [formData, setFormData] = useState({
    title: "", author: "", tags: "", status: "Want to Read", notes: ""
  });

  useEffect(() => {
    fetchUserDataAndBooks();
  }, [selectedStatus]);

  const fetchUserDataAndBooks = async (query = searchQuery) => {
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
  };

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
      if (detailBook && detailBook._id === id) setDetailBook(null);
      fetchUserDataAndBooks(searchQuery);
    } catch (err) {
      alert("Error deleting book: " + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBook(id, { status: newStatus });
      if (detailBook && detailBook._id === id) {
        setDetailBook(prev => prev ? { ...prev, status: newStatus } : null);
      }
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
    <div className="min-h-screen bg-[#F7F5EE] text-[#062C19] font-sans selection:bg-[#062C19] selection:text-white">
      <Navbar userName={user?.name} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
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

        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-20 bg-white border border-dashed border-[#E2DDD0] rounded-3xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#EEEBE1] text-[#062C19] flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#062C19]">No books found in collection</h3>
            <p className="text-[#062C19]/60 text-sm mt-1">Start your reading log by clicking "Add Book".</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {books.map((book, idx) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteBook}
                onStatusChange={handleStatusChange}
                onCardClick={(clickedBook) => {
                  setDetailBook(clickedBook);
                  setDetailBookIndex(idx);
                }}
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

      <BookDetailModal
        book={detailBook}
        index={detailBookIndex}
        onClose={() => setDetailBook(null)}
        onEdit={handleOpenEditModal}
        onDelete={handleDeleteBook}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
