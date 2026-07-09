import { useState } from "react";
import { ViewState, User } from "./types";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import SecurityPortal from "./components/SecurityPortal";
import AnalysisWorkspace from "./components/AnalysisWorkspace";
import DashboardHub from "./components/DashboardHub";
import BlueprintHub from "./components/BlueprintHub";
import AdminDashboard from "./components/AdminDashboard";
import { DataProvider } from "./components/DataContext";

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

function AppContent() {
  const [currentView, setView] = useState<ViewState>("landing");
  const [user, setUser] = useState<User | null>(null);
  
  // Topic preset sharing from Landing to Matcher Workspace
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedAbstract, setSelectedAbstract] = useState("");

  const handleSelectSampleTopic = (title: string, abstract: string) => {
    setSelectedTitle(title);
    setSelectedAbstract(abstract);
    if (!user) {
      setView("login");
    } else {
      setView("analysis");
    }
  };

  const handleClearInitial = () => {
    setSelectedTitle("");
    setSelectedAbstract("");
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === "admin") {
      setView("dashboard");
    } else {
      setView("analysis");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView("landing");
  };

  const handleSwitchRole = (role: "mahasiswa" | "dosen" | "kaprodi" | "admin") => {
    if (!user) return;
    if (role === "admin") {
      setUser({
        id: "admin",
        name: "Arva Administrator",
        email: "admin@udb.ac.id",
        role: "admin",
        nim_nidn: "admin",
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=2563eb`
      });
      setView("dashboard");
      return;
    }
    
    // Simulate role switching with preset demo credentials
    const names = {
      mahasiswa: "Muhammad Aris Saputra",
      dosen: "Dwi Hartanti, S.Kom., M.Kom.",
      kaprodi: "Wijiyanto, S.Kom., M.Pd., M.Kom."
    };
    const ids = {
      mahasiswa: "220102034",
      dosen: "6721123",
      kaprodi: "0605058702"
    };
    const emails = {
      mahasiswa: "aris.saputra@student.udb.ac.id",
      dosen: "dwi.hartanti@lecturer.udb.ac.id",
      kaprodi: "wijiyanto@udb.ac.id"
    };

    setUser({
      id: role === "mahasiswa" ? "std-1" : ids[role],
      name: names[role],
      email: emails[role],
      role: role,
      nim_nidn: ids[role],
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(names[role])}&backgroundColor=2563eb`
    });
    setView("dashboard");
  };

  // Safe wrapper routing handler with Login protection
  const safeSetView = (view: ViewState) => {
    if (view === "analysis" && !user) {
      setView("login");
    } else {
      setView(view);
    }
  };

  // If Admin is logged in, show the self-contained clean SaaS Admin Dashboard directly
  if (user && user.role === "admin") {
    return (
      <AdminDashboard user={user} onLogout={handleLogout} />
    );
  }

  // If Mahasiswa is logged in, show the self-contained student dashboard directly to prevent double navbar
  if (user && user.role === "mahasiswa") {
    return (
      <DashboardHub
        user={user}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        onUpdateUser={setUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between text-slate-800 selection:bg-blue-100 selection:text-blue-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="w-full">
        {/* Navigation bar */}
        <Navigation
          currentView={currentView}
          setView={safeSetView}
          user={user}
          onLogout={handleLogout}
        />

        {/* Dynamic view content with standard slide-fade alignment */}
        <main className="w-full pb-16">
          {currentView === "landing" && (
            <LandingPage
              setView={safeSetView}
              onSelectSampleTopic={handleSelectSampleTopic}
            />
          )}

          {currentView === "login" && (
            <SecurityPortal onLoginSuccess={handleLoginSuccess} />
          )}

          {currentView === "analysis" && user && (
            <AnalysisWorkspace
              initialTitle={selectedTitle}
              initialAbstract={selectedAbstract}
              onClearInitial={handleClearInitial}
            />
          )}

          {currentView === "dashboard" && user && (
            <DashboardHub
              user={user}
              onLogout={handleLogout}
              onSwitchRole={handleSwitchRole}
              onUpdateUser={setUser}
            />
          )}

          {currentView === "blueprint" && <BlueprintHub />}
        </main>
      </div>

      {/* Elegant minimalist academic footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {/* Minimalist SVG crosshair for small footer mark */}
            <svg viewBox="0 0 100 100" className="w-5 h-5">
              <rect width="100" height="100" rx="24" fill="#2563eb" />
              <line x1="50" y1="20" x2="50" y2="80" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <line x1="20" y1="50" x2="80" y2="50" stroke="white" strokeWidth="8" strokeLinecap="round" />
              <circle cx="50" cy="50" r="16" fill="none" stroke="white" strokeWidth="8" />
            </svg>
            <span className="font-bold text-slate-600">DOSENMATCH AI v2.1</span>
          </div>
          <p className="font-medium">
            Program Studi Teknik Informatika, Universitas Duta Bangsa Surakarta • Laporan UAS
          </p>
          <p className="font-mono text-[10px]">
            © 2026 UDB FIKOM. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
