import ModuleShell from "../pensioner/ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, DataTable, StatusPill } from "../../components/ui/kit.jsx";
import { RETIREES, REPORTS, STAGES } from "../../data/hoo.js";

function Bar({ label, value, max, tone = "primary" }) {
  const pct = Math.round((value / max) * 100);
  const c = tone === "saffron" ? "bg-saffron" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium text-foreground">{label}</span><span className="font-bold text-muted-foreground">{value}</span></div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted"><div className={"h-full rounded-full " + c} style={{ width: pct + "%" }} /></div>
    </div>
  );
}

export default function Reports({ onBack }) {
  const byStage = STAGES.map((s, i) => ({ stage: s.label, count: RETIREES.filter((r) => r.stage === i).length }));
  const maxStage = Math.max(1, ...byStage.map((b) => b.count));
  const retiring = RETIREES.filter((r) => r.stage < 6);

  const cols = [
    { key: "name", label: "Retiree", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "dor", label: "Retires" },
    { key: "bdr", label: "BDR", render: (r) => `${r.bdr}M` },
    { key: "stage", label: "Stage", render: (r) => <span className="text-xs font-semibold text-primary">{STAGES[r.stage].label}</span> },
    { key: "ppo", label: "PPO", render: (r) => r.ppo ? <StatusPill tone="ok">Issued</StatusPill> : <StatusPill>Pending</StatusPill> },
  ];

  return (
    <ModuleShell icon="bookMarked" title="Reports / MIS" desc="Oversight of your office's pension processing." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Retiring 12–15M" value={REPORTS.retiring12to15} sub="plan ahead" icon="activity" tone="primary" />
        <KPI label="Verification pending" value={REPORTS.serviceVerifyPending} sub="service books" icon="fileCheck" tone="saffron" />
        <KPI label="PPO not issued" value={REPORTS.ppoNotIssued} sub="follow up" icon="badgeCheck" tone="primary" />
        <KPI label="Processed (FY)" value={REPORTS.casesProcessedFY} sub="PPOs issued" icon="check" tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Cases by stage" desc="Where your live cases currently sit." icon="listChecks">
          <div className="space-y-3">
            {byStage.map((b, i) => <Bar key={b.stage} label={b.stage} value={b.count} max={maxStage} tone={i >= 5 ? "success" : i >= 3 ? "saffron" : "primary"} />)}
          </div>
        </SectionCard>
        <SectionCard title="CPAO data analysis" desc="Reconciliation with central pension accounting." icon="database">
          <div className="space-y-3">
            <Bar label="Records matched" value={REPORTS.casesProcessedFY - REPORTS.cpaoMismatch} max={REPORTS.casesProcessedFY} tone="success" />
            <Bar label="Mismatches to fix" value={REPORTS.cpaoMismatch} max={REPORTS.casesProcessedFY} tone="saffron" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Mismatches usually stem from name/PAN or bank-account differences between the PPO and CPAO master.</p>
        </SectionCard>
      </div>

      <SectionCard title="Retiring employees — next 6+ months" desc="Drive proactive service verification and form dispatch." icon="fileText">
        <DataTable columns={cols} rows={retiring} />
      </SectionCard>
    </ModuleShell>
  );
}
