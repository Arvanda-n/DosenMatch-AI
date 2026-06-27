import { ViewState, User } from "../types";
import { BookOpen, LogIn, LogOut, LayoutDashboard, Cpu } from "lucide-react";

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export default function Navigation({ currentView, setView, user, onLogout }: NavigationProps) {
  // Beautiful SVG Crosshair Logo mimicking the uploaded image
  const LogoCrosshair = () => (
    <svg
      viewBox="0 0 100 100"
      className="w-8 h-8 select-none"
      id="svg-logo-crosshair"
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

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 font-sans" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => setView("landing")} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="nav-brand-logo"
        >
          <LogoCrosshair />
          <span className="text-lg font-bold text-slate-800 tracking-tight transition duration-150 group-hover:text-blue-600">
            DosenMatch<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500">
          <button 
            onClick={() => setView("landing")} 
            className={`transition duration-150 cursor-pointer ${currentView === "landing" ? "text-blue-600 font-bold" : "hover:text-slate-800"}`}
            id="nav-link-landing"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => {
              setView("landing");
              setTimeout(() => {
                const element = document.getElementById("cara-kerja-section");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }} 
            className="hover:text-slate-800 transition duration-150 cursor-pointer"
            id="nav-link-metodologi"
          >
            Metodologi
          </button>
          <button 
            onClick={() => setView("blueprint")} 
            className={`flex items-center gap-1 transition duration-150 cursor-pointer ${currentView === "blueprint" ? "text-blue-600 font-bold" : "hover:text-slate-800"}`}
            id="nav-link-blueprint"
          >
            <BookOpen className="w-3.5 h-3.5" />
            UAS Blueprint Hub
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Analysis Trigger Button */}
          <button
            onClick={() => setView("analysis")}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer ${
              currentView === "analysis"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
            }`}
            id="btn-nav-match"
          >
            <Cpu className="w-3.5 h-3.5" />
            Mulai Analisis
          </button>

          {/* Login / Dashboard Account Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("dashboard")}
                className="flex items-center gap-1.5 text-xs font-semibold bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl transition duration-150 cursor-pointer"
                id="btn-nav-dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard ({user.name.split(" ")[0]})</span>
              </button>
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-50 transition duration-150 cursor-pointer"
                id="btn-nav-logout"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView("login")}
              className="flex items-center gap-1.5 text-xs font-semibold hover:text-blue-600 hover:bg-blue-50 text-slate-600 border border-slate-200/80 hover:border-blue-200 px-3.5 py-2.5 rounded-xl transition duration-150 cursor-pointer"
              id="btn-nav-login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
