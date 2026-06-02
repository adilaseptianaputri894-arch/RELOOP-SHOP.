"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Home, LayoutGrid, PlusCircle, Calculator, Package, ShoppingCart, LogOut, UserCircle, BarChart3, LockKeyhole } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("reloop_admin_auth") === "true");
  }, []);

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem("reloop_admin_auth");
    setIsAdmin(false);
    router.push("/");
  };
  
  const handleAdminLogout = () => {
    localStorage.removeItem("reloop_admin_auth");
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <nav className="border-b border-foreground/10 px-6 md:px-8 py-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-background/80">
      <a href="/" className="text-2xl font-bold tracking-widest uppercase font-sans">
        RELOOP{" "}
        <span className="text-accent font-serif italic">
          Shop.
        </span>
      </a>

      <div className="flex gap-6 items-center text-foreground/80">
        <a href="/" title="Beranda" className="hover:text-accent transition-colors hidden md:block">
          <Home size={20} strokeWidth={1.5} />
        </a>
        <a href="/katalog" title="Koleksi" className="hover:text-accent transition-colors">
          <LayoutGrid size={20} strokeWidth={1.5} />
        </a>
        
        {/* Admin Only Links */}
        {isAdmin && (
          <>
            <a href="/jual" title="Jual Barang" className="hover:text-accent transition-colors">
              <PlusCircle size={20} strokeWidth={1.5} />
            </a>
            <a href="/pos" title="POS Kasir" className="hover:text-accent transition-colors">
              <Calculator size={20} strokeWidth={1.5} />
            </a>
            <a href="/laporan" title="Laporan Keuangan" className="hover:text-accent transition-colors">
              <BarChart3 size={20} strokeWidth={1.5} />
            </a>
            <button
              onClick={handleAdminLogout}
              title="Kunci Akses Admin"
              className="text-accent hover:text-red-500 transition-colors"
            >
              <LockKeyhole size={20} strokeWidth={1.5} />
            </button>
          </>
        )}

        <div className="w-[1px] h-6 bg-foreground/10 mx-1"></div>

        <a href="/pesanan" title="Pesanan Saya" className="hover:text-accent transition-colors">
          <Package size={20} strokeWidth={1.5} />
        </a>

        <a href="/cart" title="Keranjang" className="hover:text-accent transition-colors relative">
          <ShoppingCart size={20} strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
              {cartCount}
            </span>
          )}
        </a>

        {user ? (
          <button
            onClick={handleLogout}
            title="Keluar"
            className="hover:text-accent transition-colors"
          >
            <LogOut size={20} strokeWidth={1.5} />
          </button>
        ) : (
          <a
            href="/login"
            title="Login"
            className="hover:text-accent transition-colors"
          >
            <UserCircle size={22} strokeWidth={1.5} />
          </a>
        )}
      </div>
    </nav>
  );
}
