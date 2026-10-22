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

    // Remap image URLs from /uploads/... to /public/uploads/... so Typst resolves them from projectRoot
    typstCode = typstCode.replace(/#image\("\/uploads\//g, '#image("/public/uploads/');

    const projectRoot = process.cwd();
    const exportDir = path.join(
      projectRoot,
      ".tmp-exports",
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    );

    await fs.mkdir(exportDir, { recursive: true });

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
