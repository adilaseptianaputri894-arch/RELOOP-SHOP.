"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground">
      <a href="/" className="text-2xl font-bold tracking-widest uppercase mb-10 text-foreground hover:text-accent transition-colors">
        RELOOP <span className="text-accent font-serif italic">Shop.</span>
      </a>

      <div className="w-full max-w-md bg-foreground/[0.02] border border-foreground/10 p-8 shadow-xl relative overflow-hidden rounded-sm backdrop-blur-sm">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent/15 rounded-full -z-10 blur-2xl"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-foreground/5 rounded-full -z-10 blur-2xl"></div>

        <h2 className="text-3xl font-serif font-semibold mb-2">Selamat Datang.</h2>
        <p className="text-xs opacity-70 mb-8 tracking-wide">Masuk ke akun RELOOP Anda untuk melanjutkan transaksi Syariah.</p>

        {error && (
          <div className="mb-6 p-3 bg-accent/10 border border-accent/30 text-accent text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-accent text-accent-foreground font-bold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/10"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 text-center text-xs opacity-70 tracking-wide">
          Belum punya akun?{" "}
          <a href="/register" className="font-bold text-accent hover:underline">
            Daftar di sini
          </a>
        </div>
      </div>
    </div>
  );
}
