import ModuleShell from "../pensioner/ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill } from "../../components/ui/kit.jsx";
import { GO_QUEUE } from "../../data/grievance.js";

export default function Atr({ onBack }) {
  const disposed = GO_QUEUE.filter((g) => g.status === "Disposed" || g.atr);
  return (
    <ModuleShell icon="fileCheck" title="Action Taken Reports" desc="The audit trail of grievances you have disposed, with the reply recorded for each." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Disposed" value={disposed.length} sub="with ATR" icon="check" tone="success" />
        <KPI label="This month" value={disposed.length} sub="reports filed" icon="fileCheck" tone="primary" />
        <KPI label="Avg. disposal" value="14 days" sub="within SLA" icon="activity" tone="saffron" />
      </div>
      <SectionCard title="Filed reports" icon="fileText">
        <div className="space-y-3">
          {disposed.map((g) => (
            <div key={g.id} className="rounded-xl2 border border-border bg-card p-4 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-xs font-semibold text-primary">{g.regNo}</div>
                  <div className="text-sm font-bold text-foreground">{g.subject}</div>
                  <div className="text-xs text-muted-foreground">{g.category} · from {g.from}</div>
                </div>
                <StatusPill tone="ok">Disposed</StatusPill>
              </div>
              <p className="mt-3 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed text-foreground"><span className="font-semibold text-primary">ATR: </span>{g.atr || "Disposed with reply to the complainant."}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
