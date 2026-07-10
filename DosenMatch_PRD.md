LAPORAN TEKNIS / PRODUCT REQUIREMENTS DOCUMENT (PRD)
SISTEM REKOMENDASI DOSEN PEMBIMBING SKRIPSI BERBASIS SEMANTIC MATCHING (DOSENMATCH AI)
1. Deskripsi Singkat Sistem
DosenMatch AI adalah platform berbasis web pintar yang dirancang untuk membantu mahasiswa tingkat akhir menemukan rekomendasi dosen pembimbing skripsi terbaik secara objektif.
Sistem ini memanfaatkan teknologi pencocokan semantik (Semantic Matching) untuk menganalisis tingkat relevansi antara usulan judul & abstrak skripsi mahasiswa dengan data kompetensi, riwayat penelitian, serta keahlian bidang dari masing-masing dosen. Melalui pendekatan ini, kecocokan tidak hanya ditentukan berdasarkan kata kunci (keyword-matching) mentah, melainkan menangkap kesamaan konteks dan arti (contextual/semantic meaning) secara mendalam menggunakan model representasi bahasa alami (NLP/AI embeddings).
2. Daftar Fitur Utama Berdasarkan Role
A. Role Mahasiswa (Student Dashboard)
Autentikasi Aman & Personal: Login personal menggunakan Nomor Induk Mahasiswa (NIM).
Evaluasi & Analisis Topik Baru: Workspace interaktif untuk menginput usulan Judul dan Abstrak skripsi secara mendalam.
Simulasi Pipeline AI: Visualisasi proses analisis cerdas (ekstraksi terminologi, perhitungan cosine similarity, dan pemeringkatan kesesuaian keahlian) yang dilengkapi dengan skeleton loading informatif untuk memberikan pengalaman pengguna yang realistis.
Hasil Rekomendasi Komprehensif: Menampilkan 3 kandidat dosen dengan skor kecocokan dalam persentase (%), dilengkapi penjelasan kecocokan topik dan bidang kepakaran dosen terkait.
Kunci & Ajukan Rekomendasi (Lock & Submit Proposal): Mahasiswa dapat menetapkan/mengunci salah satu dosen hasil rekomendasi sebagai pilihan utama dan mengirimkan berkas pengajuan tersebut ke sistem.
Riwayat Pengujian Topik: Panel khusus yang merekam seluruh riwayat pengujian usulan topik beserta skor kecocokan dan status pengajuannya.
B. Role Admin (Program Studi/Jurusan Dashboard)
Ringkasan Statistik Real-time: Widget ringkasan total mahasiswa, jumlah dosen, total log aktivitas kecocokan, serta jumlah pengajuan aktif.
Manajemen Data Dosen: Panel CRUD (Create, Read, Update, Delete) untuk mengelola data dosen, termasuk nama, NIDN, bidang keahlian, status kuota bimbingan, serta deskripsi kepakaran.
Manajemen Data Mahasiswa: Panel CRUD untuk mengelola data mahasiswa, NIM, angkatan, serta status akademik.
Log Aktivitas Kecocokan (Match Logs): Menampilkan riwayat analisis sistem secara mentah (status keberhasilan proses pencocokan semantik dan durasi eksekusi dalam milidetik) untuk kebutuhan audit teknis.
Monitoring Pengajuan Terkini (Semua Mahasiswa): Tabel pemantauan terpadu yang menampilkan pengajuan judul skripsi terbaru dari seluruh mahasiswa, lengkap dengan dosen rekomendasi yang dipilih dan skor kecocokannya.
3. Alur Kerja Sistem (User Flow)
Login & Autentikasi: Mahasiswa masuk ke portal menggunakan akun dengan kredensial NIM yang valid (misal: 220102034).
Input Topik Skripsi: Mahasiswa masuk ke halaman Evaluasi & Analisis Topik Baru untuk mengisi form Judul dan Abstrak draf skripsi mereka.
Proses Analisis (AI Simulated Processing):
Saat tombol "Mulai Analisis AI" diklik, sistem masuk ke State Loading selama 2.8 detik.
Sistem mematikan (disable) tombol input dan menampilkan Skeleton Loading interaktif.
Status indikator memperlihatkan pesan dinamis secara bertahap: "Mengekstrak terminologi skripsi..." 
 "Menghitung cosine similarity dengan data dosen..." 
 "Menyusun peringkat kecocokan keahlian...".
Penerimaan Rekomendasi: Hasil perhitungan pencocokan semantik ditampilkan secara elegan dalam bentuk kartu kandidat dosen teratas.
Penguncian & Pengajuan Usulan: Mahasiswa memilih salah satu dosen terbaik, mengklik tombol "Lock & Submit", yang secara otomatis menyimpan data pengajuan tersebut ke dalam histori mahasiswa.
Penyimpanan ke Riwayat & Pemantauan Admin:
Usulan topik yang telah diajukan masuk ke tabel Riwayat Pengujian Topik mahasiswa.
Di saat yang sama, data pengajuan tersebut dikirimkan ke database global sehingga langsung tampil pada panel Monitoring Pengajuan Terkini (Semua Mahasiswa) di halaman dashboard Admin (Kaprodi/Jurusan) untuk ditinjau dan disetujui.
4. Stack Teknologi & Library Tambahan
Framework Utama: React 18 berbasis Vite untuk performa render Single-Page Application (SPA) yang cepat dan modular.
Bahasa Pemrograman: TypeScript, menjamin keamanan tipe (type safety) dan meminimalkan kesalahan penulisan kode saat pengembangan.
Styling & UI: Tailwind CSS, dimanfaatkan untuk merancang antarmuka bergaya Clean SaaS dengan tata letak responsif (mobile-first design), dilengkapi integrasi font Poppins untuk estetika yang profesional dan modern.
Library Animasi: Motion (Framer Motion), digunakan untuk memberikan efek transisi halus pada menu navigasi, kartu rekomendasi, serta animasi interaktif lainnya.
Library Ikon: Lucide React, menyediakan ratusan ikon SVG konsisten untuk memperindah antarmuka visual.
Library Visualisasi Data (Charts): Recharts & D3.js, digunakan pada dashboard Admin untuk menampilkan metrik statistik, tren sebaran topik, serta grafik kuota bimbingan dosen.
5. Penjelasan State Management & Penyimpanan Data
Autentikasi (Local Storage): Data sesi pengguna (User Session) yang aktif disimpan menggunakan enkripsi dasar di dalam localStorage browser. Hal ini memungkinkan sistem mengingat status login pengguna (apakah mahasiswa atau admin) meskipun halaman web disegarkan kembali (refresh).
Penyimpanan Data Global (React Context API):
Sistem memanfaatkan DataContext sebagai penyedia state global (Global State Provider).
State ini menampung seluruh daftar data dosen aktif, data mahasiswa, log pencocokan semantik (Match Logs), dan riwayat pengajuan usulan skripsi secara terpusat (analysisHistory).
Melalui pendekatan React Context, setiap mutasi data (seperti menambah dosen baru oleh Admin, atau pengajuan judul baru oleh Mahasiswa) akan langsung disebarluaskan secara instan (reactive update) ke seluruh komponen terkait tanpa perlu melakukan pengiriman props yang berlebihan (props drilling).
