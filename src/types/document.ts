export type DocumentPreset =
  | "a4_document"
  | "letter_report"
  | "presentation_16_9"
  | "resume"
  | "cheatsheet";

export interface DocumentSettings {
  paper: string;
  orientation: "portrait" | "landscape";
  margins: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  font: string;
  accentColor: string;
  paletteId?: string;
  showPageNumbers: boolean;
}

export type BlockType =
  | "heading"
  | "text"
  | "card"
  | "card_callout"
  | "card_metric"
  | "card_profile"
  | "columns"
  | "image"
  | "table"
  | "code"
  | "divider";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4;
  text: string;
  subtitle?: string;
  align: "left" | "center" | "right";
}

export interface TextBlock extends BaseBlock {
  type: "text";
  content: string;
  align?: "left" | "center" | "right" | "justify";
}

export interface CardBlock extends BaseBlock {
  type: "card";
  title?: string;
  content: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  radius?: number;
  padding?: number;
  hasShadow?: boolean;
}

export interface CalloutCardBlock extends BaseBlock {
  type: "card_callout";
  variant: "note" | "tip" | "warning" | "caution";
  title: string;
  message: string;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
}

export interface MetricCardBlock extends BaseBlock {
  type: "card_metric";
  label: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  fillColor?: string;
  strokeColor?: string;
}

export interface ProfileCardBlock extends BaseBlock {
  type: "card_profile";
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  contact?: string;
  fillColor?: string;
  strokeColor?: string;
  roleColor?: string;
}

export interface ColumnItem {
  id: string;
  blocks: DocumentBlock[];
}

export interface ColumnsBlock extends BaseBlock {
  type: "columns";
  columnsCount: 2 | 3;
  gutter: number;
  columns: ColumnItem[];
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  caption?: string;
  alt?: string;
  width?: string;
  align: "left" | "center" | "right";
}

export interface TableBlock extends BaseBlock {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
  isZebra?: boolean;
  headerBg?: string;
  borderColor?: string;
  headerColor?: string;
}

export interface CodeBlock extends BaseBlock {
  type: "code";
  language: string;
  code: string;
  filename?: string;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  style: "solid" | "dashed" | "dotted";
  spacing: number;
  color?: string;
  thickness?: number;
}

export type DocumentBlock =
  | HeadingBlock
  | TextBlock
  | CardBlock
  | CalloutCardBlock
  | MetricCardBlock
  | ProfileCardBlock
  | ColumnsBlock
  | ImageBlock
  | TableBlock
  | CodeBlock
  | DividerBlock;

export interface DocumentState {
  id: string;
  title: string;
  preset: DocumentPreset;
  settings: DocumentSettings;
  blocks: DocumentBlock[];
  updatedAt: string;
}
