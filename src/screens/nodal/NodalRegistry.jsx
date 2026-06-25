import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, Input } from "../../components/ui/kit.jsx";
import { NODAL_REGISTRY } from "../../data/nodal.js";

export default function NodalRegistry({ onBack }) {
  const [rows, setRows] = useState(NODAL_REGISTRY.map((r) => ({ ...r })));
  const [q, setQ] = useState("");
  const toggle = (id) => setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: r.status === "Active" ? "Suspended" : "Active" } : r));
  const list = rows.filter((r) => !q || (r.name + r.role + r.office).toLowerCase().includes(q.toLowerCase()));
  const cols = [
    { key: "name", label: "Official / Body", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "role", label: "Role" },
    { key: "office", label: "Office" },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "Active" ? "ok" : "warn"}>{r.status}</StatusPill> },
    { key: "act", label: "", render: (r) => <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => toggle(r.id)}>{r.status === "Active" ? "Suspend" : "Reactivate"}</Button> },
  ];
  return (
    <ModuleShell icon="users" title="Nodal Officer Registry" desc="The registry of mapped officials and recognised associations in your ministry." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Total entries" value={rows.length} icon="users" tone="primary" />
        <KPI label="Active" value={rows.filter((r) => r.status === "Active").length} icon="check" tone="success" />
        <KPI label="Suspended" value={rows.filter((r) => r.status === "Suspended").length} icon="info" tone="saffron" />
      </div>
      <SectionCard title="Registry" icon="database">
        <div className="mb-3"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, role or office…" /></div>
        <DataTable columns={cols} rows={list} empty="No matching entries." />
      </SectionCard>
    </ModuleShell>
  );
}
