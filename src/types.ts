export type Role = "mahasiswa" | "dosen" | "kaprodi" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  nim_nidn: string;
  avatar?: string;
  password?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  sintaId: string;
  role: string;
  focus: string;
  publications: string[];
}

export interface MatchResult {
  lecturerId: string;
  lecturerName: string;
  sintaId: string;
  role: string;
  focus: string;
  score: number;
  matchedKeywords: string[];
  matchedPublication: string;
  matchedPublicationLink?: string;
  reason: string;
  bertDimensionSnippet: string;
}

export type ViewState = "landing" | "login" | "analysis" | "dashboard" | "blueprint";
