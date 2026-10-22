import { DocumentBlock, ColumnsBlock } from "@/types/document";

export function findBlockById(blocks: DocumentBlock[], id: string): DocumentBlock | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.type === "columns") {
      const cols = b as ColumnsBlock;
      for (const col of cols.columns) {
        const found = findBlockById(col.blocks, id);
        if (found) return found;
      }
    }
  }
  return null;
}

export function updateBlockInList(
  blocks: DocumentBlock[],
  blockId: string,
  updated: Partial<DocumentBlock>
): DocumentBlock[] {
  return blocks.map((b) => {
    if (b.id === blockId) {
      return { ...b, ...updated } as DocumentBlock;
    }
    if (b.type === "columns") {
      const cols = b as ColumnsBlock;
      return {
        ...cols,
        columns: cols.columns.map((c) => ({
          ...c,
          blocks: updateBlockInList(c.blocks, blockId, updated),
        })),
      };
    }
    return b;
  });
}

export function deleteBlockInList(blocks: DocumentBlock[], blockId: string): DocumentBlock[] {
  return blocks
    .filter((b) => b.id !== blockId)
    .map((b) => {
      if (b.type === "columns") {
        const cols = b as ColumnsBlock;
        return {
          ...cols,
          columns: cols.columns.map((c) => ({
            ...c,
            blocks: deleteBlockInList(c.blocks, blockId),
          })),
        };
      }
      return b;
    });
}
