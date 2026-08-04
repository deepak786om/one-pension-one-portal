import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable, InfoRow, SuccessNote, Modal, Breadcrumb, EvidenceChecklist, ReconcileChecklist, Field, Input, Select, Textarea, HistoryTrail } from "../../components/ui/kit.jsx";
import { cn } from "../../lib/cn.js";
import { RETIREES, STAGES, BUCKETS, bdrBucket, newPPO, retireeProfile, verifyEvidence, formCheckEvidence, vigilance } from "../../data/hoo.js";
import { setForm6aReturn, clearForm6aReturn } from "../../lib/form6aStore.js";
import { basicPension, commutation, retirementGratuity, totalMonthly, formatINR } from "../../lib/pension.js";
import AiCaseSummary, { AiSummaryButton } from "../../components/ui/AiCaseSummary.jsx";
import { buildCaseSummary } from "../../lib/aiSummary.js";
import { getAiDefaultOpen } from "../../lib/prefs.js";

// what happens to move OUT of each stage, and who owns it
const ACT = {
  0: { kind: "page", task: "verify", cta: "Validate Service Book" },
  1: { kind: "auto", actor: "retiree", cta: "Form 6A auto-sent — awaiting the retiree's submission", sim: "Simulate retiree submission" },
  2: { kind: "auto", actor: "retiree", cta: "Form 6A submission by the retiree", sim: "Simulate retiree submission" },
  3: { kind: "page", task: "formcheck", cta: "Validate submitted Form 6A" },
  4: { kind: "page", task: "pao", cta: "Compute Forms 7 & 8 → forward to PAO" },
  5: { kind: "auto", actor: "PAO", cta: "PPO issuance by the PAO", sim: "Simulate PAO PPO issue" },
};

// Forms 7 & 8 page: everything is DERIVED from a few source values, all auto-populated
// from the Service Book / EIS and overridable. The pensioner elects the commutation %.
function PaoForwardPage({ sel, checks, onToggle, onForward, onBack, crumbEl }) {
  const [inp, setInp] = useState({ emoluments: sel.emoluments, qualifyingYears: sel.qualifyingYears, commutePct: 40, drPct: 50, factor: 8.194 });
  const setF = (k, v) => setInp((s) => ({ ...s, [k]: v }));
  const reset = () => setInp({ emoluments: sel.emoluments, qualifyingYears: sel.qualifyingYears, commutePct: 40, drPct: 50, factor: 8.194 });

  const num = (v) => Number(v) || 0;
  const p = basicPension({ emoluments: num(inp.emoluments), qualifyingYears: num(inp.qualifyingYears) }).pension;
  const com = commutation({ pension: p, fractionPercent: num(inp.commutePct), factor: num(inp.factor) });
  const grat = retirementGratuity({ emoluments: num(inp.emoluments), drPercent: num(inp.drPct), qualifyingYears: num(inp.qualifyingYears) }).gratuity;
  const monthly = totalMonthly({ pension: p, drPercent: num(inp.drPct) });
  const sheet = [
    ["Last emoluments", formatINR(num(inp.emoluments))], ["Qualifying service", `${num(inp.qualifyingYears)} years`],
    ["Basic pension (50%)", formatINR(p)], ["Dearness Relief", formatINR(Math.round(p * num(inp.drPct) / 100))],
    ["Commuted value", formatINR(com.lumpSum)], ["Reduced pension after commutation", formatINR(com.reducedPension)],
    ["Retirement gratuity", formatINR(grat)], ["Monthly pension (basic + DR)", formatINR(monthly)],
  ];
  const items = [
    { key: "comp", label: "Computation reviewed & correct", data: [["Basic pension (50%)", formatINR(p)], ["Commuted value", formatINR(com.lumpSum)], ["Reduced pension", formatINR(com.reducedPension)], ["Retirement gratuity", formatINR(grat)], ["Monthly (basic + DR)", formatINR(monthly)]] },
    { key: "sb", label: "Service Book & Forms 7 & 8 enclosed", data: [["Service Book", num(inp.qualifyingYears) > 30 ? "Enclosed (2 vol.)" : "Enclosed (1 vol.)"], ["Forms 7 & 8", "Generated & signed"]] },
    { key: "dues", label: "No pending dues / recoveries", data: [["Government dues", "Nil"], ["Pay & allowance recovery", "Nil"], ["Licence fee", "Cleared"]] },
  ];
  const allDone = items.every((i) => checks.includes(i.key));
  const changed = num(inp.emoluments) !== sel.emoluments || num(inp.qualifyingYears) !== sel.qualifyingYears || num(inp.commutePct) !== 40 || num(inp.drPct) !== 50;

  return (
    <ModuleShell icon="arrowUpRight" title="Forms 7 & 8 → PAO" desc={`${sel.name} · forward for PPO issue`} onBack={onBack}>
      {crumbEl}
      {sel.returned && <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-800"><Icon name="info" size={16} className="mt-0.5 flex-shrink-0" /> Returned by PAO — correct the noted objection before re-forwarding.</div>}

      <SectionCard title="Computation inputs" desc="Auto-populated from the Service Book / EIS. Everything below is derived from these — change a value only if a correction is needed." icon="fileText"
        action={changed ? <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={reset}><Icon name="repeat" size={13} /> Reset to auto</Button> : <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-bold text-success"><Icon name="check" size={12} /> Auto-populated</span>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Last emoluments (₹)" hint="Last pay drawn, from the Service Book."><Input type="number" value={inp.emoluments} onChange={(e) => setF("emoluments", e.target.value)} /></Field>
          <Field label="Qualifying service (years)" hint="DOJ → DOR, less non-qualifying breaks."><Input type="number" value={inp.qualifyingYears} onChange={(e) => setF("qualifyingYears", e.target.value)} /></Field>
          <Field label="Commutation elected (%)" hint="Elected by the pensioner in Form 6A; capped at 40%."><Select options={["0", "10", "20", "30", "40"]} value={String(inp.commutePct)} onChange={(e) => setF("commutePct", e.target.value)} /></Field>
          <Field label="Dearness Relief (%)" hint="Current DR rate notified by Government."><Input type="number" value={inp.drPct} onChange={(e) => setF("drPct", e.target.value)} /></Field>
        </div>
        <p className="mt-3 rounded-lg bg-primary/[0.04] p-3 text-xs text-muted-foreground"><Icon name="info" size={12} className="mr-1 inline text-primary" /> Basic pension is 50% of emoluments; gratuity uses qualifying service; the commuted value uses the CCS commutation factor ({inp.factor}, age 60). No manual computation is required — only confirm or correct the inputs.</p>
      </SectionCard>

      <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Forms 7 & 8 — computation sheet (auto-derived)</div>
        <div className="grid gap-x-8 sm:grid-cols-2">{sheet.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
      </div>

      <SectionCard title="Pre-forwarding checklist" desc="Confirm each item against the computed figures before forwarding to the PAO." icon="fileCheck">
        <EvidenceChecklist items={items} checked={checks} onToggle={onToggle} />
        <Button variant="saffron" className="mt-4 w-full justify-center" disabled={!allDone} onClick={onForward}>
          <Icon name="arrowUpRight" size={16} /> {sel.returned ? "Correct & re-forward to PAO" : "Forward to PAO"}
        </Button>
      </SectionCard>
    </ModuleShell>
  );
}

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
    ["12M", "Service Book validated", r.stage >= 1],
    ["10M", "NDC from D/o Estates", r.quarter === "Yes" ? r.stage >= 2 : "na"],
    ["8M", "Form 6A sent to retiree", r.stage >= 2],
    ["6M", "Forms filled & received", r.stage >= 3],
    ["4M", "Validation by HOO", r.stage >= 4],
    ["4M", "Calc sheet & Service Book → PAO", r.stage >= 5],
    ["1M", "PPO generated", r.stage >= 6],
    ["0M", "SSA issued to bank", r.stage >= 6],
  ];
  return (
    <ul className="space-y-1.5">
      {items.map(([m, label, st], i) => (
        <li key={i} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
          <span className="flex items-center gap-2.5">
            <span className={cn("grid h-5 w-5 place-items-center rounded-full text-white", st === "na" ? "bg-muted-foreground/30" : st ? "bg-success" : "bg-muted-foreground/30")}>
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
    ["Last emoluments", formatINR(r.emoluments)], ["Qualifying service", `${r.qualifyingYears} years`],
    ["Basic pension (50%)", formatINR(p)], ["Dearness Relief (50%)", formatINR(dr)],
    ["Commuted value (40%)", formatINR(com.lumpSum)], ["Reduced pension after commutation", formatINR(com.reducedPension)],
    ["Retirement gratuity", formatINR(grat)], ["Monthly pension (basic + DR)", formatINR(monthly)],
  ];
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Forms 7 & 8 — computation sheet</div>
      <div className="grid gap-x-8 sm:grid-cols-2">{rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
    </div>
  );
}

export default function CaseWorkbench({ onBack }) {
  const [rows, setRows] = useState(RETIREES);
  const [view, setView] = useState({ name: "cockpit" });   // cockpit | case | task
  const [modal, setModal] = useState(null);                 // send | formcheck
  const [filter, setFilter] = useState(null);
  const [flash, setFlash] = useState("");
  const [aiOpen, setAiOpen] = useState(getAiDefaultOpen());
  const [histOpen, setHistOpen] = useState(false);   // case history is on-demand
  // task form state
  const [checks, setChecks] = useState([]);
  const [picks, setPicks] = useState({});      // HRMS/EIS reconciliation choices, key "itemKey|field" -> "hrms"|"eis"
  const [returns, setReturns] = useState({});   // Form 6A entries returned to retiree, key -> remark
  const [remarkKey, setRemarkKey] = useState(null);  // which item's return-remark box is open
  const [remarkText, setRemarkText] = useState("");

  const sel = view.id ? rows.find((r) => r.id === view.id) : null;
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2600); };
  const toggle = (key) => setChecks((c) => c.includes(key) ? c.filter((x) => x !== key) : [...c, key]);
  const pick = (itemKey, field, source) => setPicks((p) => ({ ...p, [`${itemKey}|${field}`]: source }));
  const resetTask = () => { setChecks([]); setPicks({}); setReturns({}); setRemarkKey(null); setRemarkText(""); };

  const stamp = (id, stage, actor, action, remark, extra = {}) =>
    setRows((rs) => rs.map((r) => r.id === id ? { ...r, stage, ...extra, history: [...r.history, { date: "Today", actor, action, remark }] } : r));

  // Validation done → Form 6A is auto-sent to the retiree (no manual dispatch step).
  const completeVerify = () => {
    setRows((rs) => rs.map((r) => r.id === sel.id ? { ...r, stage: 2, history: [...r.history,
      { date: "Today", actor: "You (HOO)", action: "Service Book validated", remark: `Service Book & ${sel.qualifyingYears}y qualifying service confirmed (HRMS/EIS reconciled).` },
      { date: "Today", actor: "System", action: "Form 6A auto-sent to retiree", remark: "Sent to the pensioner portal automatically on validation." },
    ] } : r));
    resetTask(); setView({ name: "case", id: sel.id });
    say("Service Book validated — Form 6A auto-sent to the retiree.");
  };
  const retireeSubmit = () => { stamp(sel.id, 3, "Retiree", "Forms received", "Form 6A + nominations + bank mandate submitted from the pensioner portal.", { form6aReturned: false }); say("Retiree submitted Form 6A (auto-update)."); };
  const retireeResubmit = () => { clearForm6aReturn(); stamp(sel.id, 3, "Retiree", "Corrected Form 6A resubmitted", "Returned entries corrected and resubmitted from the pensioner portal.", { form6aReturned: false }); say("Retiree resubmitted the corrected Form 6A."); };
  const verifyForms = () => { stamp(sel.id, 4, "You (HOO)", "Forms validated", "Submitted Form 6A validated against checklist.", { form6aReturned: false }); resetTask(); setView({ name: "case", id: sel.id }); say("Forms validated — ready to compute Forms 7 & 8."); };
  const returnForms = () => {
    const items = formCheckEvidence(sel);
    const returned = Object.keys(returns).map((k) => ({ label: (items.find((i) => i.key === k) || {}).label || k, remark: returns[k] }));
    setForm6aReturn({ caseId: sel.id, name: sel.name, at: "Today", by: "Head of Office", items: returned });
    stamp(sel.id, 3, "You (HOO)", "Form 6A returned to retiree", returned.map((x) => `${x.label} — ${x.remark}`).join(" · "), { form6aReturned: true });
    resetTask(); setView({ name: "case", id: sel.id });
    say(`Form 6A returned to the retiree with ${returned.length} remark(s).`);
  };
  const forwardPAO = () => { stamp(sel.id, 5, "You (HOO)", "Forms 7 & 8 sent to PAO", "Computation sheet & Service Book forwarded to PAO.", { returned: false }); setChecks([]); setView({ name: "case", id: sel.id }); say("Case forwarded to PAO. Awaiting PPO."); };
  const paoIssue = () => { const ppo = newPPO(); stamp(sel.id, 6, "PAO", "PPO issued", `${ppo} generated; SSA sent to bank.`, { ppo }); say(`PPO ${ppo} issued (auto-update from PAO).`); };

  // ---------- NESTED TASK PAGES ----------
  if (view.name === "task" && sel) {
    const crumb = (label) => <Breadcrumb items={[{ label: "Pension cases", onClick: () => setView({ name: "cockpit" }) }, { label: sel.name, onClick: () => setView({ name: "case", id: sel.id }) }, { label }]} />;

    if (view.task === "verify") {
      const items = verifyEvidence(sel);
      const allMismatches = items.flatMap((it) => (it.rows || []).filter((r) => r.hrms !== r.eis).map((r) => `${it.key}|${r.field}`));
      const resolvedCount = allMismatches.filter((k) => picks[k]).length;
      const allDone = items.every((i) => checks.includes(i.key));
      return (
        <ModuleShell icon="fileCheck" title="Validate Service Book" desc={`${sel.name} · ${sel.designation}`} onBack={() => setView({ name: "case", id: sel.id })}>
          {crumb("Validate Service Book")}
          <SectionCard title="Service & emoluments" icon="info">
            <div className="grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Qualifying service" value={`${sel.qualifyingYears} years`} />
              <InfoRow label="Last emoluments" value={formatINR(sel.emoluments)} />
              <InfoRow label="Date of retirement" value={sel.dor} />
              <InfoRow label="Govt quarter" value={sel.quarter === "Yes" ? "Yes — NDC required" : "No"} />
            </div>
          </SectionCard>
          {allMismatches.length > 0 && (
            <div className={cn("flex items-center gap-2.5 rounded-xl border p-3.5 text-sm", resolvedCount === allMismatches.length ? "border-success/30 bg-success/[0.06] text-success" : "border-saffron/40 bg-saffron/[0.06] text-saffron")}>
              <Icon name={resolvedCount === allMismatches.length ? "check" : "info"} size={16} className="flex-shrink-0" />
              <span className="text-foreground"><b>{resolvedCount}/{allMismatches.length}</b> HRMS ↔ EIS mismatch{allMismatches.length > 1 ? "es" : ""} resolved. Each field is shown from both systems; where they differ, choose which value to keep.</span>
            </div>
          )}
          <SectionCard title="Validation checklist — HRMS vs EIS" desc="Review each field against both source systems. Resolve any highlighted mismatch (Keep HRMS / Keep EIS), then confirm. Nothing advances until all are validated." icon="listChecks">
            <ReconcileChecklist items={items} checked={checks} onToggle={toggle} picks={picks} onPick={pick} />
            <Button variant="saffron" className="mt-4 w-full justify-center" disabled={!allDone} onClick={completeVerify}>
              <Icon name="check" size={16} /> {allDone ? "Confirm validation → auto-send Form 6A" : `Validate all ${items.length} items to proceed`}
            </Button>
          </SectionCard>
        </ModuleShell>
      );
    }

    if (view.task === "formcheck") {
      const items = formCheckEvidence(sel);
      const returnedKeys = Object.keys(returns);
      const canConfirm = items.every((i) => checks.includes(i.key)) && returnedKeys.length === 0;
      return (
        <ModuleShell icon="fileCheck" title="Validate submitted Form 6A" desc={`${sel.name} · ${sel.designation}`} onBack={() => setView({ name: "case", id: sel.id })}>
          {crumb("Validate submitted Form 6A")}
          <SectionCard title="Submitted particulars" desc="Confirm each entry, or return any entry to the retiree with a remark. Returned entries are sent back to the pensioner portal for correction." icon="listChecks">
            <ul className="space-y-2.5">
              {items.map((it) => {
                const on = checks.includes(it.key);
                const ret = returns[it.key];
                return (
                  <li key={it.key} className={cn("rounded-xl2 border p-4 transition-colors", on ? "border-success/40 bg-success/[0.04]" : ret ? "border-red-300 bg-red-50" : "border-border bg-card")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span className={cn("mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-md text-white", on ? "bg-success" : ret ? "bg-red-500" : "bg-muted-foreground/25")}><Icon name={ret ? "x" : "check"} size={12} /></span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground">{it.label}</div>
                          {it.data && (
                            <div className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                              {it.data.map(([k, v]) => (
                                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-border/70 pb-1">
                                  <span className="text-xs text-muted-foreground">{k}</span><span className="text-right text-xs font-semibold text-foreground">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {ret && <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-red-600"><Icon name="info" size={12} /> Returned to retiree — {ret}</p>}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-stretch gap-1.5">
                        <button type="button" onClick={() => { setReturns((s) => { const c = { ...s }; delete c[it.key]; return c; }); toggle(it.key); }}
                          className={cn("rounded-lg px-3 py-1.5 text-xs font-bold transition-colors", on ? "bg-success/12 text-success" : "bg-primary text-primary-foreground hover:bg-primary-light")}>
                          {on ? <span className="inline-flex items-center gap-1"><Icon name="check" size={13} /> Confirmed</span> : "Confirm"}
                        </button>
                        <button type="button" onClick={() => { setRemarkKey(it.key); setRemarkText(returns[it.key] || ""); }}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">Return…</button>
                      </div>
                    </div>
                    {remarkKey === it.key && (
                      <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
                        <Textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} placeholder="Reason to return this entry to the retiree (e.g. IFSC does not match the bank — please re-enter)." />
                        <div className="mt-2 flex gap-2">
                          <Button variant="saffron" className="px-3 py-1.5 text-xs" disabled={!remarkText.trim()} onClick={() => { setReturns((s) => ({ ...s, [it.key]: remarkText.trim() })); setChecks((c) => c.filter((x) => x !== it.key)); setRemarkKey(null); setRemarkText(""); }}>
                            <Icon name="arrowUpRight" size={13} /> Return with remark
                          </Button>
                          <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => { setRemarkKey(null); setRemarkText(""); }}>Cancel</Button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4">
              {returnedKeys.length > 0
                ? <Button variant="saffron" className="w-full justify-center" onClick={returnForms}><Icon name="arrowUpRight" size={16} /> Return Form 6A to retiree ({returnedKeys.length} remark{returnedKeys.length > 1 ? "s" : ""})</Button>
                : <Button variant="saffron" className="w-full justify-center" disabled={!canConfirm} onClick={verifyForms}><Icon name="check" size={16} /> {canConfirm ? "Confirm validation" : "Confirm or return each entry"}</Button>}
            </div>
          </SectionCard>
        </ModuleShell>
      );
    }

    if (view.task === "pao") {
      return <PaoForwardPage sel={sel} checks={checks} onToggle={toggle} onForward={forwardPAO} onBack={() => setView({ name: "case", id: sel.id })} crumbEl={crumb("Forms 7 & 8 → PAO")} />;
    }

    if (view.task === "profile") {
      const p = retireeProfile(sel);
      const Card = ({ title, icon, rows: rr }) => <SectionCard title={title} icon={icon}><div className="grid gap-x-8 sm:grid-cols-2">{rr.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div></SectionCard>;
      return (
        <ModuleShell icon="userCheck" title={`${sel.name} — Profile`} desc={`${sel.designation} · ${sel.type}`} onBack={() => setView({ name: "case", id: sel.id })}>
          {crumb("Pensioner profile")}
          <Card title="Personal" icon="info" rows={p.personal} />
          <Card title="Service" icon="briefcase" rows={p.service} />
          <Card title="Financial" icon="badgeCheck" rows={p.financial} />
          <Card title="Family & nominee" icon="users" rows={p.family} />
        </ModuleShell>
      );
    }
  }

  // ---------- CASE DETAIL ----------
  if (view.name === "case" && sel) {
    const a = ACT[sel.stage];
    const renderAction = () => {
      if (sel.stage >= 6) return <div className="rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Case completed · PPO {sel.ppo}</div>;
      if (a.kind === "auto") {
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-saffron/30 bg-saffron/[0.06] p-3.5 text-sm">
              <Icon name="activity" size={16} className="mt-0.5 flex-shrink-0 text-saffron" />
              <span className="text-foreground">Awaiting <b>{a.actor === "retiree" ? "the retiree" : "the PAO"}</b> — {a.cta}. This step updates automatically from {a.actor === "retiree" ? "the pensioner portal" : "the PAO office"}; no action is needed from you.</span>
            </div>
            <Button variant="outline" className="w-full justify-center border-dashed text-xs" onClick={a.actor === "retiree" ? retireeSubmit : paoIssue}>
              <Icon name="repeat" size={14} /> Demo: {a.sim}
            </Button>
          </div>
        );
      }
      if (sel.stage === 3 && sel.form6aReturned) {
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-800">
              <Icon name="info" size={16} className="mt-0.5 flex-shrink-0" />
              <span>Form 6A was <b>returned to the retiree</b> with remarks — awaiting the corrected resubmission from the pensioner portal.</span>
            </div>
            <Button variant="outline" className="w-full justify-center border-dashed text-xs" onClick={retireeResubmit}><Icon name="repeat" size={14} /> Demo: Simulate retiree resubmission</Button>
          </div>
        );
      }
      const label = (sel.returned && sel.stage === 4) ? "Correct & re-forward to PAO" : a.cta;
      const open = () => { resetTask(); setView({ name: "task", id: sel.id, task: a.task }); };
      return <Button variant="saffron" className="w-full justify-center" onClick={open}><Icon name="arrowRight" size={16} /> {label}</Button>;
    };

    return (
      <ModuleShell icon="briefcase" title={sel.name} desc={`${sel.designation} · ${sel.type} · retires ${sel.dor}`} onBack={() => setView({ name: "cockpit" })}>
        {flash && <SuccessNote title={flash}>The case record and its history have been updated.</SuccessNote>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: "Pension cases", onClick: () => setView({ name: "cockpit" }) }, { label: sel.name }]} />
          <div className="flex items-center gap-2">
            <AiSummaryButton open={aiOpen} onToggle={() => setAiOpen((o) => !o)} />
            <Button variant="outline" className="px-4 py-2 text-xs" onClick={() => setHistOpen(true)} title="Case history"><Icon name="clock" size={14} /> Case history</Button>
            <Button variant="outline" className="px-4 py-2 text-xs" onClick={() => setView({ name: "task", id: sel.id, task: "profile" })}><Icon name="userCheck" size={14} /> View pensioner profile</Button>
          </div>
        </div>
        {aiOpen && <AiCaseSummary summary={buildCaseSummary({
          domain: "superannuation",
          reference: sel.ppo || `CASE-${sel.id}`,
          typeLabel: `Pension Case — ${sel.type}`,
          subject: `${sel.name} (${sel.designation})`,
          why: `It was auto-created from EIS as the employee approaches superannuation on ${sel.dor}.`,
          steps: STAGES.slice(0, 6).map((st) => ({ label: st.label, actor: ({ verify: "You (HOO)", send: "You (HOO)", received: "Retiree", forms: "You (HOO)", pao: "You (HOO)", ppo: "PAO" })[st.key] })),
          current: sel.stage,
          returned: !!sel.returned,
          figures: (() => {
            const p = basicPension({ emoluments: sel.emoluments, qualifyingYears: sel.qualifyingYears }).pension;
            const grat = retirementGratuity({ emoluments: sel.emoluments, drPercent: 50, qualifyingYears: sel.qualifyingYears }).gratuity;
            const monthly = totalMonthly({ pension: p, drPercent: 50 });
            return [["Basic pension", formatINR(p)], ["Retirement gratuity", formatINR(grat)], ["Monthly (basic + DR)", formatINR(monthly)], ["Qualifying service", `${sel.qualifyingYears} years`]];
          })(),
          missing: sel.stage < 1 ? ["The Service Book is yet to be validated."] : sel.stage < 3 ? ["Form 6A from the retiree is awaited."] : [],
        })} />}
        <div className="grid gap-4 sm:grid-cols-4">
          <KPI label="Pension type" value={sel.type} sub={sel.ministry || ""} icon="info" tone="primary" />
          <KPI label="Retirement" value={sel.dor} sub={`BDR ${sel.bdr}M`} icon="activity" tone="saffron" />
          <KPI label="PPO" value={sel.ppo ? "Issued" : "Pending"} sub={sel.ppo || "not issued"} icon="badgeCheck" tone={sel.ppo ? "success" : "primary"} />
          {(() => {
            const v = vigilance(sel);
            return <KPI label="Vigilance clearance" value={v.status} sub={v.cleared ? `Ref ${v.ref}` : (v.overdue ? "Overdue — follow up CVO" : "Awaiting CVO")} icon={v.icon} tone={v.cleared ? "success" : "saffron"} />;
          })()}
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

        <SectionCard title="Next action" desc="The current step in this case — open it to capture the required data." icon="fileCheck">
          {renderAction()}
          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">BDR checklist</div>
            <Checklist r={sel} />
          </div>
        </SectionCard>

        <Modal open={histOpen} onClose={() => setHistOpen(false)} maxW="max-w-lg">
          <h3 className="flex items-center gap-2 text-lg font-extrabold text-foreground"><Icon name="clock" size={18} className="text-primary" /> Case history</h3>
          <p className="text-sm text-muted-foreground">{sel.name} · {sel.designation}</p>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1"><HistoryTrail items={sel.history} /></div>
        </Modal>

      </ModuleShell>
    );
  }

  // ---------- COCKPIT ----------
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
                className={cn("card-shimmer flex min-w-[96px] flex-col items-center rounded-xl border-2 px-4 py-3 transition-colors", on ? "border-saffron bg-saffron/10" : "border-border hover:border-primary/40")}>
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
