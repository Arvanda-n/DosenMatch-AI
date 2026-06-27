import { useState, ChangeEvent, FormEvent } from "react";
import { User, Role } from "../types";
import { ShieldAlert, KeyRound, EyeOff, Eye, CheckCircle } from "lucide-react";

interface SecurityPortalProps {
  onLoginSuccess: (user: User) => void;
}

export default function SecurityPortal({ onLoginSuccess }: SecurityPortalProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Pre-configured secure demo credentials
  const DEMO_CREDENTIALS = {
    mahasiswa: { id: "220102034", pass: "mahasiswa123", name: "Muhammad Aris Saputra", email: "aris.saputra@student.udb.ac.id" },
    dosen: { id: "0627018301", pass: "dosen123", name: "Tomoliyus, M.Cs.", email: "tomoliyus@lecturer.udb.ac.id" },
    kaprodi: { id: "0605058702", pass: "kaprodi123", name: "Wijiyanto, M.Pd., M.Kom.", email: "wijiyanto@udb.ac.id" }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = userId.trim();
    const trimmedPass = password.trim();

    if (!trimmedId || !trimmedPass) {
      setError("NIM/Email dan Password wajib diisi.");
      return;
    }

    // Identify matching role from demo credentials
    const matchedRole = (Object.keys(DEMO_CREDENTIALS) as Role[]).find((r) => {
      const creds = DEMO_CREDENTIALS[r];
      return (
        (trimmedId === creds.id || trimmedId.toLowerCase() === creds.email.toLowerCase()) &&
        trimmedPass === creds.pass
      );
    });

    if (matchedRole) {
      const targetCreds = DEMO_CREDENTIALS[matchedRole];
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          id: matchedRole === "mahasiswa" ? "std-1" : targetCreds.id,
          name: targetCreds.name,
          email: targetCreds.email,
          role: matchedRole,
          nim_nidn: targetCreds.id,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(targetCreds.name)}&backgroundColor=2563eb`
        });
      }, 1000);
    } else {
      setError("Autentikasi Gagal: NIM/Email atau password salah.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4 font-sans" id="security-portal-container">
      <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4 text-blue-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight font-sans">
            Gerbang Otorisasi Akademik
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
            Silakan masukkan kredensial akademik Anda untuk masuk ke sistem DosenMatch AI.
          </p>
        </div>

        {success ? (
          <div className="py-8 flex flex-col items-center justify-center text-center animate-fade-in" id="login-success-view">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Otorisasi Berhasil</h3>
            <p className="text-xs text-slate-400 mt-1">Mengalihkan ke dashboard spesifik Anda...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5" id="login-form">
            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-rose-800 text-xs animate-shake" id="login-error-box">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* NIM / EMAIL INPUT */}
            <div>
              <label className="block text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">
                NIM / Email Akademik
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError(null);
                }}
                placeholder="Masukkan NIM atau Email Akademik"
                className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150"
                id="input-user-id"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block text-slate-500 font-semibold text-xs uppercase tracking-wider mb-2">
                Sandi Keamanan
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Masukkan sandi Anda"
                  className="w-full bg-slate-50 border border-slate-200/80 hover:border-slate-300 focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none transition duration-150"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3.5 rounded-xl transition duration-150 cursor-pointer shadow-md shadow-blue-100"
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
