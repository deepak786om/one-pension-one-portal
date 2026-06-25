import ModuleShell from "../pensioner/ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable } from "../../components/ui/kit.jsx";
import { ASSOC_MEMBERS, ASSOC_GRIEVANCES, ASSOC_INFO } from "../../data/association.js";

export default function AssocDashboard({ onBack }) {
  const cols = [
    { key: "regNo", label: "Reg. no.", render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.regNo}</span> },
    { key: "member", label: "Member" },
    { key: "subject", label: "Subject" },
    { key: "lodged", label: "Lodged" },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
  ];
  return (
    <ModuleShell icon="bookMarked" title="Association Dashboard" desc={`${ASSOC_INFO.name} · ${ASSOC_INFO.regNo}`} onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Members" value={ASSOC_MEMBERS.length} sub={`${ASSOC_MEMBERS.filter((m) => m.status === "Active").length} active`} icon="users" tone="primary" />
        <KPI label="Total grievances" value={ASSOC_GRIEVANCES.length} sub="lodged on behalf" icon="messageCircle" tone="saffron" />
        <KPI label="Pending" value={ASSOC_GRIEVANCES.filter((g) => g.status !== "Resolved").length} sub="in progress" icon="listChecks" tone="primary" />
        <KPI label="Disposed" value={ASSOC_GRIEVANCES.filter((g) => g.status === "Resolved").length} sub="resolved" icon="check" tone="success" />
      </div>
      <SectionCard title="Member grievances" desc="Grievances lodged on behalf of your members." icon="messageCircle">
        <DataTable columns={cols} rows={ASSOC_GRIEVANCES} />
      </SectionCard>
    </ModuleShell>
  );
}
