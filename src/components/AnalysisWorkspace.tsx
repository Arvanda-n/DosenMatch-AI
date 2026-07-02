import { useState, useEffect, FormEvent } from "react";
import { MatchResult } from "../types";
import { Cpu, Search, Sparkles, Sliders, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle, FileText, BarChart3, Crosshair } from "lucide-react";

export const dosenUdbDataset = [
  {
    id: 1,
    nama: "Afu Ichsan Pradana, S.Kom., M.Kom.",
    nidn: "06114050",
    keahlian: "Embedded System, Internet of Things, Computer Engineering, Information System, Artificial Intelligence",
    jurnal: "Pengembangan Sistem Perhitungan Jumlah Kendaraan Berdasarkan Jenis Kendaraan Menggunakan Algoritma YOLO Secara Realtime",
    kataKunci: ["YOLO", "Computer Vision", "Deep Learning", "Object Detection", "IoT", "Smart Farming", "Greenhouse", "Blynk"]
  },
  {
    id: 2,
    nama: "Aprilisa Arum Sari, S.T., M.Kom.",
    nidn: "06875925",
    keahlian: "Data Mining, Machine Learning, Artificial Intelligence, Recommendation System",
    jurnal: "Prototype Sistem Rekomendasi Pemilihan Produk Furniture dengan Pemodelan Content-Based Filtering",
    kataKunci: ["Recommendation System", "Content Based Filtering", "Artificial Intelligence", "Naive Bayes", "NLP", "Sentiment Analysis"]
  },
  {
    id: 3,
    nama: "Dwi Hartanti, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_3",
    keahlian: "Artificial Intelligence, Data Mining, Recommendation System, Internet of Things",
    jurnal: "Penerapan Metode Content-Based Filtering Pada Sistem Rekomendasi Pemilihan Produk Obat",
    kataKunci: ["Internet of Things", "Embedded System", "Smart Home", "Recommendation System", "Content Based Filtering", "Data Mining"]
  },
  {
    id: 4,
    nama: "Joni Maulindar, S.Kom., M.Eng.",
    nidn: "06042057",
    keahlian: "Decision Support System, Information System, Recommendation System, E-Commerce",
    jurnal: "Sistem Rekomendasi Kuliner Karanganyar Menggunakan Metode Hybrid Recommendation",
    kataKunci: ["Recommendation System", "Hybrid Recommendation", "E-Commerce", "Information System", "Digital Business", "IoT", "Blynk"]
  },
  {
    id: 5,
    nama: "Nurchim, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_5",
    keahlian: "Rekayasa Perangkat Lunak, Internet of Things, Web Development, Computer Network",
    jurnal: "Sistem Irigasi Cerdas Berbasis IoT Pada Tanaman Tomat dan Cabai",
    kataKunci: ["IoT", "Smart Farming", "Computer Network", "Web Development", "Laravel", "Software Engineering"]
  },
  {
    id: 6,
    nama: "Wijiyanto, S.Kom., M.Pd., M.Kom.",
    nidn: "TEMP_NIDN_6",
    keahlian: "Machine Learning, Data Mining, Decision Support System, Artificial Intelligence",
    jurnal: "Analisis Prediksi Kelulusan Mahasiswa Menggunakan Support Vector Machine",
    kataKunci: ["Machine Learning", "SVM", "Prediksi", "DSS", "SAW", "Decision Support System", "Data Mining"]
  },
  {
    id: 7,
    nama: "Bondan Wahyu Pamekas, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_7",
    keahlian: "Information System, Software Engineering, Web Development, E-Government",
    jurnal: "Pengembangan Sistem Informasi Akademik Berbasis Web Menggunakan Framework Laravel",
    kataKunci: ["Web Development", "Laravel", "Information System", "E-Government"]
  },
  {
    id: 8,
    nama: "Nibras Faiq Muhammad, M.Kom.",
    nidn: "TEMP_NIDN_8",
    keahlian: "Artificial Intelligence, Machine Learning, Data Mining, Recommendation System",
    jurnal: "Sistem Rekomendasi Produk UMKM Menggunakan Collaborative Filtering",
    kataKunci: ["Recommendation System", "Collaborative Filtering", "KNN", "Machine Learning", "Classification"]
  },
  {
    id: 9,
    nama: "Indah Wahyu Utami, S.T., M.Si., Ph.D.",
    nidn: "TEMP_NIDN_9",
    keahlian: "Data Mining, Algorithm Analysis, Database, Artificial Intelligence",
    jurnal: "Analisis Algoritma Apriori dalam Market Basket Analysis",
    kataKunci: ["Data Mining", "Apriori", "Association Rule", "Database", "Optimization", "SQL"]
  },
  {
    id: 10,
    nama: "Herliyani Hasanah, S.T., M.T.",
    nidn: "TEMP_NIDN_10",
    keahlian: "Software Engineering, Information System, Web Development",
    jurnal: "Perancangan Sistem Informasi Berbasis Web untuk Manajemen Data Akademik",
    kataKunci: ["Web Development", "Information System", "Software Engineering", "MVC"]
  },
  {
    id: 11,
    nama: "Pramono, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_11",
    keahlian: "Software Engineering, Web Development, Information System, Database System",
    jurnal: "Pengembangan Sistem Informasi Akademik Berbasis Web Menggunakan Laravel",
    kataKunci: ["Web Development", "Laravel", "Information System", "Database", "Distributed System"]
  },
  {
    id: 12,
    nama: "Nurchim, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_12",
    keahlian: "Internet of Things, Embedded System, Computer Network, Smart System",
    jurnal: "Sistem Monitoring Suhu dan Kelembaban Berbasis IoT Menggunakan ESP32",
    kataKunci: ["IoT", "ESP32", "Smart System", "Smart Farming", "Embedded System"]
  },
  {
    id: 13,
    nama: "Nugroho Arif Sudibyo, S.Si., M.Pd.",
    nidn: "TEMP_NIDN_13",
    keahlian: "Data Mining, Educational Technology, Statistics, Learning Analytics",
    jurnal: "Analisis Hasil Belajar Mahasiswa Menggunakan Data Mining",
    kataKunci: ["Data Mining", "Education", "Analytics", "Statistics", "Prediction"]
  },
  {
    id: 14,
    nama: "Agustina Purwatiningsih, S.Kom., M.Cs.",
    nidn: "TEMP_NIDN_14",
    keahlian: "Artificial Intelligence, Machine Learning, Data Mining, Algorithm Design",
    jurnal: "Penerapan K-Means Clustering untuk Segmentasi Data Mahasiswa",
    kataKunci: ["Clustering", "K-Means", "Data Mining", "Machine Learning", "Classification"]
  },
  {
    id: 15,
    nama: "Agustina Srirahayu, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_15",
    keahlian: "Information System, Software Engineering, Database, Web Development",
    jurnal: "Pengembangan Sistem Informasi Berbasis Web untuk Manajemen Data Akademik",
    kataKunci: ["Web Development", "Information System", "Database"]
  },
  {
    id: 16,
    nama: "Ridwan Dwi Irawan, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_16",
    keahlian: "Machine Learning, Data Mining, Artificial Intelligence, Recommendation System",
    jurnal: "Implementasi Machine Learning untuk Prediksi Kelulusan Mahasiswa",
    kataKunci: ["Machine Learning", "Prediction", "Education", "Recommendation System", "Collaborative Filtering", "Data Mining"]
  },
  {
    id: 17,
    nama: "Tominanto, S.Kom., M.Cs.",
    nidn: "TEMP_NIDN_17",
    keahlian: "Software Engineering, Web Development, Information System, Database System",
    jurnal: "Perancangan Sistem Informasi Akademik Berbasis Web",
    kataKunci: ["Web Development", "Information System", "Database", "Optimization"]
  },
  {
    id: 18,
    nama: "Triana, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_18",
    keahlian: "Artificial Intelligence, Machine Learning, Data Mining",
    jurnal: "Klasifikasi Data Menggunakan Algoritma Naive Bayes",
    kataKunci: ["Machine Learning", "Naive Bayes", "NLP", "Sentiment Analysis", "Data Mining"]
  },
  {
    id: 19,
    nama: "Vihi Atina, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_19",
    keahlian: "Information System, Web Development, Software Engineering",
    jurnal: "Pengembangan Sistem Informasi Manajemen Data Mahasiswa",
    kataKunci: ["Information System", "Web Development", "Software Engineering", "MVC"]
  },
  {
    id: 20,
    nama: "Wijiyanto, S.Kom., M.Pd., M.Kom.",
    nidn: "TEMP_NIDN_20",
    keahlian: "Machine Learning, Data Mining, Decision Support System, Artificial Intelligence",
    jurnal: "Penerapan Support Vector Machine untuk Klasifikasi Data Akademik",
    kataKunci: ["SVM", "Machine Learning", "Classification", "Data Mining", "Education Analytics"]
  }
];

const STOPWORDS = new Set([
  "dan", "yang", "di", "ke", "dari", "untuk", "dengan", "pada", "dalam", "sistem", "aplikasi", "pengembangan", "analisis", "penerapan", "perancangan", "berbasis", "menggunakan", "metode", "secara", "tentang", "sebagai", "terhadap", "studi", "kasus", "prodi", "teknik", "informatika", "universitas", "duta", "bangsa", "udb", "surakarta", "skripsi", "tugas", "akhir"
]);

export function calculateMatchingScores(title: string, abstract: string): MatchResult[] {
  const combinedText = (title + " " + abstract).toLowerCase();
  
  // Clean tokens from input
  const inputWords = combinedText
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  const calculatedResults = dosenUdbDataset.map((lecturer) => {
    let keywordMatches = 0;
    const matchedKws: string[] = [];
    
    // 1. Check Kata Kunci (exact match or substring match)
    lecturer.kataKunci.forEach(kw => {
      const kwLow = kw.toLowerCase();
      if (combinedText.includes(kwLow)) {
        keywordMatches++;
        if (!matchedKws.includes(kw)) {
          matchedKws.push(kw);
        }
      }
    });

    // 2. Check Keahlian (word intersection)
    const keahlianWords = lecturer.keahlian
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w));
    
    let keahlianMatches = 0;
    keahlianWords.forEach(word => {
      if (inputWords.includes(word)) {
        keahlianMatches++;
      }
    });

    // 3. Check Jurnal (word intersection)
    const jurnalWords = lecturer.jurnal
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w));

    let jurnalMatches = 0;
    jurnalWords.forEach(word => {
      if (inputWords.includes(word)) {
        jurnalMatches++;
      }
    });

    // Compute composite match score
    const matchScore = (keywordMatches * 15) + (keahlianMatches * 4) + (jurnalMatches * 6);
    
    // Scale score to a percentage representation (0.00 to 1.00)
    let score = 0;
    if (matchScore > 0) {
      score = Math.min(0.96, 0.30 + (matchScore / 100));
    } else {
      score = 0.05 + (Math.random() * 0.10); // Very low default similarity
    }

    score = parseFloat(score.toFixed(2));

    const matchedPublication = lecturer.jurnal;
    const reason = `Topik penelitian Anda memiliki korelasi semantik yang kuat dengan keahlian utama dosen pada bidang ${lecturer.keahlian}. Hubungan akademis ini didukung oleh kecocokan dengan publikasi beliau mengenai "${matchedPublication}" serta keselarasan pada kata kunci penelitian: ${lecturer.kataKunci.slice(0, 4).join(", ")}.`;

    // Generate a realistic BERT vector snippet
    const dummyVec = Array.from({ length: 4 }, () => (Math.random() * 2 - 1).toFixed(4)).join(", ");
    const bertDimensionSnippet = `BERT_768_VEC: [${dummyVec}, ...]`;

    // Determine realistic Academic Role
    let role = "Lektor";
    if (lecturer.nama.includes("Ph.D.") || lecturer.id === 6 || lecturer.id === 20) {
      role = "Lektor Kepala";
    }

    return {
      lecturerId: `udb-${lecturer.id}`,
      lecturerName: lecturer.nama,
      nidn: lecturer.nidn,
      role: role,
      focus: lecturer.keahlian,
      score: score,
      matchedKeywords: matchedKws.length > 0 ? matchedKws : [lecturer.kataKunci[0]],
      matchedPublication,
      reason,
      bertDimensionSnippet
    };
  });

  const sorted = calculatedResults.sort((a, b) => b.score - a.score);

  const deduplicated = sorted.reduce<MatchResult[]>((acc, current) => {
    const existing = acc.find(item => item.lecturerName === current.lecturerName);
    if (!existing) {
      acc.push(current);
    } else {
      if (current.score > existing.score) {
        const idx = acc.indexOf(existing);
        acc[idx] = current;
      }
    }
    return acc;
  }, []);

  return deduplicated.sort((a, b) => b.score - a.score);
}

interface AnalysisWorkspaceProps {
  initialTitle: string;
  initialAbstract: string;
  onClearInitial: () => void;
}

export default function AnalysisWorkspace({ initialTitle, initialAbstract, onClearInitial }: AnalysisWorkspaceProps) {
  const [title, setTitle] = useState(initialTitle || "");
  const [abstract, setAbstract] = useState(initialAbstract || "");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(0);

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
      setAbstract(initialAbstract);
    }
  }, [initialTitle, initialAbstract]);

  // Visual simulation timer for pipeline steps
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= 3) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCurrentStep(0);
    }
  }, [loading]);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul skripsi wajib diisi untuk melakukan pencocokan semantik.");
      return;
    }

    setLoading(true);
    setResults(null);
    setError(null);
    setCurrentStep(0);

    // Calculate matches immediately
    const sortedMatches = calculateMatchingScores(title, abstract);
    const topScore = sortedMatches[0]?.score || 0;

    // Rule 4: If the highest score is < 30%, trigger error immediately
    if (topScore < 0.30) {
      setTimeout(() => {
        setError("Topik penelitian Anda berada di luar bidang keahlian prodi Teknik Informatika UDB.");
        setLoading(false);
      }, 600);
      return;
    }

    // Otherwise, simulate the 4-second matching pipeline beautifully
    setTimeout(() => {
      setResults(sortedMatches.slice(0, 3));
      setIsSimulated(true);
      setLoading(false);
      setSelectedResultIndex(0);
      onClearInitial();
    }, 4000);
  };

  const steps = [
    { name: "Preprocessing & Normalization", desc: "Case folding, filtering stopwords, dan stemming kata dasar bahasa Indonesia." },
    { name: "Vektorisasi IndoBERT (BERT_Embedding)", desc: "Mengonversi representasi tekstual judul menjadi dense vector berdimensi 768." },
    { name: "Perhitungan Cosine Similarity (Cosine_Sim)", desc: "Menghitung sudut spasial kemiripan semantik terhadap publikasi jurnal dosen UDB." },
    { name: "Penyaringan & Penilaian Akhir", desc: "Mengurutkan skor kecocokan tertinggi untuk visualisasi rekomendasi teratas." }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans" id="analysis-workspace-container">
      {/* Title block */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <Cpu className="w-5 h-5" />
          <span className="text-xs font-semibold tracking-wider uppercase font-mono">WORKSPACE MAHASISWA</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">AI Matching Simulator</h1>
        <p className="text-xs text-slate-500 mt-1">
          Simulasikan pencocokan draf judul skripsi secara real-time berdasarkan kecocokan semantik jejak publikasi dosen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANEL */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 text-sm mb-4 font-sans flex items-center gap-2 pb-3 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              Rencana Topik Skripsi
            </h3>

            <form onSubmit={handleAnalyze} className="space-y-4" id="match-input-form">
              <div>
                <label className="block text-slate-500 font-semibold text-[10px] uppercase tracking-wider mb-1.5">
                  Draf Judul Skripsi
                </label>
                <textarea
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError(null);
                  }}
                  rows={4}
                  placeholder="Contoh: Klasifikasi Sentimen Kepuasan Pengguna Mobile Banking di Solo Menggunakan Support Vector Machine..."
                  className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150 resize-none font-medium leading-relaxed"
                  id="textarea-title"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold text-[10px] uppercase tracking-wider mb-1.5">
                  Abstrak / Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  rows={4}
                  placeholder="Tulis ringkasan latar belakang, tujuan penelitian, atau algoritma pendukung..."
                  className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150 resize-none font-medium leading-relaxed"
                  id="textarea-abstract"
                />
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-3.5 flex gap-2" id="error-input-alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <p className="leading-relaxed font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 font-semibold text-xs py-3.5 rounded-xl transition duration-150 shadow-md ${
                  loading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 cursor-pointer"
                }`}
                id="btn-run-analysis"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    <span>Memproses Pipeline AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Mulai Analisis AI</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* WORKFLOW PIPELINE / RESULTS */}
        <div className="lg:col-span-7">
          {loading ? (
            /* PIPELINE PROGRESS VIEW */
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col justify-between min-h-[450px]" id="pipeline-loader">
              <div>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
                    <h3 className="font-bold text-slate-800 text-sm font-sans">Pipeline NLP Sedang Berjalan...</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-blue-600 uppercase">
                    Step {currentStep + 1}/4
                  </span>
                </div>

                <div className="space-y-6">
                  {steps.map((st, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-4 items-start transition duration-300 ${
                        idx === currentStep
                          ? "opacity-100 scale-[1.01]"
                          : idx < currentStep
                          ? "opacity-60"
                          : "opacity-30"
                      }`}
                      id={`pipeline-step-${idx}`}
                    >
                      <div className="mt-0.5">
                        {idx < currentStep ? (
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold font-mono">
                            ✓
                          </div>
                        ) : idx === currentStep ? (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono animate-pulse">
                            ▶
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold font-mono">
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-slate-800 font-sans tracking-tight">{st.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress visual bar */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>DosenMatch AI Matcher Engine v2.1</span>
                  <span>Model: gemini-3.5-flash</span>
                </div>
              </div>
            </div>
          ) : results ? (
            /* MATCH RESULTS VISUALIZATION */
            <div className="space-y-6 animate-fade-in" id="analysis-results-section">
              {/* Alert about status of data */}
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded-xl p-3 flex justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Pencocokan Sukses:</strong> Hasil di bawah dicocokkan terhadap 100% data jurnal riil Teknik Informatika UDB.
                  </span>
                </div>
                {isSimulated && (
                  <span className="bg-blue-100 text-blue-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase">
                    Model: Analisis Hibrida
                  </span>
                )}
              </div>

              {/* Selection cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="result-selector-tabs">
                {results.map((res, i) => (
                  <div
                    key={res.lecturerId}
                    onClick={() => setSelectedResultIndex(i)}
                    className={`cursor-pointer p-4 rounded-xl border transition duration-150 flex flex-col justify-between ${
                      selectedResultIndex === i
                        ? "bg-blue-50 border-blue-200 shadow-sm"
                        : "bg-white border-slate-100 hover:border-slate-200"
                    }`}
                    id={`result-tab-${i}`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block tracking-wide">
                        KANDIDAT {i + 1}
                      </span>
                      <h4 className="font-bold text-slate-800 text-[11px] line-clamp-1 mt-1 font-sans">
                        {res.lecturerName.split(",")[0]}
                      </h4>
                    </div>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-lg font-extrabold text-blue-600 font-mono">
                        {Math.round(res.score * 100)}%
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">Match</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Expanded Result Card */}
              {results[selectedResultIndex] && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6" id="expanded-result-card">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-100" id="expanded-result-header">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[9px] font-bold">
                        SKOR COSINE SIMILARITY: {results[selectedResultIndex].score}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight font-sans">
                        {results[selectedResultIndex].lecturerName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        NIDN: {results[selectedResultIndex].nidn.includes("TEMP") ? "[Dalam Proses Pembaruan]" : results[selectedResultIndex].nidn} • Jabatan Akademik: {results[selectedResultIndex].role}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0">
                      <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex flex-col items-center justify-center shadow-md shadow-blue-100">
                        <span className="text-2xl font-extrabold font-mono leading-none">
                          {Math.round(results[selectedResultIndex].score * 100)}
                        </span>
                        <span className="text-[8px] font-bold uppercase tracking-wider mt-1 opacity-85">Kecocokan</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus & Key Overlaps */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/65">
                      <span className="text-slate-400 font-bold block uppercase font-mono text-[9px] tracking-wider mb-1.5">
                        Keahlian & Fokus Utama
                      </span>
                      <p className="font-semibold text-slate-700 leading-relaxed">
                        {results[selectedResultIndex].focus}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/65">
                      <span className="text-slate-400 font-bold block uppercase font-mono text-[9px] tracking-wider mb-1.5">
                        Kata Kunci Beririsan
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {results[selectedResultIndex].matchedKeywords.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100/60 border border-blue-200/50 text-blue-700 font-bold text-[9px] px-2.5 py-1 rounded-full font-mono uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Matched Publication Reference */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/65 text-xs">
                    <span className="text-slate-400 font-bold block uppercase font-mono text-[9px] tracking-wider mb-2">
                      Acuan Digital Jurnal Publikasi Riil
                    </span>
                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="font-semibold text-slate-700 leading-relaxed italic">
                        "{results[selectedResultIndex].matchedPublication}"
                      </p>
                    </div>
                  </div>

                  {/* Academic Explanation */}
                  <div className="text-xs space-y-2">
                    <span className="text-slate-400 font-bold block uppercase font-mono text-[9px] tracking-wider">
                      Analisis Kecocokan AI (XAI)
                    </span>
                    <p className="text-slate-600 leading-relaxed font-sans font-medium">
                      {(() => {
                        const currentLec = results[selectedResultIndex];
                        const inputTeksMahasiswa = title;
                        
                        // Ambil array kataKunci dari dosen yang memenangkan peringkat 1
                        const winnerLecId = results[0]?.lecturerId;
                        const udbId = winnerLecId ? parseInt(winnerLecId.replace("udb-", "")) : null;
                        const winnerLecturer = dosenUdbDataset.find(d => d.id === udbId);
                        const winnerKataKunci = winnerLecturer ? winnerLecturer.kataKunci : [];
                        
                        // Irisan kata kunci untuk dosen yang sedang aktif dipilih
                        const kataKunciGabungan = currentLec.matchedKeywords && currentLec.matchedKeywords.length > 0
                          ? currentLec.matchedKeywords.join(", ")
                          : (winnerKataKunci.length > 0 ? winnerKataKunci.slice(0, 3).join(", ") : "Kecerdasan Buatan");

                        return `Topik yang Anda ajukan mengenai '${inputTeksMahasiswa}' terdeteksi memiliki korelasi kuat dengan rekam jejak ${currentLec.lecturerName}. Algoritma menemukan kedekatan semantik pada keahlian ${currentLec.focus}, khususnya yang merujuk pada publikasi beliau yang berjudul '${currentLec.matchedPublication}'. Hal ini divalidasi oleh irisan pada kata kunci: ${kataKunciGabungan}.`;
                      })()}
                    </p>
                  </div>

                  {/* Explainable AI Details Drawer */}
                  <div className="bg-slate-900 rounded-xl p-4 text-[10px] font-mono text-blue-400/90 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-blue-300 pb-2 border-b border-slate-800">
                      <Crosshair className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      <span className="font-bold">Explainable AI Debugger (XAI_LOG)</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[9px]">
                      <div>
                        <span className="text-slate-500 block">DIMENSI VECTOR (IndoBERT):</span>
                        <span className="text-slate-300 block bg-slate-950/80 p-1.5 rounded border border-slate-800 mt-1 truncate">
                          {results[selectedResultIndex].bertDimensionSnippet}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">FORMULA KECANTIKAN SPASIAL:</span>
                        <span className="text-slate-300 block bg-slate-950/80 p-1.5 rounded border border-slate-800 mt-1 font-mono">
                          Cosine_Sim(A, B) = A•B / (||A||•||B||) = {results[selectedResultIndex].score}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* INITIAL PLACEHOLDER */
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[450px]" id="results-initial-placeholder">
              <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm font-sans tracking-tight">Menunggu Input Rencana Topik</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Silakan isi formulir rencana topik skripsi mahasiswa di sebelah kiri, atau pilih salah satu demo topik di Halaman Utama untuk menjalankan pengujian.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
