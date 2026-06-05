"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import AdminGate from "@/components/AdminGate";

export default function POS() {
  const [items, setItems] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQty, setProductQty] = useState(1);
  const [productDefect, setProductDefect] = useState("");
  const [productPurified, setProductPurified] = useState(true);

  // Cashier checkout states
  const [cashierName, setCashierName] = useState("");
  const [customerName, setCustomerName] = useState("Umum");
  const [customerVerbalAgreement, setCustomerVerbalAgreement] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);

  const addItem = (e) => {
    e.preventDefault();
    if (!productName || !productPrice) return;

    const newItem = {
      id: Date.now(), // NOSONAR
      name: productName,
      price: parseInt(productPrice, 10),
      qty: parseInt(productQty, 10),
      defect: productDefect || "Tidak Ada Cacat",
      purified: productPurified,
    };

    setItems([...items, newItem]);
    setProductName("");
    setProductPrice("");
    setProductQty(1);
    setProductDefect("");
    setProductPurified(true);
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckoutPOS = (e) => {
    e.preventDefault();
    if (items.length === 0 || !customerVerbalAgreement) return;

    // eslint-disable-next-line react-hooks/purity
    const transactionId = `RLP-POS-${Date.now().toString().slice(-6)}`; // NOSONAR
    const timestamp = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setReceiptDetails({
      id: transactionId,
      time: timestamp,
      cashier: cashierName || "Kasir Utama",
      customer: customerName,
      items: [...items],
      total: total,
    });

    setIsReceiptModalOpen(true);
  };

  const handleCompleteTransaction = () => {
    setItems([]);
    setIsReceiptModalOpen(false);
    setReceiptDetails(null);
    setCustomerVerbalAgreement(false);
    setCustomerName("Umum");
  };

  return (
    <AdminGate>
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
          <div className="mb-10">
            <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase border border-accent/20 rounded-full mb-4">
              Sistem Kasir Syariah
            </div>
            <h1 className="text-3xl md:text-4xl font-serif">
              Point of Sale (POS)
            </h1>
            <p className="text-sm opacity-70 mt-2">Input transaksi penjualan langsung (offline) dengan penegakan akad syariah.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Input Form & Customer Details */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Input Barang Form */}
              <div className="border border-foreground/10 p-6 bg-foreground/[0.01]">
                <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">Tambah Barang Thrift</h2>
                <form onSubmit={addItem} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Nama Barang</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-sm"
                      placeholder="Contoh: Vintage Denim Jacket"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Harga Jual (Rp)</label>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        required
                        className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-sm"
                        placeholder="185000"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Jumlah</label>
                      <input
                        type="number"
                        min="1"
                        value={productQty}
                        onChange={(e) => setProductQty(e.target.value)}
                        className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Deskripsi Cacat (Transparansi)</label>
                    <input
                      type="text"
                      value={productDefect}
                      onChange={(e) => setProductDefect(e.target.value)}
                      className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-xs italic"
                      placeholder="Contoh: Ada noda samar di kerah, kancing lecet"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider">Status Kesucian:</label>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productPurified}
                        onChange={(e) => setProductPurified(e.target.checked)}
                        className="accent-accent"
                      />
                      <span>Dicuci Bersih & Suci secara Syar&apos;i (Thaharah)</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-accent text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 shadow-md"
                  >
                    + Tambah ke Struk
                  </button>
                </form>
              </div>

              {/* Customer & Cashier Info Form */}
              <div className="border border-foreground/10 p-6 bg-foreground/[0.01]">
                <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">Data Kasir & Pelanggan</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Nama Kasir</label>
                    <input
                      type="text"
                      value={cashierName}
                      onChange={(e) => setCashierName(e.target.value)}
                      className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-xs"
                      placeholder="Kasir Utama"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2">Nama Pelanggan (Opsional)</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-transparent border-b border-foreground/20 px-0 py-2 focus:outline-none focus:border-accent text-xs"
                      placeholder="Umum"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Receipt / Struk (POS Cart Review) */}
            <div className="md:col-span-5 border border-foreground/10 p-6 bg-foreground/[0.01] flex flex-col justify-between min-h-[450px]">
              <div>
                <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider text-accent border-b border-foreground/10 pb-2">Struk Transaksi</h2>

                {items.length === 0 ? (
                  <div className="py-20 opacity-30 text-center">
                    <p className="font-serif italic text-lg mb-2">Belum ada barang</p>
                    <p className="text-[10px] uppercase tracking-wider">Tambahkan barang di form sebelah</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-2">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="border-b border-dashed border-foreground/20 pb-3 last:border-0"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex-1">
                            <span className="text-[10px] opacity-40 mr-2">#{index + 1}</span>
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-[10px] opacity-60 ml-2">x{item.qty}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-accent">
                              Rp {(item.price * item.qty).toLocaleString("id-ID")}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-foreground/30 hover:text-accent text-[10px] transition-colors p-1"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-[10px] opacity-75 mt-1 grid grid-cols-2 gap-1 pl-4">
                          <div>
                            <span className="opacity-50">Cacat: </span>
                            <span className="italic">{item.defect}</span>
                          </div>
                          <div className="text-right">
                            <span className="opacity-50">Status: </span>
                            <span className="text-green-700 font-medium">{item.purified ? "✓ Suci & Steril" : "Belum Dicuci"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <form onSubmit={handleCheckoutPOS} className="border-t border-foreground/15 pt-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="uppercase tracking-wider text-[10px] font-semibold">Total Belanja</span>
                    <span className="text-xl font-serif text-accent font-bold">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* Sharia Consent Checkbox */}
                  <div className="bg-accent/5 border border-accent/20 p-3 rounded-sm">
                    <label className="flex gap-2.5 items-start cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={customerVerbalAgreement}
                        onChange={(e) => setCustomerVerbalAgreement(e.target.checked)}
                        className="mt-0.5 accent-accent"
                      />
                      <span className="text-[10px] text-foreground/80 leading-normal">
                        <strong>Pernyataan Akad Penjual:</strong> Saya menyatakan bahwa pembeli telah mengetahui cacat barang dan menyepakati harga transaksi secara lisan (Akad Bai&apos; Al-Musawamah).
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!customerVerbalAgreement}
                    className="w-full py-4 bg-accent text-accent-foreground font-semibold uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-accent/15"
                  >
                    Selesaikan & Cetak Struk
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* POS Receipt Modal (Struk Penjualan) */}
        {isReceiptModalOpen && receiptDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div
              className="bg-background border border-foreground/15 max-w-sm w-full p-6 rounded-md shadow-2xl space-y-4 animate-scale-up font-mono text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Store Banner */}
              <div className="text-center border-b border-dashed border-foreground/30 pb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider font-sans">RELOOP SHOP</h2>
                <p className="text-[9px] opacity-60 font-sans mt-0.5">Toko Thrift & Vintage Pilihan Syariah</p>
                <p className="text-[9px] opacity-50 mt-1">Gaya Klasik, Cerita Baru, 100% Suci & Halal</p>
              </div>

              {/* Receipt Metadata */}
              <div className="grid grid-cols-2 gap-y-1 text-[10px] border-b border-dashed border-foreground/30 pb-3">
                <div>No: {receiptDetails.id}</div>
                <div className="text-right">Tgl: {receiptDetails.time}</div>
                <div>Kasir: {receiptDetails.cashier}</div>
                <div className="text-right">Pelanggan: {receiptDetails.customer}</div>
              </div>

              {/* Items list */}
              <div className="space-y-3 py-2 border-b border-dashed border-foreground/30">
                {receiptDetails.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between">
                      <span>{item.name} x{item.qty}</span>
                      <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="text-[9px] opacity-60 pl-2">
                      * Cacat: {item.defect} | {item.purified ? "Status: Suci" : "Status: Belum Dicuci"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {receiptDetails.total.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak (0%):</span>
                  <span>Rp 0</span>
                </div>
                <div className="flex justify-between font-bold border-t border-dotted border-foreground/30 pt-1 text-sm text-accent">
                  <span>TOTAL:</span>
                  <span>Rp {receiptDetails.total.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Sharia footer notes */}
              <div className="border-t border-dashed border-foreground/30 pt-4 space-y-2 text-center text-[9px] opacity-75 font-sans leading-normal">
                <p className="font-bold">AKAD TRANSAKSI SAH</p>
                <p className="italic">
                  &quot;Transaksi diselesaikan menggunakan Akad Bai&apos; Al-Musawamah atas kesepakatan suka-sama-suka tanpa paksaan.&quot;
                </p>
                <p className="text-[8px] mt-2 border border-foreground/15 p-2 rounded-sm">
                  <strong>Garansi Khiyar Aib:</strong> Pelanggan berhak mengembalikan barang cacat yang tidak diungkapkan di atas dalam waktu 3 hari sejak tanggal pembelian.
                </p>
                <p className="text-[8px] opacity-50 mt-2">Terima kasih atas kepercayaan Anda membeli barang yang suci & berkah.</p>
              </div>

              {/* Print & Close */}
              <div className="pt-2 flex gap-2 font-sans">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 border border-foreground hover:bg-foreground hover:text-background text-[10px] uppercase font-semibold transition-colors rounded-sm"
                >
                  Cetak Struk
                </button>
                <button
                  onClick={handleCompleteTransaction}
                  className="flex-1 py-2 bg-accent text-accent-foreground text-[10px] uppercase font-semibold transition-colors hover:bg-accent/90 rounded-sm"
                >
                  Tutup & Selesai
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGate>
  );
}
