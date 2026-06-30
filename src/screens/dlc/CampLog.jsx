import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, KPI, Field, Input, Select, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { CAMPS_LOGGED, newCampId } from "../../data/dlc_admin.js";

export default function CampLog({ onBack }) {
  const [rows, setRows] = useState(CAMPS_LOGGED.map((r) => ({ ...r })));
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({ from: "", to: "", location: "", bank: "SBI", count: "", operator: "", lat: "", lng: "" });
  const [flash, setFlash] = useState("");
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));
  const total = rows.reduce((s, r) => s + Number(r.count || 0), 0);
  const fmtD = (v) => { if (!v) return v; const d = new Date(v); return isNaN(d) ? v : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };
  const valid = nf.from && nf.to && nf.location && nf.count && nf.lat !== "" && nf.lng !== "";
  const add = () => {
    setRows((rs) => [{ id: newCampId(), from: fmtD(nf.from), to: fmtD(nf.to), location: nf.location, lat: Number(nf.lat), lng: Number(nf.lng), bank: nf.bank, count: Number(nf.count), operator: nf.operator }, ...rs]);
    setAdding(false); setFlash(`Camp at ${nf.location} logged with ${nf.count} DLCs.`); setNf({ from: "", to: "", location: "", bank: "SBI", count: "", operator: "", lat: "", lng: "" }); setTimeout(() => setFlash(""), 2600);
  };
  const mapHref = (r) => `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`;
  const cols = [
    { key: "dates", label: "Dates", render: (r) => <span className="whitespace-nowrap text-xs font-semibold text-foreground">{r.from} – {r.to}</span> },
    { key: "location", label: "Location", render: (r) => <span className="font-semibold text-foreground">{r.location}</span> },
    { key: "coords", label: "Coordinates", render: (r) => <a href={mapHref(r)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"><Icon name="mapPin" size={11} /> {r.lat}, {r.lng}</a> },
    { key: "bank", label: "Bank" },
    { key: "count", label: "DLCs", render: (r) => <span className="font-bold text-success">{r.count}</span> },
    { key: "operator", label: "Operator" },
  ];
  return (
    <ModuleShell icon="fingerprint" title="Log DLC Camp" desc="Record a Digital Life Certificate camp's dates, location, coordinates and count." onBack={onBack}>
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
        <p className="mt-1 text-xs text-muted-foreground">The camp's date range and exact coordinates are captured by the Nodal officer so pensioners can plan a visit and navigate to the venue.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="From date" required><Input type="date" value={nf.from} onChange={(e) => setN("from", e.target.value)} /></Field>
          <Field label="To date" required><Input type="date" value={nf.to} onChange={(e) => setN("to", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Location" required><Input value={nf.location} onChange={(e) => setN("location", e.target.value)} placeholder="Venue, city" /></Field></div>
          <Field label="Latitude" required hint="Decimal degrees"><Input type="number" step="any" value={nf.lat} onChange={(e) => setN("lat", e.target.value)} placeholder="e.g. 28.6315" /></Field>
          <Field label="Longitude" required hint="Decimal degrees"><Input type="number" step="any" value={nf.lng} onChange={(e) => setN("lng", e.target.value)} placeholder="e.g. 77.2167" /></Field>
          <Field label="Bank / agency"><Select options={["SBI", "PNB", "Indian Bank", "India Post", "CSC", "IPPB"]} value={nf.bank} onChange={(e) => setN("bank", e.target.value)} /></Field>
          <Field label="DLCs collected" required><Input type="number" value={nf.count} onChange={(e) => setN("count", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Operator"><Input value={nf.operator} onChange={(e) => setN("operator", e.target.value)} /></Field></div>
        </div>
        <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!valid} onClick={add}><Icon name="arrowRight" size={16} /> {valid ? "Log camp" : "Fill required fields"}</Button>
      </Modal>
    </ModuleShell>
  );
}
