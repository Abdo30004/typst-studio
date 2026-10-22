import { DocumentPreset, DocumentState } from "./document";

export interface ProjectSummary {
  id: string;
  title: string;
  description: string | null;
  preset: DocumentPreset;
  updatedAt: string;
  createdAt: string;
}

export interface ProjectDetail extends ProjectSummary {
  documentState: DocumentState | null;
}

export interface ExportPdfRequest {
  documentState?: DocumentState;
  typstCode?: string;
  filename?: string;
}

export interface UploadFileResponse {
  type: "csv" | "document_text" | "image";
  name: string;
  headers?: string[];
  rows?: string[][];
  content?: string;
  url?: string;
  size?: number;
}
