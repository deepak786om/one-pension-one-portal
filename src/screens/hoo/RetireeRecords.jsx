import { useState } from "react";
import { motion } from "framer-motion";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, InfoRow, Field, Input, Select, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { RETIREES } from "../../data/hoo.js";

const TYPES = ["All", "Superannuation", "Family Pension", "EOP"];

export default function RetireeRecords({ onBack }) {
  const [rows, setRows] = useState(RETIREES);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [open, setOpen] = useState(null);
  const [adding, setAdding] = useState(false);
  const [flash, setFlash] = useState("");
  const [nf, setNf] = useState({ name: "", pan: "", designation: "", type: "Superannuation", dor: "", source: "Manual" });
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));

  const list = rows.filter((r) =>
    (type === "All" || r.type === type) &&
    (!q || (r.name + r.pan + r.designation).toLowerCase().includes(q.toLowerCase())));

  const addCase = () => {
    const id = "RX" + (rows.length + 1);
    setRows((rs) => [{ ...nf, id, bdr: 12, stage: 0, ppo: "", quarter: "No", emoluments: 100000, qualifyingYears: 30, history: [{ date: "Today", actor: "You (HOO)", action: nf.source === "EIS" ? "Imported from EIS" : "Record created manually", remark: "" }] }, ...rs]);
    setAdding(false); setNf({ name: "", pan: "", designation: "", type: "Superannuation", dor: "", source: "Manual" });
    setFlash(`${nf.name} added to retiree records.`); setTimeout(() => setFlash(""), 2400);
  };

  const cols = [
    { key: "name", label: "Name", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.pan}</div></div> },
    { key: "designation", label: "Designation" },
    { key: "type", label: "Type" },
    { key: "dor", label: "Retires" },
    { key: "source", label: "Source", render: (r) => <span className="text-xs">{r.source}</span> },
    { key: "status", label: "PPO", render: (r) => r.ppo ? <StatusPill tone="ok">Issued</StatusPill> : <StatusPill>Pending</StatusPill> },
  ];

  return (
    <ModuleShell icon="fileText" title="Retiree Records" desc="The master register of retiring and retired employees of your office." onBack={onBack}>
      {flash && <SuccessNote title={flash}>You can now process this case from Pension Cases.</SuccessNote>}
      <SectionCard title="Records" desc={`${list.length} of ${rows.length} shown`} icon="database"
        action={<div className="flex gap-2">
          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => { setNf((s) => ({ ...s, source: "EIS", name: "New EIS Employee", pan: "EISPX0000X", designation: "Assistant", dor: "31 Dec 2026" })); setAdding(true); }}><Icon name="repeat" size={14} /> Import from EIS</Button>
          <Button variant="saffron" className="px-3 py-2 text-xs" onClick={() => setAdding(true)}><Icon name="fileText" size={14} /> New case</Button>
        </div>}>
        <div className="mb-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, PAN or designation…" />
          <Select options={TYPES} value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <DataTable columns={cols} rows={list} onRowClick={(r) => setOpen(r)} empty="No matching records." />
      </SectionCard>

      <Modal open={!!open} onClose={() => setOpen(null)} maxW="max-w-lg">
        {open && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{open.name}</h3>
            <p className="text-sm text-muted-foreground">{open.designation} · {open.type}</p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="PAN" value={open.pan} />
              <InfoRow label="Date of retirement" value={open.dor} />
              <InfoRow label="Source" value={open.source} />
              <InfoRow label="Govt quarter" value={open.quarter} />
              <InfoRow label="PPO" value={open.ppo || "Pending"} />
              <InfoRow label="Months to retire" value={`${open.bdr}M`} />
            </div>
          </div>
        )}
      </Modal>

      <Modal open={adding} onClose={() => setAdding(false)} maxW="max-w-lg">
        <h3 className="text-lg font-extrabold text-foreground">{nf.source === "EIS" ? "Import from EIS" : "New retiree case"}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required><Input value={nf.name} onChange={(e) => setN("name", e.target.value)} /></Field>
          <Field label="PAN" required><Input value={nf.pan} onChange={(e) => setN("pan", e.target.value.toUpperCase())} /></Field>
          <Field label="Designation" required><Input value={nf.designation} onChange={(e) => setN("designation", e.target.value)} /></Field>
          <Field label="Pension type" required><Select options={["Superannuation", "Family Pension", "EOP"]} value={nf.type} onChange={(e) => setN("type", e.target.value)} /></Field>
          <Field label="Date of retirement" required><Input value={nf.dor} onChange={(e) => setN("dor", e.target.value)} placeholder="e.g. 31 Dec 2026" /></Field>
          <Field label="Source"><Select options={["Manual", "EIS"]} value={nf.source} onChange={(e) => setN("source", e.target.value)} /></Field>
        </div>
        <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!nf.name || !nf.pan || !nf.dor} onClick={addCase}>
          <Icon name="arrowRight" size={16} /> {nf.name && nf.pan && nf.dor ? "Add to records" : "Fill required fields"}
        </Button>
      </Modal>
    </ModuleShell>
  );
}
