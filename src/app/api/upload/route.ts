import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const name = file.name;
    const ext = path.extname(name).toLowerCase();

    // 1. If CSV data file
    if (ext === ".csv") {
      const csvContent = buffer.toString("utf-8");
      const lines = csvContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      const parsedRows = lines.map((line) => {
        // Basic CSV split supporting quoted strings
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (matches) {
          return matches.map((m) => m.replace(/^"|"$/g, "").trim());
        }
        return line.split(",").map((c) => c.trim());
      });

      const headers = parsedRows[0] || [];
      const rows = parsedRows.slice(1);

      return NextResponse.json({
        type: "csv",
        name,
        headers,
        rows,
      });
    }

    // 2. If Markdown or Typst text file
    if (ext === ".md" || ext === ".typ" || ext === ".txt") {
      const textContent = buffer.toString("utf-8");
      return NextResponse.json({
        type: "document_text",
        name,
        content: textContent,
      });
    }

    // 3. If Image file (PNG, JPG, SVG, WebP)
    const allowedImageExts = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"];
    if (allowedImageExts.includes(ext)) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueName}`;

      return NextResponse.json({
        type: "image",
        name,
        url: publicUrl,
        size: buffer.length,
      });
    }

    return NextResponse.json(
      { error: `Unsupported file type: ${ext}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
