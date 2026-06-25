import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, KPI, Field, Input, Select, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { CAMPS_LOGGED, newCampId } from "../../data/dlc_admin.js";

export default function CampLog({ onBack }) {
  const [rows, setRows] = useState(CAMPS_LOGGED.map((r) => ({ ...r })));
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({ date: "", location: "", bank: "SBI", count: "", operator: "" });
  const [flash, setFlash] = useState("");
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));
  const total = rows.reduce((s, r) => s + Number(r.count || 0), 0);
  const add = () => {
    setRows((rs) => [{ id: newCampId(), ...nf, count: Number(nf.count) }, ...rs]);
    setAdding(false); setFlash(`Camp at ${nf.location} logged with ${nf.count} DLCs.`); setNf({ date: "", location: "", bank: "SBI", count: "", operator: "" }); setTimeout(() => setFlash(""), 2600);
  };
  const cols = [
    { key: "date", label: "Date" },
    { key: "location", label: "Location", render: (r) => <span className="font-semibold text-foreground">{r.location}</span> },
    { key: "bank", label: "Bank" },
    { key: "count", label: "DLCs", render: (r) => <span className="font-bold text-success">{r.count}</span> },
    { key: "operator", label: "Operator" },
  ];
  return (
    <ModuleShell icon="fingerprint" title="Log DLC Camp" desc="Record a Digital Life Certificate camp's date, location and count." onBack={onBack}>
      {flash && <SuccessNote title="Camp logged">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Camps logged" value={rows.length} icon="mapPin" tone="primary" />
        <KPI label="DLCs collected" value={total} sub="across camps" icon="fingerprint" tone="success" />
        <KPI label="Avg. per camp" value={Math.round(total / rows.length)} icon="activity" tone="saffron" />
      </div>
      <SectionCard title="Recent camps" icon="mapPin" action={<Button variant="saffron" className="px-4 py-2 text-xs" onClick={() => setAdding(true)}><Icon name="mapPin" size={14} /> Log camp</Button>}>
        <DataTable columns={cols} rows={rows} />
      </SectionCard>
      <Modal open={adding} onClose={() => setAdding(false)} maxW="max-w-lg">
        <h3 className="text-lg font-extrabold text-foreground">Log a DLC camp</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Date" required><Input value={nf.date} onChange={(e) => setN("date", e.target.value)} placeholder="e.g. 25 Jun 2026" /></Field>
          <Field label="Bank / agency"><Select options={["SBI", "PNB", "Indian Bank", "India Post", "CSC", "IPPB"]} value={nf.bank} onChange={(e) => setN("bank", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Location" required><Input value={nf.location} onChange={(e) => setN("location", e.target.value)} placeholder="Venue, city" /></Field></div>
          <Field label="DLCs collected" required><Input type="number" value={nf.count} onChange={(e) => setN("count", e.target.value)} /></Field>
          <Field label="Operator"><Input value={nf.operator} onChange={(e) => setN("operator", e.target.value)} /></Field>
        </div>
        <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!nf.date || !nf.location || !nf.count} onClick={add}><Icon name="arrowRight" size={16} /> {nf.date && nf.location && nf.count ? "Log camp" : "Fill required fields"}</Button>
      </Modal>
    </ModuleShell>
  );
}
