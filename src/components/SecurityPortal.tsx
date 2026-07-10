import { useState, FormEvent } from "react";
import { User, Role } from "../types";
import { ShieldAlert, KeyRound, EyeOff, Eye, CheckCircle } from "lucide-react";
import { useData } from "./DataContext";

interface SecurityPortalProps {
  onLoginSuccess: (user: User) => void;
}

export default function SecurityPortal({ onLoginSuccess }: SecurityPortalProps) {
  const { students } = useData();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedInput = userId.trim();
    const trimmedPass = password.trim();

    if (!trimmedInput || !trimmedPass) {
      setError("Email / NIM dan Kata Sandi wajib diisi.");
      return;
    }

    // Dynamic student lookup
    const foundStudent = students.find(
      (s) => s.nim === trimmedInput || s.email === trimmedInput
    );
    const expectedPassword = foundStudent?.password || (foundStudent?.nim === "220102034" ? "mahasiswa123" : "123456789");
    const isStudentMatch = foundStudent && trimmedPass === expectedPassword;

    const isAdmin = 
      (trimmedInput === "admin.fikom@udb.ac.id" || trimmedInput === "admin") && 
      trimmedPass === "adminudb2026";

    if (isStudentMatch && foundStudent) {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          id: foundStudent.id,
          name: foundStudent.nama,
          email: foundStudent.email,
          role: "mahasiswa" as Role,
          nim_nidn: foundStudent.nim,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(foundStudent.nama)}&backgroundColor=2563eb`,
          password: expectedPassword
        });
      }, 1000);
    } else if (isAdmin) {
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          id: "admin",
          name: "Administrator",
          email: "admin.fikom@udb.ac.id",
          role: "admin" as Role,
          nim_nidn: "admin",
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=2563eb`
        });
      }, 1000);
    } else {
      setError("Autentikasi Gagal: NIM/Email atau Kata Sandi yang dimasukkan tidak cocok dengan peran apapun.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4" id="security-portal-container" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Gerbang Otorisasi Akademik
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Masukkan kredensial akademik Anda untuk masuk ke sistem DosenMatch AI. Peran Anda akan dideteksi secara otomatis.
          </p>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in" id="login-success-view">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Otorisasi Berhasil</h3>
            <p className="text-xs text-slate-400 mt-1">Mengalihkan ke halaman otoritas Anda...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5" id="login-form">
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs animate-shake" id="login-error-box">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* EMAIL / NIM INPUT */}
            <div>
              <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider mb-2">
                NIM / Email Terdaftar
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError(null);
                }}
                placeholder="Masukkan NIM atau Email UDB"
                className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150 font-medium"
                id="input-user-id"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                  Kata Sandi Keamanan
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Masukkan kata sandi otorisasi"
                  className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150 font-medium"
                  id="input-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  id="btn-reveal-password"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-blue-100"
              id="btn-submit-login"
            >
              Verifikasi Autentikasi
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
