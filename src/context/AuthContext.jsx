"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek session lokal (localStorage) terlebih dahulu
    try {
      const storedSession = localStorage.getItem("reloop_session");
      if (storedSession) {
        setUser(JSON.parse(storedSession));
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error("Gagal membaca session lokal:", e);
    }

    // 2. Cek session Supabase jika tidak ada session lokal
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("reloop_session", JSON.stringify(session.user));
        }
      } catch (e) {
        console.warn("Koneksi Supabase gagal, menggunakan mode lokal:", e);
      } finally {
        setLoading(false);
      }
    };
    getSession();

    // Listen perubahan auth Supabase
    let subscription = null;
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("reloop_session", JSON.stringify(session.user));
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("reloop_session");
        }
        setLoading(false);
      });
      subscription = data?.subscription;
    } catch (e) {
      console.warn("Supabase auth listener tidak dapat diaktifkan:", e);
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, fullName) => {
    // 1. Simpan ke database lokal di localStorage agar selalu bisa digunakan
    let localUsers = [];
    try {
      const stored = localStorage.getItem("reloop_users");
      if (stored) localUsers = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    if (localUsers.some((u) => u.email === email)) {
      return { error: { message: "Email ini sudah terdaftar di sistem lokal." } };
    }

    const newUser = {
      id: "usr_" + Date.now(), // NOSONAR
      email,
      password, // Disimpan biasa untuk keperluan demo lokal
      user_metadata: { full_name: fullName },
      email_confirmed_at: new Date().toISOString(),
    };

    localUsers.push(newUser);
    localStorage.setItem("reloop_users", JSON.stringify(localUsers));

    // 2. Coba daftar ke Supabase di background (abaikan jika gagal koneksi/SMTP)
    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
    } catch (e) {
      console.warn("Pendaftaran Supabase diabaikan untuk local sandbox:", e);
    }

    // Langsung set aktif session lokal (auto-login setelah daftar)
    setUser(newUser);
    localStorage.setItem("reloop_session", JSON.stringify(newUser));
    return { data: { user: newUser }, error: null };
  };

  const signIn = async (email, password) => {
    // 1. Cari di database lokal terlebih dahulu
    let localUsers = [];
    try {
      const stored = localStorage.getItem("reloop_users");
      if (stored) localUsers = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const matchedUser = localUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem("reloop_session", JSON.stringify(matchedUser));
      return { data: { user: matchedUser }, error: null };
    }

    // 2. Jika tidak ada di lokal, coba cari di Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        setUser(data.user);
        localStorage.setItem("reloop_session", JSON.stringify(data.user));
        return { data, error };
      }
      return {
        data: null,
        error: error || { message: "Email atau password tidak cocok di lokal maupun cloud." },
      };
    } catch (e) {
      console.error("Supabase login error:", e);
      return {
        data: null,
        error: {
          message: "Gagal menghubungkan ke server login. Silakan daftarkan akun lokal baru.",
        },
      };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("reloop_session");
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut diabaikan:", e);
    }
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
