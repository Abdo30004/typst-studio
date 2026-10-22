import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { generateTypstDocument } from "@/lib/typst/generator";
import { DocumentState } from "@/types/document";

const execAsync = promisify(exec);

export interface CompilePdfOptions {
  documentState?: DocumentState;
  typstCode?: string;
  filename?: string;
}

export interface CompilePdfResult {
  pdfBuffer: Buffer;
  filename: string;
}

export class ExportService {
  /**
   * Compiles Typst source code or DocumentState to a publication-grade PDF buffer
   * using the native Typst CLI installed in the container environment.
   */
  static async compileToPdf(options: CompilePdfOptions): Promise<CompilePdfResult> {
    let typstCode = "";

    if (options.documentState) {
      typstCode = generateTypstDocument(options.documentState);
    } else if (options.typstCode) {
      typstCode = options.typstCode;
    }

    if (!typstCode) {
      throw new Error("Missing typstCode or documentState for PDF compilation");
    }

    // Remap image URLs from /uploads/... or uploads/... to /public/uploads/... so Typst resolves them from projectRoot
    typstCode = typstCode.replace(/#image\("(?:\/public)?\/?uploads\//g, '#image("/public/uploads/');

    const projectRoot = process.cwd();
    const exportDir = path.join(
      projectRoot,
      ".tmp-exports",
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    );

    await fs.mkdir(exportDir, { recursive: true });

    // Download any external http/https images so Typst can bundle them locally from disk
    const remoteImageRegex = /#image\("(https?:\/\/[^"]+)"/g;
    const remoteMatches = [...typstCode.matchAll(remoteImageRegex)];
    for (const match of remoteMatches) {
      const remoteUrl = match[1];
      try {
        const response = await fetch(remoteUrl, { signal: AbortSignal.timeout(8000) });
        if (response.ok) {
          const imgBuffer = Buffer.from(await response.arrayBuffer());
          const urlObj = new URL(remoteUrl);
          const rawExt = path.extname(urlObj.pathname).toLowerCase();
          const ext = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif"].includes(rawExt) ? rawExt : ".png";
          const localName = `remote-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
          const localPath = path.join(exportDir, localName);
          await fs.writeFile(localPath, imgBuffer);
          typstCode = typstCode.replaceAll(match[0], `#image("${localPath.replace(/\\/g, "/")}"`);
        }
      } catch (e) {
        console.warn(`Failed to prefetch remote image ${remoteUrl}:`, e);
      }
    }

    // Ensure any referenced /public/uploads/ files exist in projectRoot/public/uploads
    const localUploadRegex = /#image\("\/public\/uploads\/([^"]+)"/g;
    const localMatches = [...typstCode.matchAll(localUploadRegex)];
    for (const lm of localMatches) {
      const filename = lm[1];
      const targetPath = path.join(projectRoot, "public", "uploads", filename);
      const altPath = path.join(projectRoot, "uploads", filename);
      try {
        await fs.access(targetPath);
      } catch {
        try {
          await fs.access(altPath);
          await fs.mkdir(path.dirname(targetPath), { recursive: true });
          await fs.copyFile(altPath, targetPath);
        } catch {
          // File does not exist in alt either
        }
      }
    }

    const typstFile = path.join(exportDir, "document.typ");
    const pdfFile = path.join(exportDir, "document.pdf");

    await fs.writeFile(typstFile, typstCode, "utf-8");

    try {
      await execAsync(`typst compile --root "${projectRoot}" "${typstFile}" "${pdfFile}"`, {
        timeout: 25000,
      });

      const pdfBuffer = await fs.readFile(pdfFile);

      // Clean up temp export directory
      await fs.rm(exportDir, { recursive: true, force: true }).catch(() => {});

      const rawTitle = options.filename || options.documentState?.title || "document";
      const sanitizedFilename = rawTitle.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";

      return {
        pdfBuffer,
        filename: sanitizedFilename,
      };
    } catch (compileErr: any) {
      await fs.rm(exportDir, { recursive: true, force: true }).catch(() => {});
      const details = compileErr.stderr || compileErr.message || "Compilation failed";
      const error: any = new Error(`Typst compilation failed: ${details}`);
      error.details = details;
      error.code = typstCode;
      throw error;
    }
  }
}
