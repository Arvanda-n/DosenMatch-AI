import { ViewState } from "../types";
import { ArrowRight, FileText, Cpu, CheckCircle2, Award, Zap, HelpCircle } from "lucide-react";

interface LandingPageProps {
  setView: (view: ViewState) => void;
  onSelectSampleTopic: (title: string, abstract: string) => void;
}

export default function LandingPage({ setView, onSelectSampleTopic }: LandingPageProps) {
  // Beautiful SVG Crosshair Logo mimicking the uploaded image
  const LogoCrosshair = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-40 h-40 select-none shadow-xl rounded-3xl"
      id="svg-landing-logo-crosshair"
    >
      <rect width="100" height="100" rx="24" fill="#2563eb" />
      {/* Outer ticks */}
      <line x1="50" y1="18" x2="50" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="50" y1="60" x2="50" y2="82" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="18" y1="50" x2="40" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <line x1="60" y1="50" x2="82" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="6" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="5" fill="white" />
    </svg>
  );

  const sampleTopics = [
    {
      title: "Penerapan Algoritma Naive Bayes Untuk Klasifikasi Sentimen Kepuasan Mahasiswa Terhadap Pembelajaran Hybrid",
      abstract: "Penelitian ini mengkaji bagaimana tanggapan mahasiswa terhadap model kuliah hybrid di UDB menggunakan data Twitter/Ulasan. Algoritma Naive Bayes diaplikasikan untuk pemilahan sentimen.",
      category: "Data Mining / NLP"
    },
    {
      title: "Rancang Bangun Web GIS Pemetaan Sebaran Lokasi UMKM Kuliner Surakarta Berbasis React dan LeafletJS",
      abstract: "Membangun sistem informasi geografis interaktif yang memungkinkan dinas koperasi melakukan monitoring spasial, rute kurir pengantaran barang, dan data multi-tenant.",
      category: "GIS & Web Dev"
    },
    {
      title: "Sistem Deteksi Hama Daun Tanaman Padi Menggunakan Segmentasi Citra Digital Berbasis Jaringan Saraf Tiruan",
      abstract: "Penelitian mendeteksi penyakit daun padi secara otomatis dengan kamera perangkat bergerak. Pengolahan citra meliputi konversi warna, filter Gaussian, dan ekstraksi fitur bentuk.",
      category: "Computer Vision"
    }
  ];

  return (
    <div className="font-sans" id="landing-page-container">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-mono font-bold tracking-wider text-blue-700 uppercase" id="badge-academic-matching">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            AI-Powered Academic Matching
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-[1.1]" id="hero-title">
            AI Dosen Pembimbing <br className="hidden sm:inline" />
            <span className="text-blue-600 relative">
              Rekomendasi
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl" id="hero-description">
            Temukan dosen pembimbing skripsi yang paling sesuai dengan topik penelitian Anda menggunakan Artificial Intelligence. Sistem kami menganalisis ribuan data publikasi untuk memastikan kecocokan optimal.
          </p>

          <div className="flex flex-wrap gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={() => setView("analysis")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3.5 px-6 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-blue-100 group"
              id="btn-hero-start"
            >
              Mulai Analisis
              <ArrowRight className="w-4 h-4 transition duration-150 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("demo-interactive-section");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto flex items-center justify-center bg-slate-50 border border-slate-200/80 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-3.5 px-6 rounded-xl transition duration-150 cursor-pointer"
              id="btn-hero-demo"
            >
              Lihat Demo
            </button>
          </div>
        </div>

        {/* Right Column Logo Recreation */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="relative bg-gradient-to-tr from-indigo-50/50 via-blue-50/20 to-purple-50/60 p-10 sm:p-14 rounded-[36px] border border-slate-100 shadow-sm w-full max-w-sm flex items-center justify-center">
            {/* Visual backdrop circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 blur-3xl rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-400/5 blur-3xl rounded-full"></div>
            
            <div className="relative transform hover:scale-[1.03] transition duration-300" id="landing-hero-logo-box">
              <LogoCrosshair />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-50/50 border-y border-slate-100 py-16 md:py-24" id="cara-kerja-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight font-sans" id="section-howitworks-title">
            Cara Kerja Sistem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto leading-relaxed">
            Proses tiga langkah sederhana untuk menemukan pembimbing ideal Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 md:mt-16">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-100 transition duration-200" id="card-step-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100/50">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 font-sans">1. Input Topik</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Masukkan judul atau abstrak rencana penelitian Anda ke dalam sistem.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-100 transition duration-200" id="card-step-2">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 border border-purple-100/50">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 font-sans">2. AI Analisis</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Mesin AI kami membandingkan topik Anda dengan database publikasi ribuan dosen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-100 transition duration-200" id="card-step-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100/50">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm mb-2 font-sans">3. Rekomendasi</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Dapatkan daftar dosen pembimbing dengan skor kecocokan tertinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24" id="demo-interactive-section">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/50 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
          
          <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-8 border-b border-slate-100 mb-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Uji Coba Cepat</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-sans">
                Eksplorasi Studi Kasus Riil UDB
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pilih salah satu draf judul skripsi mahasiswa Universitas Duta Bangsa di bawah ini untuk menguji secara instan kecocokan semantiknya terhadap jejak publikasi dosen asli.
              </p>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleTopics.map((topic, i) => (
              <div
                key={i}
                onClick={() => onSelectSampleTopic(topic.title, topic.abstract)}
                className="bg-slate-50 hover:bg-white hover:border-blue-200 cursor-pointer border border-slate-100/80 rounded-2xl p-6 transition duration-150 flex flex-col justify-between hover:shadow-sm"
                id={`sample-topic-${i}`}
              >
                <div>
                  <div className="inline-block bg-slate-200/50 text-slate-600 font-mono font-bold text-[9px] px-2.5 py-1 rounded-full mb-4">
                    {topic.category}
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs tracking-tight line-clamp-3 mb-2 font-sans leading-snug">
                    {topic.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {topic.abstract}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 mt-4">
                  <span>Match Instan</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50/50 rounded-xl p-4 border border-blue-100/30 flex items-start gap-3 text-xs text-blue-800">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Constraint Utama:</strong> Semua data dosen acuan sistem ini didasarkan 100% pada publikasi jurnal riil yang terindeks SINTA/Google Scholar dari dosen program studi Teknik Informatika UDB. Tidak ada data fiktif dalam simulasi pencocokan ini.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
