import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SpecsAccordion({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const entries = Object.entries(data ?? {});
  const [open, setOpen] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpen((current) => ({ ...current, [key]: !current[key] }));
  }

  if (entries.length === 0) {
    return (
      <div className="mt-2 text-sm text-muted">
        Technical specifications not provided.
      </div>
    );
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">Technical Specifications</h3>
      <div className="mt-4 space-y-2">
        {entries.map(([key, value]) => {
          const isOpen = Boolean(open[key]);

          return (
            <div key={key} className="overflow-hidden rounded-md bg-white/4">
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <div className="font-medium">{key}</div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>
              {isOpen ? (
                <div className="px-4 pb-3 text-sm text-foreground/90">
                  {typeof value === "object" ? (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    String(value ?? "-")
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
