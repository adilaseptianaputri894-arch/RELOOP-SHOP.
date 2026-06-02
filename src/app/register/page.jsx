"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      setLoading(false);
      return;
    }

    const { error: authError } = await signUp(email, password, fullName);

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground">
      <a href="/" className="text-2xl font-bold tracking-widest uppercase mb-10 text-foreground hover:text-accent transition-colors">
        RELOOP <span className="text-accent font-serif italic">Shop.</span>
      </a>

      <div className="w-full max-w-md bg-foreground/[0.02] border border-foreground/10 p-8 shadow-xl relative overflow-hidden rounded-sm backdrop-blur-sm">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/15 rounded-full -z-10 blur-2xl"></div>

        <h2 className="text-3xl font-serif font-semibold mb-2">Bergabung.</h2>
        <p className="text-xs opacity-70 mb-8 tracking-wide">
          Buat akun baru untuk mulai thrifting Syariah di RELOOP.
        </p>

        {error && (
          <div className="mb-6 p-3 bg-accent/10 border border-accent/30 text-accent text-xs rounded-sm animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-700 text-xs rounded-sm animate-fade-in">
            <p className="font-bold mb-1">{success}</p>
            <p className="opacity-90">Anda dapat langsung masuk sekarang menggunakan menu login di bawah.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent transition-colors text-sm"
              placeholder="Nama Anda"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent transition-colors text-sm"
              placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-foreground/70 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent transition-colors text-sm"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-accent-foreground font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 mt-4 shadow-md shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs opacity-70 tracking-wide">
          Sudah punya akun?{" "}
          <a href="/login" className="font-bold text-accent hover:underline">
            Masuk di sini
          </a>
        </div>
      </div>
    </div>
  );
}
