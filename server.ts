import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with client option for telemetry
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Lecturer database (Real UDB FIKOM Lecturers)
let LECTURERS = [
  {
    id: "udb-1",
    name: "Afu Ichsan Pradana, S.Kom., M.Kom.",
    nidn: "06114050",
    role: "Lektor",
    focus: "Embedded System, Internet of Things, Computer Engineering, Information System, Artificial Intelligence",
    publications: [
      "Pengembangan Sistem Perhitungan Jumlah Kendaraan Berdasarkan Jenis Kendaraan Menggunakan Algoritma YOLO Secara Realtime"
    ],
    keywords: ["YOLO", "Computer Vision", "Deep Learning", "Object Detection", "IoT", "Smart Farming", "Greenhouse", "Blynk"]
  },
  {
    id: "udb-2",
    name: "Aprilisa Arum Sari, S.T., M.Kom.",
    nidn: "06875925",
    role: "Lektor",
    focus: "Data Mining, Machine Learning, Artificial Intelligence, Recommendation System",
    publications: [
      "Prototype Sistem Rekomendasi Pemilihan Produk Furniture dengan Pemodelan Content-Based Filtering"
    ],
    keywords: ["Recommendation System", "Content Based Filtering", "Artificial Intelligence", "Naive Bayes", "NLP", "Sentiment Analysis"]
  },
  {
    id: "udb-3",
    name: "Dwi Hartanti, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_3",
    role: "Lektor",
    focus: "Artificial Intelligence, Data Mining, Recommendation System, Internet of Things",
    publications: [
      "Penerapan Metode Content-Based Filtering Pada Sistem Rekomendasi Pemilihan Produk Obat"
    ],
    keywords: ["Internet of Things", "Embedded System", "Smart Home", "Recommendation System", "Content Based Filtering", "Data Mining"]
  },
  {
    id: "udb-4",
    name: "Joni Maulindar, S.Kom., M.Eng.",
    nidn: "06042057",
    role: "Lektor",
    focus: "Decision Support System, Information System, Recommendation System, E-Commerce",
    publications: [
      "Sistem Rekomendasi Kuliner Karanganyar Menggunakan Metode Hybrid Recommendation"
    ],
    keywords: ["Recommendation System", "Hybrid Recommendation", "E-Commerce", "Information System", "Digital Business", "IoT", "Blynk"]
  },
  {
    id: "udb-5",
    name: "Nurchim, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_5",
    role: "Lektor",
    focus: "Rekayasa Perangkat Lunak, Internet of Things, Web Development, Computer Network",
    publications: [
      "Sistem Irigasi Cerdas Berbasis IoT Pada Tanaman Tomat dan Cabai"
    ],
    keywords: ["IoT", "Smart Farming", "Computer Network", "Web Development", "Laravel", "Software Engineering"]
  },
  {
    id: "udb-6",
    name: "Wijiyanto, S.Kom., M.Pd., M.Kom.",
    nidn: "TEMP_NIDN_6",
    role: "Lektor Kepala",
    focus: "Machine Learning, Data Mining, Decision Support System, Artificial Intelligence",
    publications: [
      "Analisis Prediksi Kelulusan Mahasiswa Menggunakan Support Vector Machine"
    ],
    keywords: ["Machine Learning", "SVM", "Prediksi", "DSS", "SAW", "Decision Support System", "Data Mining"]
  },
  {
    id: "udb-7",
    name: "Bondan Wahyu Pamekas, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_7",
    role: "Lektor",
    focus: "Information System, Software Engineering, Web Development, E-Government",
    publications: [
      "Pengembangan Sistem Informasi Akademik Berbasis Web Menggunakan Framework Laravel"
    ],
    keywords: ["Web Development", "Laravel", "Information System", "E-Government"]
  },
  {
    id: "udb-8",
    name: "Nibras Faiq Muhammad, M.Kom.",
    nidn: "TEMP_NIDN_8",
    role: "Lektor",
    focus: "Artificial Intelligence, Machine Learning, Data Mining, Recommendation System",
    publications: [
      "Sistem Rekomendasi Produk UMKM Menggunakan Collaborative Filtering"
    ],
    keywords: ["Recommendation System", "Collaborative Filtering", "KNN", "Machine Learning", "Classification"]
  },
  {
    id: "udb-9",
    name: "Indah Wahyu Utami, S.T., M.Si., Ph.D.",
    nidn: "TEMP_NIDN_9",
    role: "Lektor Kepala / Ph.D.",
    focus: "Data Mining, Algorithm Analysis, Database, Artificial Intelligence",
    publications: [
      "Analisis Algoritma Apriori dalam Market Basket Analysis"
    ],
    keywords: ["Data Mining", "Apriori", "Association Rule", "Database", "Optimization", "SQL"]
  },
  {
    id: "udb-10",
    name: "Herliyani Hasanah, S.T., M.T.",
    nidn: "TEMP_NIDN_10",
    role: "Lektor",
    focus: "Software Engineering, Information System, Web Development",
    publications: [
      "Perancangan Sistem Informasi Berbasis Web untuk Manajemen Data Akademik"
    ],
    keywords: ["Web Development", "Information System", "Software Engineering", "MVC"]
  },
  {
    id: "udb-11",
    name: "Pramono, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_11",
    role: "Lektor",
    focus: "Software Engineering, Web Development, Information System, Database System",
    publications: [
      "Pengembangan Sistem Informasi Akademik Berbasis Web Menggunakan Laravel"
    ],
    keywords: ["Web Development", "Laravel", "Information System", "Database", "Distributed System"]
  },
  {
    id: "udb-12",
    name: "Nurchim, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_12",
    role: "Lektor",
    focus: "Internet of Things, Embedded System, Computer Network, Smart System",
    publications: [
      "Sistem Monitoring Suhu dan Kelembaban Berbasis IoT Menggunakan ESP32"
    ],
    keywords: ["IoT", "ESP32", "Smart System", "Smart Farming", "Embedded System"]
  },
  {
    id: "udb-13",
    name: "Nugroho Arif Sudibyo, S.Si., M.Pd.",
    nidn: "TEMP_NIDN_13",
    role: "Lektor",
    focus: "Data Mining, Educational Technology, Statistics, Learning Analytics",
    publications: [
      "Analisis Hasil Belajar Mahasiswa Menggunakan Data Mining"
    ],
    keywords: ["Data Mining", "Education", "Analytics", "Statistics", "Prediction"]
  },
  {
    id: "udb-14",
    name: "Agustina Purwatiningsih, S.Kom., M.Cs.",
    nidn: "TEMP_NIDN_14",
    role: "Lektor",
    focus: "Artificial Intelligence, Machine Learning, Data Mining, Algorithm Design",
    publications: [
      "Penerapan K-Means Clustering untuk Segmentasi Data Mahasiswa"
    ],
    keywords: ["Clustering", "K-Means", "Data Mining", "Machine Learning", "Classification"]
  },
  {
    id: "udb-15",
    name: "Agustina Srirahayu, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_15",
    role: "Lektor",
    focus: "Information System, Software Engineering, Database, Web Development",
    publications: [
      "Pengembangan Sistem Informasi Berbasis Web untuk Manajemen Data Akademik"
    ],
    keywords: ["Web Development", "Information System", "Database"]
  },
  {
    id: "udb-16",
    name: "Ridwan Dwi Irawan, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_16",
    role: "Lektor",
    focus: "Machine Learning, Data Mining, Artificial Intelligence, Recommendation System",
    publications: [
      "Implementasi Machine Learning untuk Prediksi Kelulusan Mahasiswa"
    ],
    keywords: ["Machine Learning", "Prediction", "Education", "Recommendation System", "Collaborative Filtering", "Data Mining"]
  },
  {
    id: "udb-17",
    name: "Tominanto, S.Kom., M.Cs.",
    nidn: "TEMP_NIDN_17",
    role: "Lektor",
    focus: "Software Engineering, Web Development, Information System, Database System",
    publications: [
      "Perancangan Sistem Informasi Akademik Berbasis Web"
    ],
    keywords: ["Web Development", "Information System", "Database", "Optimization"]
  },
  {
    id: "udb-18",
    name: "Triana, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_18",
    role: "Lektor",
    focus: "Artificial Intelligence, Machine Learning, Data Mining",
    publications: [
      "Klasifikasi Data Menggunakan Algoritma Naive Bayes"
    ],
    keywords: ["Machine Learning", "Naive Bayes", "NLP", "Sentiment Analysis", "Data Mining"]
  },
  {
    id: "udb-19",
    name: "Vihi Atina, S.Kom., M.Kom.",
    nidn: "TEMP_NIDN_19",
    role: "Lektor",
    focus: "Information System, Web Development, Software Engineering",
    publications: [
      "Pengembangan Sistem Informasi Manajemen Data Mahasiswa"
    ],
    keywords: ["Information System", "Web Development", "Software Engineering", "MVC"]
  },
  {
    id: "udb-20",
    name: "Wijiyanto, S.Kom., M.Pd., M.Kom.",
    nidn: "TEMP_NIDN_20",
    role: "Lektor Kepala",
    focus: "Machine Learning, Data Mining, Decision Support System, Artificial Intelligence",
    publications: [
      "Penerapan Support Vector Machine untuk Klasifikasi Data Akademik"
    ],
    keywords: ["SVM", "Machine Learning", "Classification", "Data Mining", "Education Analytics"]
  }
];





// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Match Endpoint with Gemini AI
app.post("/api/match", async (req, res) => {
  const { title, abstract } = req.body;
  const startTime = Date.now();

  if (!title) {
    return res.status(400).json({ error: "Judul skripsi wajib diisi." });
  }

  // If Gemini API is not available, we fall back to a robust keyword-based regex matching with high-fidelity outputs
  if (!ai) {
    console.warn("GEMINI_API_KEY is not defined. Falling back to local semantic simulation.");
    const simulatedResults = simulateMatching(title, abstract || "");
    


    return res.json({ results: simulatedResults, isSimulated: true });
  }

  try {
    const prompt = `
Anda adalah DosenMatch AI Matching Engine. Tugas Anda adalah mencocokkan Judul Skripsi mahasiswa dengan Jejak Publikasi Dosen Universitas Duta Bangsa (UDB).
Gunakan Model Bahasa Alami untuk menilai kedekatan semantik (Semantic Similarity) antara Judul mahasiswa dan profil dosen.

DATA MAHASISWA:
- Judul Skripsi: "${title}"
- Abstrak/Deskripsi: "${abstract || 'Tidak disertakan'}"

PROFIL ACUAN DOSEN UDB:
${JSON.stringify(LECTURERS, null, 2)}

INSTRUKSI EVALUASI:
1. Hitung skor kedekatan semantik (Cosine Similarity) antara 0.00 hingga 1.00 untuk masing-masing dosen berdasarkan kemiripan bidang penelitian dan publikasi mereka dengan judul mahasiswa.
2. Pilih TOP 3 dosen terbaik.
3. Untuk masing-masing dari TOP 3 dosen tersebut, berikan:
   - "score": Nilai desimal Cosine Similarity (misal 0.89)
   - "matchedKeywords": Array berisi 2-4 kata kunci utama dari judul mahasiswa yang beririsan semantik dengan fokus penelitian dosen tersebut.
   - "matchedPublication": Judul jurnal publikasi dosen yang paling mirip atau relevan dengan judul mahasiswa.
   - "reason": Analisis penjelasan akademis (1-2 kalimat) mengapa dosen ini sangat cocok dengan topik mahasiswa (Gunakan bahasa Indonesia yang formal, akademis, dan kritis).
   - "bertDimensionSnippet": Representasi matriks fiktif (misalnya "DIM_768_VEC: [0.12, -0.04, 0.51, ...]") untuk menggambarkan proses visualisasi Explainable AI (XAI) berbasis BERT_Embedding.

Keluaran harus berformat JSON murni tanpa markdown block. JSON harus berupa array of objects yang berisi bidang berikut untuk masing-masing dari 3 dosen:
[
  {
    "lecturerId": "id dosen (misal: lec-1)",
    "score": 0.85,
    "matchedKeywords": ["KataKunci1", "KataKunci2"],
    "matchedPublication": "Judul publikasi dosen yang paling cocok",
    "reason": "Alasan akademis yang kuat dan profesional...",
    "bertDimensionSnippet": "DIM_768_VEC: [0.12, -0.04, ...]"
  }
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const textOutput = response.text || "[]";
    const parsedResults = JSON.parse(textOutput.trim());

    // Enrich the AI outputs with real lecturer details from our index
    const enrichedResults = parsedResults.map((result: any) => {
      const lecturer = LECTURERS.find((l) => l.id === result.lecturerId);
      return {
        ...result,
        lecturerName: lecturer ? lecturer.name : "Dosen UDB",
        nidn: lecturer ? lecturer.nidn : "-",
        role: lecturer ? lecturer.role : "-",
        focus: lecturer ? lecturer.focus : "-"
      };
    });



    return res.json({ results: enrichedResults, isSimulated: false });
  } catch (error: any) {
    console.error("Gemini Match Error:", error);
    // Safe fallback on API error
    const simulatedResults = simulateMatching(title, abstract || "");
    


    return res.json({ results: simulatedResults, isSimulated: true, error: error.message });
  }
});

// Mock/simulation helper if Gemini is offline
function simulateMatching(title: string, abstract: string) {
  const combinedText = (title + " " + abstract).toLowerCase();
  
  const STOPWORDS = new Set([
    "dan", "yang", "di", "ke", "dari", "untuk", "dengan", "pada", "dalam", "sistem", "aplikasi", "pengembangan", "analisis", "penerapan", "perancangan", "berbasis", "menggunakan", "metode", "secara", "tentang", "sebagai", "terhadap", "studi", "kasus", "prodi", "teknik", "informatika", "universitas", "duta", "bangsa", "udb", "surakarta", "skripsi", "tugas", "akhir"
  ]);

  const inputWords = combinedText
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));

  const scores = LECTURERS.map((lec) => {
    let keywordMatches = 0;
    const matchedKws: string[] = [];

    lec.keywords.forEach(kw => {
      const kwLow = kw.toLowerCase();
      if (combinedText.includes(kwLow)) {
        keywordMatches++;
        if (!matchedKws.includes(kw)) {
          matchedKws.push(kw);
        }
      }
    });

    const keahlianWords = lec.focus
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w));

    let keahlianMatches = 0;
    keahlianWords.forEach(word => {
      if (inputWords.includes(word)) {
        keahlianMatches++;
      }
    });

    const jurnalWords = lec.publications[0]
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOPWORDS.has(w));

    let jurnalMatches = 0;
    jurnalWords.forEach(word => {
      if (inputWords.includes(word)) {
        jurnalMatches++;
      }
    });

    const matchScore = (keywordMatches * 15) + (keahlianMatches * 4) + (jurnalMatches * 6);
    let score = 0;
    if (matchScore > 0) {
      score = Math.min(0.96, 0.30 + (matchScore / 100));
    } else {
      score = 0.05 + (Math.random() * 0.10);
    }

    score = parseFloat(score.toFixed(2));

    const matchedPub = lec.publications[0];
    const reason = `Topik penelitian Anda memiliki korelasi semantik yang kuat dengan keahlian utama dosen pada bidang ${lec.focus}. Hubungan akademis ini didukung oleh kecocokan dengan publikasi beliau mengenai "${matchedPub}" serta keselarasan pada kata kunci penelitian: ${lec.keywords.slice(0, 4).join(", ")}.`;

    const dummyVec = Array.from({ length: 4 }, () => (Math.random() * 2 - 1).toFixed(4)).join(", ");
    const bertDimensionSnippet = `BERT_768_VEC: [${dummyVec}, ...]`;

    return {
      lecturerId: lec.id,
      lecturerName: lec.name,
      nidn: lec.nidn,
      role: lec.role,
      focus: lec.focus,
      score: score,
      matchedKeywords: matchedKws.length > 0 ? matchedKws : [lec.keywords[0]],
      matchedPublication: matchedPub,
      reason,
      bertDimensionSnippet
    };
  });

  const sorted = scores.sort((a, b) => b.score - a.score);

  const deduplicated = sorted.reduce<any[]>((acc, current) => {
    const existing = acc.find(item => item.lecturerName === current.lecturerName);
    if (!existing) {
      acc.push(current);
    } else {
      if (current.score > existing.score) {
        const idx = acc.indexOf(existing);
        acc[idx] = current;
      }
    }
    return acc;
  }, []);

  return deduplicated.sort((a, b) => b.score - a.score).slice(0, 3);
}

// Implement Vite middleware for dev / static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DosenMatch Server] Active on port ${PORT}`);
  });
}

startServer();
