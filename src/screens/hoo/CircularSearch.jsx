import { useState, useMemo } from "react";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";
import { SectionCard, DataTable, Field, Input, Select, InfoRow, StatusPill } from "../../components/ui/kit.jsx";
import { CIRCULARS, HUB_PILLARS, SCHEMES, CIRC_TYPES } from "../../data/circulars.js";

const PID2LABEL = Object.fromEntries(HUB_PILLARS.map((p) => [p.id, p.label]));
const TYPE_TONE = { circular: undefined, judgement: "warn", compendium: "ok" };
const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? iso : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CircularSearch({ box, onBack, initialQuery = "" }) {
  const lockType = box && box.key === "compendia" ? "compendium" : box && box.key === "judgements" ? "judgement" : null;
  const [q, setQ] = useState(initialQuery);
  const [fPillar, setFPillar] = useState("");
  const [fScheme, setFScheme] = useState("");
  const [fType, setFType] = useState("");
  const [fYear, setFYear] = useState("");
  const [sel, setSel] = useState(null);

  const years = useMemo(() => [...new Set(CIRCULARS.map((c) => c.date.slice(0, 4)))].sort().reverse(), []);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return CIRCULARS.filter((c) => {
      if (lockType && c.type !== lockType) return false;
      if (fType && c.type !== fType) return false;
      if (fPillar && PID2LABEL[c.pillar] !== fPillar) return false;
      if (fScheme && !c.schemes.includes(fScheme)) return false;
      if (fYear && c.date.slice(0, 4) !== fYear) return false;
      if (needle) {
        const hay = (c.subject + " " + c.number + " " + c.summary + " " + c.keywords.join(" ")).toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, fPillar, fScheme, fType, fYear, lockType]);

  const reset = () => { setQ(""); setFPillar(""); setFScheme(""); setFType(""); setFYear(""); };

  if (sel) {
    return (
      <SectionCard title={sel.subject} desc={`${cap(sel.type)} · ${sel.number}`} icon="fileText"
        action={<StatusPill tone={TYPE_TONE[sel.type]}>{cap(sel.type)}</StatusPill>}>
        <div className="grid gap-x-8 sm:grid-cols-2">
          <InfoRow label="Reference number" value={sel.number} />
          <InfoRow label="Date" value={fmtDate(sel.date)} />
          <InfoRow label="Category" value={PID2LABEL[sel.pillar] || sel.pillar} />
          <InfoRow label="Schemes" value={sel.schemes.length ? sel.schemes.join(", ") : "—"} />
        </div>
        <div className="mt-3">
          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Summary</div>
          <p className="rounded-xl bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground">{sel.summary}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sel.keywords.map((k) => <span key={k} className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">{k}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={sel.pdfUrl} target="_blank" rel="noreferrer"><Button variant="saffron"><Icon name="download" size={15} /> Open source PDF</Button></a>
          <Button variant="outline" onClick={() => setSel(null)}><Icon name="chevronLeft" size={15} /> Back to results</Button>
        </div>
      </SectionCard>
    );
  }

  const columns = [
    { key: "type", label: "Type", render: (r) => <StatusPill tone={TYPE_TONE[r.type]}>{cap(r.type)}</StatusPill> },
    { key: "number", label: "Number", render: (r) => <span className="font-mono text-xs">{r.number}</span> },
    { key: "date", label: "Date", render: (r) => <span className="whitespace-nowrap text-xs">{fmtDate(r.date)}</span> },
    { key: "subject", label: "Subject", render: (r) => (
      <div className="max-w-md">
        <div className="whitespace-normal font-semibold text-foreground">{r.subject}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{PID2LABEL[r.pillar]}{r.schemes.length ? " · " + r.schemes.join("/") : ""}</div>
      </div>
    ) },
  ];

  return (
    <SectionCard title={box ? box.label : "Circulars"} desc={box ? box.desc : "Search the repository."} icon="fileText">
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-4">
          <Field label="Search"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Subject, number or keyword…" /></Field>
        </div>
        <Field label="Category"><Select options={HUB_PILLARS.map((p) => p.label)} placeholder="All categories" value={fPillar} onChange={(e) => setFPillar(e.target.value)} /></Field>
        <Field label="Scheme"><Select options={SCHEMES} placeholder="All schemes" value={fScheme} onChange={(e) => setFScheme(e.target.value)} /></Field>
        {!lockType && <Field label="Type"><Select options={CIRC_TYPES.map(cap)} placeholder="All types" value={fType ? cap(fType) : ""} onChange={(e) => setFType(e.target.value.toLowerCase())} /></Field>}
        <Field label="Year"><Select options={years} placeholder="All years" value={fYear} onChange={(e) => setFYear(e.target.value)} /></Field>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{rows.length} result{rows.length === 1 ? "" : "s"}</span>
        <button onClick={reset} className="text-xs font-semibold text-primary hover:underline">Clear filters</button>
      </div>
      <div className="mt-2">
        <DataTable columns={columns} rows={rows} empty="No circulars match these filters." onRowClick={(r) => setSel(r)} />
      </div>
    </SectionCard>
  );
}
