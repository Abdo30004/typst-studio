import { prisma } from "@/lib/prisma";
import { createInitialDocument } from "@/lib/typst/presets";
import { DocumentPreset, DocumentState } from "@/types/document";

export interface CreateProjectDTO {
  title?: string;
  preset?: DocumentPreset;
  description?: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  documentState?: DocumentState;
}

export class ProjectService {
  /**
   * Retrieves all projects ordered by most recently modified.
   */
  static async listProjects() {
    return prisma.project.findMany({
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
  }

  /**
   * Finds a project by its unique ID.
   */
  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) return null;

    let parsedDocumentState: DocumentState | null = null;
    try {
      parsedDocumentState = JSON.parse(project.documentState);
    } catch {
      parsedDocumentState = null;
    }

    return {
      ...project,
      documentState: parsedDocumentState,
    };
  }

  /**
   * Creates a new document project initialized with template preset data.
   */
  static async createProject(dto: CreateProjectDTO) {
    const preset = dto.preset || "a4_document";
    const title = dto.title || "Untitled Document";
    const initialState = createInitialDocument(preset, title);

    const project = await prisma.project.create({
      data: {
        title,
        preset,
        description: dto.description || null,
        documentState: JSON.stringify(initialState),
      },
    });

    return {
      ...project,
      documentState: initialState,
    };
  }

  /**
   * Updates project title, description, or document state.
   */
  static async updateProject(id: string, dto: UpdateProjectDTO) {
    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.documentState !== undefined) {
      updateData.documentState = JSON.stringify(dto.documentState);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return {
      ...updated,
      documentState: dto.documentState || null,
    };
  }

  /**
   * Deletes a project by ID.
   */
  static async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }
}
