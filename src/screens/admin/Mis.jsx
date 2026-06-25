import ModuleShell from "../pensioner/ModuleShell.jsx";
import { SectionCard, KPI } from "../../components/ui/kit.jsx";
import { SYS_MIS } from "../../data/admin.js";

function fmt(n) { return n.toLocaleString("en-IN"); }

export default function Mis({ onBack }) {
  return (
    <ModuleShell icon="bookMarked" title="System MIS" desc="Cross-module monitoring across the unified pension platform." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KPI label="Pensioners" value={fmt(SYS_MIS.pensioners)} sub="on the platform" icon="users" tone="primary" />
        <KPI label="Live cases" value={SYS_MIS.cases} sub="in processing" icon="briefcase" tone="saffron" />
        <KPI label="Open grievances" value={SYS_MIS.grievances} sub="across offices" icon="messageCircle" tone="primary" />
        <KPI label="DLCs today" value={fmt(SYS_MIS.dlcToday)} sub="submitted" icon="fingerprint" tone="success" />
        <KPI label="Active officials" value={SYS_MIS.activeUsers} sub="signed-in roles" icon="userCheck" tone="primary" />
        <KPI label="PPOs issued" value={SYS_MIS.ppoIssued} sub="this year" icon="badgeCheck" tone="success" />
      </div>
      <SectionCard title="Platform health" desc="All core services operating normally." icon="shieldCheck">
        <div className="grid gap-3 sm:grid-cols-2">
          {[["Parichay SSO", "Operational"], ["Aadhaar / Jeevan Pramaan", "Operational"], ["CPAO / COMPACT bridge", "Operational"], ["DBT / Bank interface", "Operational"]].map(([s, st]) => (
            <div key={s} className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
              <span className="text-sm font-semibold text-foreground">{s}</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-success"><span className="h-2 w-2 rounded-full bg-success" /> {st}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
