import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, SuccessNote } from "../../components/ui/kit.jsx";
import { COMPACT_BATCH, PAO_OFFICE } from "../../data/pao.js";

export default function CompactExport({ onBack }) {
  const [rows, setRows] = useState(COMPACT_BATCH.map((r) => ({ ...r })));
  const [sel, setSel] = useState([]);
  const [flash, setFlash] = useState("");
  const pending = rows.filter((r) => !r.exported);
  const toggle = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const exportBatch = () => {
    setRows((rs) => rs.map((r) => sel.includes(r.id) ? { ...r, exported: true } : r));
    setFlash(`Exported ${sel.length} PPO(s) to ${PAO_OFFICE.cpao} as COMPACT XML.`); setSel([]); setTimeout(() => setFlash(""), 2800);
  };
  const cols = [
    { key: "sel", label: "", render: (r) => r.exported ? <Icon name="check" size={15} className="text-success" /> : <input type="checkbox" checked={sel.includes(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 accent-[#1B3A6B]" /> },
    { key: "name", label: "Pensioner", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "ppo", label: "PPO", render: (r) => <span className="font-mono text-xs">{r.ppo}</span> },
    { key: "issued", label: "Issued" },
    { key: "exported", label: "Status", render: (r) => r.exported ? <StatusPill tone="ok">Exported</StatusPill> : <StatusPill>Ready</StatusPill> },
  ];
  return (
    <ModuleShell icon="database" title="Export to CPAO / COMPACT" desc="Generate the COMPACT XML batch of issued PPOs for the Central Pension Accounting Office." onBack={onBack}>
      {flash && <SuccessNote title="Batch exported">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Ready to export" value={pending.length} sub="issued PPOs" icon="arrowUpRight" tone="primary" />
        <KPI label="Selected" value={sel.length} sub="in this batch" icon="listChecks" tone="saffron" />
        <KPI label="Exported" value={rows.filter((r) => r.exported).length} sub="sent to CPAO" icon="check" tone="success" />
      </div>
      <SectionCard title="PPOs pending export" icon="database"
        action={<Button variant="saffron" className="px-4 py-2" disabled={!sel.length} onClick={exportBatch}><Icon name="arrowUpRight" size={15} /> {sel.length ? `Export ${sel.length}` : "Select PPOs"}</Button>}>
        <DataTable columns={cols} rows={rows} />
        <p className="mt-3 text-xs text-muted-foreground">Each export generates a digitally-signed XML conforming to the CPAO COMPACT schema.</p>
      </SectionCard>
    </ModuleShell>
  );
}
