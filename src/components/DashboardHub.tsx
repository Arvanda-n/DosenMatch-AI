import { useState, FormEvent } from "react";
import { User, Lecturer } from "../types";
import { Award, Check, UserCheck, BookOpen, Plus, Sparkles, TrendingUp, Users, FileSpreadsheet, Trash2, CheckCircle, ChevronRight, FileText, AlertCircle, Menu, X, LogOut, Layers, User as UserIcon, Upload, Camera, Save, KeyRound } from "lucide-react";
import AnalysisWorkspace from "./AnalysisWorkspace";
import { useData } from "./DataContext";
import { motion, AnimatePresence } from "motion/react";

interface DashboardHubProps {
  user: User;
  onLogout: () => void;
  onSwitchRole: (role: "mahasiswa" | "dosen" | "kaprodi") => void;
  onUpdateUser: (updatedUser: User) => void;
}

export default function DashboardHub({ user, onLogout, onSwitchRole, onUpdateUser }: DashboardHubProps) {
  // Navigation tabs for student layout
  const [activeTab, setActiveTab] = useState<"dashboard" | "input-topik" | "riwayat" | "list-dosen">("dashboard");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchDosen, setSearchDosen] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string } | null>(null);

  // Profile Edit Local States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editAvatar, setEditAvatar] = useState(user.avatar || "");
  const [editPassword, setEditPassword] = useState(user.password || "123456789");
  const [isDragging, setIsDragging] = useState(false);

  const { lecturers, students, updateStudent, analysisHistory, addAnalysisHistory } = useData();

  // Change Password States
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setToast({ show: true, message: "Format tidak didukung. Silakan unggah file gambar (PNG, JPG, JPEG, atau SVG)." });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setEditAvatar(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

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

  // Dedicated fully responsive Student view with Top Navigation layout and custom styling
  if (user.role === "mahasiswa") {
    const studentHistory = analysisHistory.filter(item => 
      item.studentNim === user.nim_nidn || 
      (!item.studentNim && user.nim_nidn === "220102034")
    );
    const latestItem = studentHistory.length > 0 ? studentHistory[0] : null;

    const handleLockAndSubmit = () => {
      if (!latestItem) return;

      // Update student's official registered proposal topic, score, and status in global state
      const currentStudent = students.find(s => s.nim === user.nim_nidn);
      if (currentStudent) {
        updateStudent({
          ...currentStudent,
          judulProposal: latestItem.judul,
          matchScore: latestItem.skor,
          status: "Review Admin"
        });
      }

      // Also ensure that we re-push/sync to analysisHistory to ensure state update and immediate reactivity
      addAnalysisHistory({
        judul: latestItem.judul,
        dosenNama: latestItem.dosenNama,
        skor: latestItem.skor,
        studentNim: user.nim_nidn,
        studentNama: user.name
      });

      // Show beautiful modern toast notification
      setToast({
        show: true,
        message: "Berhasil! Topik dan rekomendasi dosen telah dikunci dan disimpan ke Riwayat."
      });

      // Hide toast after 4 seconds
      setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    const matchedLecturer = lecturers.find(l => l.nama.includes("Wijiyanto") || l.nama.includes("Afu")) || lecturers[0] || {
      nama: "Wijiyanto, S.Kom., M.Pd., M.Kom.",
      sintaId: "6042074",
      bidangKeahlian: ["Machine Learning", "Software Engineering", "Information System", "Computer Network"]
    };
    const networkLecturer = lecturers.find(l => l.nama.includes("Nurchim") || l.nama.includes("Joni")) || lecturers[4] || {
      nama: "Nurchim, S.Kom., M.Kom.",
      sintaId: "5975297",
      bidangKeahlian: ["Internet of Things", "Computer Network", "Wireless Network", "Smart System"]
    };

    return (
      <div className="min-h-screen bg-[#FAFAFA]" style={{ fontFamily: "'Poppins', sans-serif" }} id="student-view-root">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setActiveTab("dashboard")}>
              <svg viewBox="0 0 100 100" className="w-8 h-8">
                <rect width="100" height="100" rx="24" fill="#2563eb" />
                <line x1="50" y1="18" x2="50" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="60" x2="50" y2="82" stroke="white" strokeWidth="6" strokeLinecap="round" />
                <line x1="18" y1="50" x2="40" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
                <line x1="60" y1="50" x2="82" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="6" />
                <circle cx="50" cy="50" r="5" fill="white" />
              </svg>
              <span className="text-base font-extrabold text-slate-800 tracking-tight">
                DosenMatch<span className="text-blue-600">AI</span>
              </span>
            </div>

            {/* Center Section: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`text-xs font-semibold px-1 py-2 border-b-2 transition duration-150 cursor-pointer ${
                  activeTab === "dashboard"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("input-topik")}
                className={`text-xs font-semibold px-1 py-2 border-b-2 transition duration-150 cursor-pointer ${
                  activeTab === "input-topik"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Input Topik
              </button>
              <button
                onClick={() => setActiveTab("riwayat")}
                className={`text-xs font-semibold px-1 py-2 border-b-2 transition duration-150 cursor-pointer ${
                  activeTab === "riwayat"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Riwayat
              </button>
              <button
                onClick={() => setActiveTab("list-dosen")}
                className={`text-xs font-semibold px-1 py-2 border-b-2 transition duration-150 cursor-pointer ${
                  activeTab === "list-dosen"
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Daftar Dosen
              </button>
            </nav>

            {/* Right Section: Profile & Hamburger */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition duration-150 cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-blue-100 bg-slate-50"
                    referrerPolicy="no-referrer"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-700">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-90" : "rotate-0"}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl py-3.5 z-50 animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <div className="px-4 py-3 border-b border-slate-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <p className="text-xs font-bold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{user.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>NIM: {user.nim_nidn}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{user.email}</p>
                    </div>

                    <div className="px-2 pt-2 space-y-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      <button
                        onClick={() => {
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setShowProfileModal(true);
                          setIsProfileOpen(false);
                        }}
                        className="w-full text-left text-xs font-bold text-slate-700 hover:bg-slate-50 px-3 py-2.5 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                        Profil Saya
                      </button>
                      <button
                        onClick={onLogout}
                        className="w-full text-left text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Keluar Akun
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition duration-150 cursor-pointer border border-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-slate-100 px-4 py-3 space-y-2.5 shadow-md">
              <button
                onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }}
                className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setActiveTab("input-topik"); setIsMobileMenuOpen(false); }}
                className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === "input-topik" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Input Topik
              </button>
              <button
                onClick={() => { setActiveTab("riwayat"); setIsMobileMenuOpen(false); }}
                className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === "riwayat" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Riwayat
              </button>
              <button
                onClick={() => { setActiveTab("list-dosen"); setIsMobileMenuOpen(false); }}
                className={`w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer ${
                  activeTab === "list-dosen" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Daftar Dosen
              </button>
              <button
                onClick={() => { setShowProfileModal(true); setIsMobileMenuOpen(false); }}
                className="w-full text-left text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer text-slate-600 hover:bg-slate-50 flex items-center gap-2"
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-600" />
                Profil Saya
              </button>
            </div>
          )}
        </header>

        {/* SUBTAB RENDERS */}
        <main className="font-sans">
          {activeTab === "dashboard" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                  Selamat datang, {user.name}!
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Gunakan portal DosenMatch AI untuk menguji, memetakan, dan mengajukan topik riset skripsi Anda secara presisi.
                </p>
              </div>

              {/* Summary Cards Row (Responsive Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* Card 1 */}
                <div 
                  onClick={() => setActiveTab("riwayat")}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition duration-200 cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Analisis Topik</span>
                    <span className="text-2xl font-extrabold text-slate-800 font-mono mt-0.5 block">{studentHistory.length} Kali</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div 
                  onClick={() => setActiveTab("list-dosen")}
                  className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition duration-200 cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition duration-200">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Dosen Tersedia</span>
                    <span className="text-2xl font-extrabold text-slate-800 font-mono mt-0.5 block">{lecturers.length} Dosen</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center gap-4 hover:border-slate-200 hover:shadow-md transition duration-200">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Status Pengajuan</span>
                    {latestItem ? (
                      <span className="text-xs font-bold text-amber-600 mt-1 block uppercase bg-amber-50/50 border border-amber-100/50 px-2.5 py-0.5 rounded-full w-fit">
                        Review Kaprodi
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 mt-1 block uppercase bg-slate-50 border border-slate-150 px-2.5 py-0.5 rounded-full w-fit">
                        Belum Ada
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Grid Layout (Responsive Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* Left Column: Topik Skripsi Terakhir */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                   <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                       <FileText className="w-4 h-4 text-blue-600" />
                       Topik Skripsi Terakhir
                     </h3>
                     <span className="text-[10px] font-bold text-slate-400 font-mono">{latestItem ? latestItem.tanggal : "-"}</span>
                   </div>
                   {latestItem ? (
                     <div className="space-y-4">
                       <div>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Judul Usulan:</span>
                         <p className="text-sm font-bold text-slate-700 leading-relaxed italic mt-1">
                           "{latestItem.judul}"
                         </p>
                       </div>
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs font-medium">
                         <div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">NIM:</span>
                           <span className="text-slate-700">{user.nim_nidn}</span>
                         </div>
                         <div>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Program Studi:</span>
                           <span className="text-slate-700">Teknik Informatika (S1)</span>
                         </div>
                       </div>
                     </div>
                   ) : (
                     <div className="text-center py-10 text-slate-400 text-xs italic">
                       Belum ada riwayat pengujian topik skripsi.
                     </div>
                   )}
                </div>

                {/* Right Column: Rekomendasi Dosen & Persentase Kecocokan */}
                <div className="lg:col-span-5 bg-gradient-to-tr from-blue-50/30 via-indigo-50/15 to-blue-50/50 rounded-2xl border border-blue-100 p-6 shadow-sm space-y-5">
                   <div className="flex justify-between items-start">
                     <div className="flex items-center gap-2">
                       <Sparkles className="w-4 h-4 text-blue-600" />
                       <h3 className="font-bold text-blue-800 text-xs uppercase tracking-wider">
                         Rekomendasi Utama AI
                       </h3>
                     </div>
                     {latestItem ? (
                       <span className="bg-blue-600 text-white font-extrabold text-xs font-mono px-2.5 py-1 rounded-lg animate-pulse">
                         Match: {latestItem.skor}%
                       </span>
                     ) : (
                       <span className="bg-slate-200 text-slate-400 font-extrabold text-xs font-mono px-2.5 py-1 rounded-lg">
                         Match: -
                       </span>
                     )}
                   </div>
                   
                   {latestItem ? (
                     (() => {
                       const matchLec = lecturers.find(l => l.nama === latestItem.dosenNama) || {
                         sintaId: "6042074",
                         bidangKeahlian: ["Machine Learning", "Software Engineering", "Computer Network"]
                       };
                       return (
                         <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100/40 space-y-3">
                           <div>
                             <h4 className="font-bold text-slate-800 text-sm">{latestItem.dosenNama}</h4>
                             <p className="text-[10px] text-slate-400 font-mono mt-0.5">SINTA ID: {matchLec.sintaId || "6042074"} • Lektor</p>
                           </div>
                           <div className="text-[11px] text-slate-600 leading-relaxed">
                             <span className="font-semibold block text-[10px] text-slate-400 uppercase tracking-wider font-mono">Keahlian Pendukung:</span>
                             {Array.isArray(matchLec.bidangKeahlian) ? matchLec.bidangKeahlian.join(", ") : matchLec.bidangKeahlian}
                           </div>
                         </div>
                       );
                     })()
                   ) : (
                     <div className="bg-white/80 backdrop-blur-sm p-10 rounded-xl border border-blue-100/40 text-center text-slate-400 text-xs italic">
                       Belum ada rekomendasi dosen pembimbing.
                     </div>
                   )}

                   <button
                     disabled={!latestItem}
                     onClick={handleLockAndSubmit}
                     className={`w-full font-semibold text-xs py-2.5 px-4 rounded-xl transition duration-150 text-center shadow-md ${
                       latestItem
                         ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100 cursor-pointer"
                         : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                     }`}
                   >
                     Kunci & Ajukan Dosen Pembimbing
                   </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "input-topik" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
              <div className="space-y-1 mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Evaluasi & Analisis Topik Baru</h2>
                <p className="text-xs text-slate-400">Masukkan judul dan abstrak usulan topik skripsi Anda untuk mencocokkan secara semantik dengan keahlian dosen.</p>
              </div>
              <AnalysisWorkspace initialTitle="" initialAbstract="" onClearInitial={() => {}} currentUser={user} />
            </div>
          )}

          {activeTab === "riwayat" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Riwayat Pengujian & Analisis Topik</h2>
                <p className="text-xs text-slate-400">Daftar lengkap riwayat ekstraksi terminologi skripsi Anda beserta kecocokan dosen pembimbing.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[9px] tracking-wider">
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Judul Topik Skripsi</th>
                        <th className="py-3 px-4">Rekomendasi Utama</th>
                        <th className="py-3 px-4 text-center">Skor Kecocokan</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                      {studentHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 px-4 text-center text-slate-400 text-xs italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            Belum ada riwayat pengujian topik skripsi.
                          </td>
                        </tr>
                      ) : (
                        studentHistory.map((item, idx) => (
                          <tr key={item.id} style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <td className="py-4 px-4 font-mono text-[10px] text-slate-400">{item.tanggal}</td>
                            <td className="py-4 px-4 max-w-sm font-sans truncate text-slate-700 italic font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              "{item.judul}"
                            </td>
                            <td className="py-4 px-4 font-sans font-bold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.dosenNama}</td>
                            <td className="py-4 px-4 text-center">
                              <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg">{item.skor}%</span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className={`font-bold text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${
                                idx === 0 
                                  ? "bg-amber-50 text-amber-700 border-amber-100" 
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                                {idx === 0 ? "Review Kaprodi" : "Arsip Uji"}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {studentHistory.length === 0 ? (
                    <div className="bg-slate-50/50 p-8 rounded-xl border border-slate-100 text-center text-slate-400 text-xs italic" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Belum ada riwayat pengujian topik skripsi.
                    </div>
                  ) : (
                    studentHistory.map((item, idx) => (
                      <div key={item.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                          <span>{item.tanggal}</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full border uppercase ${
                            idx === 0 
                              ? "bg-amber-50 text-amber-700 border-amber-100" 
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {idx === 0 ? "Review Kaprodi" : "Arsip Uji"}
                          </span>
                        </div>
                        <p className="text-xs font-semibold italic text-slate-700 leading-relaxed font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          "{item.judul}"
                        </p>
                        <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
                          <div style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <span className="text-[9px] text-slate-400 block font-mono">Dosen Rekomendasi:</span>
                            <span className="font-bold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.dosenNama}</span>
                          </div>
                          <span className="bg-blue-600 text-white font-bold font-mono px-2 py-0.5 rounded-md">{item.skor}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "list-dosen" && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Daftar Dosen & Bidang Keahlian</h2>
                  <p className="text-xs text-slate-400">Eksplorasi seluruh dosen pembimbing Universitas Duta Bangsa beserta klaster penelitian mereka.</p>
                </div>
                <div className="relative max-w-sm w-full">
                  <input
                    type="text"
                    placeholder="Cari dosen atau keahlian..."
                    value={searchDosen}
                    onChange={(e) => setSearchDosen(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition duration-150 shadow-sm"
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const filteredLecturers = lecturers.filter((l) =>
                    l.nama.toLowerCase().includes(searchDosen.toLowerCase()) ||
                    l.bidangKeahlian.some((k) => k.toLowerCase().includes(searchDosen.toLowerCase()))
                  );
                  if (filteredLecturers.length === 0) {
                    return (
                      <div className="col-span-full py-12 text-center text-slate-400 text-xs italic bg-white rounded-2xl border border-slate-100">
                        Tidak ditemukan dosen dengan nama atau keahlian tersebut.
                      </div>
                    );
                  }
                  return filteredLecturers.map((lec) => (
                    <div key={lec.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:border-blue-100 hover:shadow-md transition duration-200 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{lec.nama}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">SINTA ID: {lec.sintaId || "-"}</p>
                          </div>
                          <span className="bg-blue-50 text-blue-600 font-extrabold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                            Dosen
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Bidang Keahlian:</span>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {lec.bidangKeahlian.map((keahlian, kIdx) => (
                              <span key={kIdx} className="bg-slate-50 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-100">
                                {keahlian}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {lec.matchedPublication && (
                        <div className="pt-3 border-t border-slate-100 space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Publikasi Utama:</span>
                          <p className="text-[11px] text-slate-600 italic leading-relaxed line-clamp-2">
                            "{lec.matchedPublication}"
                          </p>
                          {lec.matchedPublicationLink && (
                            <a
                              href={lec.matchedPublicationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-700 font-semibold pt-1 cursor-pointer"
                            >
                              Detail Publikasi
                              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            </div>
          )}

          {activeTab === "profil" && (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Profil Mahasiswa</h2>
                <p className="text-xs text-slate-400">Informasi akademik resmi dan ringkasan aktivitas riset skripsi Anda.</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header Banner */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                  <div className="absolute -bottom-10 left-8">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Profile Details */}
                <div className="pt-14 pb-8 px-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{user.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">NIM: {user.nim_nidn} • S1 Teknik Informatika</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Academic Information */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Informasi Akademik</h4>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Program Studi</span>
                          <span className="font-bold text-slate-700">Teknik Informatika (S1)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Fakultas</span>
                          <span className="font-bold text-slate-700">Fakultas Ilmu Komputer</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Tahun Angkatan</span>
                          <span className="font-bold text-slate-700">2022</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Status</span>
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100">
                            Aktif
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Email</span>
                          <span className="font-semibold text-slate-700">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Research Summary */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ringkasan Aktivitas Skripsi</h4>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Total Analisis</span>
                          <span className="font-bold text-slate-700">{analysisHistory.length} Kali</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Topik Terakhir</span>
                          <span className="font-semibold text-slate-700 max-w-[150px] truncate block text-right text-ellipsis overflow-hidden" title={latestItem ? latestItem.judul : "Belum ada"}>
                            {latestItem ? `"${latestItem.judul}"` : "Belum ada"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Rekomendasi Dosen</span>
                          <span className="font-bold text-slate-700 text-right">{latestItem ? latestItem.dosenNama : "Belum ada"}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Skor Kecocokan</span>
                          <span className={`font-bold ${latestItem ? "text-blue-600" : "text-slate-700"}`}>
                            {latestItem ? `${latestItem.skor}%` : "Belum ada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {showProfileModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-scale-up">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setIsEditingProfile(false);
                }}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md text-slate-500 hover:text-slate-800 p-2 rounded-full border border-slate-200/50 shadow-sm z-50 transition duration-150 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <div className="absolute -bottom-10 left-8">
                  <div className="relative group">
                    <img
                      src={isEditingProfile
                        ? (editAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName || 'User')}&backgroundColor=2563eb`)
                        : (user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=2563eb`)}
                      alt={user.name}
                      className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 shadow-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isEditingProfile && (
                      <label htmlFor="avatar-upload-input" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition duration-150">
                        <Camera className="w-5 h-5" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="pt-14 pb-8 px-8 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{isEditingProfile ? "Edit Profil Saya" : user.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {user.role === "mahasiswa" ? `NIM: ${user.nim_nidn}` : `NIDN: ${user.nim_nidn}`} • S1 Teknik Informatika
                    </p>
                  </div>
                  
                  {!isEditingProfile && (
                    <button
                      onClick={() => {
                        setEditName(user.name);
                        setEditAvatar(user.avatar || "");
                        setEditPassword(user.password || "123456789");
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setIsEditingProfile(true);
                      }}
                      className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer border border-blue-100/50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Edit Profil
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="space-y-5 animate-fade-in text-xs">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Nama Lengkap</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-medium"
                        placeholder="Nama Lengkap"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Upload Photo (Drag and Drop / Click) */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Unggah Foto Profil</label>
                        <input
                          type="file"
                          id="avatar-upload-input"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageFile(file);
                          }}
                        />
                        <div
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleImageFile(file); }}
                          className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2.5 transition duration-150 min-h-[140px] ${
                            isDragging
                              ? "border-blue-500 bg-blue-50/50 animate-pulse"
                              : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                          }`}
                        >
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-700">Seret & Lepas Gambar</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">atau <label htmlFor="avatar-upload-input" className="text-blue-600 hover:underline cursor-pointer font-semibold">pilih file</label></p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Select & Reset Photo */}
                      <div className="space-y-3.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Preset atau Atur Ulang</label>
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 min-h-[140px] flex flex-col justify-between">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 font-mono block">Pilih Karakter Cepat:</span>
                            <div className="flex gap-2">
                              {["Aris", "Wijiyanto", "Dwi", "Arva"].map((seed) => {
                                const presetUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=2563eb`;
                                return (
                                  <button
                                    key={seed}
                                    type="button"
                                    onClick={() => setEditAvatar(presetUrl)}
                                    className={`w-10 h-10 rounded-full overflow-hidden border-2 transition duration-150 cursor-pointer ${
                                      editAvatar === presetUrl ? "border-blue-600 scale-105 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                  >
                                    <img src={presetUrl} alt={seed} className="w-full h-full object-cover" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName || 'User')}&backgroundColor=2563eb`)}
                              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition duration-150 cursor-pointer text-center"
                            >
                              Inisial Nama
                            </button>
                            {editAvatar && (
                              <button
                                type="button"
                                onClick={() => setEditAvatar("")}
                                className="bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition duration-150 cursor-pointer"
                              >
                                Hapus Foto
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Password Edit Section with Old, New and Confirm Password fields */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                        <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                        Ubah Kata Sandi Akses (Opsional)
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500">Kata Sandi Lama</label>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium"
                            placeholder="Masukkan kata sandi lama"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">Kata Sandi Baru</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium"
                              placeholder="Min. 6 karakter"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500">Konfirmasi Sandi Baru</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium"
                              placeholder="Ulangi sandi baru"
                            />
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-normal">
                          *Kosongkan jika Anda tidak ingin mengubah kata sandi Anda. Kata sandi default adalah <span className="font-mono text-blue-600 font-bold">123456789</span>.
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          setIsEditingProfile(false);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!editName.trim()) {
                            setToast({ show: true, message: "Nama tidak boleh kosong!" });
                            setTimeout(() => setToast(null), 4000);
                            return;
                          }

                          const currentStudent = students.find(s => s.nim === user.nim_nidn);
                          const currentDbPassword = currentStudent?.password || user.password || "123456789";
                          let targetPassword = currentDbPassword;

                          // Password Change Validation
                          if (oldPassword || newPassword || confirmPassword) {
                            if (!oldPassword) {
                              setToast({ show: true, message: "Gagal! Silakan masukkan Kata Sandi Lama untuk melakukan perubahan sandi." });
                              setTimeout(() => setToast(null), 4000);
                              return;
                            }
                            if (oldPassword !== currentDbPassword) {
                              setToast({ show: true, message: "Gagal! Kata Sandi Lama salah." });
                              setTimeout(() => setToast(null), 4000);
                              return;
                            }
                            if (!newPassword.trim()) {
                              setToast({ show: true, message: "Gagal! Kata Sandi Baru tidak boleh kosong." });
                              setTimeout(() => setToast(null), 4000);
                              return;
                            }
                            if (newPassword.length < 6) {
                              setToast({ show: true, message: "Gagal! Kata Sandi Baru minimal harus 6 karakter." });
                              setTimeout(() => setToast(null), 4000);
                              return;
                            }
                            if (newPassword !== confirmPassword) {
                              setToast({ show: true, message: "Gagal! Konfirmasi Kata Sandi Baru tidak cocok." });
                              setTimeout(() => setToast(null), 4000);
                              return;
                            }
                            targetPassword = newPassword;
                          }

                          if (currentStudent) {
                            updateStudent({
                              ...currentStudent,
                              nama: editName.trim(),
                              password: targetPassword
                            });
                          }

                          onUpdateUser({
                            ...user,
                            name: editName.trim(),
                            avatar: editAvatar || undefined,
                            password: targetPassword
                          });

                          // Reset temporary password states
                          setOldPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                          
                          setIsEditingProfile(false);
                          setToast({ show: true, message: "Berhasil! Profil dan kata sandi Anda telah diperbarui secara permanen." });
                          setTimeout(() => setToast(null), 4000);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-blue-100"
                      >
                        <Save className="w-3.5 h-3.5" />
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Academic Information */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Informasi Akademik</h4>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Program Studi</span>
                          <span className="font-bold text-slate-700">Teknik Informatika (S1)</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Fakultas</span>
                          <span className="font-bold text-slate-700">Fakultas Ilmu Komputer</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">{user.role === "mahasiswa" ? "Tahun Angkatan" : "Jabatan"}</span>
                          <span className="font-bold text-slate-700">{user.role === "mahasiswa" ? "2022" : "Dosen Tetap / Lektor"}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Status</span>
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100">
                            Aktif
                          </span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-slate-500">Email</span>
                          <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={user.email}>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Research/Lecturer Summary */}
                    {user.role === "mahasiswa" ? (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Ringkasan Aktivitas Skripsi</h4>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Total Analisis</span>
                            <span className="font-bold text-slate-700">{analysisHistory.length} Kali</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Topik Terakhir</span>
                            <span className="font-semibold text-slate-700 max-w-[150px] truncate block text-right text-ellipsis overflow-hidden" title={latestItem ? latestItem.judul : "Belum ada"}>
                              {latestItem ? `"${latestItem.judul}"` : "Belum ada"}
                            </span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Rekomendasi Dosen</span>
                            <span className="font-bold text-slate-700 text-right">{latestItem ? latestItem.dosenNama : "Belum ada"}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-500">Skor Kecocokan</span>
                            <span className={`font-bold ${latestItem ? "text-blue-600" : "text-slate-700"}`}>
                              {latestItem ? `${latestItem.skor}%` : "Belum ada"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Aktivitas Akademik Dosen</h4>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Bimbingan Aktif</span>
                            <span className="font-bold text-slate-700">6 Mahasiswa</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Total Publikasi Jurnal</span>
                            <span className="font-bold text-slate-700">{publications.length} Paper</span>
                          </div>
                          <div className="flex justify-between py-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Keahlian Utama</span>
                            <span className="font-bold text-blue-600 text-right text-ellipsis overflow-hidden truncate max-w-[150px]">Machine Learning, Data Science</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-slate-500">Status Validasi</span>
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                              Terverifikasi SINTA
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 max-w-md"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <div className="bg-slate-950/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3.5">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-[11px] font-bold tracking-wider uppercase text-blue-400 font-mono">Notifikasi</h5>
                  <p className="text-xs font-semibold leading-relaxed text-slate-200 mt-0.5">
                    {toast.message}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg transition duration-150 cursor-pointer bg-slate-800 text-slate-400 hover:text-slate-200"
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
                NIDN: {user.nim_nidn}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                {user.email}
              </p>

              <button
                onClick={() => {
                  setEditName(user.name);
                  setEditAvatar(user.avatar || "");
                  setEditPassword(user.password || "123456789");
                  setIsEditingProfile(false);
                  setShowProfileModal(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-[10px] py-1.5 px-3.5 rounded-lg transition duration-150 cursor-pointer border border-blue-100/30"
              >
                <Camera className="w-3.5 h-3.5" />
                Edit Foto & Profil
              </button>
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
          {user.role === "dosen" && (
            /* ==============================================================
               DOSEN DASHBOARD
               ============================================================== */
            <div className="space-y-6" id="dashboard-dosen">
              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Render Profile Modal and Toast for Dosen/Kaprodi view */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-scale-up">
            {/* Close button */}
            <button
              onClick={() => {
                setShowProfileModal(false);
                setIsEditingProfile(false);
              }}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-md text-slate-500 hover:text-slate-800 p-2 rounded-full border border-slate-200/50 shadow-sm z-50 transition duration-150 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
              <div className="absolute -bottom-10 left-8">
                <div className="relative group">
                  <img
                    src={isEditingProfile
                      ? (editAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName || 'User')}&backgroundColor=2563eb`)
                      : (user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=2563eb`)}
                    alt={user.name}
                    className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 shadow-md object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isEditingProfile && (
                    <label htmlFor="avatar-upload-input" className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition duration-150">
                      <Camera className="w-5 h-5" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="pt-14 pb-8 px-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{isEditingProfile ? "Edit Profil Saya" : user.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    NIDN: {user.nim_nidn} • S1 Teknik Informatika
                  </p>
                </div>
                
                {!isEditingProfile && (
                  <button
                    onClick={() => {
                      setEditName(user.name);
                      setEditAvatar(user.avatar || "");
                      setEditPassword(user.password || "123456789");
                      setIsEditingProfile(true);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer border border-blue-100/50"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Edit Profil
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-5 animate-fade-in text-xs">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-medium"
                      placeholder="Nama Lengkap"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Upload Photo (Drag and Drop / Click) */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Unggah Foto Profil</label>
                      <input
                        type="file"
                        id="avatar-upload-input"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file);
                        }}
                      />
                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) handleImageFile(file); }}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center gap-2.5 transition duration-150 min-h-[140px] ${
                          isDragging
                            ? "border-blue-500 bg-blue-50/50 animate-pulse"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                        }`}
                      >
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shrink-0">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-700">Seret & Lepas Gambar</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">atau <label htmlFor="avatar-upload-input" className="text-blue-600 hover:underline cursor-pointer font-semibold">pilih file</label></p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Select & Reset Photo */}
                    <div className="space-y-3.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">Preset atau Atur Ulang</label>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3 min-h-[140px] flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 font-mono block">Pilih Karakter Cepat:</span>
                          <div className="flex gap-2">
                            {["Aris", "Wijiyanto", "Dwi", "Arva"].map((seed) => {
                              const presetUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=2563eb`;
                              return (
                                <button
                                  key={seed}
                                  type="button"
                                  onClick={() => setEditAvatar(presetUrl)}
                                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition duration-150 cursor-pointer ${
                                    editAvatar === presetUrl ? "border-blue-600 scale-105 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"
                                  }`}
                                >
                                  <img src={presetUrl} alt={seed} className="w-full h-full object-cover" />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditAvatar(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(editName || 'User')}&backgroundColor=2563eb`)}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition duration-150 cursor-pointer text-center"
                          >
                            Inisial Nama
                          </button>
                          {editAvatar && (
                            <button
                              type="button"
                              onClick={() => setEditAvatar("")}
                              className="bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 font-bold text-[10px] py-1.5 px-2.5 rounded-lg transition duration-150 cursor-pointer"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Edit Section */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Kata Sandi Baru</label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 outline-none font-medium"
                      placeholder="Masukkan kata sandi baru"
                    />
                    <p className="text-[10px] text-slate-400">Kata sandi default untuk mahasiswa baru adalah <span className="font-mono text-blue-600 font-bold">123456789</span>. Ubah untuk menjaga keamanan akun Anda.</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editName.trim()) {
                          setToast({ show: true, message: "Nama tidak boleh kosong!" });
                          setTimeout(() => setToast(null), 4000);
                          return;
                        }
                        onUpdateUser({
                          ...user,
                          name: editName.trim(),
                          avatar: editAvatar || undefined,
                          password: editPassword
                        });
                        setIsEditingProfile(false);
                        setToast({ show: true, message: "Berhasil! Profil dan kata sandi Anda telah diperbarui." });
                        setTimeout(() => setToast(null), 4000);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-blue-100"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Academic Information */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Informasi Akademik</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Program Studi</span>
                        <span className="font-bold text-slate-700">Teknik Informatika (S1)</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Fakultas</span>
                        <span className="font-bold text-slate-700">Fakultas Ilmu Komputer</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Jabatan</span>
                        <span className="font-bold text-slate-700">Dosen Tetap / Lektor</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Status</span>
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-green-100">
                          Aktif
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Email</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[120px]" title={user.email}>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Lecturer Summary */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Aktivitas Akademik Dosen</h4>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Bimbingan Aktif</span>
                        <span className="font-bold text-slate-700">6 Mahasiswa</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Total Publikasi Jurnal</span>
                        <span className="font-bold text-slate-700">{publications.length} Paper</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Keahlian Utama</span>
                        <span className="font-bold text-blue-600 text-right text-ellipsis overflow-hidden truncate max-w-[150px]">Machine Learning, Data Science</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500">Status Validasi</span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                          Terverifikasi SINTA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <div className="bg-slate-950/95 backdrop-blur-md text-white px-5 py-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3.5">
              <div className="p-2 bg-blue-50/10 text-blue-400 rounded-xl border border-blue-50/20 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[11px] font-bold tracking-wider uppercase text-blue-400 font-mono">Notifikasi</h5>
                <p className="text-xs font-semibold leading-relaxed text-slate-200 mt-0.5">
                  {toast.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
