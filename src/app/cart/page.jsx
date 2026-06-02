"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartItems, updateQty, removeItem, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  
  // Checkout Form States
  const [buyerName, setBuyerName] = useState("");
  const [defectsConfirmed, setDefectsConfirmed] = useState(false);
  const [akadAccepted, setAkadAccepted] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Shipping Address States
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [provinsi, setProvinsi] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [noHp, setNoHp] = useState("");

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleStartCheckout = () => {
    setIsCheckoutOpen(true);
    setCheckoutStep(1);
    setDefectsConfirmed(false);
    setAkadAccepted(false);
  };

  const handleNextStep = () => {
    if (checkoutStep === 1 && defectsConfirmed) {
      setCheckoutStep(2);
    }
  };

  const isAddressComplete = alamat && kota && provinsi && kodePos && noHp;

  const handleCompleteAkad = (e) => {
    e.preventDefault();
    if (!buyerName || !akadAccepted || !isAddressComplete) return;

    // Generate Invoice Details
    const transactionId = `RLP-TX-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    setInvoiceDetails({
      id: transactionId,
      time: timestamp,
      buyer: buyerName,
      alamat: `${alamat}, ${kota}, ${provinsi} ${kodePos}`,
      noHp: noHp,
      items: [...cartItems],
      total: subtotal,
    });

    setCheckoutStep(3);
  };

  const handleFinish = () => {
    // Save order to localStorage
    if (invoiceDetails) {
      const existingOrdersStr = localStorage.getItem("reloop_orders");
      const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      const newOrder = {
        ...invoiceDetails,
        status: "Dikemas", // Status awal
      };
      localStorage.setItem("reloop_orders", JSON.stringify([newOrder, ...existingOrders]));
    }

    clearCart();
    setIsCheckoutOpen(false);
    setCheckoutStep(1);
    setBuyerName("");
    setAlamat("");
    setKota("");
    setProvinsi("");
    setKodePos("");
    setNoHp("");
    setInvoiceDetails(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold">
            Keranjang Belanja
          </h1>
          <p className="text-sm opacity-60 mt-2">{cartItems.length} item di keranjang Anda.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <p className="font-serif italic text-2xl mb-4">
              Keranjang Anda masih kosong
            </p>
            <a
              href="/katalog"
              className="inline-block px-6 py-3 border border-foreground/20 hover:border-accent hover:text-accent transition-colors text-sm uppercase tracking-wider"
            >
              Lihat Koleksi
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.price}`}
                  className="flex gap-4 border border-foreground/10 p-4 bg-foreground/[0.01] group hover:border-accent/30 transition-colors"
                >
                  {/* Info Icon / Visual */}
                  <div className="w-20 h-24 bg-foreground/[0.04] flex-shrink-0 flex flex-col items-center justify-center border border-foreground/5 p-2 text-center rounded-sm">
                    <span className="font-serif italic text-sm">{item.era || "Modern"}</span>
                    <span className="text-[8px] uppercase tracking-widest mt-1 opacity-50">{item.category}</span>
                    <span className="text-[9px] mt-1 bg-accent/15 text-accent px-1 rounded-sm">Size: {item.size}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          {item.isNegotiated && (
                            <span className="px-1.5 py-0.5 bg-accent text-accent-foreground text-[8px] uppercase tracking-widest font-bold rounded-sm">
                              Harga Nego
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id, item.price)}
                          className="text-foreground/30 hover:text-accent self-start text-sm transition-colors p-1"
                        >
                          ✕
                        </button>
                      </div>
                      
                      {/* Defect preview */}
                      <p className="text-[10px] opacity-70 italic mt-1 line-clamp-1">
                        Cacat: <span className="text-amber-800 font-medium">{item.defectGrade || "Tidak Ada"}</span> - {item.defectDesc || "Kondisi mulus."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.id, -1, item.price)}
                          className="w-7 h-7 border border-foreground/20 flex items-center justify-center hover:border-accent transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1, item.price)}
                          className="w-7 h-7 border border-foreground/20 flex items-center justify-center hover:border-accent transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-serif text-accent font-semibold">
                        Rp {(item.price * item.qty).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="border border-foreground/10 p-6 bg-foreground/[0.01] h-fit sticky top-24">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-6">Ringkasan Pesanan</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="opacity-60">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Ongkos Kirim</span>
                  <span className="text-accent text-xs">Gratis (Subsidi Akad)</span>
                </div>
                <div className="border-t border-foreground/10 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-serif text-accent text-lg">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleStartCheckout}
                className="w-full py-4 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold uppercase tracking-widest text-xs transition-all duration-300 shadow-md shadow-accent/10"
              >
                Lanjutkan ke Akad
              </button>

              <a
                href="/katalog"
                className="block text-center text-xs mt-4 opacity-50 hover:opacity-100 hover:text-accent transition-all underline"
              >
                Lanjutkan Belanja
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Checkout / Akad Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div
            className="bg-background border border-foreground/15 max-w-xl w-full rounded-md shadow-2xl overflow-hidden relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-accent p-6 text-accent-foreground flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold opacity-75">Checkout Syariah</span>
                <h2 className="text-xl font-bold font-serif">
                  {checkoutStep === 1 && "1. Tinjau & Konfirmasi Cacat"}
                  {checkoutStep === 2 && "2. Akad Bai' Al-Musawamah"}
                  {checkoutStep === 3 && "Sertifikat Akad Transaksi"}
                </h2>
              </div>
              {checkoutStep !== 3 && (
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-accent-foreground/70 hover:text-accent-foreground text-lg p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              
              {/* STEP 1: DEFECT TRANSPARENCY CONFIRMATION */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <p className="text-xs opacity-75 leading-relaxed">
                    Sesuai dengan asas <strong>keterbukaan dalam perdagangan Islam (Khiyar Aib)</strong>, Anda diwajibkan memeriksa kembali rincian cacat pakaian di bawah ini sebelum membeli agar tidak terjadi keraguan (Gharar).
                  </p>

                  <div className="space-y-3 max-h-[250px] overflow-y-auto border border-foreground/10 p-4 rounded-sm bg-foreground/[0.01]">
                    {cartItems.map((item) => (
                      <div key={item.id} className="text-xs border-b border-foreground/5 pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between font-semibold">
                          <span>{item.name} (Size {item.size})</span>
                          <span className="text-amber-800 text-[10px]">Cacat: {item.defectGrade || "Tidak Ada"}</span>
                        </div>
                        <p className="text-foreground/60 italic mt-1 font-serif">"{item.defectDesc || "Kondisi sangat mulus, tidak ditemukan cacat fisik."}"</p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-accent/20 bg-accent/5 p-4 rounded-sm">
                    <label className="flex gap-3 cursor-pointer items-start">
                      <input
                        type="checkbox"
                        checked={defectsConfirmed}
                        onChange={(e) => setDefectsConfirmed(e.target.checked)}
                        className="mt-1 accent-accent"
                      />
                      <span className="text-xs text-foreground/80 leading-normal">
                        Saya dengan sadar telah membaca dan menyetujui kondisi cacat barang di atas. Saya memahami bahwa cacat yang diungkapkan ini <strong>gugur dari tuntutan ganti rugi (Khiyar Aib)</strong> di kemudian hari.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="flex-1 py-3 border border-foreground/20 hover:border-foreground text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      Kembali ke Keranjang
                    </button>
                    <button
                      disabled={!defectsConfirmed}
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                      Lanjut ke Akad →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: IJAB QOBUL AKAD CONTRACT */}
              {checkoutStep === 2 && (
                <form onSubmit={handleCompleteAkad} className="space-y-5">
                  <p className="text-xs opacity-75 leading-relaxed">
                    Kami menggunakan Akad <strong>Bai' Al-Musawamah</strong> (jual beli kesepakatan harga tanpa syarat pengungkapan modal). Mohon lengkapi data Anda untuk melakukan ijab qobul secara sah.
                  </p>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Nama Lengkap Pembeli</label>
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda..."
                      className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-sm"
                    />
                  </div>

                  {/* ── ALAMAT PENGIRIMAN ── */}
                  <div className="border border-foreground/10 bg-foreground/[0.02] p-4 rounded-sm space-y-4">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-60 flex items-center gap-2">
                      <span>📦</span> Alamat Pengiriman
                    </h4>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Alamat Lengkap (Jalan, RT/RW, No. Rumah)</label>
                      <textarea
                        required
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Contoh: Jl. Merdeka No. 17, RT 03/RW 05, Kel. Sukajadi"
                        rows={2}
                        className="w-full bg-transparent border border-foreground/15 rounded-sm py-2 px-3 focus:outline-none focus:border-accent text-sm resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Kota / Kabupaten</label>
                        <input
                          type="text"
                          required
                          value={kota}
                          onChange={(e) => setKota(e.target.value)}
                          placeholder="Contoh: Bandung"
                          className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Provinsi</label>
                        <input
                          type="text"
                          required
                          value={provinsi}
                          onChange={(e) => setProvinsi(e.target.value)}
                          placeholder="Contoh: Jawa Barat"
                          className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">Kode Pos</label>
                        <input
                          type="text"
                          required
                          value={kodePos}
                          onChange={(e) => setKodePos(e.target.value.replace(/\D/g, "").slice(0, 5))}
                          placeholder="Contoh: 40123"
                          maxLength={5}
                          className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider opacity-75">No. HP / WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={noHp}
                          onChange={(e) => setNoHp(e.target.value.replace(/\D/g, "").slice(0, 15))}
                          placeholder="Contoh: 081234567890"
                          className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-foreground/10 bg-foreground/[0.02] p-4 rounded-sm space-y-3 font-serif">
                    <h4 className="text-[10px] font-sans font-semibold uppercase tracking-wider opacity-60 text-center border-b border-foreground/10 pb-2">
                      Naskah Akad Ijab Qobul
                    </h4>
                    <p className="text-xs text-foreground/80 italic leading-relaxed text-center">
                      "Dengan ini saya, {buyerName || "[Nama Pembeli]"}, menyatakan setuju membeli barang-barang thrift yang tercantum seharga Rp {subtotal.toLocaleString("id-ID")} secara tunai. Saya menerima kondisi cacat fisik yang telah diungkapkan oleh penjual, dan saya memegang Hak Khiyar Aib (hak membatalkan transaksi) apabila ditemukan cacat lain yang tersembunyi yang belum dideklarasikan sebelumnya."
                    </p>
                  </div>

                  <div className="border border-accent/20 bg-accent/5 p-4 rounded-sm">
                    <label className="flex gap-3 cursor-pointer items-start">
                      <input
                        type="checkbox"
                        checked={akadAccepted}
                        onChange={(e) => setAkadAccepted(e.target.checked)}
                        className="mt-1 accent-accent"
                      />
                      <span className="text-xs text-foreground/85 leading-normal">
                        Saya menyatakan <strong>QOBUL (Saya Terima Akad Ini)</strong> atas kesadaran penuh demi kehalalan transaksi jual beli.
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-3 border border-foreground/20 hover:border-foreground text-xs uppercase tracking-wider font-semibold transition-colors"
                    >
                      ← Edit Konfirmasi
                    </button>
                    <button
                      type="submit"
                      disabled={!buyerName || !akadAccepted || !isAddressComplete}
                      className="flex-1 py-3 bg-accent text-accent-foreground text-xs uppercase tracking-wider font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
                    >
                      Selesaikan Akad & Bayar
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: DIGITAL AKAD CERTIFICATE / INVOICE */}
              {checkoutStep === 3 && invoiceDetails && (
                <div className="space-y-6">
                  {/* Certificate box */}
                  <div className="border-4 border-accent p-6 rounded-sm bg-background flex flex-col items-center justify-between text-center relative overflow-hidden shadow-lg">
                    {/* Decorative Stamp watermark */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-4 border-accent/15 flex items-center justify-center text-accent/10 font-bold italic rotate-12 pointer-events-none select-none text-2xl uppercase">
                      SAH
                    </div>

                    <div className="w-full border-b border-accent/20 pb-4 mb-4">
                      <h3 className="font-serif text-2xl text-accent font-bold tracking-wider">
                        SERTIFIKAT AKAD SYARIAH
                      </h3>
                      <p className="text-[9px] uppercase tracking-[0.2em] opacity-60 mt-1">
                        Reloop Thrift Syariah Store
                      </p>
                    </div>

                    <p className="text-xs italic leading-relaxed text-foreground/80 max-w-sm mb-6">
                      Telah dilangsungkan ijab qobul secara sah atas nama <strong>{invoiceDetails.buyer}</strong> untuk pembelian barang thrift pada tanggal {invoiceDetails.time} dengan total transaksi <strong>Rp {invoiceDetails.total.toLocaleString("id-ID")}</strong>.
                    </p>

                    <div className="w-full grid grid-cols-2 text-left text-[10px] gap-y-2 border-y border-foreground/10 py-4 mb-4">
                      <div>
                        <span className="opacity-50 block uppercase">No. Transaksi</span>
                        <strong className="text-xs">{invoiceDetails.id}</strong>
                      </div>
                      <div>
                        <span className="opacity-50 block uppercase">Jenis Akad</span>
                        <strong className="text-xs">Bai' Al-Musawamah</strong>
                      </div>
                      <div>
                        <span className="opacity-50 block uppercase">Status Transaksi</span>
                        <strong className="text-xs text-green-700">Lunas / Sah</strong>
                      </div>
                      <div>
                        <span className="opacity-50 block uppercase">Garansi Khiyar Aib</span>
                        <strong className="text-xs text-accent">Aktif (3 Hari)</strong>
                      </div>
                    </div>

                    {/* Alamat Pengiriman di Sertifikat */}
                    <div className="w-full border border-dashed border-foreground/15 bg-foreground/[0.02] p-4 rounded-sm mb-6 text-left">
                      <h5 className="text-[9px] font-semibold uppercase tracking-wider opacity-50 mb-2 flex items-center gap-1.5">
                        <span>📦</span> Alamat Pengiriman
                      </h5>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        {invoiceDetails.alamat}
                      </p>
                      <p className="text-xs text-foreground/60 mt-1">
                        📞 {invoiceDetails.noHp}
                      </p>
                    </div>

                    <div className="w-full text-[9px] opacity-60 leading-normal text-left max-w-md">
                      <strong>Ketentuan Hak Khiyar:</strong> Pembeli berhak mengembalikan barang (retur/refund) dalam jangka waktu 3 hari terhitung sejak barang diterima apabila ditemukan cacat tersembunyi yang <strong>tidak disebutkan</strong> di rincian produk saat transaksi.
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full py-4 bg-foreground text-background font-semibold uppercase tracking-widest text-xs hover:bg-accent hover:text-accent-foreground transition-colors rounded-sm shadow-md"
                  >
                    Selesai & Belanja Lagi
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
