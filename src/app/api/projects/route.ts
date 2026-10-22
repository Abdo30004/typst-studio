import { NextResponse } from "next/server";
import { ProjectService } from "@/server";
import { DocumentPreset } from "@/types/document";

export async function GET() {
  try {
    const projects = await ProjectService.listProjects();
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

    const project = await ProjectService.createProject({
      preset,
      title,
      description: body.description,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to create project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
