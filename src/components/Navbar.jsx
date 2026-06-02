"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Home, LayoutGrid, PlusCircle, Calculator, Package, ShoppingCart, LogOut, UserCircle } from "lucide-react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
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

      <div className="flex gap-4 md:gap-6 items-center text-sm font-medium">
        <a href="/" className="hover:text-accent transition-colors hidden md:block">
          Beranda
        </a>
        <a href="/katalog" className="hover:text-accent transition-colors">
          Koleksi
        </a>
        <a href="/jual" className="hover:text-accent transition-colors">
          Jual
        </a>

        {user ? (
          <>
            <a href="/pos" className="hover:text-accent transition-colors">
              POS
            </a>
            <a href="/pesanan" className="hover:text-accent transition-colors">
              Pesanan
            </a>
            <a href="/cart" className="hover:text-accent transition-colors relative">
              Keranjang
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300 text-xs uppercase tracking-wider"
            >
              Keluar
            </button>
          </>
        ) : (
          <a
            href="/login"
            className="px-5 py-2 border border-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}
