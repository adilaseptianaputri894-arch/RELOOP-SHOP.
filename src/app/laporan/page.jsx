"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, Package, Clock } from "lucide-react";
import AdminGate from "@/components/AdminGate";

export default function LaporanKeuangan() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    try {
      const stored = localStorage.getItem("reloop_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  const totalPendapatan = orders.reduce((sum, order) => sum + order.total, 0);
  const totalPesananSukses = orders.length; // Assuming all recorded orders are success
  
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("reloop_orders", JSON.stringify(updatedOrders));
  };

  return (
    <AdminGate>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-accent/10 text-accent rounded-full mb-4">
              <BarChart3 size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold">
              Laporan Keuangan & Pesanan
            </h1>
            <p className="text-sm opacity-60 mt-2">Ringkasan transaksi, pendapatan toko, dan status pengiriman.</p>
          </div>

          {/* Statistik Kartu */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Card 1: Pendapatan */}
            <div className="border border-foreground/10 bg-foreground/[0.02] p-6 rounded-md flex flex-col items-center text-center">
              <TrendingUp size={32} className="text-accent mb-4" />
              <h3 className="text-xs font-semibold uppercase tracking-widest opacity-60">Total Pendapatan</h3>
              <p className="font-serif text-3xl md:text-4xl font-bold text-accent mt-2">
                Rp {totalPendapatan.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Card 2: Pesanan */}
            <div className="border border-foreground/10 bg-foreground/[0.02] p-6 rounded-md flex flex-col items-center text-center">
              <Package size={32} className="text-foreground/70 mb-4" />
              <h3 className="text-xs font-semibold uppercase tracking-widest opacity-60">Total Pesanan Sukses</h3>
              <p className="font-serif text-3xl md:text-4xl font-bold mt-2">
                {totalPesananSukses} <span className="text-xl font-sans font-medium opacity-50">Trans</span>
              </p>
            </div>
          </div>

          {/* Riwayat Transaksi */}
          <div className="border border-foreground/10 rounded-md bg-background overflow-hidden">
            <div className="bg-foreground/[0.03] p-4 border-b border-foreground/10 flex items-center gap-2">
              <Clock size={16} className="opacity-60" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Riwayat Transaksi Terakhir</h2>
            </div>
            
            {orders.length === 0 ? (
              <div className="p-12 text-center opacity-50 italic font-serif">
                Belum ada transaksi yang tercatat.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-foreground/[0.01] border-b border-foreground/10 text-[10px] uppercase tracking-wider opacity-60">
                    <tr>
                      <th className="px-6 py-4 font-semibold">ID / Waktu</th>
                      <th className="px-6 py-4 font-semibold">Pembeli</th>
                      <th className="px-6 py-4 font-semibold">Item</th>
                      <th className="px-6 py-4 font-semibold">Status Pengiriman</th>
                      <th className="px-6 py-4 font-semibold text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {orders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-foreground/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{order.id}</div>
                          <div className="text-[10px] opacity-60 mt-0.5">{order.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium">{order.buyer}</div>
                          <div className="text-[10px] opacity-60 max-w-[150px] truncate" title={order.alamat}>{order.alamat}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1 flex-wrap max-w-[200px]">
                            {order.items?.map((item, i) => (
                              <span key={i} className="px-2 py-0.5 bg-foreground/5 rounded-full text-[10px] truncate max-w-[120px]">
                                {item.name} ({item.qty})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status || "Dikemas"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-sm border focus:outline-none 
                              ${(order.status || "Dikemas") === "Dikemas" ? "bg-amber-100 text-amber-800 border-amber-200" : ""}
                              ${order.status === "Dikirim" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                              ${order.status === "Selesai" ? "bg-green-100 text-green-800 border-green-200" : ""}
                              ${order.status === "Batal" ? "bg-red-100 text-red-800 border-red-200" : ""}
                            `}
                          >
                            <option value="Dikemas">📦 Dikemas</option>
                            <option value="Dikirim">🚚 Dikirim</option>
                            <option value="Selesai">✅ Selesai</option>
                            <option value="Batal">❌ Batal</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right font-serif font-bold text-accent">
                          Rp {order.total.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGate>
  );
}
