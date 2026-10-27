# ElectroAR Lab 3D Pro V2 — prototipe pengembangan

## Menjalankan

Unggah **seluruh isi folder** ke root repository GitHub Pages. Buka `index.html` melalui URL HTTPS GitHub Pages. Alternatif lokal: jalankan `python -m http.server 8000` di folder ini dan buka `http://localhost:8000` (mode kamera biasanya membutuhkan localhost atau HTTPS). Jangan buka sebagai `file://` karena JavaScript modules membutuhkan HTTP.

Koneksi internet diperlukan untuk Three.js dan MindAR melalui jsDelivr. Proyek ini bukan aplikasi offline.

## Fitur yang telah diimplementasikan

- Builder 3D: komponen, terminal, drag, kabel lengkung, pemilihan warna, saklar, contoh rangkaian, Start/Stop, Reset, Undo/Redo, reset kamera.
- Ekspor/impor proyek JSON (file lokal) dan resistor 4 gelang warna pendekatan.
- Solver DC edukasi terpisah di `js/engine.js` untuk **satu loop seri** (1 baterai, 1 resistor, 1 LED, 1 saklar). Menghitung arus, daya resistor, mendeteksi beberapa kondisi terbuka, LED terbalik, korsleting langsung baterai, dan arus LED berlebih.
- Multimeter terbatas: pilih probe merah/hitam pada terminal. Tegangan dapat dibaca **melintasi komponen yang sama** pada rangkaian seri valid; resistansi resistor saat simulasi dihentikan. Mode mA adalah indikator arus loop, **bukan pengukuran probe secara seri**.
- Enam tugas game dengan pemeriksaan kriteria sederhana, skor disimpan di localStorage.
- AR MindAR di `ar.html` dengan rangkaian 3D tetap dan saklar yang dapat diklik, **setelah** file target dikompilasi.

## Mengaktifkan AR image tracking

1. Buka `assets/marker.svg` pada browser, cetak atau tampilkan pada layar lain. Target kaya fitur visual dan kontras.
2. Gunakan [MindAR Image Target Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/) untuk mengunggah **gambar PNG/JPEG** dari marker (ekspor SVG ke PNG dahulu, misalnya lewat browser atau editor grafis).
3. Download hasil kompilasi `.mind`, ubah nama menjadi `target.mind` dan letakkan di `assets/target.mind`.
4. Unggah semua file ke GitHub Pages HTTPS, buka `ar.html` di HP, izinkan kamera, arahkan kamera ke marker.
5. Jika target belum dikompilasi atau kamera tidak tersedia, gunakan `index.html` sebagai fallback.

**Catatan:** `assets/target.mind` tidak disertakan, sehingga AR image tracking belum siap pakai langsung. Kompilasi target merupakan langkah wajib. Model AR saat ini adalah rangkaian demonstrasi tetap, belum hasil impor builder.

## Batasan yang belum selesai

- Breadboard masih visual; belum memiliki konektivitas internal.
- Belum mendukung rangkaian bercabang, beberapa sumber, atau simulasi SPICE.
- Multimeter belum menyisipkan amperemeter secara seri; tegangan antar-node umum belum tersedia.
- Belum ada component explorer terpisah dengan exploded view interaktif dan label detail.
- Belum ada osiloskop, mode pengukuran umum, penyimpanan proyek di server, atau gamifikasi dengan generator kesalahan per level.
- Redo bekerja untuk Undo; perubahan setelah Undo belum selalu mengosongkan riwayat Redo.
- Model LED dan resistor merupakan geometri prosedural, bukan model CAD berakurasi tinggi.

## Struktur

```
index.html         — UI dan canvas builder
ar.html            — image tracking MindAR
js/app.js          — renderer, interaksi, proyek, game, multimeter
js/engine.js       — solver DC seri terpisah
assets/marker.svg  — gambar target cetak
assets/target.mind — dibuat pengguna melalui compiler (belum ada)
```

## Pengujian manual yang disarankan

1. Klik Contoh Rangkaian, Start, pastikan LED menyala dan nilai arus tampil.
2. Ubah resistor menjadi 1000 Ω; arus LED turun. Ubah ke 100 Ω; peringatan arus berlebih muncul.
3. Buka saklar; arus menjadi 0 mA.
4. Putus salah satu kabel; status rangkaian terbuka.
5. Simpan JSON, Reset, Buka JSON; posisi dan koneksi kembali.
6. Pilih mode V, tempatkan kedua probe pada dua terminal baterai; baca tegangan.
7. Stop, pilih Ω, tempatkan kedua probe pada resistor; baca resistansi.
8. Uji pada HP dan laptop. Periksa browser console bila CDN gagal dimuat.

Kode telah diperiksa sintaks dengan `node --check`, tetapi pengujian interaksi browser dan kamera pada perangkat nyata tetap diperlukan.
