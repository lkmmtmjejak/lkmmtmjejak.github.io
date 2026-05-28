# Panduan Singkat: Pasang Google Analytics (GA4) di GitHub Pages

Dokumen ini menjelaskan langkah cepat untuk memasang Google Analytics (GA4) pada situs statis yang di-host di GitHub Pages.

**Ringkasan**
- Jenis: Google Analytics 4 (GA4)
- Kebutuhan: Akun Google, property GA4, Measurement ID (`G-P0P1H7E0SE`)
- File yang diedit: `index.html`

## 1. Buat property GA4
1. Masuk ke https://analytics.google.com dengan akun Google.
2. Klik Admin → Create Property → isi nama (mis. JEJAK 2026) → Next.
3. Dapatkan Measurement ID yang berbentuk `G-P0P1H7E0SE` pada bagian Data Streams → Web.

## 2. Pasang snippet dasar ke `index.html`
Tambahkan potongan ini di dalam tag `<head>` pada `index.html` (Measurement ID Anda: `G-P0P1H7E0SE`):

```html
<!-- Google Analytics (GA4) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-P0P1H7E0SE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-P0P1H7E0SE');
</script>
```

- Untuk situs statis, GA4 akan mencatat page_view saat halaman dimuat.
- Jika situsmu berperilaku seperti SPA (single-page app) — mis. navigasi antar-seksi pada `index.html` — kirim page_view virtual saat navigasi (lihat bagian 3).

## 3. Tracking untuk SPA / navigasi antar-seksi
Situs `index.html` kamu nampak memuat konten beberapa section (home, recruitment, team, alumni). Bila navigasi dilakukan tanpa reload, gunakan event virtual page_view agar page_path tercatat dengan benar.

Contoh fungsi yang bisa ditaruh di `script.js` (panggil saat section berubah):

```js
function trackVirtualPage(path) {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {
      page_path: path
    });
  }
}

// Contoh pemanggilan ketika user switch section
// trackVirtualPage('/#recruitment');
```

Pastikan memanggil `trackVirtualPage()` setelah DOM diubah / class active-section diperbarui.

## 4. Debugging & verifikasi
- Buka Google Analytics → Configure → DebugView untuk melihat event realtime.
- Untuk melihat debug events di local, aktifkan debug mode sementara dengan menambahkan pada config:

```js
gtag('config', 'G-XXXXXXXX', { 'anonymize_ip': true, 'debug_mode': true });
```

- Alternatif: gunakan ekstensi Chrome "Google Analytics Debugger".

## 5. Privasi & kepatuhan singkat
- Aktifkan `anonymize_ip` seperti contoh di atas agar IP tidak disimpan utuh.
- Jangan mengirim PII (nama, email, NIM) ke GA melalui event parameter.
- Bila perlu, sediakan opsi opt-out di UI (mis. tombol toggle) dan hormati Do Not Track.

## 6. Tips khusus GitHub Pages
- GA bekerja baik di GitHub Pages; tidak perlu perubahan CNAME kecuali domain kustom.
- Setelah commit & push, tunggu beberapa menit lalu cek DebugView / Realtime di GA.

## 7. Opsional — event tambahan yang direkomendasikan
- `click_registration` saat tombol pendaftaran diklik
- `newsletter_signup` jika ada form
- `outbound_click` untuk klik link eksternal

Contoh event klik sederhana (letakkan pada handler klik):

```js
// saat tombol pendaftaran diklik
gtag('event', 'click_registration', { 'method': 'guidebook-link' });
```

## 8. Pertanyaan lanjutan
- Mau saya pasang snippet langsung ke `index.html`? (saya bisa commit perubahan)
- Mau tracking virtual page otomatis? Saya bisa tambahkan contoh integrasi ke `script.js`.

---
Panduan ini pendek dan praktis agar cepat dipasang di GitHub Pages. Bila mau, saya tambahkan langsung ke `index.html` dan `script.js` contoh integrasi virtual page tracking.