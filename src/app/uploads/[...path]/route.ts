import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function getSearchDirectories(): string[] {
  const root = process.cwd();
  const dirs = [
    path.join(root, "public", "uploads"),
    path.join(root, "uploads"),
  ];
  if (process.env.UPLOAD_DIR) {
    const custom = path.isAbsolute(process.env.UPLOAD_DIR)
      ? process.env.UPLOAD_DIR
      : path.join(/*turbopackIgnore: true*/ root, process.env.UPLOAD_DIR);
    dirs.unshift(custom);
  }
  return [...new Set(dirs)];
}

interface RouteContext {
  params: Promise<{ path: string[] }> | { path: string[] };
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const resolved = await Promise.resolve(context.params);
    const segments = resolved?.path || [];

    if (!segments.length) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    // Protect against path traversal
    const safeRelativePath = path.normalize(path.join(...segments)).replace(/^(\.\.(\/|\\|$))+/, "");

    const searchDirs = getSearchDirectories();
    let foundPath: string | null = null;
    let fileStat = null;

    for (const dir of searchDirs) {
      const candidate = path.join(dir, safeRelativePath);
      // Double check containment within parent dir
      if (!candidate.startsWith(dir)) continue;

      try {
        const stat = await fs.stat(candidate);
        if (stat.isFile()) {
          foundPath = candidate;
          fileStat = stat;
          break;
        }
      } catch {
        // Continue searching in next dir
      }
    }

    if (!foundPath || !fileStat) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(/*turbopackIgnore: true*/ foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileStat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    console.error("Static file serving error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
