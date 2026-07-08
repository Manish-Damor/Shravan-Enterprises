type SpecRow = {
  property: string;
  value: string;
  unit?: string | null;
  notes?: string | null;
};

function normalizeSpecRows(specs: unknown): SpecRow[] {
  if (!Array.isArray(specs)) return [];

  return specs
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const property = String(
        item.property ?? item.label ?? item.name ?? item.key ?? "",
      ).trim();
      if (!property) return null;

      return {
        property,
        value: String(item.value ?? item.val ?? item.detail ?? "").trim(),
        unit: String(item.unit ?? "").trim() || null,
        notes: String(item.notes ?? item.description ?? "").trim() || null,
      };
    })
    .filter((row): row is SpecRow => row !== null);
}

function normalizeSpecEntries(specs: unknown) {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];

  return Object.entries(specs as Record<string, unknown>)
    .map(([key, value]) => ({
      label: key,
      value: String(value ?? "").trim(),
    }))
    .filter((entry) => entry.label && entry.value);
}

export default function SpecsTable({
  specs,
  summary,
}: {
  specs: unknown;
  summary?: string | null;
}) {
  const rows = normalizeSpecRows(specs);
  const entries = rows.length === 0 ? normalizeSpecEntries(specs) : [];
  const hasContent =
    Boolean(summary?.trim()) || rows.length > 0 || entries.length > 0;

  return (
    <section className="rounded-[2rem] border border-border bg-card p-7 shadow-card md:p-9">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
        Technical Details
      </div>
      <h2 className="mt-3 text-3xl font-bold text-foreground">
        Specifications
      </h2>

      {!hasContent ? (
        <p className="mt-5 text-sm text-muted-foreground">
          Technical specifications not provided.
        </p>
      ) : null}

      {summary?.trim() ? (
        <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground md:text-lg">
          {summary}
        </p>
      ) : null}

      {rows.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-border">
          <div className="grid grid-cols-[1.2fr_1fr] gap-4 border-b border-border bg-secondary/45 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:grid-cols-[1.2fr_0.9fr_0.6fr_1fr]">
            <div>Property</div>
            <div>Value</div>
            <div className="hidden md:block">Unit</div>
            <div className="hidden md:block">Notes</div>
          </div>
          <div className="divide-y divide-border">
            {rows.map((row) => (
              <div
                key={`${row.property}-${row.value}-${row.unit ?? ""}`}
                className="grid grid-cols-[1.2fr_1fr] gap-4 px-5 py-4 text-sm text-foreground md:grid-cols-[1.2fr_0.9fr_0.6fr_1fr]"
              >
                <div className="font-semibold">{row.property}</div>
                <div>{row.value || "-"}</div>
                <div className="hidden md:block">{row.unit || "-"}</div>
                <div className="hidden md:block text-muted-foreground">
                  {row.notes || "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {rows.length === 0 && entries.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="rounded-[1.5rem] border border-border bg-secondary/35 px-5 py-4"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                {entry.label}
              </div>
              <div className="mt-2 text-sm leading-7 text-foreground">
                {entry.value}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
