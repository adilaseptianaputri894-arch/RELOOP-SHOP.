# AI_SPEC.md — Spesifikasi Integrasi Kecerdasan Buatan (AI)

Dokumen ini mendefinisikan alur kerja AI (*AI workflows*), antarmuka model, dan kontrak integrasi API (*API integration contracts*) untuk otomatisasi pemeriksaan barang (*defect audit*), penentuan grade produk, dan standardisasi deskripsi guna mencegah ketidakjelasan (*Gharar*).

---

## 🤖 Alur Sistem AI (AI Workflows)

Dalam ekosistem RELOOP Shop, AI berperan membantu Admin Toko mempercepat inventarisasi barang thrift secara jujur dan konsisten menggunakan dua modul utama:

```
[Foto Pakaian Thrift] ────► [1. Computer Vision (Defect Audit)] 
                                      │
                                      ├─► Deteksi fisik (Noda, Robekan, Pudar)
                                      └─► Penentuan Grade Cacat (Ringan/Sedang/Berat)
                                      │
                                      ▼
[Uraian & Klasifikasi] ───► [2. LLM Parser (Standardisasi Syariah)]
                                      │
                                      ├─► Penghilangan Ambivalensi Kata (Anti-Gharar)
                                      ├─► Pembuatan Teks Ijab Qobul Kustom
                                      └─► Penyaringan Konten Haram (Gambar/Tulisan)
                                      │
                                      ▼
                         [Database & Katalog Produk]
```

---

## 📝 Kontrak Integrasi API (Integration Contracts)

Berikut adalah definisi format JSON request/response untuk komunikasi antara server utama Next.js dan microservice AI.

### 1. API Deteksi & Penilaian Cacat (`/api/ai/audit-defect`)
Digunakan oleh Admin saat mengunggah foto pakaian baru di panel administrasi/POS.

* **Metode**: `POST`
* **Content-Type**: `application/json`

#### Request Payload:
```json
{
  "image_url": "https://supabase.reloop.shop/storage/v1/object/public/raw-products/vintage-jacket-01.jpg", // Opsional jika sudah disimpan di cloud
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRg...", // Opsional, dikirim oleh halaman /jual menggunakan FileReader
  "category_suggestion": "Jaket",
  "confidence_threshold": 0.65
}
```

#### Response Payload (Sukses):
```json
{
  "status": "success",
  "data": {
    "detected_defects": [
      {
        "type": "noda_kuning",
        "location": {
          "x_min": 120,
          "y_min": 340,
          "x_max": 210,
          "y_max": 400,
          "description": "Kerah bagian dalam"
        },
        "severity": "low",
        "confidence": 0.89
      },
      {
        "type": "warna_pudar",
        "location": null,
        "severity": "low",
        "confidence": 0.72,
        "details": "Pudar warna sekitar 5% di ujung lengan luar"
      }
    ],
    "defect_grade": "Ringan",
    "condition_score": 8.5,
    "suggested_description": "Terdapat noda kuning kecil diameter 0.5cm di kerah bagian dalam. Warna sedikit pudar (5%) karena pemakaian wajar."
  }
}
```

---

### 2. API Penyaringan Konten & Standardisasi Anti-Gharar (`/api/ai/sanitize-text`)
Memastikan teks deskripsi cacat yang ditulis admin tidak bermakna ganda (ambigu) dan menyaring pakaian dari simbol/tulisan yang dilarang dalam syariat (seperti gambar tokoh agama lain, konten kekerasan, pornografi, atau logo haram).

* **Metode**: `POST`
* **Content-Type**: `application/json`

#### Request Payload:
```json
{
  "product_name": "Oversized Band T-Shirt",
  "user_description": "Kaos band metal ada gambar tengkorak sedikit sobek di ketek kanan sablonan retak-retak.",
  "raw_ocr_text": "DEATH METAL APOCALYPSE 666"
}
```

#### Response Payload (Ditolak - Haram/Mengandung Unsur Sensitif):
```json
{
  "status": "rejected",
  "reason": "PROHIBITED_CONTENT",
  "details": "Pakaian mengandung teks/atribut simbol satanisme/kekerasan ('666', 'Apocalypse') yang bertentangan dengan kebijakan syariah penjualan pakaian bersih & mendidik."
}
```

#### Response Payload (Diterima & Distandardisasi):
*Jika deskripsi pakaian bersih dan lolos kriteria:*
```json
{
  "status": "approved",
  "data": {
    "standardized_description": "Terdapat jahitan sedikit lepas sekitar 2cm di ketiak bagian kanan (bisa dijahit ulang), print gambar sablon sedikit pecah-pecah (vintage crack).",
    "defect_grade": "Sedang",
    "sharia_notes": "Bebas dari gambar makhluk bernyawa penuh yang menonjol atau simbol keyakinan lain."
  }
}
```

---

## 🛠️ Panduan Implementasi untuk AI Engineer

1. **Model Deteksi Objek (Defect Detection)**:
   * Direkomendasikan menggunakan arsitektur **YOLOv8** atau **Faster R-CNN** yang telah di-fine-tune dengan dataset pakaian bekas (kategori cacat: noda, lubang, robekan, kancing hilang, ritsleting rusak).
   * Dataset pelatihan harus dianotasi dengan label koordinat kotak pembatas (*bounding box*) dan tingkat keparahan (*severity*).
2. **Model Pemrosesan Bahasa Alami (LLM)**:
   * Gunakan model open-source seperti **Llama-3-8B-Instruct** atau API **Gemini Flash** dengan sistem prompt ketat (*system prompt guidelines*) untuk merangkum input deskripsi kasir kasual menjadi bahasa formal yang jujur, ringkas, dan jelas (*clarity*).
   * Contoh prompt sistem LLM:
     ```text
     "Anda adalah Asisten Auditor Syariah untuk toko pakaian bekas. Tugas Anda adalah memformat ulang deskripsi cacat produk menjadi sangat detail, jelas, jujur, dan tidak menyembunyikan kekurangan apa pun. Hindari kata-kata yang bias seperti 'kondisi masih oke banget' jika ada lubang. Berikan klasifikasi grade cacat antara: 'Tidak Ada', 'Sangat Ringan', 'Ringan', atau 'Sedang'."
     ```
3. **Penyaringan Gambar (Image Moderation)**:
   * **Filter NSFW & Aurat**: Mendeteksi gambar tidak sopan atau pose pakaian yang melanggar nilai kesopanan Islam sebelum disetujui tampil di katalog.
   * **Penyaringan Atribut Simbol & Logo Haram**: Klasifikasi gambar untuk mendeteksi keberadaan gambar makhluk hidup yang menonjol secara utuh (yang dilarang dalam gambar pakaian tertentu menurut beberapa mazhab), simbol keagamaan non-Muslim (seperti salib), lambang satanisme, gambar/tulisan berkonotasi maksiat (alkohol, kasino/judi, sekte menyimpang), serta kalimat ofensif.
   * **Validasi Defect Visual**: Pencocokan hasil deskripsi cacat penjual dengan deteksi visual AI. Jika penjual mendeklarasikan "Cacat: Tidak Ada" namun AI mendeteksi adanya robekan besar atau noda besar, sistem akan menolak otomatis atau memasukkan postingan ke antrean review moderator manusia (*pending moderation*) untuk mencegah tadlis.
