import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, KPI } from "../../components/ui/kit.jsx";
import { LIFECYCLE, PAYMENTS, PENSIONER, MONTHS, disbursementFor } from "../../data/pensioner.js";
import { formatINR } from "../../lib/pension.js";

const WD = ["S", "M", "T", "W", "T", "F", "S"];

function PaymentCalendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6); // 1-12
  const first = new Date(year, month - 1, 1).getDay();
  const days = new Date(year, month, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const disb = disbursementFor(year, month);
  const step = (d) => {
    let m = month + d, y = year;
    if (m < 1) { m = 12; y--; } if (m > 12) { m = 1; y++; }
    if (y < 2024 || y > 2026) return;
    setMonth(m); setYear(y);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
      <div className="rounded-xl border border-border p-3 sm:p-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => step(-1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:border-primary/40"><Icon name="chevronLeft" size={15} /></button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-foreground">{MONTHS[month - 1]}</span>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-lg border border-border bg-white px-2 py-1 text-sm font-semibold outline-none focus:border-primary">
              {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={() => step(1)} className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:border-primary/40"><Icon name="chevronRight" size={15} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {WD.map((d, i) => <div key={i} className="py-1 text-[11px] font-bold text-muted-foreground">{d}</div>)}
          {cells.map((d, i) => {
            const paid = d === 1 && disb;
            return (
              <div key={i} className={"relative grid aspect-square place-items-center rounded-lg text-sm " + (d ? "text-foreground" : "") + (paid ? " bg-success/12 font-bold ring-1 ring-success/30" : d ? " hover:bg-muted" : "")}>
                {d || ""}
                {paid && <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-success" />}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col justify-center rounded-xl border border-border bg-muted/30 p-4 text-center lg:w-52">
        {disb ? (
          <>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disbursed</span>
            <span className="mt-1 text-2xl font-black text-success">{formatINR(disb.amount)}</span>
            <span className="mt-1 text-xs text-muted-foreground">Credited {disb.date}</span>
            <StatusPill tone="ok"><span className="mt-2 inline-block">Credited via DBT</span></StatusPill>
          </>
        ) : (
          <>
            <Icon name="info" size={22} className="mx-auto text-muted-foreground/50" />
            <span className="mt-2 text-xs text-muted-foreground">No pension disbursed for this month.</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function TrackPension({ onBack }) {
  const [sel, setSel] = useState(LIFECYCLE.length - 1);
  const stage = LIFECYCLE[sel];

  return (
    <ModuleShell icon="activity" title="Track My Pension" desc="Every stage of your case, and your monthly credits — no office visits." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Stage" value="7 of 7" sub="Pension active" icon="check" tone="success" />
        <KPI label="Last credited" value={formatINR(PAYMENTS[0].gross)} sub={PAYMENTS[0].credited} icon="activity" tone="primary" />
        <KPI label="Disbursing bank" value={PENSIONER.bank.name.split(" ")[0]} sub={PENSIONER.bank.accountMasked} icon="badgeCheck" tone="saffron" />
      </div>

      <SectionCard title="Your pension lifecycle" desc="Tap any stage to see what happened." icon="listChecks">
        {/* horizontal timeline */}
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[640px] items-start">
            {LIFECYCLE.map((s, i) => {
              const active = i === sel;
              return (
                <div key={s.key} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && <span className="absolute right-1/2 top-5 h-0.5 w-full bg-success/40" />}
                  <button onClick={() => setSel(i)} className="relative z-10">
                    <motion.span
                      whileHover={{ scale: 1.12 }}
                      animate={active ? { scale: 1.12 } : { scale: 1 }}
                      className={"grid h-10 w-10 place-items-center rounded-full ring-4 ring-card transition-colors " + (active ? "bg-saffron text-saffron-foreground" : "bg-success text-white")}
                    >
                      <Icon name={s.icon} size={17} />
                    </motion.span>
                  </button>
                  <span className={"mt-2 max-w-[92px] text-center text-[11px] font-semibold leading-tight " + (active ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                  <span className="text-[10px] text-muted-foreground/70">{s.date}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* detail */}
        <AnimatePresence mode="wait">
          <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-foreground">{stage.label}</h4>
              <span className="text-xs text-muted-foreground">{stage.date}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{stage.detail.note}</p>
            <p className="mt-2 text-xs text-foreground"><span className="font-semibold">Action by:</span> {stage.detail.by}</p>
            {stage.detail.docs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {stage.detail.docs.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/15"><Icon name="fileText" size={12} /> {d}</span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      <SectionCard title="Monthly disbursement" desc="Pick a month to see the amount credited that month." icon="activity">
        <PaymentCalendar />
        <p className="mt-3 text-xs text-muted-foreground">Amounts include Dearness Relief; differences reflect DR revisions over the year.</p>
      </SectionCard>
    </ModuleShell>
  );
}
