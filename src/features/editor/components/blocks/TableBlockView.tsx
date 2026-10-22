"use client";

import React, { useRef } from "react";
import { TableBlock } from "@/types/document";
import { Plus, Trash2, Upload, Table as TableIcon } from "lucide-react";

interface Props {
  block: TableBlock;
  onChange: (updated: Partial<TableBlock>) => void;
}

export function TableBlockView({ block, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headers = block.headers || ["Col 1", "Col 2"];
  const rows = block.rows || [["", ""]];

  const handleHeaderChange = (index: number, val: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = val;
    onChange({ headers: newHeaders });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, val: string) => {
    const newRows = rows.map((r, rIdx) => {
      if (rIdx !== rowIndex) return r;
      const newRow = [...r];
      newRow[colIndex] = val;
      return newRow;
    });
    onChange({ rows: newRows });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Col ${headers.length + 1}`];
    const newRows = rows.map((r) => [...r, ""]);
    onChange({ headers: newHeaders, rows: newRows });
  };

  const addRow = () => {
    const newRows = [...rows, Array(headers.length).fill("")];
    onChange({ rows: newRows });
  };

  const deleteRow = (rowIndex: number) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, idx) => idx !== rowIndex);
    onChange({ rows: newRows });
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.type === "csv" && data.headers && data.rows) {
        onChange({
          headers: data.headers,
          rows: data.rows,
          caption: data.name.replace(/\.[^/.]+$/, ""),
        });
      }
    } catch (err) {
      console.error("CSV upload failed:", err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <TableIcon className="w-4 h-4 text-blue-400" />
          <input
            type="text"
            value={block.caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="Table Caption..."
            className="bg-transparent border-0 outline-none p-0 text-xs font-semibold text-slate-300 placeholder:text-slate-600 focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
          >
            <Upload className="w-3 h-3" /> Upload CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="hidden"
          />
          <button
            onClick={addColumn}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700"
          >
            + Column
          </button>
          <button
            onClick={addRow}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700"
          >
            + Row
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="bg-slate-800/80 border-b border-slate-700">
              {headers.map((h, colIdx) => (
                <th key={colIdx} className="p-2 border-r border-slate-700/60 last:border-r-0">
                  <input
                    type="text"
                    value={h}
                    onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                    className="w-full bg-transparent font-semibold border-0 outline-none p-0 text-slate-200 focus:ring-0"
                  />
                </th>
              ))}
              <th className="w-8 p-1"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-slate-800/80 hover:bg-slate-900/50">
                {headers.map((_, colIdx) => (
                  <td key={colIdx} className="p-2 border-r border-slate-800/60 last:border-r-0">
                    <input
                      type="text"
                      value={row[colIdx] || ""}
                      onChange={(e) => handleCellChange(rIdx, colIdx, e.target.value)}
                      placeholder="..."
                      className="w-full bg-transparent border-0 outline-none p-0 text-slate-300 focus:ring-0"
                    />
                  </td>
                ))}
                <td className="p-1 text-center">
                  <button
                    onClick={() => deleteRow(rIdx)}
                    className="text-slate-500 hover:text-red-400 p-1"
                    title="Delete row"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
