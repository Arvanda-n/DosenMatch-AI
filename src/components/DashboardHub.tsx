import { useState, FormEvent } from "react";
import { User, Lecturer } from "../types";
import { Award, Check, UserCheck, BookOpen, Plus, Sparkles, TrendingUp, Users, FileSpreadsheet, Trash2, CheckCircle, ChevronRight, FileText, AlertCircle } from "lucide-react";

interface DashboardHubProps {
  user: User;
  onLogout: () => void;
  onSwitchRole: (role: "mahasiswa" | "dosen" | "kaprodi") => void;
}

export default function DashboardHub({ user, onLogout, onSwitchRole }: DashboardHubProps) {
  // Local state for Lecturer Publications addition (Dosen dashboard)
  const [publications, setPublications] = useState([
    "Penerapan Algoritma Naive Bayes Untuk Prediksi Kelulusan Mahasiswa Tepat Waktu",
    "Sistem Pendukung Keputusan Pemilihan Karyawan Terbaik Menggunakan Metode AHP dan TOPSIS",
    "Analisis Sentimen Ulasan Aplikasi Dompet Digital Menggunakan Support Vector Machine (SVM)"
  ]);
  const [newPub, setNewPub] = useState("");

  // Local state for Kaprodi Approval items
  const [approvals, setApprovals] = useState([
    { id: "app-1", studentName: "Muhammad Aris Saputra", nim: "220102034", topic: "Klasifikasi Sentimen Kepuasan Pengguna Mobile Banking di Solo Menggunakan Support Vector Machine", recommendedLecturer: "Tomoliyus, M.Cs.", score: 0.92, status: "pending" },
    { id: "app-2", studentName: "Siti Rahmawati", nim: "220102015", topic: "Rancang Bangun Web GIS Pemetaan Sebaran Lokasi UMKM Kuliner Surakarta Berbasis React", recommendedLecturer: "Rina Wijayanti, M.Kom.", score: 0.88, status: "approved" },
    { id: "app-3", studentName: "Bambang Pamungkas", nim: "220102008", topic: "Sistem Deteksi Hama Daun Tanaman Padi Menggunakan Segmentasi Citra Digital", recommendedLecturer: "Sopingi, M.Kom.", score: 0.94, status: "pending" }
  ]);

  const handleAddPublication = (e: FormEvent) => {
    e.preventDefault();
    if (!newPub.trim()) return;
    setPublications([...publications, newPub.trim()]);
    setNewPub("");
  };

  const handleRemovePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const handleApprove = (id: string) => {
    setApprovals(approvals.map(app => app.id === id ? { ...app, status: "approved" } : app));
  };

  const handleReject = (id: string) => {
    setApprovals(approvals.map(app => app.id === id ? { ...app, status: "rejected" } : app));
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-sans" id="dashboard-hub">
      {/* Role selection shortcuts to test all perspectives easily */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border border-slate-800 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-xs font-semibold font-mono tracking-wide">
            SIMULASI AKSES MULTI-PERAN (RBAC BY BACKEND)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSwitchRole("mahasiswa")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer ${
              user.role === "mahasiswa"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            id="switch-to-mahasiswa"
          >
            Dashboard Mahasiswa
          </button>
          <button
            onClick={() => onSwitchRole("dosen")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer ${
              user.role === "dosen"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            id="switch-to-dosen"
          >
            Dashboard Dosen
          </button>
          <button
            onClick={() => onSwitchRole("kaprodi")}
            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer ${
              user.role === "kaprodi"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            id="switch-to-kaprodi"
          >
            Dashboard Kaprodi
          </button>
        </div>
      </div>

      {/* CORE DASHBOARD RENDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Profile Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
            <div className="text-center pb-6 border-b border-slate-100">
              <div className="relative inline-block">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-2 border-blue-100 mx-auto bg-slate-50"
                  referrerPolicy="no-referrer"
                  id="user-avatar"
                />
                <span className="absolute bottom-0 right-0 bg-blue-600 border-2 border-white text-white font-bold text-[8px] font-mono px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <h3 className="font-extrabold text-slate-800 text-sm mt-4 font-sans tracking-tight">
                {user.name}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                {user.role === "mahasiswa" ? "NIM" : "NIDN"}: {user.nim_nidn}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {user.email}
              </p>
            </div>

            {/* Academic Information Details based on role */}
            <div className="space-y-4 text-xs font-sans">
              <span className="text-slate-400 font-bold block uppercase font-mono text-[9px] tracking-wider">
                Sistem & Otorisasi
              </span>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Prodi:</span>
                  <span className="font-semibold text-slate-700">Teknik Informatika (S1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fakultas:</span>
                  <span className="font-semibold text-slate-700">Ilmu Komputer (FIKOM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Institusi:</span>
                  <span className="font-semibold text-blue-600">Universitas Duta Bangsa</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100/80">
                  <span className="text-slate-400">Metode Validasi:</span>
                  <span className="font-bold text-emerald-600 font-mono">JWT SECURE HANDSHAKE</span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100 hover:text-rose-600 text-slate-600 font-semibold text-xs py-2.5 rounded-xl transition duration-150 cursor-pointer text-center"
              id="btn-sidebar-logout"
            >
              Keluar Akun
            </button>
          </div>
        </div>

        {/* Main Work Area based on active simulated role */}
        <div className="lg:col-span-8">
          {user.role === "mahasiswa" && (
            /* ==============================================================
               MAHASISWA DASHBOARD
               ============================================================== */
            <div className="space-y-6" id="dashboard-mahasiswa">
              {/* Proposal Status Bar */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Status Pengajuan Pembimbing</h4>
                  <span className="bg-amber-50 border border-amber-200 text-amber-700 font-bold text-[10px] font-mono px-2.5 py-1 rounded-full uppercase">
                    Menunggu Review Kaprodi
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase font-mono tracking-wider">Topik Skripsi Anda:</span>
                  <p className="font-semibold text-slate-700 italic leading-relaxed">
                    "Penerapan Algoritma Naive Bayes Untuk Klasifikasi Sentimen Kepuasan Mahasiswa Terhadap Pembelajaran Hybrid Di Universitas Duta Bangsa"
                  </p>
                </div>
              </div>

              {/* Top Match recommendation highlight */}
              <div className="bg-gradient-to-tr from-blue-50/20 via-indigo-50/10 to-blue-50/50 rounded-2xl border border-blue-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-blue-800 text-xs tracking-tight">Kandidat Utama Rekomendasi AI</h4>
                  </div>
                  <span className="bg-blue-600 text-white font-extrabold text-xs font-mono px-2.5 py-1 rounded-lg">
                    Match: 92%
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-blue-100/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Tomoliyus, M.Cs.</h5>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">NIDN: 0627018301 • Lektor</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1">Fokus: Data Mining, ML, Decision Support System</p>
                  </div>
                  <button
                    onClick={() => alert("Pengajuan resmi dikirimkan ke Kaprodi!")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] py-2 px-4 rounded-xl transition duration-150 cursor-pointer"
                  >
                    Kunci & Ajukan Dosen
                  </button>
                </div>
              </div>

              {/* Attempt History Logs */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-4">Riwayat Pengujian Topik</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] tracking-wider">
                        <th className="py-2.5">Tanggal</th>
                        <th className="py-2.5">Topik Skripsi</th>
                        <th className="py-2.5">Rekomendasi Utama</th>
                        <th className="py-2.5">Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      <tr>
                        <td className="py-3 font-mono text-[10px]">27 Juni 2026</td>
                        <td className="py-3 max-w-xs truncate font-sans">Klasifikasi Sentimen Kuliah Hybrid Naive Bayes</td>
                        <td className="py-3 font-sans">Tomoliyus, M.Cs.</td>
                        <td className="py-3 font-mono font-bold text-blue-600">0.92</td>
                      </tr>
                      <tr>
                        <td className="py-3 font-mono text-[10px]">25 Juni 2026</td>
                        <td className="py-3 max-w-xs truncate font-sans">Sistem Keamanan Jaringan Firewall IDS Linux</td>
                        <td className="py-3 font-sans">Eko Setyawan, M.Kom.</td>
                        <td className="py-3 font-mono font-bold text-blue-600">0.78</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {user.role === "dosen" && (
            /* ==============================================================
               DOSEN DASHBOARD
               ============================================================== */
            <div className="space-y-6" id="dashboard-dosen">
              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Bimbingan Aktif</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">6 / 8</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Rekomendasi Baru</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">2</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Jejak Publikasi</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">{publications.length}</span>
                </div>
              </div>

              {/* Research Footprints (Lecturer database update) */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    Manajemen Jejak Digital (Profil Vektor Jurnal)
                  </h4>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Sistem AI melakukan update model pencarian semantik (vektor BERT) secara berkala berdasarkan publikasi jurnal di bawah ini. Tambahkan jurnal ilmiah baru Anda untuk memperkaya acuan AI.
                </p>

                {/* List publications */}
                <div className="space-y-2.5">
                  {publications.map((pub, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-100 hover:border-blue-50 hover:bg-blue-50/10 rounded-xl flex justify-between items-start gap-4">
                      <div className="flex gap-2">
                        <span className="font-bold text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded h-fit">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                          "{pub}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemovePublication(idx)}
                        className="p-1 hover:text-rose-500 text-slate-300 rounded cursor-pointer"
                        title="Hapus Jurnal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new publication form */}
                <form onSubmit={handleAddPublication} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newPub}
                    onChange={(e) => setNewPub(e.target.value)}
                    placeholder="Judul Jurnal Publikasi Baru (misal: Penerapan Deep Learning...)"
                    className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none"
                    id="input-new-publication"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 rounded-xl transition duration-150 flex items-center justify-center cursor-pointer"
                    id="btn-add-publication"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Waiting Approval requests */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-4">Daftar Mahasiswa Mengajukan Bimbingan</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-xs text-slate-800">Muhammad Aris Saputra</span>
                        <span className="bg-blue-100 text-blue-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded">Match 92%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mb-1">NIM: 220102034</p>
                      <p className="text-[11px] text-slate-600 italic leading-relaxed font-medium">
                        "Penerapan Algoritma Naive Bayes Untuk Klasifikasi Sentimen Kepuasan Mahasiswa Terhadap Pembelajaran Hybrid Di Universitas Duta Bangsa"
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
                        Terima
                      </button>
                      <button className="bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] font-semibold py-1.5 px-3 rounded-lg cursor-pointer">
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user.role === "kaprodi" && (
            /* ==============================================================
               KAPRODI DASHBOARD
               ============================================================== */
            <div className="space-y-6" id="dashboard-kaprodi">
              {/* Stats overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <FileText className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Total Pengajuan</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">{approvals.length}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Disetujui</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">
                    {approvals.filter(a => a.status === "approved").length}
                  </span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm text-center">
                  <AlertCircle className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wide">Menunggu Review</span>
                  <span className="text-xl font-extrabold text-slate-800 font-mono block mt-1">
                    {approvals.filter(a => a.status === "pending").length}
                  </span>
                </div>
              </div>

              {/* Topic distribution chart/visualization simulation */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Distribusi Bidang Penelitian Mahasiswa</h4>
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="font-semibold">Data Mining & Machine Learning</span>
                      <span className="font-mono font-bold">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="font-semibold">Web Development & GIS Spatial</span>
                      <span className="font-mono font-bold">25%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span className="font-semibold">Computer Vision & Image Processing</span>
                      <span className="font-mono font-bold">20%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: "20%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Approval Table */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-4">Meja Persetujuan Pencocokan AI (Kaprodi Desk)</h4>
                <div className="space-y-4">
                  {approvals.map((app) => (
                    <div key={app.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2.5 border-b border-slate-200/50">
                        <div>
                          <h5 className="font-bold text-slate-800 text-xs">{app.studentName}</h5>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">NIM: {app.nim}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">Rekomendasi AI:</span>
                          <span className="bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[10px] font-mono px-2 py-0.5 rounded-md">
                            {app.recommendedLecturer} ({Math.round(app.score * 100)}% Match)
                          </span>
                        </div>
                      </div>

                      <div className="text-xs">
                        <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider font-mono">Draf Judul Skripsi:</span>
                        <p className="text-slate-700 font-semibold italic mt-1 leading-relaxed">
                          "{app.topic}"
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400">Status: </span>
                          <span className={`text-[10px] font-bold uppercase font-mono ${
                            app.status === "approved" ? "text-emerald-600" : app.status === "rejected" ? "text-rose-600" : "text-amber-600"
                          }`}>
                            ● {app.status}
                          </span>
                        </div>

                        {app.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
