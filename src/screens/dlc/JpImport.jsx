import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, KPI, Field, Input, Select, SuccessNote } from "../../components/ui/kit.jsx";
import { JP_IMPORTS } from "../../data/dlc_admin.js";

export default function JpImport({ onBack }) {
  const [rows, setRows] = useState(JP_IMPORTS.map((r) => ({ ...r })));
  const [range, setRange] = useState("");
  const [source, setSource] = useState("Jeevan Pramaan API");
  const [count, setCount] = useState("");
  const [flash, setFlash] = useState("");
  const total = rows.reduce((s, r) => s + r.count, 0);
  const imp = () => {
    setRows((rs) => [{ id: "J" + (rs.length + 1), range, source, count: Number(count), date: "Today" }, ...rs]);
    setFlash(`Imported ${Number(count).toLocaleString("en-IN")} DLC records from ${source}.`); setRange(""); setCount(""); setTimeout(() => setFlash(""), 2800);
  };
  const cols = [
    { key: "range", label: "Period", render: (r) => <span className="font-semibold text-foreground">{r.range}</span> },
    { key: "source", label: "Source" },
    { key: "count", label: "Records", render: (r) => <span className="font-bold text-success">{r.count.toLocaleString("en-IN")}</span> },
    { key: "date", label: "Imported" },
  ];
  return (
    <ModuleShell icon="repeat" title="Jeevan Pramaan Import" desc="Import aggregate DLC counts by date range from external sources." onBack={onBack}>
      {flash && <SuccessNote title="Imported">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-2">
        <KPI label="Total imported" value={total.toLocaleString("en-IN")} sub="DLC records" icon="database" tone="success" />
        <KPI label="Import batches" value={rows.length} sub="on record" icon="repeat" tone="primary" />
      </div>
      <SectionCard title="New import" desc="Pull aggregate counts for a period." icon="repeat">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Period / range" required><Input value={range} onChange={(e) => setRange(e.target.value)} placeholder="e.g. 21–30 Jun 2026" /></Field>
          <Field label="Source"><Select options={["Jeevan Pramaan API", "IPPB bulk", "CSC aggregate", "Bank upload"]} value={source} onChange={(e) => setSource(e.target.value)} /></Field>
          <Field label="Record count" required><Input type="number" value={count} onChange={(e) => setCount(e.target.value)} /></Field>
        </div>
        <Button variant="saffron" className="mt-4" disabled={!range || !count} onClick={imp}><Icon name="repeat" size={16} /> {range && count ? "Run import" : "Fill required fields"}</Button>
      </SectionCard>
      <SectionCard title="Import history" icon="database"><DataTable columns={cols} rows={rows} /></SectionCard>
    </ModuleShell>
  );
}
