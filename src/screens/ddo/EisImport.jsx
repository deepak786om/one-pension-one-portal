import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, SuccessNote, Input } from "../../components/ui/kit.jsx";
import { EIS_POOL } from "../../data/ddo.js";

export default function EisImport({ onBack }) {
  const [rows, setRows] = useState(EIS_POOL.map((r) => ({ ...r })));
  const [q, setQ] = useState("");
  const [flash, setFlash] = useState("");
  const list = rows.filter((r) => !q || (r.name + r.pan).toLowerCase().includes(q.toLowerCase()));
  const imp = (id) => {
    const r = rows.find((x) => x.id === id);
    setRows((rs) => rs.map((x) => x.id === id ? { ...x, imported: true } : x));
    setFlash(`${r.name} imported from EIS — a pension case has been created.`); setTimeout(() => setFlash(""), 2600);
  };
  const cols = [
    { key: "name", label: "Employee", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.designation} · {r.pan}</div></div> },
    { key: "dor", label: "Retires" },
    { key: "act", label: "", render: (r) => r.imported ? <StatusPill tone="ok">Imported</StatusPill> : <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => imp(r.id)}><Icon name="repeat" size={13} /> Import</Button> },
  ];
  return (
    <ModuleShell icon="repeat" title="Import from EIS / HRMS" desc="Pull employees nearing retirement from the Employee Information System and open their pension case." onBack={onBack}>
      {flash && <SuccessNote title="Imported">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="In EIS pool" value={rows.length} sub="nearing retirement" icon="database" tone="primary" />
        <KPI label="Imported" value={rows.filter((r) => r.imported).length} sub="cases created" icon="check" tone="success" />
        <KPI label="Pending" value={rows.filter((r) => !r.imported).length} sub="to import" icon="listChecks" tone="saffron" />
      </div>
      <SectionCard title="EIS / HRMS pool" icon="database">
        <div className="mb-3"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or PAN…" /></div>
        <DataTable columns={cols} rows={list} empty="No matching employees." />
      </SectionCard>
    </ModuleShell>
  );
}
