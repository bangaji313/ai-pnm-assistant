# Keamanan demo AI.PNM

Gunakan hanya data contoh. Ini konsep presentasi independen, bukan layanan produksi PNM.

Kontrol yang diterapkan: verifikasi Firebase ID token pada server, pemeriksaan origin, pemisahan secret/server, deny-all client Firestore rules, service account khusus dengan IAM terbatas, transaksi kuota user/IP/global, batas payload/history/output, timeout, sumber terkurasi, structured output, dan pemeriksaan ID sumber.

Penyamaran berbasis pola tidak mengenali semua informasi pribadi. Hash IP bukan anonimisasi sempurna. Guardrail model tidak menjamin semua jawaban benar atau semua jailbreak terblokir. Login demo tidak memberi hak pegawai atau akses dokumen internal.

Jangan mengirim kerentanan yang menyertakan key/token atau data pribadi ke issue publik. Hubungi pemilik repository melalui kanal privat yang disepakati terlebih dahulu. Jika key bocor, cabut/rotasi di penyedia, perbarui environment, redeploy, dan periksa riwayat Git. Menghapus teks dari README saja tidak mencabut key.

Firestore rules menolak semua client read/write; Admin SDK melewatinya dan bergantung pada IAM. Rules merupakan konfigurasi awal yang sudah diperiksa untuk akses demo ini dan tetap perlu review bila model data berubah. Tidak ada klaim audit formal, sertifikasi, ZDR, atau kesiapan compliance produksi.
