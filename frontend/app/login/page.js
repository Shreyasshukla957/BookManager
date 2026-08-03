"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { loginUser } from "../../utils/api";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || err.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] flex flex-col items-center justify-center p-4 relative text-[#062C19]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6"
      >
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-bold text-[#062C19] hover:opacity-80 transition bg-white border border-[#E2DDD0] px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white border border-[#E2DDD0] rounded-3xl p-8 w-full max-w-md shadow-xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-2">
          <span className="text-xl font-black tracking-tighter uppercase text-[#062C19] block">
            BOOK MANAGER
          </span>
          <h2 className="text-2xl font-black text-[#062C19] tracking-tight">Sign In to Dashboard</h2>
          <p className="text-xs font-medium text-[#062C19]/60">Enter credentials to manage your personal books</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold p-3 rounded-xl text-center"
          >
            {typeof error === "string" ? error : "Login failed. Please try again."}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#062C19] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-[#062C19] text-sm font-medium rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#062C19] transition"
              />
              <Mail className="w-4 h-4 text-[#062C19]/40 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#062C19] mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F7F5EE] border border-[#E2DDD0] text-[#062C19] text-sm font-medium rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#062C19] transition"
              />
              <Lock className="w-4 h-4 text-[#062C19]/40 absolute left-3.5 top-3" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#062C19] hover:bg-[#0a4227] text-white font-bold text-sm rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </motion.button>
        </form>

        <p className="text-center text-xs font-semibold text-[#062C19]/70">
          Don't have an account?{" "}
          <Link href="/register" className="text-[#062C19] font-black hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
