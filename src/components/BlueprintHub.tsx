import { useState } from "react";
import { Copy, Check, Download, BookOpen, Layers, ShieldCheck, Cpu, FileText } from "lucide-react";

export default function BlueprintHub() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadText = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const blueprintFullText = `================================================================================
BLUEPRINT ARSITEKTUR SISTEM, BASIS DATA, DAN SPESIFIKASI ANTARMUKA "DOSENMATCH AI"
Studi Kasus: Program Studi Teknik Informatika, Universitas Duta Bangsa (UDB) Surakarta
Dokumen Hasil Rancangan Apex System Architect & AI Researcher untuk Laporan UAS
================================================================================

1. EDTECH UI/UX & BRANDING DECONSTRUCTION
--------------------------------------------------------------------------------
A. Analisis Landing Page: Mengapa "Clean Academic SaaS" Sangat Tepat untuk Kampus
Pendekatan visual "Clean Academic SaaS" dengan dominasi ruang negatif (negative space), sudut tumpul lembut (rounded corners), dan tata letak lapang (spacious padding) memberikan dampak psikologis signifikan dalam lingkungan institusi pendidikan tinggi. 

- Mereduksi Kecemasan Administratif: Proses penentuan dosen pembimbing skripsi sering kali dipandang menegangkan dan membingungkan oleh mahasiswa. Desain yang bersih dan terstruktur mereduksi "cognitive overload," mengubah persepsi birokrasi kampus menjadi alur kerja modern yang transparan dan bersahabat.
- Tipografi Poppins: Pemilihan font Poppins secara eksklusif memberikan estetika kontemporer yang ramah dan berwibawa. Karakter geometris sans-serif sans-serif yang seimbang menjaga legibilitas tinggi, baik pada layar desktop beresolusi tinggi maupun perangkat mobile, melambangkan modernitas UDB yang responsif terhadap inovasi digital.
- Kepercayaan Akademik: Konsistensi elemen UI menunjukkan tingkat profesionalisme tinggi, mempertegas identitas Universitas Duta Bangsa (UDB) sebagai "The Global Entrepreneur University" yang mengadopsi teknologi terdepan secara andal.

B. XAI (Explainable AI) Visualization: Peran Simbolisme dan Label Teknis
Algoritma AI sering dianggap sebagai "kotak hitam" (Black Box) yang memicu keraguan di kalangan dosen, kaprodi, maupun mahasiswa terkait keadilan distribusinya. DOSENMATCH AI menyelesaikan hambatan ini melalui visualisasi Explainable AI (XAI):

- Logo "Crosshair" (Solid Blue): Melambangkan presisi mutlak dalam penargetan vektor ruang dimensi tinggi (high-dimensional vector space). Crosshair mengindikasikan bahwa sistem AI bekerja secara fokus untuk menemukan kecocokan terdekat tanpa subjektivitas emosional.
- Transparansi Metrik (BERT_Embedding & Cosine_Sim): Menampilkan label teknis ini secara eksplisit di UI mendidik pengguna bahwa sistem bekerja berdasarkan model matematis formal. 
  - BERT_Embedding membuktikan judul skripsi dikonversi menjadi representasi vektor padat (dense vector) 768 dimensi yang peka konteks, bukan sekadar pencarian kata kunci literal (bag-of-words).
  - Cosine_Sim bertindak sebagai indikator derajat kedekatan sudut antar-vektor dalam ruang euklidian, mempertegas kecocokan ilmiah berbasis jejak digital publikasi jurnal dosen di SINTA dan Google Scholar.


2. REAL-ACCOUNT SECURITY ARCHITECTURE
--------------------------------------------------------------------------------
A. Perancangan Halaman Login: Implementasi "Blind Input" Murni
Keamanan akun akademik merupakan pilar vital. Guna memitigasi risiko pembocoran informasi (Information Disclosure) dan serangan bahu (Shoulder Surfing) di area komunal kampus, sistem menerapkan antarmuka "Blind Input":

- Keamanan Masukan Kredensial: Kolom input kata sandi tidak menampilkan indikator jumlah karakter konvensional (seperti titik sandi statis) yang dapat dihitung secara visual oleh pengamat luar. Nilai input dikaburkan sepenuhnya dengan visualisasi hibrida dinamis.
- Pencegahan Timing Attack: Sistem backend mengonversi masukan teks menggunakan skema hashing konstan (seperti bcrypt dengan cost factor 12) yang diuji secara simultan pada rentang waktu tetap (constant-time comparison). Hal ini mempersulit peretas mengukur perbedaan waktu verifikasi kunci untuk mengekstrak struktur karakter.

B. Role-Based Access Control (RBAC): Validasi Keamanan Sisi Server (Backend)
Keamanan rute dan hak akses dalam DOSENMATCH AI mengadopsi prinsip pertahanan berlapis (defense-in-depth). Otorisasi tidak pernah bertumpu pada validasi frontend:

- Token Otorisasi JWT (JSON Web Token): Saat login sukses, backend memverifikasi peran pengguna dan menyematkan payload peran (Mahasiswa / Dosen / Kaprodi) di dalam enkripsi token JWT yang ditandatangani secara kriptografis (HMAC SHA256).
- Validasi Database Sisi Server: Setiap permintaan endpoint API dilindungi oleh middleware otorisasi yang mendekripsi JWT secara real-time dan memeriksa kecocokan peran langsung ke schema database. Jika pengguna mencoba mengakses dashboard Kaprodi (misalnya mengubah penetapan kuota dosen) menggunakan peran Mahasiswa, backend secara otomatis memutus koneksi dan mencatat log upaya intrusi keamanan.


3. THE REAL-DATA AI PIPELINE (END-TO-END WORKFLOW)
--------------------------------------------------------------------------------
Alur kerja pemrosesan pencocokan dosen pembimbing dari masukan awal hingga keluaran rekomendasi dirinci sebagai berikut:

[Langkah 1: Input Judul & Deskripsi Topik]
Mahasiswa memasukkan draf judul skripsi dan abstrak singkat melalui form UI DosenMatch AI. Sistem melakukan validasi karakter dan mencegah serangan injeksi naskah (XSS) di sisi klien.

[Langkah 2: Transmisi ke AI Microservice]
Data judul dikirimkan secara aman via protokol HTTPS POST menuju API Gateway, yang kemudian meneruskan payload ke AI Microservice (memanfaatkan Model Bahasa Besar/LLM server-side seperti gemini-3.5-flash atau encoder IndoBERT lokal).

[Langkah 3: Preprocessing & Text Normalization]
Teks mentah judul skripsi diproses melalui tahapan:
  a. Case Folding: Mengubah seluruh huruf menjadi huruf kecil.
  b. Filtering & Stopwords Removal: Membuang kata hubung akademis umum (misalnya: "analisis", "penerapan", "studi kasus", "pada", "menggunakan").
  c. Stemming Bahasa Indonesia: Mengembalikan kata berimbuhan ke kata dasar untuk meningkatkan akurasi ekstraksi fitur semantik.

[Langkah 4: Vektorisasi Berbasis BERT Embedding]
Teks yang telah bersih dilewatkan melalui model bahasa BERT (Bidirectional Encoder Representations from Transformers) versi Bahasa Indonesia (IndoBERT). Proses ini menghasilkan vektor representasi kontekstual padat (dense vector) berdimensi 768 yang merangkum makna semantik dari topik skripsi mahasiswa.

[Langkah 5: Perhitungan Cosine Similarity dengan Jejak Publikasi Dosen]
Vektor skripsi mahasiswa kemudian dibandingkan secara matematis terhadap kumpulan vektor publikasi jurnal dosen Universitas Duta Bangsa (UDB) yang telah di-ingest sebelumnya dari Google Scholar atau SINTA.
Rumus Cosine Similarity yang digunakan:
  Similarity(A, B) = (A . B) / (||A|| * ||B||)
Di mana A adalah vektor skripsi mahasiswa dan B adalah vektor jurnal publikasi dosen.

[Langkah 6: Penyaringan (Filtering) dan Rekomendasi Teratas]
Sistem mengurutkan nilai Cosine Similarity tertinggi dan menyaring 3 kandidat dosen dengan tingkat kemiripan semantik paling signifikan. Hasil pencocokan diperkaya dengan visualisasi representasi dimensi BERT dan penjelasan transparan (XAI) mengenai alasan korelasi topik publikasi ilmiah dosen dengan rencana skripsi mahasiswa. Hasil akhir dikirimkan kembali ke Frontend secara real-time.`;

  const sections = [
    {
      id: "sec-1",
      title: "1. EdTech UI/UX & Branding Deconstruction",
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      text: `A. Analisis Landing Page: Mengapa "Clean Academic SaaS" Sangat Tepat untuk Kampus
Pendekatan visual "Clean Academic SaaS" dengan dominasi ruang negatif (negative space), sudut tumpul lembut (rounded corners), dan tata letak lapang (spacious padding) memberikan dampak psikologis signifikan dalam lingkungan institusi pendidikan tinggi. 

- Mereduksi Kecemasan Administratif: Proses penentuan dosen pembimbing skripsi sering kali dipandang menegangkan dan membingungkan oleh mahasiswa. Desain yang bersih dan terstruktur mereduksi "cognitive overload," mengubah persepsi birokrasi kampus menjadi alur kerja modern yang transparan dan bersahabat.
- Tipografi Poppins: Pemilihan font Poppins secara eksklusif memberikan estetika kontemporer yang ramah dan berwibawa. Karakter geometris sans-serif sans-serif yang seimbang menjaga legibilitas tinggi, baik pada layar desktop beresolusi tinggi maupun perangkat mobile, melambangkan modernitas UDB yang responsif terhadap inovasi digital.
- Kepercayaan Akademik: Konsistensi elemen UI menunjukkan tingkat profesionalisme tinggi, mempertegas identitas Universitas Duta Bangsa (UDB) sebagai "The Global Entrepreneur University" yang mengadopsi teknologi terdepan secara andal.

B. XAI (Explainable AI) Visualization: Peran Simbolisme dan Label Teknis
Algoritma AI sering dianggap sebagai "kotak hitam" (Black Box) yang memicu keraguan di kalangan dosen, kaprodi, maupun mahasiswa terkait keadilan distribusinya. DOSENMATCH AI menyelesaikan hambatan ini melalui visualisasi Explainable AI (XAI):

- Logo "Crosshair" (Solid Blue): Melambangkan presisi mutlak dalam penargetan vektor ruang dimensi tinggi (high-dimensional vector space). Crosshair mengindikasikan bahwa sistem AI bekerja secara fokus untuk menemukan kecocokan terdekat tanpa subjektivitas emosional.
- Transparansi Metrik (BERT_Embedding & Cosine_Sim): Menampilkan label teknis ini secara eksplisit di UI mendidik pengguna bahwa sistem bekerja berdasarkan model matematis formal. 
  - BERT_Embedding membuktikan judul skripsi dikonversi menjadi representasi vektor padat (dense vector) 768 dimensi yang peka konteks, bukan sekadar pencarian kata kunci literal (bag-of-words).
  - Cosine_Sim bertindak sebagai indikator derajat kedekatan sudut antar-vektor dalam ruang euklidian, mempertegas kecocokan ilmiah berbasis jejak digital publikasi jurnal dosen di SINTA dan Google Scholar.`
    },
    {
      id: "sec-2",
      title: "2. Real-Account Security Architecture",
      icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
      text: `A. Perancangan Halaman Login: Implementasi "Blind Input" Murni
Keamanan akun akademik merupakan pilar vital. Guna memitigasi risiko pembocoran informasi (Information Disclosure) dan serangan bahu (Shoulder Surfing) di area komunal kampus, sistem menerapkan antarmuka "Blind Input":

- Keamanan Masukan Kredensial: Kolom input kata sandi tidak menampilkan indikator jumlah karakter konvensional (seperti titik sandi statis) yang dapat dihitung secara visual oleh pengamat luar. Nilai input dikaburkan sepenuhnya dengan visualisasi hibrida dinamis.
- Pencegahan Timing Attack: Sistem backend mengonversi masukan teks menggunakan skema hashing konstan (seperti bcrypt dengan cost factor 12) yang diuji secara simultan pada rentang waktu tetap (constant-time comparison). Hal ini mempersulit peretas mengukur perbedaan waktu verifikasi kunci untuk mengekstrak struktur karakter.

B. Role-Based Access Control (RBAC): Validasi Keamanan Sisi Server (Backend)
Keamanan rute dan hak akses dalam DOSENMATCH AI mengadopsi prinsip pertahanan berlapis (defense-in-depth). Otorisasi tidak pernah bertumpu pada validasi frontend:

- Token Otorisasi JWT (JSON Web Token): Saat login sukses, backend memverifikasi peran pengguna dan menyematkan payload peran (Mahasiswa / Dosen / Kaprodi) di dalam enkripsi token JWT yang ditandatangani secara kriptografis (HMAC SHA256).
- Validasi Database Sisi Server: Setiap permintaan endpoint API dilindungi oleh middleware otorisasi yang mendekripsi JWT secara real-time dan memeriksa kecocokan peran langsung ke schema database. Jika pengguna mencoba mengakses dashboard Kaprodi (misalnya mengubah penetapan kuota dosen) menggunakan peran Mahasiswa, backend secara otomatis memutus koneksi dan mencatat log upaya intrusi keamanan.`
    },
    {
      id: "sec-3",
      title: "3. The Real-Data AI Pipeline (End-To-End Workflow)",
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      text: `Alur kerja pemrosesan pencocokan dosen pembimbing dari masukan awal hingga keluaran rekomendasi dirinci sebagai berikut:

[Langkah 1: Input Judul & Deskripsi Topik]
Mahasiswa memasukkan draf judul skripsi dan abstrak singkat melalui form UI DosenMatch AI. Sistem melakukan validasi karakter dan mencegah serangan injeksi naskah (XSS) di sisi klien.

[Langkah 2: Transmisi ke AI Microservice]
Data judul dikirimkan secara aman via protokol HTTPS POST menuju API Gateway, yang kemudian meneruskan payload ke AI Microservice (memanfaatkan Model Bahasa Besar/LLM server-side seperti gemini-3.5-flash atau encoder IndoBERT lokal).

[Langkah 3: Preprocessing & Text Normalization]
Teks mentah judul skripsi diproses melalui tahapan:
  a. Case Folding: Mengubah seluruh huruf menjadi huruf kecil.
  b. Filtering & Stopwords Removal: Membuang kata hubung akademis umum (misalnya: "analisis", "penerapan", "studi kasus", "pada", "menggunakan").
  c. Stemming Bahasa Indonesia: Mengembalikan kata berimbuhan ke kata dasar untuk meningkatkan akurasi ekstraksi fitur semantik.

[Langkah 4: Vektorisasi Berbasis BERT Embedding]
Teks yang telah bersih dilewatkan melalui model bahasa BERT (Bidirectional Encoder Representations from Transformers) versi Bahasa Indonesia (IndoBERT). Proses ini menghasilkan vektor representasi kontekstual padat (dense vector) berdimensi 768 yang merangkum makna semantik dari topik skripsi mahasiswa.

[Langkah 5: Perhitungan Cosine Similarity dengan Jejak Publikasi Dosen]
Vektor skripsi mahasiswa kemudian dibandingkan secara matematis terhadap kumpulan vektor publikasi jurnal dosen Universitas Duta Bangsa (UDB) yang telah di-ingest sebelumnya dari Google Scholar atau SINTA.
Rumus Cosine Similarity yang digunakan:
  Similarity(A, B) = (A . B) / (||A|| * ||B||)
Di mana A adalah vektor skripsi mahasiswa dan B adalah vektor jurnal publikasi dosen.

[Langkah 6: Penyaringan (Filtering) dan Rekomendasi Teratas]
Sistem mengurutkan nilai Cosine Similarity tertinggi dan menyaring 3 kandidat dosen dengan tingkat kemiripan semantik paling signifikan. Hasil pencocokan diperkaya dengan visualisasi representasi dimensi BERT dan penjelasan transparan (XAI) mengenai alasan korelasi topik publikasi ilmiah dosen dengan rencana skripsi mahasiswa. Hasil akhir dikirimkan kembali ke Frontend secara real-time.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4" id="blueprint-hub">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider uppercase font-mono">DosenMatch AI - Blueprint Arsitektur</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">
              Spesifikasi Arsitektur Sistem & AI (Laporan UAS)
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Disusun untuk Program Studi Teknik Informatika, Universitas Duta Bangsa (UDB)
            </p>
          </div>
          <button
            onClick={() => downloadText("blueprint_dosenmatch_ai_uas.txt", blueprintFullText)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition duration-150 cursor-pointer shadow-sm shadow-blue-100 font-sans"
            id="btn-download-full-blueprint"
          >
            <Download className="w-4 h-4" />
            Unduh Blueprint Lengkap (.txt)
          </button>
        </div>

        {/* Academic Meta Info */}
        <div className="bg-slate-50 rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans border border-slate-100">
          <div>
            <span className="text-slate-400 block uppercase font-mono tracking-wider mb-0.5">Penulis Blueprint</span>
            <span className="font-semibold text-slate-700">Apex System Architect & AI Researcher</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-mono tracking-wider mb-0.5">Studi Kasus</span>
            <span className="font-semibold text-slate-700">Teknik Informatika UDB</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-mono tracking-wider mb-0.5">Data Acuan AI</span>
            <span className="font-semibold text-slate-700">100% Jejak Digital Publikasi Riil</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-mono tracking-wider mb-0.5">Status Dokumen</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              TERVERTIFIKASI UAS
            </span>
          </div>
        </div>

        {/* Blueprint Body Sections */}
        <div className="space-y-8">
          {sections.map((sec) => (
            <div key={sec.id} className="group relative border border-slate-100 hover:border-blue-100 rounded-xl p-6 transition duration-200 bg-white" id={`card-sec-${sec.id}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition duration-200">
                    {sec.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm font-sans tracking-tight">{sec.title}</h3>
                </div>
                <button
                  onClick={() => handleCopy(sec.text, sec.id)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-100 px-2.5 py-1.5 rounded-lg transition duration-150 text-[10px] font-semibold cursor-pointer"
                  id={`btn-copy-${sec.id}`}
                  title="Salin bagian ini"
                >
                  {copiedSection === sec.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Bab</span>
                    </>
                  )}
                </button>
              </div>

              {/* Document Text */}
              <div className="bg-slate-50/50 rounded-lg p-5 font-mono text-xs text-slate-700 leading-relaxed border border-slate-100/50 whitespace-pre-wrap select-all">
                {sec.text}
              </div>
            </div>
          ))}
        </div>

        {/* Academic Footnote */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-mono gap-2">
          <span>© 2026 DosenMatch AI System Architect - Universitas Duta Bangsa</span>
          <span>Dokumen Terstruktur Standar IEEE / Ristekdikti</span>
        </div>
      </div>
    </div>
  );
}
