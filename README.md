# ElectroAR Ultimate V3.1 — Tahap 2 (peningkatan nyata)

## Apa yang diperbaiki
- Mesin DC seri sekarang memeriksa graf terminal/kabel dan dapat menghitung urutan komponen yang bebas, lebih dari satu resistor, LED, atau saklar dalam **satu loop seri**.
- Menolak cabang/paralel, komponen bypass, polaritas terbalik, loop terputus, dan korsleting baterai; tidak mengarang angka untuk rangkaian tak didukung.
- Menambahkan hasil arus dan tegangan per komponen untuk pengukuran resistor/LED.
- Indikator LED mendukung beberapa LED dalam loop, dan label terminal +/- ditambahkan pada model 3D.
- Menambah LED putih dan pengujian regresi.

## Menjalankan
Unggah **seluruh isi folder** ke root GitHub Pages, atau jalankan `python -m http.server 8000` di folder ini. Buka `index.html`. Butuh koneksi internet untuk CDN Three.js.

## Uji otomatis
`node --test tests/*.test.mjs`
`node --check js/app.js`

## Batasan jujur
Belum ada solver MNA untuk rangkaian paralel; breadboard masih visual; pengukuran arus probe inline belum tersedia; AR masih memerlukan kompilasi `assets/target.mind` dari `assets/marker.svg` melalui MindAR Compiler. Interaksi browser/AR fisik belum diuji. Tahap ini **belum 10/10**.
