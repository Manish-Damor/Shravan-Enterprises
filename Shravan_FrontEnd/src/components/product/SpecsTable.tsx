import React from "react";
import SpecsAccordion from "./SpecsAccordion";

export default function SpecsTable({ specs }: { specs: any }) {
  if (!specs) return <div className="text-sm text-muted mt-2">Technical specifications not provided.</div>;
  // If specs is an array of rows, convert to object; otherwise use as-is
  const normalized = Array.isArray(specs)
    ? specs.reduce((acc: Record<string, any>, row: any, i: number) => {
        const key = row?.label ?? row?.name ?? row?.key ?? `row-${i + 1}`;
        acc[String(key)] = row?.value ?? row?.val ?? row?.detail ?? row ?? "";
        return acc;
      }, {})
    : typeof specs === "object"
    ? specs
    : { value: specs };

  return <SpecsAccordion data={normalized} />;
}
