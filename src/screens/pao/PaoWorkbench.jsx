import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable, InfoRow, SuccessNote, Field, Textarea, HistoryTrail, Breadcrumb } from "../../components/ui/kit.jsx";
import { PAO_CASES, newPPO } from "../../data/pao.js";
import { basicPension, commutation, retirementGratuity, totalMonthly, formatINR } from "../../lib/pension.js";

function Computation({ r }) {
  if (r.type === "Family Pension") {
    const fp = Math.round(r.emoluments * 0.3);
    return (
      <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Family pension computation</div>
        <div className="grid gap-x-8 sm:grid-cols-2">
          <InfoRow label="Last emoluments" value={formatINR(r.emoluments)} />
          <InfoRow label="Family pension (30%)" value={formatINR(fp)} />
          <InfoRow label="Enhanced rate (10 yrs)" value={formatINR(Math.round(r.emoluments * 0.5))} />
        </div>
      </div>
    );
  }
  const p = basicPension({ emoluments: r.emoluments, qualifyingYears: r.qualifyingYears }).pension;
  const com = commutation({ pension: p, fractionPercent: 40, factor: 8.194 });
  const grat = retirementGratuity({ emoluments: r.emoluments, drPercent: 50, qualifyingYears: r.qualifyingYears }).gratuity;
  const rows = [["Last emoluments", formatINR(r.emoluments)], ["Qualifying service", `${r.qualifyingYears} years`], ["Basic pension (50%)", formatINR(p)], ["Commuted value (40%)", formatINR(com.lumpSum)], ["Reduced pension", formatINR(com.reduced)], ["Retirement gratuity", formatINR(grat)], ["Monthly (basic + DR)", formatINR(totalMonthly({ pension: p, drPercent: 50 }))]];
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Forms 7 & 8 — verified computation</div>
      <div className="grid gap-x-8 sm:grid-cols-2">{rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
    </div>
  );
}

export default function PaoWorkbench({ onBack }) {
  const [rows, setRows] = useState(PAO_CASES);
  const [openId, setOpenId] = useState(null);
  const [obj, setObj] = useState("");
  const [showObj, setShowObj] = useState(false);
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === openId);

  const issuePPO = () => {
    const ppo = newPPO();
    setRows((rs) => rs.map((r) => r.id === openId ? { ...r, status: "PPO issued", ppo, history: [...r.history, { date: "Today", actor: "You (PAO)", action: "PPO issued", remark: `${ppo} generated; SSA to bank, CPAO updated.` }] } : r));
    setFlash(`PPO ${ppo} issued.`); setOpenId(null); setTimeout(() => setFlash(""), 2600);
  };
  const raiseObjection = () => {
    setRows((rs) => rs.map((r) => r.id === openId ? { ...r, status: "Objection raised", history: [...r.history, { date: "Today", actor: "You (PAO)", action: "Objection raised", remark: obj }] } : r));
    setShowObj(false); setObj(""); setFlash("Objection returned to HOO."); setOpenId(null); setTimeout(() => setFlash(""), 2600);
  };

  if (sel) {
    return (
      <ModuleShell icon="badgeCheck" title={sel.name} desc={`${sel.type} · received from ${sel.hoo}`} onBack={() => setOpenId(null)}>
        <Breadcrumb items={[{ label: "Sanction queue", onClick: () => setOpenId(null) }, { label: sel.name }]} />
        <div className="grid gap-4 sm:grid-cols-3">
          <KPI label="PAN" value={sel.pan} icon="info" tone="primary" />
          <KPI label="Received" value={sel.received} icon="activity" tone="saffron" />
          <KPI label="Status" value={sel.ppo ? "PPO issued" : sel.status} sub={sel.ppo || ""} icon="badgeCheck" tone={sel.ppo ? "success" : "primary"} />
        </div>
        <Computation r={sel} />
        {sel.status === "PPO issued" ? (
          <SuccessNote title="PPO issued">PPO <b className="font-mono text-foreground">{sel.ppo}</b> has been generated, the Special Seal Authority sent to the disbursing bank, and CPAO updated.</SuccessNote>
        ) : (
          <SectionCard title="Scrutiny decision" desc="Verify the computation, then issue the PPO or return with an objection." icon="scale">
            {!showObj ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="saffron" onClick={issuePPO}><Icon name="badgeCheck" size={16} /> Issue e-PPO</Button>
                <Button variant="outline" onClick={() => setShowObj(true)}><Icon name="repeat" size={16} /> Raise objection</Button>
              </div>
            ) : (
              <div>
                <Field label="Objection / discrepancy" required><Textarea value={obj} onChange={(e) => setObj(e.target.value)} placeholder="Describe the discrepancy to return to the HOO…" /></Field>
                <div className="mt-3 flex gap-2">
                  <Button variant="saffron" disabled={obj.trim().length < 8} onClick={raiseObjection}><Icon name="arrowRight" size={16} /> Return to HOO</Button>
                  <Button variant="outline" onClick={() => setShowObj(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </SectionCard>
        )}
        <SectionCard title="Case history" icon="activity"><HistoryTrail items={sel.history} /></SectionCard>
      </ModuleShell>
    );
  }

  const pend = rows.filter((r) => r.status === "Pending scrutiny").length;
  const obj2 = rows.filter((r) => r.status === "Objection raised").length;
  const issued = rows.filter((r) => r.ppo).length;
  const cols = [
    { key: "name", label: "Retiree", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.pan} · {r.hoo}</div></div> },
    { key: "type", label: "Type" },
    { key: "received", label: "Received" },
    { key: "status", label: "Status", render: (r) => r.ppo ? <StatusPill tone="ok">PPO Issued</StatusPill> : r.status === "Objection raised" ? <StatusPill tone="warn">Objection</StatusPill> : <StatusPill>Pending</StatusPill> },
    { key: "go", label: "", render: () => <Icon name="chevronRight" size={16} className="text-muted-foreground" /> },
  ];
  return (
    <ModuleShell icon="badgeCheck" title="Sanction & Issue PPO" desc="Cases sanctioned by Heads of Office, awaiting scrutiny and PPO issue." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The case record and CPAO data have been updated.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Pending scrutiny" value={pend} sub="awaiting action" icon="listChecks" tone="primary" />
        <KPI label="Objections" value={obj2} sub="returned to HOO" icon="repeat" tone="saffron" />
        <KPI label="PPOs issued" value={issued} sub="this year" icon="check" tone="success" />
      </div>
      <SectionCard title="Sanction queue" icon="listChecks"><DataTable columns={cols} rows={rows} onRowClick={(r) => setOpenId(r.id)} /></SectionCard>
    </ModuleShell>
  );
}
