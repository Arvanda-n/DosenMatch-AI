import { useState } from "react";
import { ViewState, User } from "../types";
import { BookOpen, LogIn, LogOut, LayoutDashboard, Cpu, Menu, X } from "lucide-react";

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
}

export default function Navigation({ currentView, setView, user, onLogout }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navigateToSection = (view: ViewState, hash?: string) => {
    setView(view);
    setIsMobileMenuOpen(false);
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 font-sans" id="app-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div 
          onClick={() => navigateToSection("landing")} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="nav-brand-logo"
        >
          <LogoCrosshair />
          <span className="text-lg font-bold text-slate-800 tracking-tight transition duration-150 group-hover:text-blue-600">
            DosenMatch<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500">
          <button 
            onClick={() => navigateToSection("landing")} 
            className={`transition duration-150 cursor-pointer ${currentView === "landing" ? "text-blue-600 font-bold" : "hover:text-slate-800"}`}
            id="nav-link-landing"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => navigateToSection("landing", "cara-kerja-section")} 
            className="hover:text-slate-800 transition duration-150 cursor-pointer"
            id="nav-link-metodologi"
          >
            Metodologi
          </button>
          <button 
            onClick={() => navigateToSection("blueprint")} 
            className={`flex items-center gap-1 transition duration-150 cursor-pointer ${currentView === "blueprint" ? "text-blue-600 font-bold" : "hover:text-slate-800"}`}
            id="nav-link-blueprint"
          >
            <BookOpen className="w-3.5 h-3.5" />
            UAS Blueprint Hub
          </button>
        </nav>

        {/* Action Buttons & Hamburger (Desktop/Mobile) */}
        <div className="flex items-center gap-2.5">
          {/* Mulai Analisis Button (Desktop only, or small text) */}
          <button
            onClick={() => navigateToSection("analysis")}
            className={`hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl transition duration-150 cursor-pointer ${
              currentView === "analysis"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
            }`}
            id="btn-nav-match"
          >
            <Cpu className="w-3.5 h-3.5" />
            Mulai Analisis
          </button>

          {/* Login / Account Profile Buttons (Desktop/Mobile condensed) */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigateToSection("dashboard")}
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
              onClick={() => navigateToSection("login")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold hover:text-blue-600 hover:bg-blue-50 text-slate-600 border border-slate-200/80 hover:border-blue-200 px-3.5 py-2.5 rounded-xl transition duration-150 cursor-pointer"
              id="btn-nav-login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Responsive Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition duration-150 cursor-pointer border border-slate-100"
            id="btn-mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3 animate-fade-in shadow-inner" id="mobile-navigation-drawer">
          <div className="flex flex-col gap-2.5">
            <button 
              onClick={() => navigateToSection("landing")} 
              className={`text-left text-xs font-bold py-2 px-3 rounded-lg transition duration-150 cursor-pointer ${currentView === "landing" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              Tentang Kami
            </button>
            <button 
              onClick={() => navigateToSection("landing", "cara-kerja-section")} 
              className="text-left text-xs font-bold py-2 px-3 rounded-lg text-slate-600 hover:bg-slate-50 transition duration-150 cursor-pointer"
            >
              Metodologi
            </button>
            <button 
              onClick={() => navigateToSection("blueprint")} 
              className={`flex items-center gap-2 text-xs font-bold py-2 px-3 rounded-lg transition duration-150 cursor-pointer ${currentView === "blueprint" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <BookOpen className="w-4 h-4" />
              UAS Blueprint Hub
            </button>

            <div className="h-px bg-slate-100 my-1"></div>

            {/* Mobile Actions */}
            <button
              onClick={() => navigateToSection("analysis")}
              className={`flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer ${
                currentView === "analysis"
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Cpu className="w-4 h-4" />
              Mulai Analisis AI
            </button>

            {user ? (
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => navigateToSection("dashboard")}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-700 py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard ({user.name.split(" ")[0]})</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold bg-rose-50 text-rose-600 py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateToSection("login")}
                className="flex items-center justify-center gap-2 text-xs font-bold hover:text-blue-600 hover:bg-blue-50 text-slate-600 border border-slate-200 py-2.5 px-3 rounded-xl transition duration-150 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Login Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
