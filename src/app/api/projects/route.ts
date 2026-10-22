import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInitialDocument } from "@/lib/typst/presets";
import { DocumentPreset } from "@/types/document";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        preset: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to list projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const preset = (body.preset as DocumentPreset) || "a4_document";
    const title = body.title || "Untitled Document";

    const initialState = createInitialDocument(preset, title);

    const project = await prisma.project.create({
      data: {
        title,
        preset,
        description: body.description || null,
        documentState: JSON.stringify(initialState),
      },
    });

    return NextResponse.json({
      ...project,
      documentState: initialState,
    });
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
