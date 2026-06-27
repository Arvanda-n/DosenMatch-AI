import { useState, useEffect, FormEvent } from "react";
import { MatchResult } from "../types";
import { Cpu, Search, Sparkles, Sliders, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle, FileText, BarChart3, Crosshair } from "lucide-react";

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

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, abstract }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi server pencocokan.");
      }

      const data = await response.json();
      
      // Delay finishing matching to let the visual step pipeline finish beautifully
      setTimeout(() => {
        setResults(data.results);
        setIsSimulated(data.isSimulated);
        setLoading(false);
        setSelectedResultIndex(0);
        onClearInitial();
      }, 4000);

    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
      setLoading(false);
    }
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
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-24">
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
              <div className="grid grid-cols-3 gap-3" id="result-selector-tabs">
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
                  <div className="flex justify-between items-start gap-4 pb-5 border-b border-slate-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[9px] font-bold mb-2">
                        SKOR COSINE SIMILARITY: {results[selectedResultIndex].score}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight font-sans">
                        {results[selectedResultIndex].lecturerName}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        NIDN: {results[selectedResultIndex].nidn} • Jabatan Akademik: {results[selectedResultIndex].role}
                      </p>
                    </div>

                    <div className="flex flex-col items-end">
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
                      {results[selectedResultIndex].reason}
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
