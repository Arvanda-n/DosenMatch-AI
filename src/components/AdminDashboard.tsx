import React, { useState } from "react";
import { useData, LecturerData, StudentData } from "./DataContext";
import { User } from "../types";
import {
  LayoutDashboard,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  BarChart3,
  User as UserIcon,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Search,
  CheckCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  X
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from "recharts";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type MenuType =
  | "dashboard"
  | "lecturers"
  | "expertise"
  | "publications"
  | "students";

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const {
    lecturers,
    addLecturer,
    updateLecturer,
    deleteLecturer,
    fieldsOfExpertise,
    addFieldOfExpertise,
    deleteFieldOfExpertise,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    matchLogs,
    analysisHistory,
  } = useData();

  const [activeMenu, setActiveMenu] = useState<MenuType>("dashboard");

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Modals / Form state
  const [isLecturerModalOpen, setIsLecturerModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<LecturerData | null>(null);
  const [lecForm, setLecForm] = useState({
    nama: "",
    sintaId: "",
    bidangKeahlian: "",
    matchedPublication: "",
    matchedPublicationLink: "",
  });

  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [editingPubLec, setEditingPubLec] = useState<LecturerData | null>(null);
  const [pubForm, setPubForm] = useState({
    matchedPublication: "",
    matchedPublicationLink: "",
  });

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [studentForm, setStudentForm] = useState({
    nama: "",
    nim: "",
    email: "",
    prodi: "Teknik Informatika",
    judulProposal: "",
    matchScore: 85,
    status: "Siap Konsultasi",
    password: "123456789",
  });

  const [newExpertise, setNewExpertise] = useState("");

  // Admin Profile edit state
  const [adminName, setAdminName] = useState(user.name);
  const [adminEmail, setAdminEmail] = useState(user.email);
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // --- HANDLERS FOR LECTURERS ---
  const handleOpenAddLec = () => {
    setEditingLecturer(null);
    setLecForm({
      nama: "",
      sintaId: "",
      bidangKeahlian: "",
      matchedPublication: "",
      matchedPublicationLink: "",
    });
    setIsLecturerModalOpen(true);
  };

  const handleOpenEditLec = (lec: LecturerData) => {
    setEditingLecturer(lec);
    setLecForm({
      nama: lec.nama,
      sintaId: lec.sintaId || "",
      bidangKeahlian: lec.bidangKeahlian ? lec.bidangKeahlian.join(", ") : "",
      matchedPublication: lec.matchedPublication || "",
      matchedPublicationLink: lec.matchedPublicationLink || "",
    });
    setIsLecturerModalOpen(true);
  };

  const handleSaveLecturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lecForm.nama) return;

    const expertiseArray = lecForm.bidangKeahlian
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k !== "");

    if (editingLecturer) {
      updateLecturer({
        ...editingLecturer,
        nama: lecForm.nama,
        sintaId: lecForm.sintaId,
        bidangKeahlian: expertiseArray,
        matchedPublication: lecForm.matchedPublication,
        matchedPublicationLink: lecForm.matchedPublicationLink,
      });
    } else {
      addLecturer({
        nama: lecForm.nama,
        sintaId: lecForm.sintaId,
        bidangKeahlian: expertiseArray,
        matchedPublication: lecForm.matchedPublication,
        matchedPublicationLink: lecForm.matchedPublicationLink,
      });
    }
    setIsLecturerModalOpen(false);
  };

  const handleDeleteLec = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data dosen ini?")) {
      deleteLecturer(id);
    }
  };

  // --- HANDLERS FOR PUBLICATIONS ---
  const handleOpenEditPub = (lec: LecturerData) => {
    setEditingPubLec(lec);
    setPubForm({
      matchedPublication: lec.matchedPublication || "",
      matchedPublicationLink: lec.matchedPublicationLink || "",
    });
    setIsPubModalOpen(true);
  };

  const handleSavePub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPubLec || !pubForm.matchedPublication) return;

    updateLecturer({
      ...editingPubLec,
      matchedPublication: pubForm.matchedPublication,
      matchedPublicationLink: pubForm.matchedPublicationLink,
    });
    setIsPubModalOpen(false);
  };

  // --- HANDLERS FOR STUDENTS ---
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({
      nama: "",
      nim: "",
      email: "",
      prodi: "Teknik Informatika",
      judulProposal: "",
      matchScore: 85,
      status: "Siap Konsultasi",
      password: "123456789",
    });
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (std: StudentData) => {
    setEditingStudent(std);
    setStudentForm({
      nama: std.nama,
      nim: std.nim,
      email: std.email,
      prodi: std.prodi,
      judulProposal: std.judulProposal,
      matchScore: std.matchScore,
      status: std.status,
      password: std.password || "123456789",
    });
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.nama || !studentForm.nim) return;

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        nama: studentForm.nama,
        nim: studentForm.nim,
        email: studentForm.email || `${studentForm.nim}@student.udb.ac.id`,
        prodi: studentForm.prodi,
        judulProposal: studentForm.judulProposal,
        matchScore: Number(studentForm.matchScore),
        status: studentForm.status,
        password: studentForm.password || "123456789",
      });
    } else {
      addStudent({
        nama: studentForm.nama,
        nim: studentForm.nim,
        email: studentForm.email || `${studentForm.nim}@student.udb.ac.id`,
        prodi: studentForm.prodi,
        judulProposal: studentForm.judulProposal,
        matchScore: Number(studentForm.matchScore),
        status: studentForm.status,
        password: studentForm.password || "123456789",
      });
    }
    setIsStudentModalOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
      deleteStudent(id);
    }
  };

  // --- HANDLERS FOR EXPERTISE ---
  const handleAddExpertise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpertise.trim()) return;
    addFieldOfExpertise(newExpertise);
    setNewExpertise("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2000);
  };

  // --- FILTERED DATA FOR TABLES ---
  const filteredLecturers = lecturers.filter(
    (l) =>
      l.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.sintaId && l.sintaId.includes(searchTerm)) ||
      (l.bidangKeahlian && l.bidangKeahlian.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nim.includes(searchTerm) ||
      s.judulProposal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- STATS COMPUTATION FOR CHARTS ---
  // Distribution of Keywords (top keywords)
  const getKeywordStats = () => {
    const counts: { [key: string]: number } = {};
    lecturers.forEach((l) => {
      if (l.bidangKeahlian) {
        l.bidangKeahlian.forEach((k) => {
          counts[k] = (counts[k] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  };

  // Status Distribution of Students
  const getStudentStatusStats = () => {
    const counts: { [key: string]: number } = {};
    students.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const COLORS = ["#2563eb", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 justify-between sticky top-0 h-screen">
        <div>
          {/* Header Brand */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center gap-3">
            <svg viewBox="0 0 100 100" className="w-7 h-7">
              <rect width="100" height="100" rx="24" fill="#2563eb" />
              <line x1="50" y1="18" x2="50" y2="40" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <line x1="50" y1="60" x2="50" y2="82" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <line x1="18" y1="50" x2="40" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <line x1="60" y1="50" x2="82" y2="50" stroke="white" strokeWidth="6" strokeLinecap="round" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="white" strokeWidth="6" />
              <circle cx="50" cy="50" r="5" fill="white" />
            </svg>
            <span className="font-extrabold text-slate-800 tracking-tight text-sm">
              DosenMatch <span className="text-blue-600">Admin</span>
            </span>
          </div>

          {/* Admin Info Profile Summary */}
          <div className="p-4 mx-3 my-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xs">
              AD
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-800 truncate">{adminName}</h4>
              <span className="text-[10px] text-slate-400 font-medium">Administrator</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard Admin", icon: LayoutDashboard },
              { id: "lecturers", label: "Kelola Dosen", icon: Users },
              { id: "expertise", label: "Kelola Bidang Keahlian", icon: Award },
              { id: "publications", label: "Kelola Penelitian Dosen", icon: BookOpen },
              { id: "students", label: "Kelola Mahasiswa", icon: GraduationCap },
            ].map((menu) => {
              const Icon = menu.icon;
              const isActive = activeMenu === menu.id;
              return (
                <button
                  key={menu.id}
                  onClick={() => {
                    setActiveMenu(menu.id as MenuType);
                    setSearchTerm("");
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-150 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-100/50"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* TOP HUB BAR */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sistem Penjaminan Mutu Akademik</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-xs text-slate-600 font-bold capitalize">{activeMenu.replace("-", " ")}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold font-mono border border-blue-100/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              ADMINISTRATIVE MODE
            </span>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="p-8 flex-1 overflow-auto max-w-7xl w-full mx-auto">
          {/* ==================== 1. MENU: DASHBOARD ADMIN ==================== */}
          {activeMenu === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Overview Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Metrik sistem pencocokan skripsi mahasiswa dan data keahlian dosen Teknik Informatika UDB.
                  </p>
                </div>
              </div>

              {/* Status Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Dosen TI</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{lecturers.length}</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Berdasarkan data publikasi SINTA</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Bidang Keahlian</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{fieldsOfExpertise.length}</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Kategori riset terindeks</p>
                  </div>
                  <div className="w-10 h-10 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center border border-cyan-100/50">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Mahasiswa Terdaftar</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{students.length}</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Sistem bimbingan aktif</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100/50">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Pencocokan AI</span>
                    <span className="text-2xl font-extrabold text-slate-800 mt-1 block">156</span>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">98.6% Success Rate</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100/50">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* CHARTS CONTAINER */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Bar Chart: Top Keywords */}
                <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Frekuensi Kata Kunci Riset Dosen Teratas
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getKeywordStats()} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 9 }} stroke="#94a3b8" />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12, border: "1px solid #e2e8f0" }} />
                        <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]}>
                          {getKeywordStats().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Pie Chart: Student Status */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-5 pb-3 border-b border-slate-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Status Kelayakan Mahasiswa (%)
                  </h3>
                  <div className="h-72 flex flex-col justify-between">
                    <div className="h-56 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getStudentStatusStats()}
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {getStudentStatusStats().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-4 text-[10px] font-bold font-mono">
                      {getStudentStatusStats().map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          <span className="text-slate-600">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Live matching logs & Recent System updates */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Log Aktivitas Pencocokan AI</h3>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2 py-0.5 rounded border border-emerald-100/30">
                      SISTEM SEHAT
                    </span>
                  </div>

                  <div className="space-y-3">
                    {matchLogs.map((log) => (
                      <div key={log.id} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100/60 rounded-xl text-xs hover:border-slate-200 transition">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            AI
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 line-clamp-1">{log.judul}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                              Selesai dalam {log.durationMs}ms • {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span className="bg-emerald-100/60 text-emerald-700 text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                          {log.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                      Sains & Sinkronisasi
                    </h3>
                    <div className="space-y-4 text-xs">
                      <div className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-800">State Tunggal Terpusat</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            Semua pembaruan pada data dosen, jurnal, dan kata kunci di panel ini secara instan merefleksikan hasil analisis pencocokan AI mahasiswa.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-bold text-slate-800">Data Riil Universitas</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            Dataset utama terdiri dari 20 dosen asli Program Studi Teknik Informatika, Universitas Duta Bangsa Surakarta.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>DosenMatch Backend v2.1</span>
                    <span>UDB FIKOM</span>
                  </div>
                </div>
              </div>

              {/* Monitoring Pengajuan Terkini */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Monitoring Pengajuan Terkini (Semua Mahasiswa)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-bold px-2.5 py-0.5 rounded border border-blue-100/30">
                    {analysisHistory.length} Pengajuan
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-4">Tanggal</th>
                        <th className="py-3 px-4">Nama Mahasiswa</th>
                        <th className="py-3 px-4">Judul Topik Skripsi</th>
                        <th className="py-3 px-4">Rekomendasi Utama Dosen</th>
                        <th className="py-3 px-4 text-center">Skor Kecocokan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {analysisHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 text-xs italic">
                            Belum ada riwayat pengajuan atau pencocokan dari mahasiswa.
                          </td>
                        </tr>
                      ) : (
                        analysisHistory.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/50 transition duration-150">
                            <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                              {item.tanggal}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800">{item.studentNama || "Muhammad Aris Saputra"}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{item.studentNim || "220102034"}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 max-w-sm font-semibold italic text-slate-700 leading-relaxed">
                              "{item.judul}"
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-800">{item.dosenNama}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="font-mono font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-1 rounded-lg">
                                {item.skor}%
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 2. MENU: KELOLA DOSEN ==================== */}
          {activeMenu === "lecturers" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Database Dosen</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Tambah, perbarui, atau hapus dosen penilai skripsi beserta data NIDN serta kompetensinya.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddLec}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm shadow-blue-100 transition duration-150"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Dosen Baru
                </button>
              </div>

              {/* SEARCH FILTERS */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari NIDN, Nama Dosen, atau Bidang Keahlian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* DATA TABLE */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-6">ID</th>
                        <th className="py-3.5 px-6">SINTA ID</th>
                        <th className="py-3.5 px-6">Nama Dosen</th>
                        <th className="py-3.5 px-6">Bidang Keahlian (Badges)</th>
                        <th className="py-3.5 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                      {filteredLecturers.length > 0 ? (
                        filteredLecturers.map((lec) => (
                          <tr key={lec.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 font-mono font-bold text-slate-400">#{lec.id}</td>
                            <td className="py-4 px-6 font-mono font-bold text-blue-600 bg-blue-50/20 rounded">
                              {lec.sintaId || "-"}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">{lec.nama}</td>
                            <td className="py-4 px-6 text-slate-500">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {lec.bidangKeahlian && lec.bidangKeahlian.map((tag, idx) => (
                                  <span key={idx} className="bg-slate-100 text-slate-700 font-bold text-[9px] px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditLec(lec)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition inline-flex items-center"
                                title="Edit Dosen"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteLec(lec.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition inline-flex items-center"
                                title="Hapus Dosen"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400">
                            Tidak ada data dosen yang sesuai dengan pencarian Anda.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. MENU: KELOLA BIDANG KEAHLIAN ==================== */}
          {activeMenu === "expertise" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Bidang Keahlian</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Keahlian unik diekstrak secara dinamis dari database dosen riil. Anda dapat menambahkan keahlian baru secara manual.
                </p>
              </div>

              {/* ADD EXPERTISE FORM */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 pb-3 border-b border-slate-100">
                  Tambah Bidang Keahlian Baru
                </h3>
                <form onSubmit={handleAddExpertise} className="flex gap-3 max-w-lg">
                  <input
                    type="text"
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Contoh: Blockchain, YOLO v8, Deep NLP..."
                    className="flex-1 bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-700 outline-none font-medium transition"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition duration-150"
                  >
                    Tambah Keahlian
                  </button>
                </form>
              </div>

              {/* LIST EXPERTISE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fieldsOfExpertise.map((field) => (
                  <div
                    key={field}
                    className="bg-white border border-slate-100 hover:border-blue-100 rounded-2xl p-4 shadow-sm flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100/30">
                        #
                      </div>
                      <span className="text-xs font-bold text-slate-700">{field}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus bidang keahlian "${field}"?`)) {
                          deleteFieldOfExpertise(field);
                        }
                      }}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-lg cursor-pointer transition opacity-0 group-hover:opacity-100"
                      title="Hapus Keahlian"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 4. MENU: KELOLA PENELITIAN DOSEN ==================== */}
          {activeMenu === "publications" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Jurnal & Penelitian Dosen</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Atur judul penelitian, draf abstrak acuan, dan kata kunci penelitian dosen untuk sinkronisasi algoritma pencocokan AI.
                </p>
              </div>

              {/* SEARCH FILTER */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama dosen, judul jurnal penelitian..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* TABLE LIST */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-6">Nama Dosen</th>
                        <th className="py-3.5 px-6">Acuan Jurnal Penelitian (Link Clickable)</th>
                        <th className="py-3.5 px-6">Bidang Keahlian / Kata Kunci</th>
                        <th className="py-3.5 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                      {filteredLecturers.length > 0 ? (
                        filteredLecturers.map((lec) => (
                          <tr key={lec.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 font-bold text-slate-800 whitespace-nowrap">{lec.nama}</td>
                            <td className="py-4 px-6 text-slate-600 max-w-sm italic leading-relaxed font-semibold">
                              <a
                                href={lec.matchedPublicationLink || "https://sinta.kemdiktisaintek.go.id"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline cursor-pointer"
                              >
                                "{lec.matchedPublication}"
                              </a>
                            </td>
                            <td className="py-4 px-6 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {lec.bidangKeahlian && lec.bidangKeahlian.map((kw, i) => (
                                  <span
                                    key={i}
                                    className="bg-blue-50 border border-blue-100/30 text-blue-600 font-bold font-mono text-[9px] px-2 py-0.5 rounded"
                                  >
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleOpenEditPub(lec)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold rounded-lg cursor-pointer transition text-[10px]"
                              >
                                <Edit className="w-3 h-3" />
                                Edit Jurnal
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400">
                            Tidak ditemukan data jurnal yang cocok.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5. MENU: KELOLA MAHASISWA ==================== */}
          {activeMenu === "students" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Data Mahasiswa</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Administrasikan bimbingan, usulan draf judul proposal skripsi, dan verifikasi kelayakan bimbingan.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddStudent}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm shadow-blue-100 transition duration-150"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah Mahasiswa Baru
                </button>
              </div>

              {/* SEARCH FILTER */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari NIM, Nama Mahasiswa, atau judul proposal skripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-slate-700 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* TABLE LIST */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="py-3.5 px-6">NIM / Nama</th>
                        <th className="py-3.5 px-6">Prodi</th>
                        <th className="py-3.5 px-6">Judul Rencana Proposal</th>
                        <th className="py-3.5 px-6">Skor AI</th>
                        <th className="py-3.5 px-6">Status Bimbingan</th>
                        <th className="py-3.5 px-6 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((std) => (
                          <tr key={std.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-4 px-6 max-w-xs">
                              <h4 className="font-bold text-slate-800">{std.nama}</h4>
                              <span className="text-[10px] font-mono font-bold text-slate-400 block mt-0.5">{std.nim}</span>
                            </td>
                            <td className="py-4 px-6 text-slate-500 whitespace-nowrap">{std.prodi}</td>
                            <td className="py-4 px-6 text-slate-600 font-medium max-w-sm leading-relaxed truncate">
                              {std.judulProposal || "[Belum Mengisi Proposal]"}
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className="font-mono font-extrabold text-blue-600 bg-blue-50 border border-blue-100/30 px-2 py-1 rounded">
                                {std.matchScore}%
                              </span>
                            </td>
                            <td className="py-4 px-6 whitespace-nowrap">
                              <span
                                className={`text-[9px] font-extrabold font-mono px-2 py-0.5 rounded uppercase ${
                                  std.status === "Siap Konsultasi"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : std.status === "Judul Diterima"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {std.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-1">
                              <button
                                onClick={() => handleOpenEditStudent(std)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition inline-flex items-center"
                                title="Edit Mahasiswa"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(std.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer transition inline-flex items-center"
                                title="Hapus Mahasiswa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            Tidak ditemukan data mahasiswa yang cocok.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* ============================================================== */}
      {/* ==================== 8. MODAL FORMS DIALOGS ==================== */}
      {/* ============================================================== */}

      {/* A. LECTURER ADD/EDIT MODAL */}
      {isLecturerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-slate-800 text-sm font-sans">
                {editingLecturer ? "Edit Data Dosen" : "Tambah Dosen Baru"}
              </h3>
              <button
                onClick={() => setIsLecturerModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLecturer} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">SINTA ID</label>
                  <input
                    type="text"
                    value={lecForm.sintaId}
                    onChange={(e) => setLecForm({ ...lecForm, sintaId: e.target.value })}
                    placeholder="SINTA ID (opsional)"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Dosen</label>
                  <input
                    type="text"
                    required
                    value={lecForm.nama}
                    onChange={(e) => setLecForm({ ...lecForm, nama: e.target.value })}
                    placeholder="Contoh: Nama, S.Kom., M.Kom."
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Bidang Keahlian (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  value={lecForm.bidangKeahlian}
                  onChange={(e) => setLecForm({ ...lecForm, bidangKeahlian: e.target.value })}
                  placeholder="Contoh: Data Mining, Machine Learning, NLP..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Acuan Jurnal Publikasi</label>
                <textarea
                  required
                  rows={2}
                  value={lecForm.matchedPublication}
                  onChange={(e) => setLecForm({ ...lecForm, matchedPublication: e.target.value })}
                  placeholder="Tuliskan judul jurnal publikasi riil yang pernah dipublikasikan..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Link Jurnal Publikasi (Hyperlink)</label>
                <input
                  type="text"
                  value={lecForm.matchedPublicationLink}
                  onChange={(e) => setLecForm({ ...lecForm, matchedPublicationLink: e.target.value })}
                  placeholder="Contoh: https://sinta.kemdiktisaintek.go.id/authors/profile/..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsLecturerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold shadow-md shadow-blue-100"
                >
                  Simpan Dosen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. PUBLICATION EDIT MODAL */}
      {isPubModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-slate-800 text-sm font-sans">
                Edit Penelitian: {editingPubLec?.nama.split(",")[0]}
              </h3>
              <button
                onClick={() => setIsPubModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePub} className="space-y-4 text-xs font-medium text-slate-700">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Acuan Jurnal Penelitian</label>
                <textarea
                  required
                  rows={3}
                  value={pubForm.matchedPublication}
                  onChange={(e) => setPubForm({ ...pubForm, matchedPublication: e.target.value })}
                  placeholder="Ubah judul acuan publikasi jurnal..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Link Jurnal Publikasi (Hyperlink)
                </label>
                <input
                  type="text"
                  value={pubForm.matchedPublicationLink}
                  onChange={(e) => setPubForm({ ...pubForm, matchedPublicationLink: e.target.value })}
                  placeholder="Contoh: https://sinta.kemdiktisaintek.go.id/authors/profile/..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsPubModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold shadow-md shadow-blue-100"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. STUDENT ADD/EDIT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl p-6 overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-extrabold text-slate-800 text-sm font-sans">
                {editingStudent ? "Edit Data Mahasiswa" : "Tambah Mahasiswa Baru"}
              </h3>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs font-medium text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">NIM</label>
                  <input
                    type="text"
                    required
                    value={studentForm.nim}
                    onChange={(e) => setStudentForm({ ...studentForm, nim: e.target.value })}
                    placeholder="Masukkan NIM Mahasiswa"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={studentForm.nama}
                    onChange={(e) => setStudentForm({ ...studentForm, nama: e.target.value })}
                    placeholder="Nama Lengkap Mahasiswa"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Akademik</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="Contoh: nim@student.udb.ac.id"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kata Sandi Akses</label>
                  <input
                    type="text"
                    value={studentForm.password}
                    onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                    placeholder="Default: 123456789"
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Program Studi</label>
                  <select
                    value={studentForm.prodi}
                    onChange={(e) => setStudentForm({ ...studentForm, prodi: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Teknik Informatika">Teknik Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Teknologi Informasi">Teknologi Informasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-mono">Simulasi Autentikasi</label>
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-semibold text-slate-500 leading-relaxed min-h-[42px]">
                    Role auto-detected
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Draf Judul Proposal Skripsi
                </label>
                <textarea
                  rows={2}
                  value={studentForm.judulProposal}
                  onChange={(e) => setStudentForm({ ...studentForm, judulProposal: e.target.value })}
                  placeholder="Judul skripsi yang diajukan..."
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Skor Kecocokan AI (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={studentForm.matchScore}
                    onChange={(e) => setStudentForm({ ...studentForm, matchScore: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status Kelayakan</label>
                  <select
                    value={studentForm.status}
                    onChange={(e) => setStudentForm({ ...studentForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Siap Konsultasi">Siap Konsultasi</option>
                    <option value="Judul Diterima">Judul Diterima</option>
                    <option value="Bimbingan Aktif">Bimbingan Aktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold shadow-md shadow-blue-100"
                >
                  Simpan Mahasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
