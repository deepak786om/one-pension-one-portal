import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Input } from "../../components/ui/kit.jsx";
import { PENSIONER } from "../../data/pensioner.js";
import {
  formatINR, basicPension, dearnessRelief, totalMonthly, commutation, retirementGratuity,
  DEFAULT_COMMUTATION_FACTOR,
} from "../../lib/pension.js";

const TABS = [
  ["pension", "Basic Pension", "badgeCheck"],
  ["dr", "Dearness Relief", "activity"],
  ["commute", "Commutation", "repeat"],
  ["gratuity", "Gratuity", "fileText"],
];

function Result({ label, value, big }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={big ? "text-xl font-extrabold text-primary" : "text-base font-bold text-foreground"}>{value}</span>
    </div>
  );
}

export default function Calculators({ onBack }) {
  const [tab, setTab] = useState("pension");
  const [emol, setEmol] = useState(PENSIONER.emoluments);
  const [years, setYears] = useState(PENSIONER.qualifyingYears);
  const [dr, setDr] = useState(PENSIONER.drPercent);
  const [pension, setPension] = useState(PENSIONER.basicPension);
  const [fraction, setFraction] = useState(40);
  const [factor, setFactor] = useState(DEFAULT_COMMUTATION_FACTOR);

  const bp = basicPension({ emoluments: Number(emol), qualifyingYears: Number(years) });
  const com = commutation({ pension: Number(pension), fractionPercent: Number(fraction), factor: Number(factor) });
  const grat = retirementGratuity({ emoluments: Number(emol), drPercent: Number(dr), qualifyingYears: Number(years) });
  const drAmt = dearnessRelief({ pension: Number(pension), drPercent: Number(dr) });

  return (
    <ModuleShell icon="calculator" title="Pension Calculators" desc="Indicative estimates for pension, DR, commutation and gratuity." onBack={onBack}>
      <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-card p-1.5 sm:grid-cols-4">
        {TABS.map(([k, l, ic]) => (
          <button key={k} onClick={() => setTab(k)}
            className={"inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm " + (tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary")}>
            <Icon name={ic} size={15} /> {l}
          </button>
        ))}
      </div>

      {tab === "pension" && (
        <SectionCard title="Basic monthly pension" desc="50% of last emoluments, for 10+ years of qualifying service." icon="badgeCheck">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Last basic pay (emoluments) ₹"><Input type="number" value={emol} onChange={(e) => setEmol(e.target.value)} /></Field>
            <Field label="Qualifying service (years)"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
          </div>
          <div className="mt-4 space-y-2.5">
            {bp.eligible ? <Result label="Estimated basic pension / month" value={formatINR(bp.pension)} big /> : <Result label="Eligibility" value="Not eligible (need 10+ yrs)" />}
            {bp.note && <p className="text-xs text-muted-foreground">{bp.note}</p>}
          </div>
        </SectionCard>
      )}

      {tab === "dr" && (
        <SectionCard title="Dearness Relief" desc="DR is paid on your basic pension at the rate notified by Government." icon="activity">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Basic pension ₹"><Input type="number" value={pension} onChange={(e) => setPension(e.target.value)} /></Field>
            <Field label="Current DR rate (%)"><Input type="number" value={dr} onChange={(e) => setDr(e.target.value)} /></Field>
          </div>
          <div className="mt-4 space-y-2.5">
            <Result label="Dearness Relief amount" value={formatINR(drAmt)} />
            <Result label="Total monthly (pension + DR)" value={formatINR(totalMonthly({ pension: Number(pension), drPercent: Number(dr) }))} big />
          </div>
        </SectionCard>
      )}

      {tab === "commute" && (
        <SectionCard title="Commutation of pension" desc="You may commute up to 40% of pension for a lump sum; it is restored after 15 years." icon="repeat">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Basic pension ₹"><Input type="number" value={pension} onChange={(e) => setPension(e.target.value)} /></Field>
            <Field label="Commute (%) — max 40"><Input type="number" value={fraction} onChange={(e) => setFraction(e.target.value)} /></Field>
            <Field label="Commutation factor" hint="CCS table; 8.194 at age 60"><Input type="number" step="0.001" value={factor} onChange={(e) => setFactor(e.target.value)} /></Field>
          </div>
          <div className="mt-4 space-y-2.5">
            <Result label={`Commuted portion (${com.fraction}%)`} value={formatINR(com.commutedPortion) + " / month"} />
            <Result label="Lump sum received" value={formatINR(com.lumpSum)} big />
            <Result label="Reduced pension (for 15 yrs)" value={formatINR(com.reducedPension) + " / month"} />
          </div>
        </SectionCard>
      )}

      {tab === "gratuity" && (
        <SectionCard title="Retirement gratuity" desc="¼ × (pay + DA) per six months of service, capped at 16.5× pay and ₹25 lakh." icon="fileText">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Last basic pay ₹"><Input type="number" value={emol} onChange={(e) => setEmol(e.target.value)} /></Field>
            <Field label="DA rate (%)"><Input type="number" value={dr} onChange={(e) => setDr(e.target.value)} /></Field>
            <Field label="Qualifying service (years)"><Input type="number" value={years} onChange={(e) => setYears(e.target.value)} /></Field>
          </div>
          <div className="mt-4 space-y-2.5">
            <Result label={`Six-monthly periods counted (max 66)`} value={grat.halfYears} />
            <Result label="Estimated retirement gratuity" value={formatINR(grat.gratuity)} big />
            <p className="text-xs text-muted-foreground">Capped by: {grat.cappedBy === "ceiling" ? "₹25 lakh ceiling" : grat.cappedBy === "16.5x" ? "16.5× emoluments" : "length of service"}.</p>
          </div>
        </SectionCard>
      )}

      <p className="text-center text-xs text-muted-foreground">
        <Icon name="info" size={13} className="mr-1 inline text-primary" />
        These are indicative estimates. Your sanctioned amounts are computed by the PAO under the CCS (Pension) Rules.
      </p>
    </ModuleShell>
  );
}
