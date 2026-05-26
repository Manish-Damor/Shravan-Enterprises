import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export type RepeatableRow = Record<string, string>;

export function RepeatableEditor({
  title,
  columns,
  rows,
  onChange,
  dense = false,
}: {
  title: string;
  columns: { key: string; label: string; placeholder?: string; textarea?: boolean }[];
  rows: RepeatableRow[];
  onChange: (rows: RepeatableRow[]) => void;
  dense?: boolean;
}) {
  const updateRow = (index: number, key: string, value: string) => {
    const next = rows.map((row, current) => (current === index ? { ...row, [key]: value } : row));
    onChange(next);
  };

  const addRow = () => {
    const nextRow: RepeatableRow = {};
    columns.forEach((column) => {
      nextRow[column.key] = "";
    });
    onChange([...rows, nextRow]);
  };

  return (
    <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-500">Add unlimited rows and keep them optional.</div>
        </div>
        <Button type="button" variant="outline" onClick={addRow}>
          <Plus className="mr-2 h-4 w-4" /> Add row
        </Button>
      </div>

      <div className="space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            No rows yet. Add one to build your section.
          </div>
        ) : null}

        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className={`grid gap-3 ${dense ? "md:grid-cols-2" : "md:grid-cols-4"}`}>
              {columns.map((column) => (
                <div key={column.key} className="space-y-1.5">
                  <div className="text-xs font-medium text-slate-600">{column.label}</div>
                  {column.textarea ? (
                    <Textarea
                      rows={dense ? 2 : 3}
                      value={row[column.key] ?? ""}
                      onChange={(event) => updateRow(rowIndex, column.key, event.target.value)}
                      placeholder={column.placeholder}
                    />
                  ) : (
                    <Input
                      value={row[column.key] ?? ""}
                      onChange={(event) => updateRow(rowIndex, column.key, event.target.value)}
                      placeholder={column.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(rows.filter((_, current) => current !== rowIndex))}
              >
                <Trash2 className="mr-2 h-4 w-4 text-rose-500" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
