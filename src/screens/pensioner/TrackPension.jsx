import ModuleShell from "./ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Stepper, DataTable, StatusPill, KPI } from "../../components/ui/kit.jsx";
import { LIFECYCLE, PAYMENTS, PENSIONER } from "../../data/pensioner.js";
import { formatINR } from "../../lib/pension.js";

export default function TrackPension({ onBack }) {
  const cols = [
    { key: "month", label: "Month" },
    { key: "credited", label: "Credited on" },
    { key: "gross", label: "Amount", render: (r) => <span className="font-bold">{formatINR(r.gross)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
  ];

  return (
    <ModuleShell icon="activity" title="Track My Pension" desc="Every stage of your case, and your recent monthly credits — no office visits." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Stage" value="7 of 7" sub="Pension active" icon="check" tone="success" />
        <KPI label="Last credited" value={formatINR(PAYMENTS[0].gross)} sub={PAYMENTS[0].credited} icon="activity" tone="primary" />
        <KPI label="Disbursing bank" value={PENSIONER.bank.name.split(" ")[0]} sub={PENSIONER.bank.accountMasked} icon="badgeCheck" tone="saffron" />
      </div>

      <SectionCard title="Your pension lifecycle" desc="From service verification to monthly disbursement." icon="listChecks">
        <div className="rounded-xl bg-muted/30 p-2 text-xs text-muted-foreground sm:p-3">
          <Icon name="info" size={13} className="mr-1 inline text-primary" />
          SMS &amp; email alerts are sent at every stage.
        </div>
        <div className="mt-4">
          <Stepper steps={LIFECYCLE} current={LIFECYCLE.length} />
        </div>
      </SectionCard>

      <SectionCard title="Recent payments" desc="Last six monthly pension credits." icon="activity">
        <DataTable columns={cols} rows={PAYMENTS} />
        <p className="mt-3 text-xs text-muted-foreground">Amounts include Dearness Relief. Differences reflect DR revisions.</p>
      </SectionCard>
    </ModuleShell>
  );
}
