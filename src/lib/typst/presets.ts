import { DocumentPreset, DocumentSettings, DocumentState } from "@/types/document";

export const PRESET_CONFIGS: Record<
  DocumentPreset,
  { label: string; description: string; settings: DocumentSettings }
> = {
  a4_document: {
    label: "A4 Document / Report",
    description: "Standard clean technical or executive report layout with header and page numbering.",
    settings: {
      paper: "a4",
      orientation: "portrait",
      margins: { top: "2.5cm", bottom: "2.5cm", left: "2.5cm", right: "2.5cm" },
      font: "Liberation Sans",
      accentColor: "#2563eb",
      showPageNumbers: true,
    },
  },
  letter_report: {
    label: "US Letter Report",
    description: "Standard US Letter formatted business document or formal brief.",
    settings: {
      paper: "us-letter",
      orientation: "portrait",
      margins: { top: "1in", bottom: "1in", left: "1in", right: "1in" },
      font: "Liberation Sans",
      accentColor: "#0f766e",
      showPageNumbers: true,
    },
  },
  presentation_16_9: {
    label: "Presentation Deck (16:9)",
    description: "Landscape card-based slide layout optimized for projection and export.",
    settings: {
      paper: "presentation-16-9",
      orientation: "landscape",
      margins: { top: "1.5cm", bottom: "1.5cm", left: "2cm", right: "2cm" },
      font: "Liberation Sans",
      accentColor: "#7c3aed",
      showPageNumbers: false,
    },
  },
  resume: {
    label: "Modern Resume / CV",
    description: "Compact, high-density two-column professional curriculum vitae.",
    settings: {
      paper: "a4",
      orientation: "portrait",
      margins: { top: "1.5cm", bottom: "1.5cm", left: "1.5cm", right: "1.5cm" },
      font: "Liberation Sans",
      accentColor: "#1e293b",
      showPageNumbers: false,
    },
  },
  cheatsheet: {
    label: "Reference Cheatsheet",
    description: "Multi-column quick reference cheat-sheet packed with code and tables.",
    settings: {
      paper: "a4",
      orientation: "landscape",
      margins: { top: "1cm", bottom: "1cm", left: "1cm", right: "1cm" },
      font: "Liberation Mono",
      accentColor: "#d97706",
      showPageNumbers: false,
    },
  },
};

export function createInitialDocument(preset: DocumentPreset, title?: string): DocumentState {
  const config = PRESET_CONFIGS[preset];
  const now = new Date().toISOString();

  if (preset === "resume") {
    const candidateName = title || "Alex Morgan";
    return {
      id: "doc-" + Math.random().toString(36).substring(2, 9),
      title: candidateName,
      preset,
      settings: { ...config.settings },
      updatedAt: now,
      blocks: [
        {
          id: "b-head",
          type: "heading",
          level: 1,
          text: candidateName,
          subtitle: "Senior Systems Engineer & Full-Stack Architect | alex@example.com | San Francisco, CA",
          align: "left",
        },
        {
          id: "b-profile",
          type: "card_profile",
          name: "Executive Summary",
          role: "Cloud & Systems Specialist",
          bio: "10+ years engineering distributed systems, container orchestration, and high-performance web tooling.",
          contact: "github.com/alexmorgan • linkedin.com/in/alexmorgan",
        },
        {
          id: "b-cols-1",
          type: "columns",
          columnsCount: 2,
          gutter: 14,
          columns: [
            {
              id: "col-left",
              blocks: [
                {
                  id: "b-exp-card",
                  type: "card",
                  title: "Experience: Principal Architect at Apex",
                  content: "- Led migration to Rust & WebAssembly microservices\n- Reduced build times by 74% across 80 engineers\n- Managed $2.4M multi-region cloud budget",
                  fillColor: "#f8fafc",
                  strokeColor: "#cbd5e1",
                  strokeWidth: 1,
                  radius: 6,
                  padding: 12,
                },
                {
                  id: "b-exp-card-2",
                  type: "card",
                  title: "Experience: Senior Engineer at Cloudflare",
                  content: "- Developed edge worker runtimes\n- Designed automated deployment and testing pipelines",
                  fillColor: "#f8fafc",
                  strokeColor: "#cbd5e1",
                  strokeWidth: 1,
                  radius: 6,
                  padding: 12,
                },
              ],
            },
            {
              id: "col-right",
              blocks: [
                {
                  id: "b-metric",
                  type: "card_metric",
                  label: "Uptime Reliability",
                  value: "99.995%",
                  change: "+0.15% YoY",
                  changeType: "positive",
                },
                {
                  id: "b-skills-card",
                  type: "card",
                  title: "Core Technologies",
                  content: "**Languages**: TypeScript, Rust, Go, Python\n**DevOps**: Docker, Kubernetes, Linux, CI/CD\n**Publishing**: Typst, LaTeX, Markdown",
                  fillColor: "#eff6ff",
                  strokeColor: "#bfdbfe",
                  strokeWidth: 1,
                  radius: 6,
                  padding: 12,
                },
              ],
            },
          ],
        },
      ],
    };
  }

  // Default A4 / Report starter template
  return {
    id: "doc-" + Math.random().toString(36).substring(2, 9),
    title: title || "Project Architecture & Design Document",
    preset,
    settings: { ...config.settings },
    updatedAt: now,
    blocks: [
      {
        id: "b-1",
        type: "heading",
        level: 1,
        text: title || "Project Architecture & Design Document",
        subtitle: "Generated dynamically via Typst Visual Drag & Drop Builder",
        align: "left",
      },
      {
        id: "b-2",
        type: "card_callout",
        variant: "tip",
        title: "Drag & Drop Canvas",
        message: "You can reorder cards, modify background styling, edit content inline, and inspect the real-time Typst code.",
      },
      {
        id: "b-3",
        type: "columns",
        columnsCount: 2,
        gutter: 16,
        columns: [
          {
            id: "c-1",
            blocks: [
              {
                id: "b-metric-1",
                type: "card_metric",
                label: "Preview Latency",
                value: "<45ms",
                change: "WASM Powered",
                changeType: "positive",
              },
            ],
          },
          {
            id: "c-2",
            blocks: [
              {
                id: "b-metric-2",
                type: "card_metric",
                label: "Export Pipeline",
                value: "Native CLI",
                change: "Docker Verified",
                changeType: "neutral",
              },
            ],
          },
        ],
      },
      {
        id: "b-4",
        type: "card",
        title: "System Overview",
        content: "This document was composed visually using structured cards and blocks. The background engine compiles the intermediate state into clean Typst markup and outputs publication-grade PDFs.",
        fillColor: "#f8fafc",
        strokeColor: "#e2e8f0",
        strokeWidth: 1,
        radius: 8,
        padding: 14,
      },
      {
        id: "b-5",
        type: "table",
        caption: "Component Pipeline Performance",
        headers: ["Module", "Responsibility", "Latency"],
        rows: [
          ["Visual Editor", "Drag-and-drop state management", "0ms (React)"],
          ["Typst AST Generator", "Converts state to pure Typst markup", "<1ms"],
          ["Client WASM Preview", "Renders instant vector SVG preview", "35-50ms"],
          ["Docker Typst CLI", "Generates publication PDF", "120ms"],
        ],
      },
    ],
  };
}
