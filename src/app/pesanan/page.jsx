"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Pesanan() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("reloop_orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-10">
          <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full mb-4">
            Riwayat Transaksi
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            Status Pesanan Anda
          </h1>
          <p className="text-sm opacity-60 mt-2">
            Lacak status pengiriman dan riwayat pembelian thrift Anda.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-foreground/20 bg-foreground/[0.01]">
            <p className="font-serif italic text-xl mb-4 opacity-50">
              Belum ada pesanan
            </p>
            <a
              href="/katalog"
              className="inline-block px-6 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold transition-colors"
            >
              Mulai Belanja
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-foreground/10 bg-foreground/[0.01] rounded-sm overflow-hidden">
                <div className="bg-foreground/[0.03] p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-foreground/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-60 block">No. Invoice</span>
                    <strong className="text-sm">{order.id}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-60 block">Tanggal</span>
                    <span className="text-xs">{order.time}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest opacity-60 block">Total Belanja</span>
                    <strong className="text-sm text-accent">Rp {order.total.toLocaleString("id-ID")}</strong>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-full">
                      {order.status || "Dikemas"}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row gap-6">
                  {/* Items */}
                  <div className="flex-1 space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest font-semibold opacity-60 border-b border-foreground/10 pb-2">Detail Item</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-foreground/5 border border-foreground/10 flex items-center justify-center text-[10px] italic font-serif">
                            {item.size}
                          </div>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="opacity-60 text-[10px]">{item.qty}x @ Rp {item.price.toLocaleString("id-ID")}</p>
                          </div>
                        </div>
                        <span className="font-semibold">Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="flex-1 md:border-l border-foreground/10 md:pl-6 space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest font-semibold opacity-60 border-b border-foreground/10 pb-2">Info Pengiriman</h4>
                    <div className="text-xs space-y-1 opacity-80 leading-relaxed">
                      <p><strong>Penerima:</strong> {order.buyer}</p>
                      <p><strong>No. HP:</strong> {order.noHp}</p>
                      <p><strong>Alamat:</strong> {order.alamat}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
