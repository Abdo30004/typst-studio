import fs from "fs/promises";
import path from "path";

export interface ParsedUploadResult {
  type: "csv" | "document_text" | "image";
  name: string;
  headers?: string[];
  rows?: string[][];
  content?: string;
  url?: string;
  size?: number;
}

export class UploadService {
  /**
   * Processes uploaded file buffers: parses CSV, extracts Markdown/Typst text,
   * or stores uploaded images in public storage with safe naming.
   */
  static async handleFileUpload(file: File): Promise<ParsedUploadResult> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name;
    const ext = path.extname(name).toLowerCase();

    // 1. CSV Data File
    if (ext === ".csv") {
      const csvContent = buffer.toString("utf-8");
      const lines = csvContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const parsedRows = lines.map((line) => {
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (matches) {
          return matches.map((m) => m.replace(/^"|"$/g, "").trim());
        }
        return line.split(",").map((c) => c.trim());
      });

      return {
        type: "csv",
        name,
        headers: parsedRows[0] || [],
        rows: parsedRows.slice(1),
      };
    }

    // 2. Markdown, Typst, or Plaintext Files
    if (ext === ".md" || ext === ".typ" || ext === ".txt") {
      return {
        type: "document_text",
        name,
        content: buffer.toString("utf-8"),
      };
    }

    // 3. Supported Image Formats
    const allowedImageExts = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"];
    if (allowedImageExts.includes(ext)) {
      const publicUploads = path.join(process.cwd(), "public", "uploads");
      const rootUploads = path.join(process.cwd(), "uploads");
      await fs.mkdir(publicUploads, { recursive: true });
      await fs.mkdir(rootUploads, { recursive: true }).catch(() => {});

      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(publicUploads, uniqueName);

      await fs.writeFile(filePath, buffer);

      // Also mirror to root uploads folder if distinct
      try {
        const rootFilePath = path.join(rootUploads, uniqueName);
        if (rootFilePath !== filePath) {
          await fs.writeFile(rootFilePath, buffer);
        }
      } catch {
        // Non-critical mirror
      }

      return {
        type: "image",
        name,
        url: `/uploads/${uniqueName}`,
        size: buffer.length,
      };
    }

    throw new Error(`Unsupported file type: ${ext}`);
  }
}
