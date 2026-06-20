# SIM — Sistem Informasi Manajemen Toko Komputer Maju Jaya

## File yang Dihasilkan

| File | Keterangan |
|------|-----------|
| `sim.html` | Halaman utama sistem informasi |
| `sim-style.css` | Stylesheet (CSS) untuk tampilan SIM |
| `sim-script.js` | Logic JavaScript (CRUD, validasi, auth) |

## Cara Menggunakan

1. Letakkan ketiga file (`sim.html`, `sim-style.css`, `sim-script.js`) dalam **satu folder** bersama file website asli (`hero-image.png`, `keyboard.jpg`, dst).
2. Buka `sim.html` di browser.
3. Login menggunakan akun berikut:

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | admin    | admin123  |
| Kasir | kasir    | kasir123  |

## Fitur Sistem

### ✅ Semua Fitur yang Diminta

| No | Fitur | Keterangan |
|----|-------|-----------|
| 1 | **Login** | Validasi username & password, 2 akun (admin & kasir) |
| 2 | **Logout** | Konfirmasi sebelum keluar, kembali ke halaman login |
| 3 | **Dashboard** | Statistik total produk, transaksi, pendapatan, stok menipis |
| 4 | **Tampil Data** | Tabel produk & transaksi dengan semua kolom |
| 5 | **Tambah Data** | Modal form untuk tambah produk & transaksi |
| 6 | **Detail Data** | Halaman detail lengkap per produk / per transaksi |
| 7 | **Edit Data** | Edit produk & transaksi via modal yang sama |
| 8 | **Hapus Data** | Hapus dengan konfirmasi dialog sebelum dihapus |
| 9 | **Pencarian Data** | Realtime search pada tabel produk & transaksi |
| 10 | **Filter Data** | Filter kategori (produk) & status (transaksi) |
| 11 | **Validasi Form** | Semua field wajib divalidasi, pesan error ditampilkan |

### 🗄️ Dua Tabel Database

**Tabel 1: Produk** (`mj_produk`)
- id, nama, kategori, harga, stok, merek, deskripsi

**Tabel 2: Transaksi** (`mj_trans`)
- id, produkId, produkNama, pelanggan, qty, total, tanggal, status

> Database menggunakan `localStorage` browser sebagai simulasi database.

## Integrasi dengan Website Utama

Untuk menambahkan link ke SIM dari website utama (`index.html`), tambahkan di navbar:

```html
<a href="sim.html">SIM Admin</a>
```

Atau tambahkan tombol di hero section:

```html
<a href="sim.html" class="btn-secondary">🔧 Admin Panel</a>
```

## Teknologi

- **HTML5** — Struktur halaman
- **CSS3** — Styling responsif (Flexbox, Grid)
- **JavaScript (Vanilla)** — Logic CRUD, validasi, dan auth
- **localStorage** — Simulasi database (2 tabel)
- **Google Fonts Poppins** — Tipografi konsisten dengan website utama
