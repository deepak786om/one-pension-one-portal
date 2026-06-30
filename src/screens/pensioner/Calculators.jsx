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

function AiCard({ title, tag, children }) {
  return (
    <div className="ai-sheen overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#061B3D] to-[#0B2A55] px-4 py-2.5 text-white">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600"><Icon name="sparkles" size={14} /></span>
        <span className="text-[13px] font-extrabold">{title}</span>
        {tag && <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-300">{tag}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function CommutationAdvisor({ pension, factor }) {
  const [goal, setGoal] = useState("max");      // "max" | "need"
  const [need, setNeed] = useState(1000000);
  const [rate, setRate] = useState(7);
  const f = Number(factor) || DEFAULT_COMMUTATION_FACTOR;
  const at = (pct) => commutation({ pension: Number(pension), fractionPercent: pct, factor: f });

  // Break-even discount rate: rate at which lump sum == present value of the 15-yr reduction.
  const lumpFactor = 12 * f;                     // lump sum = commutedPortion × lumpFactor
  const pvf = (im) => (im === 0 ? 180 : (1 - Math.pow(1 + im, -180)) / im);
  let lo = 1e-7, hi = 0.05;                      // monthly rate search
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (pvf(mid) > lumpFactor) lo = mid; else hi = mid; }
  const beAnnual = ((lo + hi) / 2) * 12 * 100;   // % per year

  const im = rate / 100 / 12;
  const pvReduction = (monthly) => monthly * pvf(im);
  const advAt = (pct) => { const c = at(pct); return c.lumpSum - pvReduction(c.commutedPortion); };
  const favorable = rate > beAnnual;

  let recPct, recReason;
  if (goal === "max") {
    recPct = favorable ? 40 : 0;
    recReason = favorable
      ? `Your assumed ${rate}%/yr discount rate is above the ~${beAnnual.toFixed(1)}% break-even, so the lump sum is worth more to you today than the 15-year reduction it costs — commuting the full 40% maximises present value.`
      : `Your assumed ${rate}%/yr discount rate is below the ~${beAnnual.toFixed(1)}% break-even, so the 15-year reduction outweighs the lump sum in today's money — keeping the higher monthly pension is the better value.`;
  } else {
    let p = 0;
    for (let x = 1; x <= 40; x++) { if (at(x).lumpSum >= Number(need)) { p = x; break; } }
    if (p === 0) { recPct = 40; recReason = `Even the maximum 40% raises ${formatINR(at(40).lumpSum)} — the most commutation can provide; it falls short of ${formatINR(Number(need))}.`; }
    else { recPct = p; recReason = `Commuting ${p}% raises ${formatINR(at(p).lumpSum)} — the smallest commutation that meets your ${formatINR(Number(need))} need, keeping the monthly reduction as low as possible.`; }
  }
  const rec = at(recPct);
  const sweep = [10, 20, 30, 40].map((p) => ({ p, ...at(p) }));

  return (
    <div className="mt-4">
      <AiCard title="Commutation advisor" tag="AI recommendation">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-bold text-slate-500">Your goal:</span>
          {[["max", "Maximise value"], ["need", "Raise a lump sum"]].map(([k, l]) => (
            <button key={k} onClick={() => setGoal(k)} className={"rounded-full px-3 py-1 text-[12px] font-bold transition-colors " + (goal === k ? "bg-[#0B2A55] text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{l}</button>
          ))}
        </div>

        {goal === "need" ? (
          <div className="mt-3"><Field label="Amount you need now ₹"><Input type="number" value={need} onChange={(e) => setNeed(e.target.value)} /></Field></div>
        ) : (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500"><span>Your discount rate (how much you value money now)</span><span className="font-black text-[#0B2A55]">{rate}%/yr</span></div>
            <input type="range" min="4" max="12" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1.5 w-full accent-cyan-500" />
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-soft p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Recommended</div>
            <div className="mt-0.5 flex items-baseline gap-2"><span className="text-3xl font-black text-[#0B2A55]">{recPct}%</span><span className="text-[12px] text-slate-500">commute</span></div>
            <div className="mt-2 space-y-1 text-[12.5px]">
              <div className="flex justify-between"><span className="text-slate-500">Lump sum now</span><span className="font-bold text-emerald-600">{formatINR(rec.lumpSum)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Monthly reduction</span><span className="font-bold text-slate-700">{recPct ? "−" + formatINR(rec.commutedPortion) : "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">For</span><span className="font-bold text-slate-700">15 years, then restored</span></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Break-even discount rate</div>
            <div className="mt-0.5 text-2xl font-black" style={{ color: favorable ? "#00C896" : "#FF7A59" }}>~{beAnnual.toFixed(1)}%<span className="text-sm font-bold">/yr</span></div>
            <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">Commutation is value-positive only if your personal discount rate is above this. DR keeps being paid on your full pension, so only the basic portion is reduced.</p>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-2 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-[12.5px] leading-relaxed text-slate-600">
          <Icon name="sparkles" size={14} className="mt-0.5 flex-shrink-0 text-cyan-600" /> <span>{recReason}</span>
        </p>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead><tr className="text-left text-slate-400"><th className="py-1 font-bold">Commute</th><th className="py-1 font-bold">Lump sum</th><th className="py-1 font-bold">Monthly reduction</th></tr></thead>
            <tbody>
              {sweep.map((s) => (
                <tr key={s.p} className={"border-t border-slate-100 " + (s.p === recPct ? "bg-emerald-50/60 font-bold text-[#0B2A55]" : "text-slate-600")}>
                  <td className="py-1.5">{s.p}%{s.p === recPct ? " ✓" : ""}</td><td className="py-1.5">{formatINR(s.lumpSum)}</td><td className="py-1.5">−{formatINR(s.commutedPortion)}/mo</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AiCard>
    </div>
  );
}

function DrWhatIf({ pension, dr }) {
  const [wd, setWd] = useState(Number(dr));
  const base = Number(pension);
  const drAmt = dearnessRelief({ pension: base, drPercent: wd });
  const monthly = base + drAmt;
  const curMonthly = totalMonthly({ pension: base, drPercent: Number(dr) });
  const delta = monthly - curMonthly;

  // 20-year projection from this DR baseline, ~4%/yr DR-driven growth.
  const g = 1.04; let life = 0; const pts = [];
  for (let y = 0; y < 20; y++) { const m = monthly * Math.pow(g, y); life += m * 12; pts.push(m); }
  const mn = Math.min(...pts), mx = Math.max(...pts);
  const W = 300, H = 44;
  const sx = (i) => (i / (pts.length - 1)) * W;
  const sy = (v) => H - 4 - ((v - mn) / (mx - mn || 1)) * (H - 8);
  const poly = pts.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(" ");

  return (
    <div className="mt-4">
      <AiCard title="What-if: Dearness Relief" tag="live projection">
        <div className="flex items-center justify-between text-[12px] font-semibold text-slate-500">
          <span>Try a future DR rate</span><span className="font-black text-[#0B2A55]">{wd}%</span>
        </div>
        <input type="range" min="0" max="120" step="1" value={wd} onChange={(e) => setWd(Number(e.target.value))} className="mt-1.5 w-full accent-cyan-500" />

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-soft p-3"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">DR amount</div><div className="mt-0.5 text-lg font-black text-[#7A5AF8]">{formatINR(drAmt)}</div><div className="text-[11px] text-slate-500">per month</div></div>
          <div className="rounded-xl border border-slate-200 bg-soft p-3"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Total monthly</div><div className="mt-0.5 text-lg font-black text-emerald-600">{formatINR(monthly)}</div><div className={"text-[11px] font-semibold " + (delta >= 0 ? "text-emerald-600" : "text-rose-600")}>{delta >= 0 ? "+" : "−"}{formatINR(Math.abs(delta))} vs current</div></div>
          <div className="rounded-xl border border-slate-200 bg-soft p-3"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">20-yr receipts</div><div className="mt-0.5 text-lg font-black text-[#1B63E8]">{formatINR(life)}</div><div className="text-[11px] text-slate-500">at ~4%/yr growth</div></div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Projected monthly · next 20 years</div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }} preserveAspectRatio="none" role="img" aria-label="20-year monthly projection">
            <polyline points={poly} fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-2 text-[11.5px] text-slate-400"><Icon name="info" size={11} className="mr-1 inline" /> Indicative — actual DR is notified by Government twice a year; future pay-commission revisions are not modelled.</p>
      </AiCard>
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
          <DrWhatIf pension={pension} dr={dr} />
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
          <CommutationAdvisor pension={pension} factor={factor} />
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

      {(() => {
        const monthlyNow = totalMonthly({ pension: Number(pension), drPercent: Number(dr) });
        const drHike = dearnessRelief({ pension: Number(pension), drPercent: Number(dr) + 4 }) - drAmt;
        const commutedTotal15 = com.commutedPortion * 180;
        const perYearGrat = Number(years) > 0 ? Math.round(grat.gratuity / Number(years)) : 0;
        const INSIGHT = {
          pension: bp.eligible
            ? [`Your basic pension works out to 50% of last emoluments — about ${formatINR(bp.pension)}/month, or ${formatINR(monthlyNow)} including DR at ${dr}%.`,
               `You may commute up to 40% of this for a lump sum, and any Dearness Relief is paid on the full basic pension, not the reduced one.`]
            : [`With under 10 years of qualifying service there is no service pension; a service gratuity is payable instead. Each additional year up to 10 moves you toward the 50% pension.`],
          dr: [`Dearness Relief currently adds ${formatINR(drAmt)}/month — that is ${dr}% of your basic pension of ${formatINR(Number(pension))}.`,
               `A typical 4-point DR revision (to ${Number(dr) + 4}%) would add about ${formatINR(drHike)}/month, roughly ${formatINR(drHike * 12)} more a year.`],
          commute: [`Commuting ${com.fraction}% gives ${formatINR(com.lumpSum)} now, but reduces your pension by ${formatINR(com.commutedPortion)}/month for 15 years (about ${formatINR(commutedTotal15)} in total before restoration).`,
                    `The commutation factor (${factor}) is effectively the number of years over which the lump sum is recovered — break-even is ~${Math.round(Number(factor))} years; the full pension is automatically restored after 15 years.`,
                    `Trade-off: liquidity today versus a lower monthly income. Commuting suits a near-term need (housing, medical); otherwise the higher monthly pension is usually worth more.`],
          gratuity: [`Estimated retirement gratuity is ${formatINR(grat.gratuity)}, capped by ${grat.cappedBy === "ceiling" ? "the ₹25 lakh ceiling" : grat.cappedBy === "16.5x" ? "16.5× your emoluments" : "your length of service"}.`,
                     grat.cappedBy === "ceiling"
                       ? `You are at the ₹25 lakh statutory ceiling, so additional service or pay will not increase the gratuity further.`
                       : `On these inputs, each additional year of qualifying service adds roughly ${formatINR(perYearGrat)} to the gratuity, until a cap is reached.`],
        }[tab];
        return (
          <div className="ai-sheen overflow-hidden rounded-xl bg-gradient-to-r from-[#061B3D] to-[#0B2A55] p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600"><Icon name="sparkles" size={14} /></span>
              <span className="text-[13px] font-extrabold">AI insight</span>
              <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-300">interprets your numbers</span>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {INSIGHT.map((t, i) => <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-cyan-50/90"><Icon name="check" size={13} className="mt-0.5 flex-shrink-0 text-cyan-300" /> <span>{t}</span></li>)}
            </ul>
          </div>
        );
      })()}

      <p className="text-center text-xs text-muted-foreground">
        <Icon name="info" size={13} className="mr-1 inline text-primary" />
        These are indicative estimates. Your sanctioned amounts are computed by the PAO under the CCS (Pension) Rules.
      </p>
    </ModuleShell>
  );
}
