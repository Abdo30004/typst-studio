import { NextResponse } from "next/server";
import { ExportService } from "@/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { pdfBuffer, filename } = await ExportService.compileToPdf({
      documentState: body.documentState,
      typstCode: body.typstCode,
      filename: body.filename,
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("PDF export controller error:", error);
    return NextResponse.json(
      {
        error: error.message || "Export failed",
        details: error.details,
        code: error.code,
      },
      { status: 500 }
    );
  }
}
