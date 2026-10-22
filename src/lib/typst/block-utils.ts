import { DocumentBlock, ColumnsBlock, GridLayoutBlock } from "@/types/document";

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
    if (b.type === "grid_layout") {
      const grid = b as GridLayoutBlock;
      for (const slot of grid.slots) {
        const found = findBlockById(slot.blocks, id);
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
    if (b.type === "grid_layout") {
      const grid = b as GridLayoutBlock;
      return {
        ...grid,
        slots: grid.slots.map((s) => ({
          ...s,
          blocks: updateBlockInList(s.blocks, blockId, updated),
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
      if (b.type === "grid_layout") {
        const grid = b as GridLayoutBlock;
        return {
          ...grid,
          slots: grid.slots.map((s) => ({
            ...s,
            blocks: deleteBlockInList(s.blocks, blockId),
          })),
        };
      }
      return b;
    });
}

export function insertBlockIntoSlot(
  blocks: DocumentBlock[],
  gridId: string,
  slotId: string,
  newBlock: DocumentBlock
): DocumentBlock[] {
  return blocks.map((b) => {
    if (b.id === gridId && b.type === "grid_layout") {
      const grid = b as GridLayoutBlock;
      return {
        ...grid,
        slots: grid.slots.map((s) =>
          s.id === slotId ? { ...s, blocks: [...s.blocks, newBlock] } : s
        ),
      };
    }
    if (b.type === "grid_layout") {
      const grid = b as GridLayoutBlock;
      return {
        ...grid,
        slots: grid.slots.map((s) => ({
          ...s,
          blocks: insertBlockIntoSlot(s.blocks, gridId, slotId, newBlock),
        })),
      };
    }
    return b;
  });
}
