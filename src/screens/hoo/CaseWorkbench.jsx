import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable, InfoRow, SuccessNote } from "../../components/ui/kit.jsx";
import { cn } from "../../lib/cn.js";
import { RETIREES, STAGES, STAGE_PRIMARY, BUCKETS, bdrBucket, newPPO } from "../../data/hoo.js";
import { basicPension, commutation, retirementGratuity, totalMonthly, formatINR } from "../../lib/pension.js";

function Lifecycle({ stage }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[640px] items-start">
        {STAGES.map((s, i) => {
          const done = i < stage, here = i === stage;
          return (
            <div key={s.key} className="relative flex flex-1 flex-col items-center">
              {i > 0 && <span className={cn("absolute right-1/2 top-4 h-0.5 w-full", i <= stage ? "bg-success/50" : "bg-border")} />}
              <span className={cn("relative z-10 grid h-8 w-8 place-items-center rounded-full ring-4 ring-card",
                here ? "bg-saffron text-saffron-foreground" : done ? "bg-success text-white" : "bg-muted text-muted-foreground")}>
                <Icon name={done ? "check" : s.icon} size={14} />
              </span>
              <span className={cn("mt-1.5 max-w-[84px] text-center text-[10px] font-semibold leading-tight", here ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
              <span className="text-[9px] text-muted-foreground/70">{s.bdr}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Checklist({ r }) {
  const items = [
    ["12M", "Retiree list sent to PAO", r.stage >= 4],
    ["12M", "Service Book verified", r.stage >= 1],
    ["10M", "NDC from D/o Estates", r.quarter === "Yes" ? r.stage >= 2 : "na"],
    ["8M", "Form 6A sent to retiree", r.stage >= 2],
    ["6M", "Forms filled & received", r.stage >= 3],
    ["4M", "Verification by HOO", r.stage >= 4],
    ["4M", "Calc sheet & Service Book → PAO", r.stage >= 5],
    ["1M", "PPO generated", r.stage >= 6],
    ["0M", "SSA issued to bank", r.stage >= 6],
  ];
  return (
    <ul className="space-y-1.5">
      {items.map(([m, label, st], i) => (
        <li key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
          <span className="flex items-center gap-2.5">
            <span className={cn("grid h-5 w-5 place-items-center rounded-full text-white",
              st === "na" ? "bg-muted-foreground/30" : st ? "bg-success" : "bg-muted-foreground/30")}>
              <Icon name={st === true ? "check" : st === "na" ? "x" : "info"} size={11} />
            </span>
            <span className={st === true ? "text-foreground" : "text-muted-foreground"}>{label}</span>
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">{m}</span>
        </li>
      ))}
    </ul>
  );
}

function Computation({ r }) {
  const p = basicPension({ emoluments: r.emoluments, qualifyingYears: r.qualifyingYears }).pension;
  const dr = Math.round(p * 0.5);
  const com = commutation({ pension: p, fractionPercent: 40, factor: 8.194 });
  const grat = retirementGratuity({ emoluments: r.emoluments, drPercent: 50, qualifyingYears: r.qualifyingYears }).gratuity;
  const monthly = totalMonthly({ pension: p, drPercent: 50 });
  const rows = [
    ["Last emoluments", formatINR(r.emoluments)],
    ["Qualifying service", `${r.qualifyingYears} years`],
    ["Basic pension (50%)", formatINR(p)],
    ["Dearness Relief (50%)", formatINR(dr)],
    ["Commuted value (40%)", formatINR(com.lumpSum)],
    ["Reduced pension after commutation", formatINR(com.reduced)],
    ["Retirement gratuity", formatINR(grat)],
    ["Monthly pension (basic + DR)", formatINR(monthly)],
  ];
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Form 7 & 8 — computation sheet</div>
      <div className="grid gap-x-8 sm:grid-cols-2">
        {rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
      </div>
    </div>
  );
}

export default function CaseWorkbench({ onBack }) {
  const [rows, setRows] = useState(RETIREES);
  const [view, setView] = useState({ name: "cockpit" });
  const [filter, setFilter] = useState(null); // {type:'bucket'|'stage', val}
  const [flash, setFlash] = useState("");
  const sel = view.id ? rows.find((r) => r.id === view.id) : null;

  const advance = (id) => {
    setRows((rs) => rs.map((r) => {
      if (r.id !== id || r.stage >= 6) return r;
      const ns = r.stage + 1;
      const ppo = ns === 6 ? newPPO() : r.ppo;
      const action = STAGE_PRIMARY[r.stage];
      return { ...r, stage: ns, ppo, returned: false, history: [...r.history, { date: "Today", actor: "You (HOO)", action, remark: ns === 6 ? `PPO ${ppo} recorded; SSA to bank.` : "" }] };
    }));
    const r = rows.find((x) => x.id === id);
    setFlash(r && r.stage === 5 ? "PPO recorded — case completed." : "Stage advanced.");
    setTimeout(() => setFlash(""), 2200);
  };

  const filtered = rows.filter((r) => {
    if (!filter) return true;
    if (filter.type === "bucket") return r.type === "Superannuation" && bdrBucket(r.bdr) === filter.val && r.stage < 6;
    if (filter.type === "stage") return r.stage === filter.val;
    return true;
  });

  const counts = {
    retiring: rows.filter((r) => r.stage < 6).length,
    notIssued: rows.filter((r) => !r.ppo && r.stage >= 4).length,
    returned: rows.filter((r) => r.returned).length,
    issued: rows.filter((r) => r.ppo).length,
  };

  // ---------- CASE DETAIL ----------
  if (view.name === "case" && sel) {
    const label = sel.returned && sel.stage === 4 ? "Correct & re-send to PAO" : STAGE_PRIMARY[sel.stage];
    return (
      <ModuleShell icon="briefcase" title={sel.name} desc={`${sel.designation} · ${sel.type} · retires ${sel.dor}`} onBack={() => setView({ name: "cockpit" })}>
        {flash && <SuccessNote title={flash}>The case record and its history have been updated.</SuccessNote>}
        <div className="grid gap-4 sm:grid-cols-4">
          <KPI label="Pension type" value={sel.type} sub={sel.ministry || ""} icon="info" tone="primary" />
          <KPI label="Retirement" value={sel.dor} sub={`BDR ${sel.bdr}M`} icon="activity" tone="saffron" />
          <KPI label="PPO" value={sel.ppo ? "Issued" : "Pending"} sub={sel.ppo || "not issued"} icon="badgeCheck" tone={sel.ppo ? "success" : "primary"} />
          <KPI label="Govt quarter" value={sel.quarter} sub={sel.quarter === "Yes" ? "NDC required" : "NDC N.A."} icon="building" tone="primary" />
        </div>

        {sel.returned && (
          <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-800">
            <Icon name="info" size={16} className="mt-0.5 flex-shrink-0" /> Returned by PAO — correct the noted objection and re-send.
          </div>
        )}

        <SectionCard title="Lifecycle" icon="listChecks" action={<StatusPill tone={sel.stage >= 6 ? "ok" : undefined}>Stage {Math.min(sel.stage + 1, 7)} of 7</StatusPill>}>
          <Lifecycle stage={sel.stage} />
        </SectionCard>

        {sel.stage >= 4 && <Computation r={sel} />}

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Action checklist" desc="By months before date of retirement (BDR)." icon="fileCheck">
            <Checklist r={sel} />
            {label && (
              <Button variant="saffron" className="mt-4 w-full justify-center" onClick={() => advance(sel.id)}>
                <Icon name="arrowRight" size={16} /> {label}
              </Button>
            )}
            {!label && <div className="mt-4 rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Case completed · PPO {sel.ppo}</div>}
          </SectionCard>

          <SectionCard title="Case history" icon="activity">
            <ol className="relative ml-3 border-l-2 border-border">
              {sel.history.map((h, i) => (
                <li key={i} className="mb-4 ml-5 last:mb-0">
                  <span className="absolute -left-[0.65rem] grid h-5 w-5 place-items-center rounded-full bg-primary text-white ring-4 ring-card"><Icon name="check" size={11} /></span>
                  <div className="flex flex-wrap items-center gap-x-2"><span className="text-sm font-bold text-foreground">{h.action}</span><span className="text-[11px] text-muted-foreground">· {h.date}</span></div>
                  <div className="text-xs font-medium text-primary">{h.actor}</div>
                  {h.remark && <p className="mt-0.5 text-xs text-muted-foreground">{h.remark}</p>}
                </li>
              ))}
            </ol>
          </SectionCard>
        </div>
      </ModuleShell>
    );
  }

  // ---------- COCKPIT ----------
  const cols = [
    { key: "name", label: "Retiree", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.designation} · {r.pan}</div></div> },
    { key: "dor", label: "Retires", render: (r) => <div><div>{r.dor}</div><div className="text-xs text-muted-foreground">BDR {r.bdr}M</div></div> },
    { key: "stage", label: "Stage", render: (r) => <span className="text-xs font-semibold text-primary">{STAGES[r.stage].label}</span> },
    { key: "status", label: "Status", render: (r) => r.ppo ? <StatusPill tone="ok">PPO Issued</StatusPill> : r.returned ? <StatusPill tone="warn">Returned</StatusPill> : <StatusPill>In process</StatusPill> },
    { key: "go", label: "", render: () => <Icon name="chevronRight" size={16} className="text-muted-foreground" /> },
  ];

  return (
    <ModuleShell icon="briefcase" title="Pension Cases — Superannuation" desc="Your office cockpit. Work each retiring employee end-to-end until the PPO is issued." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-4">
        <KPI label="Retiring cases" value={counts.retiring} sub="in pipeline" icon="briefcase" tone="primary" />
        <KPI label="Awaiting PPO" value={counts.notIssued} sub="with PAO" icon="badgeCheck" tone="saffron" />
        <KPI label="Returned" value={counts.returned} sub="needs rework" icon="repeat" tone="primary" />
        <KPI label="PPOs issued" value={counts.issued} sub="this year" icon="check" tone="success" />
      </div>

      <SectionCard title="Retiring employees by BDR" desc="Months before date of retirement — click a bucket to filter." icon="activity">
        <div className="flex flex-wrap gap-2.5">
          {BUCKETS.map((b) => {
            const n = rows.filter((r) => r.type === "Superannuation" && bdrBucket(r.bdr) === b.key && r.stage < 6).length;
            const on = filter && filter.type === "bucket" && filter.val === b.key;
            return (
              <button key={b.key} onClick={() => setFilter(on ? null : { type: "bucket", val: b.key })}
                className={cn("card-shimmer flex min-w-[96px] flex-col items-center rounded-xl border-2 px-4 py-3 transition-colors",
                  on ? "border-saffron bg-saffron/10" : "border-border hover:border-primary/40")}>
                <span className="text-2xl font-black text-foreground">{n}</span>
                <span className="text-[11px] font-semibold text-muted-foreground">{b.label}</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Cases" desc={filter ? "Filtered — clear to see all." : "All cases in your office."} icon="listChecks"
        action={filter ? <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => setFilter(null)}>Clear filter</Button> : null}>
        <DataTable columns={cols} rows={filtered} onRowClick={(r) => setView({ name: "case", id: r.id })} />
      </SectionCard>
    </ModuleShell>
  );
}
