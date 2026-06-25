import ModuleShell from "../pensioner/ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI } from "../../components/ui/kit.jsx";
import { CAMPAIGN_STATS, DLC_REGIONS, CAMPAIGN_INFO } from "../../data/dlc_admin.js";

function fmtN(n) { return n.toLocaleString("en-IN"); }

function RegionBar({ r }) {
  const pct = Math.round((r.covered / r.target) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{r.region}</span>
        <span className="font-bold text-muted-foreground">{pct}% · {fmtN(r.covered)}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={"h-full rounded-full " + (pct >= 75 ? "bg-success" : pct >= 50 ? "bg-saffron" : "bg-primary")} style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

export default function CampaignDashboard({ onBack }) {
  const pct = Math.round((CAMPAIGN_STATS.covered / CAMPAIGN_STATS.target) * 100);
  return (
    <ModuleShell icon="database" title="Campaign MIS Dashboard" desc={`${CAMPAIGN_INFO.name} · ${CAMPAIGN_INFO.scope}`} onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI label="Coverage" value={pct + "%"} sub={`${fmtN(CAMPAIGN_STATS.covered)} of ${fmtN(CAMPAIGN_STATS.target)}`} icon="activity" tone="success" />
        <KPI label="DLCs today" value={fmtN(CAMPAIGN_STATS.today)} sub="submitted" icon="fingerprint" tone="primary" />
        <KPI label="Camps held" value={fmtN(CAMPAIGN_STATS.camps)} sub="nationwide" icon="mapPin" tone="saffron" />
        <KPI label="Pending" value={fmtN(CAMPAIGN_STATS.target - CAMPAIGN_STATS.covered)} sub="to cover" icon="listChecks" tone="primary" />
      </div>
      <SectionCard title="Coverage by region" desc="Progress against each region's target." icon="database">
        <div className="space-y-3.5">{DLC_REGIONS.map((r) => <RegionBar key={r.region} r={r} />)}</div>
      </SectionCard>
      <SectionCard title="National progress" icon="activity">
        <div className="flex items-center gap-4">
          <div className="relative grid h-24 w-24 place-items-center">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEF3FA" strokeWidth="3.2" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1B9C57" strokeWidth="3.2" strokeDasharray={`${pct} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute text-lg font-black text-foreground">{pct}%</span>
          </div>
          <div className="text-sm text-muted-foreground">
            <p><b className="text-foreground">{fmtN(CAMPAIGN_STATS.covered)}</b> life certificates collected so far against a target of <b className="text-foreground">{fmtN(CAMPAIGN_STATS.target)}</b>.</p>
            <p className="mt-1">Daily progress is trending up with {fmtN(CAMPAIGN_STATS.today)} submitted today.</p>
          </div>
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
