import ModuleShell from "../pensioner/ModuleShell.jsx";
import { SectionCard, KPI, DataTable, StatusPill } from "../../components/ui/kit.jsx";
import { RETIREES, STAGES } from "../../data/hoo.js";

function Bar({ label, value, max, tone = "primary" }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  const c = tone === "saffron" ? "bg-saffron" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs"><span className="font-medium text-foreground">{label}</span><span className="font-bold text-muted-foreground">{value}</span></div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted"><div className={"h-full rounded-full " + c} style={{ width: pct + "%" }} /></div>
    </div>
  );
}

export default function DeptReports({ onBack }) {
  const byStage = STAGES.map((s, i) => ({ stage: s.label, count: RETIREES.filter((r) => r.stage === i).length }));
  const maxStage = Math.max(1, ...byStage.map((b) => b.count));
  const issued = RETIREES.filter((r) => r.ppo).length;
  const pending = RETIREES.filter((r) => !r.ppo).length;

  const cols = [
    { key: "name", label: "Retiree", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "dor", label: "Retires" },
    { key: "stage", label: "Stage", render: (r) => <span className="text-xs font-semibold text-primary">{STAGES[r.stage].label}</span> },
    { key: "ppo", label: "PPO", render: (r) => r.ppo ? <StatusPill tone="ok">Issued</StatusPill> : <StatusPill>Pending</StatusPill> },
  ];

  return (
    <ModuleShell icon="bookMarked" title="Department Reports / MIS" desc="Cross-office oversight of pension processing and disposal." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Live cases" value={RETIREES.filter((r) => r.stage < 6).length} sub="in pipeline" icon="activity" tone="primary" />
        <KPI label="PPOs issued" value={issued} sub="this year" icon="badgeCheck" tone="success" />
        <KPI label="Pending PPO" value={pending} sub="follow-up" icon="repeat" tone="saffron" />
        <KPI label="Avg. cycle time" value="42 days" sub="case → PPO" icon="check" tone="primary" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Cases by stage" desc="Distribution across the pension lifecycle." icon="listChecks">
          <div className="space-y-3">{byStage.map((b, i) => <Bar key={b.stage} label={b.stage} value={b.count} max={maxStage} tone={i >= 5 ? "success" : i >= 3 ? "saffron" : "primary"} />)}</div>
        </SectionCard>
        <SectionCard title="Disposal summary" desc="Processed vs pending across the department." icon="database">
          <div className="space-y-3">
            <Bar label="Issued" value={issued} max={RETIREES.length} tone="success" />
            <Bar label="Pending" value={pending} max={RETIREES.length} tone="saffron" />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Reports can be exported as PDF/Excel and scheduled to ministry dashboards.</p>
        </SectionCard>
      </div>
      <SectionCard title="Case register" icon="fileText"><DataTable columns={cols} rows={RETIREES} /></SectionCard>
    </ModuleShell>
  );
}
