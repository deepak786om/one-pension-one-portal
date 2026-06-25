import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, SuccessNote } from "../../components/ui/kit.jsx";
import { DDO_CASES } from "../../data/ddo.js";

export default function DdoCases({ onBack }) {
  const [rows, setRows] = useState(DDO_CASES.map((r) => ({ ...r })));
  const [flash, setFlash] = useState("");
  const forward = (id) => {
    const r = rows.find((x) => x.id === id);
    setRows((rs) => rs.map((x) => x.id === id ? { ...x, forwarded: "Today", status: "Forwarded to HOO" } : x));
    setFlash(`${r.name} forwarded to ${r.hoo}.`); setTimeout(() => setFlash(""), 2400);
  };
  const cols = [
    { key: "name", label: "Retiree", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "hoo", label: "Head of Office" },
    { key: "forwarded", label: "Forwarded" },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status.includes("Draft") ? "warn" : "ok"}>{r.status}</StatusPill> },
    { key: "act", label: "", render: (r) => r.status.includes("Draft") ? <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => forward(r.id)}><Icon name="arrowUpRight" size={13} /> Forward</Button> : <Icon name="check" size={15} className="text-success" /> },
  ];
  return (
    <ModuleShell icon="arrowUpRight" title="My Forwarded Cases" desc="Retiree cases you have created and forwarded to the Head of Office." onBack={onBack}>
      {flash && <SuccessNote title="Forwarded">{flash}</SuccessNote>}
      <SectionCard title="Cases" icon="listChecks"><DataTable columns={cols} rows={rows} /></SectionCard>
    </ModuleShell>
  );
}
