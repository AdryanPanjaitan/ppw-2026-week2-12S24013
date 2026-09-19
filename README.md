# Portfolio Adryan Julianto Panjaitan

Tugas Mandiri Praktikum Minggu 02 - Mata Kuliah Pemrograman dan Pengujian Aplikasi Web (12S3101), Institut Teknologi Del.

**Live demo:** https://adryanpanjaitan.github.io/ppw-2026-week2-12S24013/

## Isi Halaman

- **Tentang Saya**: foto profil, nama, program studi, dan deskripsi singkat.
- **Keahlian**: Figma & UI/UX Design, Java Programming, Database, HTML5 & CSS3.
- **Portofolio & Capaian**: tabel daftar project (Nusantara Connect, Layanan Imunisasi Anak, Sistem Informasi Pendataan Penghuni Asrama).
- **Proses Pengembangan Project**: lima langkah kerja dalam bentuk daftar berurutan.
- **Layanan Konsultasi**: formulir dengan validasi bawaan HTML5.

## Pemenuhan Spesifikasi Tugas

| Ketentuan | Penerapan |
| --- | --- |
| Struktur semantik HTML5 | `header`, `nav`, `main`, 5 `section`, `article`, `aside`, dan `footer`; tanpa pembungkus `div` yang tidak bermakna |
| Tabel & list | Satu tabel lengkap dengan `caption`, `thead`, `tbody`, `tfoot`, dan atribut `scope`; list `ul` (navigasi, keahlian) dan `ol` (proses) |
| Formulir accessible | 4 `fieldset` dengan `legend`; kontrol `text`, `email`, `tel`, `number`, `radio`, `checkbox`, `select`, `textarea`; semua input punya `label for` eksplisit; atribut `required`, `pattern`, `min`, `max`, dan `autocomplete` |
| CSS modern | CSS eksternal (`style.css`), *universal box-sizing reset*, palet 60-30-10, tipografi Plus Jakarta Sans, `border-radius`, `box-shadow`, Flexbox dan CSS Grid |
| Responsif | *Media query* `@media (max-width: 768px)` dan `@media (max-width: 480px)`, diuji pada lebar layar laptop, tablet, dan ponsel |
| Aksesibilitas (WCAG 2.2 AA) | *Skip link*, penanda fokus keyboard yang jelas, kontras teks minimal 4,5:1, area tabel dapat digulir dengan keyboard, dan `prefers-reduced-motion` dihormati |

## Palet Warna

| Peran | Warna | Kode |
| --- | --- | --- |
| Netral (60%) | Putih & blush muda | `#ffffff`, `#f9f4f4`, `#f6eaec` |
| Teks & burgundy tua (30%) | Teks gelap, navbar, footer | `#2d2226`, `#5c2233`, `#4a1b29` |
| Aksen (10%) | Burgundy soft | `#7a2e41`, `#64243a` |

Seluruh warna dikelola sebagai variabel CSS di bagian `:root` pada `style.css`.

## Struktur Folder

```
ppw-2026-week2-[NIM]/
├── index.html
├── style.css
├── README.md
├── images/
│   └── foto-profil.jpg
```

## Cara Menjalankan

1. Unduh atau *clone* repositori ini.
2. Buka `index.html` di browser, atau gunakan ekstensi **Live Server** di Visual Studio Code.

## Mengganti Foto Profil

Simpan foto baru di folder `images/` dengan nama `foto-profil.jpg` (menimpa file lama), atau ubah atribut `src` pada elemen `<img>` di bagian **Tentang Saya** pada `index.html`. Foto otomatis dipotong menjadi lingkaran. Jika posisi wajah kurang pas, ubah variabel `--foto-posisi` di `style.css`.

## Publikasi dengan GitHub Pages

1. Unggah kode ke repositori publik `ppw-2026-week2-[NIM]`.
2. Buka **Settings > Pages**, pilih branch `main`, lalu klik **Save**.
3. Tunggu beberapa menit sampai tautan live demo aktif.

## Teknologi

HTML5, CSS3 (Flexbox, Grid, variabel CSS), Git & GitHub Pages, Google Fonts (Plus Jakarta Sans).

## Catatan

Formulir konsultasi bersifat demo. Karena GitHub Pages hanya menyajikan file statis, data formulir tidak dikirim ke server; halaman hanya menampilkan pesan konfirmasi setelah validasi berhasil.