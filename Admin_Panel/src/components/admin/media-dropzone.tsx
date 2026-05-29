import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";

type MediaValue = {
  name: string;
  url: string;
  type: string;
};

async function fileToMediaValue(file: File): Promise<MediaValue> {
  // Read as data URL and upload to backend upload endpoint.
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  // dataUrl is like 'data:<type>;base64,<data>'
  const parts = dataUrl.split(",");
  const base64 = parts[1] ?? "";

  try {
    const res = await fetch("/api/uploads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream", data: base64 }),
    });
    if (!res.ok) throw new Error("Upload failed");
    const payload = await res.json();
    const url = payload.url || payload.path || payload.id ? `/api/uploads/${payload.id || payload.insertedId || payload.path}` : dataUrl;
    return { name: file.name, type: file.type, url };
  } catch (err) {
    // fallback to dataUrl so UX still works offline
    return { name: file.name, type: file.type, url: dataUrl };
  }
}

export function MediaDropzone({
  label,
  value,
  multiple = false,
  accept,
  onChange,
}: {
  label: string;
  value: MediaValue | MediaValue[] | null;
  multiple?: boolean;
  accept?: string;
  onChange: (value: MediaValue | MediaValue[] | null) => void;
}) {
  const id = useId();
  const [dragging, setDragging] = useState(false);
  const items = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next = await Promise.all(Array.from(files).map(fileToMediaValue));
    onChange(multiple ? next : next[0] ?? null);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-slate-700">{label}</div>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-5 text-center transition-all",
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <UploadCloud className="h-5 w-5 text-slate-500" />
        <div className="mt-2 text-sm font-medium text-slate-800">Drop files here or click to browse</div>
        <div className="mt-1 text-xs text-slate-500">{multiple ? "Multiple files supported" : "Single file upload"}</div>
        <input id={id} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(event) => void handleFiles(event.target.files)} />
      </label>

      {items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div key={`${item.name}-${index}`} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="aspect-video bg-slate-50">
                {item.type?.startsWith?.("image/") ? (
                  <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-xs text-slate-500">
                    {item.name}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-2">
                <div className="min-w-0 flex-1 truncate text-xs text-slate-600">{item.name}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    if (multiple) {
                      onChange(items.filter((_, current) => current !== index));
                    } else {
                      onChange(null);
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export type { MediaValue };
