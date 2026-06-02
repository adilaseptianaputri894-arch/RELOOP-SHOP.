"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

// Fallback products same as Katalog to ensure product loading works
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    category: "Jaket",
    price: 185000,
    condition: "Sangat Baik",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Retro Floral Dress",
    category: "Dress",
    price: 120000,
    condition: "Sangat Baik",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Classic Corduroy Pants",
    category: "Celana",
    price: 95000,
    condition: "Baik",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Oversized Band T-Shirt",
    category: "Kaos",
    price: 75000,
    condition: "Baik",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    category: "Tas",
    price: 210000,
    condition: "Vintage",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Wool Blend Cardigan",
    category: "Sweater",
    price: 145000,
    condition: "Sangat Baik",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Plaid Flannel Shirt",
    category: "Kemeja",
    price: 85000,
    condition: "Baik",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "High-Waist Mom Jeans",
    category: "Celana",
    price: 130000,
    condition: "Sangat Baik",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600&auto=format&fit=crop"
  }
];

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productIdParam = searchParams.get("productId");
  
  const { user, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [negotiationPrice, setNegotiationPrice] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState(null);

  const messagesEndRef = useRef(null);

  // Load products and current active product
  useEffect(() => {
    let allProducts = DEFAULT_PRODUCTS;
    const stored = localStorage.getItem("reloop_products");
    if (stored) {
      try {
        allProducts = JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    setProducts(allProducts);

    if (productIdParam) {
      const prod = allProducts.find((p) => p.id === parseInt(productIdParam));
      if (prod) {
        setActiveProduct(prod);
      } else {
        setActiveProduct(allProducts[0]);
      }
    } else {
      setActiveProduct(allProducts[0]);
    }
  }, [productIdParam]);

  // Load chat messages for the active product
  useEffect(() => {
    if (!activeProduct || !user) return;

    const chatKey = `reloop_chat_${user.email}_${activeProduct.id}`;
    const storedChats = localStorage.getItem(chatKey);

    if (storedChats) {
      try {
        const parsed = JSON.parse(storedChats);
        setChatMessages(parsed.messages);
        setIsAccepted(parsed.isAccepted || false);
        setAgreedPrice(parsed.agreedPrice || null);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default initial greetings matching Sharia compliance
      const initialMsgs = [
        {
          id: 1,
          sender: "seller",
          text: `Assalamu'alaikum! Selamat datang di negosiasi produk "${activeProduct.name}". Barang ini dalam kondisi ${activeProduct.condition} dan kami tawarkan seharga Rp ${activeProduct.price.toLocaleString("id-ID")}.`,
          timestamp: new Date(Date.now() - 60000).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: 2,
          sender: "seller",
          text: `Menurut prinsip Syariah (Bai' Al-Musawamah), Anda diperkenankan menawar harga barang ini secara terbuka dan jujur tanpa paksaan. Silakan masukkan penawaran terbaik Anda di bawah.`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        }
      ];
      setChatMessages(initialMsgs);
      setIsAccepted(false);
      setAgreedPrice(null);
      saveChats(initialMsgs, false, null);
    }
  }, [activeProduct, user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typing]);

  const saveChats = (messages, accepted, price) => {
    if (!activeProduct || !user) return;
    const chatKey = `reloop_chat_${user.email}_${activeProduct.id}`;
    localStorage.setItem(chatKey, JSON.stringify({
      messages,
      isAccepted: accepted,
      agreedPrice: price
    }));
  };

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!negotiationPrice || !activeProduct || !user) return;

    const offerVal = parseInt(negotiationPrice);
    if (isNaN(offerVal) || offerVal <= 0) {
      setToastMessage("Masukkan penawaran harga yang valid.");
      setTimeout(() => setToastMessage(""), 3000);
      return;
    }

    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    // User message
    const userMsg = {
      id: chatMessages.length + 1,
      sender: "buyer",
      text: `Saya ingin mengajukan penawaran harga sebesar Rp ${offerVal.toLocaleString("id-ID")}. Apakah bisa disepakati?`,
      timestamp,
      offer: offerVal
    };

    const updatedMsgs = [...chatMessages, userMsg];
    setChatMessages(updatedMsgs);
    setNegotiationPrice("");
    saveChats(updatedMsgs, isAccepted, agreedPrice);

    // Bot Seller response logic
    setTyping(true);
    setTimeout(() => {
      const minAcceptable = activeProduct.price * 0.85; // 15% discount limit
      let botResponse = "";
      let newIsAccepted = false;
      let newAgreedPrice = null;

      if (offerVal >= activeProduct.price) {
        botResponse = `Maa syaa Allah, terima kasih atas kemurahan hati Anda yang menawar dengan harga Rp ${offerVal.toLocaleString("id-ID")}. Namun berdasarkan prinsip kejujuran muamalah, kami hanya menjual barang ini dengan harga pas Rp ${activeProduct.price.toLocaleString("id-ID")}. Silakan beli dengan harga tersebut ya!`;
        newIsAccepted = true;
        newAgreedPrice = activeProduct.price;
      } else if (offerVal >= minAcceptable) {
        botResponse = `Alhamdulillah, kami sepakat dengan harga penawaran Rp ${offerVal.toLocaleString("id-ID")}! Transaksi ini sah berdasarkan kesepakatan suka-sama-suka (Bai' Al-Musawamah). Silakan klik tombol 'Beli dengan Harga Nego' di bawah untuk melanjutkan transaksi ke keranjang belanja.`;
        newIsAccepted = true;
        newAgreedPrice = offerVal;
      } else {
        // Counter offer (halfway between offer and target)
        const counter = Math.round((activeProduct.price + offerVal) / 2 / 1000) * 1000;
        botResponse = `Maaf Kak, harga Rp ${offerVal.toLocaleString("id-ID")} masih terlalu rendah untuk barang berkualitas ${activeProduct.condition} ini. Bagaimana jika kita ambil titik tengah di harga Rp ${counter.toLocaleString("id-ID")}?`;
      }

      const botMsg = {
        id: updatedMsgs.length + 1,
        sender: "seller",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        isOfferResponse: newIsAccepted,
        priceOffered: newAgreedPrice
      };

      const finalMsgs = [...updatedMsgs, botMsg];
      setChatMessages(finalMsgs);
      setIsAccepted(newIsAccepted);
      setAgreedPrice(newAgreedPrice);
      setTyping(false);
      saveChats(finalMsgs, newIsAccepted, newAgreedPrice);
    }, 1500);
  };

  const handleResetChat = () => {
    if (!activeProduct || !user) return;
    const initialMsgs = [
      {
        id: 1,
        sender: "seller",
        text: `Assalamu'alaikum! Selamat datang kembali di negosiasi produk "${activeProduct.name}". Barang ini dalam kondisi ${activeProduct.condition} dan kami tawarkan seharga Rp ${activeProduct.price.toLocaleString("id-ID")}.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      },
      {
        id: 2,
        sender: "seller",
        text: `Menurut prinsip Syariah (Bai' Al-Musawamah), Anda diperkenankan menawar harga barang ini secara terbuka dan jujur tanpa paksaan. Silakan masukkan penawaran terbaik Anda di bawah.`,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      }
    ];
    setChatMessages(initialMsgs);
    setIsAccepted(false);
    setAgreedPrice(null);
    saveChats(initialMsgs, false, null);
  };

  const handleBuyNegotiated = () => {
    if (!activeProduct || !agreedPrice) return;
    
    // Add to cart with negotiated price
    addToCart(activeProduct, agreedPrice);
    setToastMessage("✓ Kesepakatan Berhasil! Item masuk keranjang belanja.");
    setTimeout(() => {
      setToastMessage("");
      router.push("/cart");
    }, 1500);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold opacity-70">Memuat Sesi Pengguna...</p>
        </div>
      </div>
    );
  }

  // Redirect to Login if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-foreground/[0.02] border border-foreground/10 p-8 rounded-sm text-center space-y-6 shadow-xl">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <h2 className="text-2xl font-serif font-semibold">Login Diperlukan</h2>
            <p className="text-xs opacity-70 leading-relaxed">
              Berdasarkan syariat muamalah, negosiasi harga membutuhkan kejelasan identitas pihak yang bertransaksi demi menghindari kesimpangsiuran (Gharar). Silakan login atau buat akun terlebih dahulu.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="/login"
                className="flex-1 py-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors rounded-sm"
              >
                Login
              </a>
              <a
                href="/register"
                className="flex-1 py-3 border border-foreground/20 text-foreground text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-colors rounded-sm"
              >
                Daftar Akun
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Side: Product Details & Negotiation List */}
        <section className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
          <div className="bg-foreground/[0.01] border border-foreground/10 p-5 rounded-sm flex flex-col space-y-4">
            <h3 className="font-serif font-semibold text-lg border-b border-foreground/10 pb-3">Produk yang Dinegosiasikan</h3>
            
            {activeProduct ? (
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-foreground/[0.04] relative overflow-hidden rounded-sm border border-foreground/10">
                  <img src={activeProduct.image} alt={activeProduct.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm leading-snug">{activeProduct.name}</h4>
                  <p className="text-[10px] uppercase opacity-55 mt-1">{activeProduct.category} · Kondisi {activeProduct.condition}</p>
                </div>
                <div className="flex justify-between items-center bg-background p-3 border border-foreground/5 rounded-sm">
                  <span className="text-xs opacity-65">Harga Penjual:</span>
                  <span className="font-serif text-accent font-bold text-sm">Rp {activeProduct.price.toLocaleString("id-ID")}</span>
                </div>
                {isAccepted && agreedPrice && (
                  <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-sm text-center">
                    <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">Nego Disetujui</span>
                    <p className="font-serif text-green-800 font-bold text-base mt-0.5">Rp {agreedPrice.toLocaleString("id-ID")}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs opacity-60">Tidak ada produk yang dipilih.</p>
            )}
          </div>

          <div className="bg-foreground/[0.01] border border-foreground/10 p-5 rounded-sm flex flex-col space-y-3 mt-auto">
            <h4 className="font-semibold text-xs uppercase tracking-wider opacity-60">Panduan Musawamah</h4>
            <ul className="text-[10px] opacity-75 space-y-2 leading-relaxed list-disc pl-4">
              <li>Lakukan penawaran harga dengan sopan dan jujur (*siddiq*).</li>
              <li>Batas negosiasi normal maksimal diskon 15% dari harga jual.</li>
              <li>Ketika kesepakatan tercapai, ijab-qabul dilakukan secara suka-sama-suka (*antaradhin*).</li>
            </ul>
          </div>
        </section>

        {/* Right Side: Chat Panel */}
        <section className="flex-1 bg-foreground/[0.01] border border-foreground/10 rounded-sm flex flex-col overflow-hidden relative h-[500px] lg:h-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-foreground/10 bg-background/50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider">Pemilik Toko (Reloop Admin)</h3>
                <p className="text-[9px] opacity-50 uppercase tracking-widest mt-0.5">Aktif Merespon</p>
              </div>
            </div>
            <button
              onClick={handleResetChat}
              className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline"
            >
              Reset Obrolan
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-background/25">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${
                  msg.sender === "buyer" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <div
                  className={`p-3.5 text-xs rounded-sm leading-relaxed border ${
                    msg.sender === "buyer"
                      ? "bg-accent text-accent-foreground border-accent/20 rounded-tr-none shadow-sm"
                      : "bg-foreground/5 text-foreground border-foreground/10 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* Dynamic checkout card rendered inside the chat bubble */}
                  {msg.isOfferResponse && msg.priceOffered && (
                    <div className="mt-3.5 pt-3.5 border-t border-dashed border-green-800/20 flex flex-col items-center">
                      <p className="text-[9px] uppercase tracking-widest text-green-700 font-bold mb-2">Konfirmasi Akad Nego</p>
                      <button
                        onClick={handleBuyNegotiated}
                        className="w-full px-4 py-2.5 bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-green-800 transition-colors shadow-md rounded-sm"
                      >
                        Beli dengan Harga Nego: Rp {msg.priceOffered.toLocaleString("id-ID")}
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[8px] opacity-40 mt-1 uppercase tracking-widest px-1">{msg.timestamp}</span>
              </div>
            ))}

            {typing && (
              <div className="mr-auto items-start max-w-[80%] flex flex-col">
                <div className="p-3 bg-foreground/5 text-foreground border border-foreground/10 rounded-sm rounded-tl-none flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce delay-200"></span>
                </div>
                <span className="text-[8px] opacity-40 mt-1 uppercase tracking-widest px-1">Mengetik...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Offer Input Bar */}
          <div className="p-4 border-t border-foreground/10 bg-background/50">
            {isAccepted && agreedPrice ? (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-3 animate-fade-in">
                <div className="text-center md:text-left">
                  <p className="text-[10px] uppercase font-bold text-green-700 tracking-wider">Kesepakatan Akad Musawamah Tercapai!</p>
                  <p className="text-xs opacity-75 mt-0.5">Barang siap dibeli dengan harga diskon kesepakatan Rp {agreedPrice.toLocaleString("id-ID")}.</p>
                </div>
                <button
                  onClick={handleBuyNegotiated}
                  className="w-full md:w-auto px-6 py-3 bg-accent text-accent-foreground font-bold text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-md rounded-sm"
                >
                  Bayar & Masuk Keranjang
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold opacity-50">Rp</span>
                  <input
                    type="number"
                    value={negotiationPrice}
                    onChange={(e) => setNegotiationPrice(e.target.value)}
                    required
                    className="w-full bg-background border border-foreground/15 focus:border-accent focus:outline-none pl-10 pr-4 py-3.5 text-xs rounded-sm tracking-wider"
                    placeholder="Masukkan Penawaran Anda (misal: 165000)"
                  />
                </div>
                <button
                  type="submit"
                  disabled={typing}
                  className="px-6 py-3.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase tracking-widest transition-colors rounded-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Tawar
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-6 py-4 rounded-sm border border-accent/25 shadow-xl flex items-center gap-3 animate-fade-in">
          <span className="text-accent font-bold">✓</span>
          <span className="text-xs uppercase tracking-wider font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-semibold opacity-70">Memuat Halaman Negosiasi...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
