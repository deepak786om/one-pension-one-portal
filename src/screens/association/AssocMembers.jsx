import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, Field, Input, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { ASSOC_MEMBERS } from "../../data/association.js";

export default function AssocMembers({ onBack }) {
  const [rows, setRows] = useState(ASSOC_MEMBERS.map((r) => ({ ...r })));
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({ name: "", ppo: "", mobile: "" });
  const [flash, setFlash] = useState("");
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));
  const add = () => {
    setRows((rs) => [{ id: "M" + (rs.length + 1), ...nf, status: "Active" }, ...rs]);
    setAdding(false); setFlash(`${nf.name} added to the member registry.`); setNf({ name: "", ppo: "", mobile: "" }); setTimeout(() => setFlash(""), 2400);
  };
  const toggle = (id) => setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: r.status === "Active" ? "Lapsed" : "Active" } : r));
  const cols = [
    { key: "name", label: "Member", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "ppo", label: "PPO", render: (r) => <span className="font-mono text-xs">{r.ppo}</span> },
    { key: "mobile", label: "Mobile" },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "Active" ? "ok" : "warn"}>{r.status}</StatusPill> },
    { key: "act", label: "", render: (r) => <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => toggle(r.id)}>{r.status === "Active" ? "Mark lapsed" : "Reactivate"}</Button> },
  ];
  return (
    <ModuleShell icon="users" title="Member Registry" desc="Maintain your association's members and their membership status." onBack={onBack}>
      {flash && <SuccessNote title={flash}>You can now lodge grievances on their behalf.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Members" value={rows.length} icon="users" tone="primary" />
        <KPI label="Active" value={rows.filter((r) => r.status === "Active").length} icon="check" tone="success" />
        <KPI label="Lapsed" value={rows.filter((r) => r.status === "Lapsed").length} icon="info" tone="saffron" />
      </div>
      <SectionCard title="Members" icon="users" action={<Button variant="saffron" className="px-4 py-2 text-xs" onClick={() => setAdding(true)}><Icon name="users" size={14} /> Add member</Button>}>
        <DataTable columns={cols} rows={rows} />
      </SectionCard>
      <Modal open={adding} onClose={() => setAdding(false)} maxW="max-w-md">
        <h3 className="text-lg font-extrabold text-foreground">Add member</h3>
        <div className="mt-4 grid gap-4">
          <Field label="Name" required><Input value={nf.name} onChange={(e) => setN("name", e.target.value)} /></Field>
          <Field label="PPO number" required><Input value={nf.ppo} onChange={(e) => setN("ppo", e.target.value)} placeholder="PPO-YYYY-XXX-NNNNNNN" /></Field>
          <Field label="Mobile"><Input value={nf.mobile} onChange={(e) => setN("mobile", e.target.value)} /></Field>
        </div>
        <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!nf.name || !nf.ppo} onClick={add}><Icon name="arrowRight" size={16} /> {nf.name && nf.ppo ? "Add member" : "Fill required fields"}</Button>
      </Modal>
    </ModuleShell>
  );
}
