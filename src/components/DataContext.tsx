import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "../types";

export interface LecturerData {
  id: number;
  nama: string;
  sintaId: string;
  bidangKeahlian: string[];
  matchedPublication: string;
  matchedPublicationLink: string;
}

export interface StudentData {
  id: string;
  nama: string;
  nim: string;
  email: string;
  prodi: string;
  judulProposal: string;
  matchScore: number;
  status: string;
  password?: string;
}

export interface MatchLog {
  id: string;
  judul: string;
  timestamp: string;
  status: string;
  durationMs: number;
}

export interface AnalysisHistoryItem {
  id: string;
  judul: string;
  dosenNama: string;
  skor: number;
  tanggal: string;
  studentNim?: string;
  studentNama?: string;
}

interface DataContextType {
  lecturers: LecturerData[];
  setLecturers: React.Dispatch<React.SetStateAction<LecturerData[]>>;
  addLecturer: (lec: Omit<LecturerData, "id">) => void;
  updateLecturer: (lec: LecturerData) => void;
  deleteLecturer: (id: number) => void;
  
  fieldsOfExpertise: string[];
  addFieldOfExpertise: (field: string) => void;
  deleteFieldOfExpertise: (field: string) => void;

  students: StudentData[];
  addStudent: (student: Omit<StudentData, "id">) => void;
  updateStudent: (student: StudentData) => void;
  deleteStudent: (id: string) => void;

  matchLogs: MatchLog[];
  addMatchLog: (log: Omit<MatchLog, "id" | "timestamp">) => void;

  analysisHistory: AnalysisHistoryItem[];
  addAnalysisHistory: (item: Omit<AnalysisHistoryItem, "id" | "tanggal">) => void;
  clearAnalysisHistory: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialLecturers: LecturerData[] = [
  { id: 1, nama: "Afu Ichsan Pradana, S.Kom., M.Kom.", sintaId: "6114050", bidangKeahlian: ["Embedded System", "Computer Engineering", "Information System", "Socio Technical"], matchedPublication: "Pengembangan Sistem Perhitungan Jumlah Kendaraan Berdasarkan Jenis Kendaraan Menggunakan Algoritma YOLO Secara Realtime", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6114050/?view=googlescholar" },
  { id: 2, nama: "Aprilisa Arum Sari, S.T., M.Kom.", sintaId: "6875925", bidangKeahlian: ["Data Mining", "Machine Learning", "Artificial Intelligence"], matchedPublication: "Prototype Sistem Rekomendasi Pemilihan Produk Furniture dengan Pemodelan Content-Based Filtering", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6875925/?view=garuda" },
  { id: 3, nama: "Dwi Hartanti, S.Kom., M.Kom.", sintaId: "6721123", bidangKeahlian: ["Artificial Intelligence", "Decision Support System", "Data Mining", "Machine Learning"], matchedPublication: "Komparasi Metode Decision Tree, Logistic Regression, SVM, dan ANN Dalam Klasifikasi Kualitas Air", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6721123/?view=garuda" },
  { id: 4, nama: "Joni Maulindar, S.Kom., M.Eng.", sintaId: "6042057", bidangKeahlian: ["Teknologi Informasi", "Internet of Things", "Decision Support System", "Artificial Intelligence"], matchedPublication: "Monitoring Jumlah Orang di Ruangan Menggunakan Teknologi IoT", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6042057/?view=garuda" },
  { id: 5, nama: "Nurchim, S.Kom., M.Kom.", sintaId: "5975297", bidangKeahlian: ["Internet of Things", "Computer Network", "Wireless Network", "Smart System"], matchedPublication: "Implementation of Renewable Energy-based Public Wireless Internet Infrastructure in Rural Indonesia", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/5975297/?view=garuda" },
  { id: 6, nama: "Wijiyanto, S.Kom., M.Pd., M.Kom.", sintaId: "6042074", bidangKeahlian: ["Machine Learning", "Software Engineering", "Information System", "Computer Network"], matchedPublication: "Identifikasi Jenis Kelamin Otomatis Berdasarkan Mata Manusia Menggunakan Convolutional Neural Network (CNN) dan Haar Cascade Classifier", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6042074/?view=garuda" },
  { id: 7, nama: "Herliyani Hasanah, S.T., M.T.", sintaId: "6035239", bidangKeahlian: ["Artificial Intelligence", "Energy Efficiency", "Machine Learning"], matchedPublication: "Implementasi Algoritma Naive Bayes dalam Sistem Analisis Sentimen Aplikasi Zenius pada Playstore", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6035239/?view=garuda" },
  { id: 8, nama: "Moh. Muhtarom, S.E., S.Kom., M.Kom.", sintaId: "6042064", bidangKeahlian: ["Information System", "Software Engineering", "Web Development"], matchedPublication: "Rancang Bangun Sistem Monitoring dan Kendali Tanaman Pintar Berbasis Android", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6042064/?view=garuda" },
  { id: 9, nama: "Nugroho Arif Sudibyo, S.Si., M.Pd.", sintaId: "5976330", bidangKeahlian: ["Educational Technology", "Data Analysis", "Learning Analytics"], matchedPublication: "Analisis Persebaran Izin Usaha di Kabupaten Sragen Menggunakan Metode K-Means Clustering", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/5976330/?view=garuda" },
  { id: 10, nama: "Pramono, S.Kom., M.Kom.", sintaId: "6879803", bidangKeahlian: ["Software Engineering", "Information System", "Web Development"], matchedPublication: "Sistem Informasi Akademik Berbasis Web", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6879803/?view=garuda" },
  { id: 11, nama: "Nibras Fa'iq Muhammad, M.Kom.", sintaId: "6854958", bidangKeahlian: ["Artificial Intelligence", "Machine Learning", "Data Mining"], matchedPublication: "Publikasi pada bidang Artificial Intelligence dan Data Mining", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6854958/?view=garuda" },
  { id: 12, nama: "Anisatul Farida, S.Pd., M.Pd.", sintaId: "6042059", bidangKeahlian: ["Mathematics", "Computational Mathematics", "Machine Learning", "Artificial Intelligence"], matchedPublication: "Mathematical Modeling and Integration of Machine Learning-Based Prediction System on E-Learning Platform to Improve Students' Academic Performance", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6042059/?view=garuda" },
  { id: 13, nama: "Bondan Wahyu Pamekas, S.Kom., M.Kom.", sintaId: "6783743", bidangKeahlian: ["Internet of Things", "Game Development", "Artificial Intelligence"], matchedPublication: "Perancangan Sistem Pakar Untuk Mendeteksi Gejala Kerusakan Pada Komputer Menggunakan Metode Forward Chaining", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6783743/?view=researches" },
  { id: 14, nama: "Sundari, S.E., M.M.", sintaId: "6027531", bidangKeahlian: ["Information System", "Digital Business", "Management"], matchedPublication: "Lihat daftar publikasi pada profil SINTA", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6027531/?view=garuda" },
  { id: 15, nama: "Vihi Atina, S.Kom., M.Kom.", sintaId: "6119240", bidangKeahlian: ["Artificial Intelligence", "Recommendation System", "Information System", "Expert System", "Natural Language Processing", "Automata"], matchedPublication: "Analisis Sentimen Aplikasi Tiktok Tokopedia Seller Center dengan Pendekatan Machine Learning: SVM, CNN, Naive", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id/authors/profile/6119240/?view=garuda" },
  { id: 16, nama: "Intan Oktaviani, S.Kom., M.Kom.", sintaId: "", bidangKeahlian: ["Web Development", "Information System", "Software Engineering"], matchedPublication: "Sistem Informasi Monitoring Data Pesanan Customer Berbasis Website Pada JeeDee Advertising", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id" },
  { id: 17, nama: "Triana, S.Kom., M.Kom.", sintaId: "", bidangKeahlian: ["Software Engineering", "Information System", "Computer Science"], matchedPublication: "Lihat publikasi pada prosiding dan penelitian FIKOM UDB", matchedPublicationLink: "https://ojs.udb.ac.id/icohetech/" },
  { id: 18, nama: "Agustina Srirahayu, S.Kom., M.Kom.", sintaId: "", bidangKeahlian: ["Software Engineering", "Information System", "Web Programming"], matchedPublication: "Publikasi bidang Sistem Informasi dan Rekayasa Perangkat Lunak", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id" },
  { id: 19, nama: "Pipin Widyaningsih, M.Kom.", sintaId: "", bidangKeahlian: ["Information System", "Data Processing", "Software Engineering"], matchedPublication: "Publikasi bidang Sistem Informasi", matchedPublicationLink: "https://sinta.kemdiktisaintek.go.id" }
];

const initialStudents: StudentData[] = [
  { id: "std-1", nama: "Muhammad Aris Saputra", nim: "220102034", email: "aris.saputra@student.udb.ac.id", prodi: "Teknik Informatika", judulProposal: "Penerapan Deep Learning untuk Analisis Sentimen Pasar", matchScore: 92, status: "Siap Konsultasi", password: "mahasiswa123" },
  { id: "std-2", nama: "Ahmad Dahlan", nim: "19102030", email: "ahmad.dahlan@student.univ.ac.id", prodi: "Teknik Informatika", judulProposal: "Optimasi Algoritma Transformer untuk Analisis Sentimen Bahasa Indonesia pada Media Sosial", matchScore: 88, status: "Judul Diterima", password: "123456789" },
  { id: "std-3", nama: "Rina Marlina", nim: "220102015", email: "rina.marlina@student.udb.ac.id", prodi: "Teknik Informatika", judulProposal: "Pengembangan Metodologi Agile-Scrum pada Startup Skala Mikro", matchScore: 85, status: "Bimbingan Aktif", password: "123456789" },
  { id: "std-4", nama: "Budi Santoso", nim: "220102001", email: "budi.santoso@student.udb.ac.id", prodi: "Teknik Informatika", judulProposal: "Implementasi Deep Learning untuk Deteksi Penyakit Daun Teh Berdasarkan Citra Visual", matchScore: 88, status: "Siap Konsultasi", password: "123456789" }
];

const initialLogs: MatchLog[] = [
  { id: "log-1", judul: "Sistem Rekomendasi Pemilihan Produk Furniture", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: "SUCCESS", durationMs: 420 },
  { id: "log-2", judul: "Penerapan Metode Content-Based Filtering", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), status: "SUCCESS", durationMs: 380 },
  { id: "log-3", judul: "Sistem Irigasi Cerdas Berbasis IoT", timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), status: "SUCCESS", durationMs: 610 }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lecturers, setLecturers] = useState<LecturerData[]>(() => {
    const saved = localStorage.getItem("udb_lecturers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && ("nidn" in parsed[0] || typeof parsed[0].bidangKeahlian === "undefined")) {
          localStorage.removeItem("udb_lecturers");
          return initialLecturers;
        }
        return parsed;
      } catch (e) {
        return initialLecturers;
      }
    }
    return initialLecturers;
  });

  const [students, setStudents] = useState<StudentData[]>(() => {
    const saved = localStorage.getItem("udb_students");
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [matchLogs, setMatchLogs] = useState<MatchLog[]>(() => {
    const saved = localStorage.getItem("udb_match_logs");
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [customFields, setCustomFields] = useState<string[]>(() => {
    const saved = localStorage.getItem("udb_custom_fields");
    return saved ? JSON.parse(saved) : [];
  });

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>(() => {
    const saved = localStorage.getItem("udb_analysis_history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("udb_lecturers", JSON.stringify(lecturers));
  }, [lecturers]);

  useEffect(() => {
    localStorage.setItem("udb_students", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("udb_match_logs", JSON.stringify(matchLogs));
  }, [matchLogs]);

  useEffect(() => {
    localStorage.setItem("udb_custom_fields", JSON.stringify(customFields));
  }, [customFields]);

  useEffect(() => {
    localStorage.setItem("udb_analysis_history", JSON.stringify(analysisHistory));
  }, [analysisHistory]);

  const fieldsOfExpertise = React.useMemo(() => {
    const extracted = new Set<string>();
    lecturers.forEach((l) => {
      if (l.bidangKeahlian) {
        l.bidangKeahlian.forEach((field) => {
          const trimmed = field.trim();
          if (trimmed) extracted.add(trimmed);
        });
      }
    });
    customFields.forEach(f => extracted.add(f));
    return Array.from(extracted);
  }, [lecturers, customFields]);

  const addFieldOfExpertise = (field: string) => {
    const trimmed = field.trim();
    if (trimmed && !customFields.includes(trimmed)) {
      setCustomFields(prev => [...prev, trimmed]);
    }
  };

  const deleteFieldOfExpertise = (field: string) => {
    setCustomFields(prev => prev.filter(f => f !== field));
  };

  const addLecturer = (lec: Omit<LecturerData, "id">) => {
    setLecturers((prev) => [
      ...prev,
      {
        ...lec,
        id: prev.length > 0 ? Math.max(...prev.map((l) => l.id)) + 1 : 1,
      },
    ]);
  };

  const updateLecturer = (lec: LecturerData) => {
    setLecturers((prev) => prev.map((l) => (l.id === lec.id ? lec : l)));
  };

  const deleteLecturer = (id: number) => {
    setLecturers((prev) => prev.filter((l) => l.id !== id));
  };

  const addStudent = (student: Omit<StudentData, "id">) => {
    setStudents((prev) => [
      ...prev,
      {
        ...student,
        password: student.password || "123456789",
        id: `std-${Date.now()}`,
      },
    ]);
  };

  const updateStudent = (student: StudentData) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const addMatchLog = (log: Omit<MatchLog, "id" | "timestamp">) => {
    const newLog: MatchLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setMatchLogs((prev) => [newLog, ...prev]);
  };

  const addAnalysisHistory = (item: Omit<AnalysisHistoryItem, "id" | "tanggal">) => {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const d = new Date();
    const formattedDate = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    
    const newItem: AnalysisHistoryItem = {
      ...item,
      id: `analysis-${Date.now()}`,
      tanggal: formattedDate
    };
    setAnalysisHistory((prev) => [newItem, ...prev]);
  };

  const clearAnalysisHistory = () => {
    setAnalysisHistory([]);
  };

  return (
    <DataContext.Provider
      value={{
        lecturers,
        setLecturers,
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
        addMatchLog,
        analysisHistory,
        addAnalysisHistory,
        clearAnalysisHistory,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
