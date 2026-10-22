import { NextResponse } from "next/server";
import { UploadService } from "@/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await UploadService.handleFileUpload(file);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Upload controller error:", error);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: error.message?.includes("Unsupported") ? 400 : 500 }
    );
  }
}
