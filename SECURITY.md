# SECURITY.md — Kebijakan Keamanan Aplikasi

Dokumen ini mendefinisikan model ancaman (*threat models*), pemisahan peran (*role permissions*), kebijakan keamanan data, dan mekanisme pencegahan manipulasi transaksi dalam aplikasi RELOOP Shop.

---

## 👥 Kebijakan Peran & Hak Akses (Role-Based Access Control)

Aplikasi memiliki dua kategori pengguna dengan hak akses yang terisolasi secara ketat:

| Peran (Role) | Hak Akses Fitur | Pengamanan Sisi Server (RLS) |
| :--- | :--- | :--- |
| **Pelanggan (Customer)** | Menjelajah katalog, melihat detail cacat barang, mengelola keranjang pribadi, melakukan transaksi akad online. | Hanya boleh membaca data miliknya sendiri di tabel `orders` dan `order_items`. |
| **Kasir / Admin** | Mengakses halaman Point of Sale (POS) offline, mengubah katalog produk, mengunduh data laporan penjualan. | Memiliki akses baca-tulis penuh ke semua tabel melalui *Service Role Key* yang dikelola aman di sisi server. |

> [!WARNING]
> Rute `/pos` saat ini menggunakan pengecekan login dasar. Pada tahap produksi, rute ini harus dilindungi middleware Next.js yang memvalidasi *metadata user* (`role: 'admin'` atau `role: 'cashier'`) yang dikirim dari Supabase Auth JWT untuk mencegah akses ilegal dari pembeli biasa.

---

## 🔒 Keamanan Transaksi & Pencegahan Penipuan (Anti-Tadlis Security)

Dalam perdagangan konvensional maupun digital, manipulasi harga atau penyembunyian kondisi barang adalah tindakan ilegal (*Tadlis/Penipuan*). Keamanan codebase RELOOP didesain untuk mencegah serangan manipulasi harga (*Price Tampering*):

### 1. Validasi Harga & Defect Sisi Server
* Keranjang belanja lokal (`localStorage`) dapat dimodifikasi oleh pembeli yang memiliki pengetahuan teknis melalui konsol developer.
* **Protokol Keamanan**: Setiap kali checkout dilakukan, sistem **tidak boleh** memercayai harga total yang dikirimkan oleh payload client. Sistem backend wajib mencocokkan ID produk yang dipesan ke tabel database `products` untuk menghitung ulang total pembayaran yang valid secara mandiri.
* Menyimpan versi *snapshot* deskripsi cacat produk pada tabel `order_items` saat transaksi terjadi. Ini menjadi bukti hukum jika pelanggan menuntut retur atas alasan cacat yang belum diungkapkan (*Khiyar Aib*).

### 2. Pencegahan Balap Data (*Race Conditions / Double Spending*)
Pakaian thrift bersifat unik (hanya ada 1 stok per item).
* **Solusi Arsitektur**: Sistem wajib menerapkan transaksi database transaksional (*ACID Transaction* atau PostgreSQL Row Locking `SELECT FOR UPDATE`) pada saat pemrosesan pesanan.
* Begitu pesanan pertama berhasil mengunci barang, status barang diubah menjadi `sold`. Pesanan berikutnya untuk produk yang sama otomatis ditolak guna menghindari penjualan ganda (*double booking*) yang dapat merusak keridhaan akad (*gharar* ketersediaan barang).

---

## 🛡️ Model Keamanan Supabase (Row Level Security - RLS)

Apabila Supabase DB diaktifkan, kebijakan berikut wajib diterapkan untuk melindungi data sensitif pelanggan:

### Kebijakan Tabel `products`:
* **Read (SELECT)**: Terbuka untuk umum (`anon` & `authenticated`).
* **Write (INSERT/UPDATE/DELETE)**: Terbatas hanya untuk pengguna dengan role Admin.
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON products 
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access" ON products 
    FOR ALL USING (auth.jwt() ->> 'email' IN ('admin@reloop.com'));
```

### Kebijakan Tabel `orders`:
* **Read (SELECT)**: Terbatas pada pemilik pesanan.
* **Insert (INSERT)**: Terbuka untuk semua user yang login.
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own orders" ON orders 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Logged in users can insert orders" ON orders 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 🖼️ Keamanan Unggah Gambar (Base64 File Security)

Proses unggah file foto pakaian oleh mitra penjual melalui halaman `/jual` harus diproteksi dengan ketat guna mencegah serangan siber berbasis file upload:

### 1. Pembatasan Ukuran File (File Size Limit)
* **Ukuran Maksimal**: File dibatasi maksimal **2MB** pada sisi client.
* **Tujuan**: Mencegah serangan *Denial of Service (DoS)* berupa pengiriman gambar resolusi sangat besar (misal 50MB+) yang dapat menghabiskan kuota penyimpanan `localStorage` browser (maksimal 5MB) dan membebani server backend di masa mendatang.

### 2. Validasi MIME Type & Ekstensi Gambar
* **MIME Terdaftar**: Input tipe file hanya menerima gambar dengan filter `accept="image/*"`.
* **Protokol Keamanan**: Sistem wajib memvalidasi tipe file di sisi client sebelum pemrosesan FileReader, dan pada sisi API backend menggunakan verifikasi *magic numbers* (header file biner asli) untuk memastikan file yang dikirim benar-benar berformat JPEG, PNG, atau WEBP, **bukan** script executable (.exe, .js, .php) yang disamarkan sebagai gambar.

### 3. Mitigasi XSS melalui Metadata & Sanitasi Payload
* File gambar seringkali mengandung metadata EXIF (lokasi GPS, tipe perangkat, dll.). Penyerang dapat menyuntikkan script berbahaya (*Cross-Site Scripting*) ke dalam metadata EXIF tersebut.
* **Protokol Keamanan**:
  * Gambar yang dirender di client disajikan menggunakan tag `<img>` standar Next.js dengan atribut `src` beralamat Base64 URL atau static CDN URL (menghindari manipulasi HTML langsung `dangerouslySetInnerHTML`).
  * Saat migrasi ke server, microservice penyimpanan wajib melakukan sanitasi (misal memotong metadata EXIF) sebelum menyimpan atau menyajikan ulang gambar ke pengguna lain.

---

## 📞 Melaporkan Kerentanan

Jika Anda menemukan celah keamanan dalam aplikasi ini, harap jangan mempublikasikannya secara terbuka. Laporkan langsung ke tim kami melalui email:
* **Email**: security@reloop.shop
* **Kunci PGP**: (Opsional untuk enkripsi berkas laporan)

Kami akan merespons dalam waktu 24-48 jam dan menyediakan patch keamanan sebelum publikasi resmi dilakukan.
