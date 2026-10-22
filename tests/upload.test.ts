import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { UploadService } from "../src/server/services/upload.service";
import { GET as getUploadHandler } from "../src/app/uploads/[...path]/route";
import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

describe("Image Upload & Serving Engine", () => {
  const samplePngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const sampleBuffer = Buffer.from(samplePngBase64, "base64");
  let uploadedUrl: string = "";
  let uploadedFilename: string = "";

  it("handles image upload and returns valid /uploads/ URL", async () => {
    const file = new File([sampleBuffer], "test-avatar.png", { type: "image/png" });
    const result = await UploadService.handleFileUpload(file);

    expect(result.type).toBe("image");
    expect(result.name).toBe("test-avatar.png");
    expect(result.url).toMatch(/^\/uploads\/\d+-[a-z0-9]+\.png$/);

    uploadedUrl = result.url!;
    uploadedFilename = path.basename(result.url!);

    // Check file exists on disk
    const publicPath = path.join(process.cwd(), "public", "uploads", uploadedFilename);
    const stat = await fs.stat(publicPath);
    expect(stat.size).toBe(sampleBuffer.length);
  });

  it("serves uploaded image through /uploads/[...path] route handler with 200 OK and correct mime type", async () => {
    expect(uploadedFilename).toBeTruthy();

    const req = new NextRequest(`http://localhost:3000${uploadedUrl}`);
    const res = await getUploadHandler(req, { params: Promise.resolve({ path: [uploadedFilename] }) });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("image/png");
    expect(res.headers.get("Cache-Control")).toContain("public");

    const arrayBuf = await res.arrayBuffer();
    expect(arrayBuf.byteLength).toBe(sampleBuffer.length);
  });

  it("blocks directory traversal attempts with safety checks", async () => {
    const req = new NextRequest("http://localhost:3000/uploads/../../etc/passwd");
    const res = await getUploadHandler(req, {
      params: Promise.resolve({ path: ["..", "..", "etc", "passwd"] }),
    });

    // Should return 404 Not Found or 403 Forbidden
    expect([403, 404]).toContain(res.status);
  });

  afterAll(async () => {
    // Cleanup generated test files
    if (uploadedFilename) {
      const publicPath = path.join(process.cwd(), "public", "uploads", uploadedFilename);
      const rootPath = path.join(process.cwd(), "uploads", uploadedFilename);
      await fs.unlink(publicPath).catch(() => {});
      await fs.unlink(rootPath).catch(() => {});
    }
  });
});
