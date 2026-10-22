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
   * using the native Typst CLI installed in the environment.
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

    const projectRoot = process.cwd();
    const exportDir = path.join(
      projectRoot,
      ".tmp-exports",
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    );

    await fs.mkdir(exportDir, { recursive: true });

    // Fallback placeholder box for missing or broken images
    const placeholderMarkup = (width = "100%") =>
      `#rect(fill: rgb("#f8fafc"), stroke: 1pt + rgb("#cbd5e1"), radius: 4pt, width: ${width}, height: 60pt)[#align(center + horizon)[#text(size: 8pt, fill: rgb("#94a3b8"))[Image Unavailable]]]`;

    // 1. Process all remote http/https images: download and place locally in exportDir
    const remoteImageRegex = /#image\("((?:https?:\/\/)[^"]+)"([^)]*)\)/g;
    const remoteMatches = [...typstCode.matchAll(remoteImageRegex)];

    for (let i = 0; i < remoteMatches.length; i++) {
      const match = remoteMatches[i];
      let remoteUrl = match[1];
      const extraArgs = match[2] || "";

      // If it's an Unsplash URL with auto=format, ensure jpeg format for Typst compatibility
      if (remoteUrl.includes("images.unsplash.com")) {
        if (!remoteUrl.includes("fm=")) {
          remoteUrl += (remoteUrl.includes("?") ? "&" : "?") + "fm=jpg";
        }
      }

      try {
        const response = await fetch(remoteUrl, {
          signal: AbortSignal.timeout(7000),
          headers: {
            Accept: "image/jpeg,image/png,image/svg+xml,*/*",
            "User-Agent": "Typst-Studio/1.0",
          },
        });

        if (response.ok) {
          const imgBuffer = Buffer.from(await response.arrayBuffer());
          let ext = ".jpg";

          // Detect format from magic bytes
          if (
            imgBuffer.length >= 8 &&
            imgBuffer[0] === 0x89 &&
            imgBuffer[1] === 0x50 &&
            imgBuffer[2] === 0x4e &&
            imgBuffer[3] === 0x47
          ) {
            ext = ".png";
          } else if (
            imgBuffer.length >= 3 &&
            imgBuffer[0] === 0xff &&
            imgBuffer[1] === 0xd8 &&
            imgBuffer[2] === 0xff
          ) {
            ext = ".jpg";
          } else if (imgBuffer.length >= 4 && imgBuffer.subarray(0, 4).toString() === "GIF8") {
            ext = ".gif";
          } else if (imgBuffer.subarray(0, 100).toString().toLowerCase().includes("<svg")) {
            ext = ".svg";
          } else {
            const parsedUrl = new URL(remoteUrl);
            const rawExt = path.extname(parsedUrl.pathname).toLowerCase();
            if ([".png", ".jpg", ".jpeg", ".svg", ".gif"].includes(rawExt)) {
              ext = rawExt;
            }
          }

          const localName = `remote-${Date.now()}-${i}${ext}`;
          const localPath = path.join(exportDir, localName);
          await fs.writeFile(localPath, imgBuffer);

          // Use localName relative to document.typ so Typst resolves it directly without path issues
          typstCode = typstCode.replace(match[0], `#image("${localName}"${extraArgs})`);
        } else {
          // Download failed with status != 200, replace with safe vector placeholder
          typstCode = typstCode.replace(match[0], placeholderMarkup());
        }
      } catch (err) {
        console.warn(`Could not download remote image ${remoteUrl}, using placeholder:`, err);
        typstCode = typstCode.replace(match[0], placeholderMarkup());
      }
    }

    // 2. Process all local /uploads/ or public/uploads/ or local image references
    const localImageRegex = /#image\("([^"]+)"([^)]*)\)/g;
    const localMatches = [...typstCode.matchAll(localImageRegex)];

    for (let i = 0; i < localMatches.length; i++) {
      const match = localMatches[i];
      const imgPath = match[1];
      const extraArgs = match[2] || "";

      // Skip already processed local files in exportDir
      if (imgPath.startsWith("remote-") || imgPath.startsWith("asset-")) {
        continue;
      }

      const basename = path.basename(imgPath);
      const candidates = [
        path.join(projectRoot, imgPath),
        path.join(projectRoot, "public", imgPath.replace(/^\/?(public\/)?/, "")),
        path.join(projectRoot, "uploads", basename),
        path.join(projectRoot, "public", "uploads", basename),
        path.join("/data", basename),
      ];

      let foundPath: string | null = null;
      for (const candidate of candidates) {
        try {
          await fs.access(candidate);
          foundPath = candidate;
          break;
        } catch {
          // Continue searching candidates
        }
      }

      if (foundPath) {
        const ext = path.extname(foundPath) || ".png";
        const assetName = `asset-${i}-${basename}`;
        const destPath = path.join(exportDir, assetName);
        await fs.copyFile(foundPath, destPath);
        typstCode = typstCode.replace(match[0], `#image("${assetName}"${extraArgs})`);
      } else {
        // Local file not found on disk, replace with safe vector placeholder
        typstCode = typstCode.replace(match[0], placeholderMarkup());
      }
    }

    const typstFile = path.join(exportDir, "document.typ");
    const pdfFile = path.join(exportDir, "document.pdf");

    await fs.writeFile(typstFile, typstCode, "utf-8");

    // Check if system fonts directory exists
    let fontPathArg = "";
    try {
      await fs.access("/usr/share/fonts");
      fontPathArg = '--font-path "/usr/share/fonts"';
    } catch {
      // Font path not available on host/Windows, fallback to system discovery
    }

    try {
      await execAsync(
        `typst compile ${fontPathArg} --root "${exportDir}" "${typstFile}" "${pdfFile}"`,
        {
          timeout: 25000,
        }
      );

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
