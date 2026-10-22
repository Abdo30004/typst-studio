import { NextResponse } from "next/server";
import { generateTypstDocument } from "@/lib/typst/generator";
import { DocumentState } from "@/types/document";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  let exportDir: string | null = null;
  try {
    const body = await req.json();
    let typstCode: string = "";

    if (body.documentState) {
      typstCode = generateTypstDocument(body.documentState as DocumentState);
    } else if (body.typstCode) {
      typstCode = body.typstCode;
    }

    if (!typstCode) {
      return NextResponse.json({ error: "Missing typstCode or documentState" }, { status: 400 });
    }

    // Remap image URLs from /uploads/... to /public/uploads/... so Typst resolves them from projectRoot
    typstCode = typstCode.replace(/#image\("\/uploads\//g, '#image("/public/uploads/');

    const projectRoot = process.cwd();
    exportDir = path.join(
      projectRoot,
      ".tmp-exports",
      `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    );
    await fs.mkdir(exportDir, { recursive: true });

    const typstFile = path.join(exportDir, "document.typ");
    const pdfFile = path.join(exportDir, "document.pdf");

    await fs.writeFile(typstFile, typstCode, "utf-8");

    // Execute typst CLI with projectRoot as the root
    try {
      await execAsync(`typst compile --root "${projectRoot}" "${typstFile}" "${pdfFile}"`, {
        timeout: 25000,
      });

      const pdfBuffer = await fs.readFile(pdfFile);

      // Clean up temp export directory
      await fs.rm(exportDir, { recursive: true, force: true }).catch(() => {});

      const rawTitle = body.filename || body.documentState?.title || "document";
      const filename = rawTitle.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";

      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": pdfBuffer.length.toString(),
        },
      });
    } catch (compileErr: any) {
      console.error("Typst compile error:", compileErr);
      if (exportDir) {
        await fs.rm(exportDir, { recursive: true, force: true }).catch(() => {});
      }

      return NextResponse.json(
        {
          error: "Typst compilation failed",
          details: compileErr.stderr || compileErr.message,
          code: typstCode,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("PDF export API error:", error);
    if (exportDir) {
      await fs.rm(exportDir, { recursive: true, force: true }).catch(() => {});
    }
    return NextResponse.json({ error: error.message || "Export failed" }, { status: 500 });
  }
}
