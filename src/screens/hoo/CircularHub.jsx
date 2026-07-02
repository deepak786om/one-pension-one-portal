import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";
import { SectionCard, Breadcrumb, Input } from "../../components/ui/kit.jsx";
import { HUB_PILLARS, pillarCount } from "../../data/circulars.js";
import CircularSearch from "./CircularSearch.jsx";

const ACTION_LABEL = { search: "Search", matrix: "Compare", explainer: "Guided", calculator: "Calculator", generate: "AI draft", tracker: "Tracker" };

// Sub-service components are registered here as each increment lands.
// Increment 1 ships the landing + router; live boxes without a component yet
// fall back to a graceful in-progress panel.
const SUBSERVICES = {
  circulars: CircularSearch,
  compendia: CircularSearch,
  judgements: CircularSearch,
};

function findBox(key) {
  for (const p of HUB_PILLARS) {
    const b = p.boxes.find((x) => x.key === key);
    if (b) return { pillar: p, box: b };
  }
  return null;
}

function InProgress({ box, onBack }) {
  return (
    <SectionCard title={box.label} desc={box.desc} icon="bookMarked">
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
        <Icon name="loader2" size={22} className="mx-auto mb-2 text-primary" />
        <p className="text-sm font-semibold text-foreground">This sub-service opens here.</p>
        <p className="mt-1 text-xs text-muted-foreground">Being built in the current phase — the hub navigation and data model are in place.</p>
      </div>
      <Button variant="outline" className="mt-4" onClick={onBack}><Icon name="chevronLeft" size={15} /> Back to the hub</Button>
    </SectionCard>
  );
}

function BoxCard({ pillar, box, onOpen }) {
  const soon = box.status !== "live";
  return (
    <button
      onClick={() => !soon && onOpen(box.key)}
      disabled={soon}
      className={cn(
        "flex h-full flex-col rounded-xl2 border bg-card p-4 text-left shadow-card transition-shadow",
        soon ? "cursor-default border-border opacity-70" : "border-border hover:shadow-elegant"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg" style={{ backgroundColor: pillar.accent + "1A", color: pillar.accent }}>
          <Icon name={pillar.icon} size={17} />
        </span>
        {soon ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Soon</span>
        ) : (
          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: pillar.accent + "1A", color: pillar.accent }}>{ACTION_LABEL[box.action] || "Open"}</span>
        )}
      </div>
      <div className="mt-2.5 text-sm font-bold text-foreground">{box.label}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{box.desc}</div>
      {!soon && <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: pillar.accent }}>Open <Icon name="arrowRight" size={13} /></span>}
    </button>
  );
}

export default function CircularHub({ onBack }) {
  const [active, setActive] = useState(null);
  const [q, setQ] = useState("");
  const [seedQuery, setSeedQuery] = useState("");

  if (active) {
    const found = findBox(active);
    const Comp = SUBSERVICES[active];
    return (
      <ModuleShell icon="bookMarked" title="Circular & Knowledge Hub" desc="Officer knowledge workspace" onBack={() => setActive(null)}>
        <Breadcrumb items={[{ label: "Knowledge Hub", onClick: () => setActive(null) }, { label: found ? found.box.label : active }]} />
        {Comp ? <Comp box={found ? found.box : null} initialQuery={seedQuery} onBack={() => setActive(null)} /> : <InProgress box={found ? found.box : { label: active, desc: "" }} onBack={() => setActive(null)} />}
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="bookMarked" title="Circular & Knowledge Hub" desc="Search circulars, judgements and the retirement-benefit matrix — one officer workspace." onBack={onBack}>
      {/* hero */}
      <div className="overflow-hidden rounded-xl2 bg-gradient-to-br from-[#0B2A55] to-[#1B3A6B] p-5 text-white shadow-card">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/70">
          <Icon name="sparkles" size={14} /> Actionable knowledge
        </div>
        <h2 className="mt-1 text-lg font-black">Find the rule, the circular and the calculation — in one place.</h2>
        <p className="mt-1 text-xs text-white/70">Every box below is an action, not just a link. Search the repository or ask the assistant.</p>
        <div className="mt-3 flex max-w-xl gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search circulars, judgements, subjects…" className="!bg-white/95 !text-foreground" />
          <Button variant="saffron" onClick={() => { setSeedQuery(q); setActive("circulars"); }}><Icon name="search" size={15} /> Search</Button>
        </div>
      </div>

      {/* pillars */}
      {HUB_PILLARS.map((pillar) => (
        <SectionCard
          key={pillar.id}
          title={pillar.label}
          desc={pillar.desc}
          icon={pillar.icon}
          action={<span className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">{pillarCount(pillar.id)} items</span>}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pillar.boxes.map((box) => <BoxCard key={box.key} pillar={pillar} box={box} onOpen={setActive} />)}
          </div>
        </SectionCard>
      ))}
    </ModuleShell>
  );
}
