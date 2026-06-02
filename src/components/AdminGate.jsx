"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function AdminGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const authStatus = localStorage.getItem("reloop_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Password umum: reloop123
    if (password === "reloop123") {
      setIsAuthenticated(true);
      localStorage.setItem("reloop_admin_auth", "true");
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (!mounted) return null;

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <div className="max-w-md mx-auto mt-24 px-6">
        <div className="border border-foreground/10 bg-foreground/[0.01] p-8 space-y-6 shadow-xl rounded-sm animate-scale-up">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-serif font-bold">Akses Terbatas</h2>
            <p className="text-xs opacity-70">Halaman ini khusus untuk pemilik toko RELOOP.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Password Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full bg-background border border-foreground/20 px-4 py-3 focus:outline-none focus:border-accent text-sm rounded-sm"
                autoFocus
              />
              {error && <p className="text-red-500 text-[10px] uppercase tracking-wider mt-2">Password salah, silakan coba lagi.</p>}
            </div>
            
            <button
              type="submit"
              className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 shadow-md shadow-accent/15 rounded-sm"
            >
              Buka Kunci
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
