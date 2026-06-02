# BUSINESS_RULES.md — Aturan Bisnis & Logika Keuangan

Dokumen ini berisi keputusan manajerial, aturan finansial, klasifikasi produk, dan parameter operasional transaksi yang diterapkan dalam RELOOP Shop.

---

## 📈 1. Perhitungan Harga & Margin Laba Syariah

Islam tidak membatasi persentase keuntungan yang boleh diambil oleh penjual secara kaku, melainkan menyerahkannya pada hukum pasar dan kesepakatan suka sama suka. Namun, dilarang mengambil untung yang sangat eksploitatif (*Ghabn Al-Fahish*) dengan memanfaatkan ketidaktahuan pembeli.

### Rumus Penentuan Harga Jual RELOOP:
```
Harga Jual = Harga Perkiraan Bal (Proporsional) + Biaya Operasional + Overhead Sanitasi + Margin Laba
```
* **Harga Perkiraan Bal (Proporsional)**: Total modal pembelian satu karung pakaian dibagi rata berdasarkan estimasi berat/kualitas pakaian.
* **Overhead Sanitasi (Penyucian)**: Biaya mencakup detergen organik bebas bahan najis, air mengalir, listrik setrika uap, dan desinfektan. Nominal rata-rata adalah **Rp 15.000,- per potong**.
* **Margin Laba Wajar**: Margin laba dipatok maksimal **30% - 50%** dari biaya modal keseluruhan untuk menjaga etika bisnis muamalah yang berkah.

---

## 🏷️ 2. Matriks Grading Cacat (Defect Classification Matrix)

Untuk standardisasi transparansi di katalog, admin wajib menggolongkan barang berdasarkan tabel kriteria cacat berikut:

| Grade Cacat | Kriteria Fisik | Dampak Terhadap Harga | Kewajiban Pengungkapan |
| :--- | :--- | :--- | :--- |
| **Tidak Ada (Mint)** | Kondisi mulus, serat kain kencang, warna pekat 100%, kancing & ritsleting lengkap dan berfungsi normal. | Harga jual premium (nilai pasar penuh). | Tidak ada cacat yang perlu diungkapkan. |
| **Sangat Ringan** | Terdapat bulu halus halus di kain, atau warna sedikit pudar karena usia (kurang dari 5%). | Diskon 5% - 10% dari nilai pasar barang baru. | Wajib menyebutkan status pemakaian wajar. |
| **Ringan** | Terdapat noda samar diameter < 1cm di tempat tersembunyi, kancing lepas (namun disertakan cadangan). | Diskon 15% - 25% dari nilai pasar. | Wajib menulis detail posisi noda/minus di deskripsi. |
| **Sedang** | Sobekan jahitan di lipatan < 3cm, noda warna pudar terlihat, zipper agak macet namun masih bisa ditutup. | Diskon 30% - 50% dari nilai pasar. | Wajib menyertakan foto close-up cacat & deskripsi teks rinci. |
| **Berat (Unsellable)** | Sobek besar pada bagian utama kain, berbau tidak sedap permanen, atau terkena najis yang tidak bisa hilang. | **Dilarang dijual** untuk menjaga kehormatan pelanggan dan menghindari penipuan. | Barang dialihkan untuk daur ulang (reconstructed denim/etc). |

---

## 🚫 3. Kebijakan Mystery Box (Gharar Mutlak)

* **Larangan Paket Misteri (Mystery Box)**:
  Sangat dilarang menjual paket pakaian bekas dalam bentuk "Random Bal" atau "Mystery Box" di mana pembeli membayar sejumlah uang tanpa mengetahui model, ukuran, atau cacat pakaian yang akan diterimanya. Transaksi ini mengandung **Gharar Mutlak** (ketidakpastian tinggi) yang memicu kerugian bagi salah satu pihak (*Jahalah*).
* **Pengecualian Bundling**:
  Penjualan paket bundling diperbolehkan jika dan hanya jika seluruh isi item di dalam paket tersebut telah dideklarasikan secara tertulis (ukuran, cacat, dan fotonya) secara transparan sebelum pembayaran.

---

## 🔄 4. Durasi & Operasional Klaim Khiyar Aib (Refund/Retur)

1. **Jendela Pengajuan**:
   Masa pengajuan klaim Khiyar Aib dibatasi maksimal **3 x 24 jam (H+3 hari)** sejak status pengiriman dinyatakan "Terkirim/Diterima" oleh sistem logistik kurir.
2. **Kriteria Penerimaan Retur**:
   * Menemukan cacat fisik tersembunyi yang **belum pernah ditulis** di katalog atau struk transaksi saat pembelian.
   * Label harga/tag RELOOP masih menempel dan pakaian belum dicuci ulang oleh pembeli (untuk menjaga keaslian kondisi saat dikirim).
   * Pakaian tidak sengaja dikotori atau terkena najis baru oleh pihak pembeli.
3. **Mekanisme Solusi**:
   * **Fasakh (Batalkan Akad)**: Pengembalian dana 100% setelah barang dikembalikan ke gudang RELOOP. Ongkos kirim retur sepenuhnya ditanggung oleh penjual karena kelalaian audit cacat pakaian.
   * **Arsy (Ganti Rugi)**: Jika pembeli menyukai pakaian tersebut dan enggan mengembalikan meski ada cacat baru, disepakati diskon susulan berupa pengembalian dana sebagian (misal 15% dari harga jual) sebagai kompensasi cacat tersembunyi tersebut, sesuai kesepakatan suka-sama-suka (*Taradhin*).

---

## ✅ 5. Validasi Transaksi & Ijab Qobul

* Sistem e-commerce online tidak akan mengizinkan proses pembayaran jika:
  1. Nama Lengkap Pembeli kosong atau mengandung karakter ilegal (digunakan untuk keabsahan naskah akad).
  2. Pembeli tidak memberikan centang konfirmasi atas daftar cacat pakaian (Step 1 Checkout).
  3. Pembeli tidak memberikan centang pernyataan Qobul (Step 2 Checkout).
* Untuk transaksi kasir POS offline:
  Kasir wajib menanyakan konfirmasi lisan pelanggan atas rincian cacat barang sebelum menekan tombol "Selesaikan Transaksi". Transaksi dinyatakan sah secara syariah dan tersimpan dalam log audit setelah checkbox verbal dicentang kasir.

---

## 👥 6. Kebijakan & Moderasi Penjualan Mitra (Seller Policy)

Untuk menjaga ekosistem e-commerce tetap bersih dan tepercaya, barang yang didaftarkan pengguna lain/mitra di halaman `/jual` tunduk pada ketentuan bisnis berikut:

### 1. Bagi Hasil (Ujrah / Komisi Platform)
* RELOOP Shop mengenakan biaya administrasi (*Ujrah Khidmah*) sebesar **5%** dari harga barang yang berhasil terjual. 
* Skema ini berlandaskan akad **Wakalah bil Ujrah** (perwakilan pemasaran dengan komisi tetap), bukan bagi hasil tidak menentu dari margin modal, sehingga terhindar dari ketidakpastian. Jika barang tidak terjual, tidak ada biaya apa pun yang dibebankan kepada penjual.

### 2. Status Alur Moderasi Barang (Listing Verification)
Setiap postingan baru dari mitra tidak langsung muncul secara publik di katalog, melainkan melalui alur status berikut:
1. **Pending**: Barang baru didaftarkan, dalam antrean verifikasi visual AI & admin manusia.
2. **Approved**: Lolos kurasi kondisi, kebersihan (thaharah), keaslian produk, dan kesesuaian harga. Produk ditampilkan di katalog publik.
3. **Rejected**: Ditolak karena melanggar aturan (misalnya: terdeteksi replica/KW, kotor/najis fisik, mengandung tulisan/gambar haram, atau harga eksploitatif).

### 3. Sanksi & Pemblokiran (Ta'zir)
Penjual yang secara sengaja melanggar komitmen Akad Siddiq (misal: menyembunyikan cacat berat, mengirimkan barang palsu, atau mengirimkan barang yang kotor/najis) akan dikenakan sanksi bertahap:
* **Pelanggaran Pertama**: Peringatan keras dan penghapusan listing produk terkait.
* **Pelanggaran Kedua**: Pembekuan dana penjualan selama 14 hari kerja untuk menyelesaikan sengketa pembeli.
* **Pelanggaran Ketiga**: Blokir permanen akun mitra penjual dari platform RELOOP Shop dan blacklist nomor rekening terkait guna melindungi konsumen dari kerugian finansial.
