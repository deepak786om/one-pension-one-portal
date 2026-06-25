import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, KPI, Modal } from "../../components/ui/kit.jsx";
import { cn } from "../../lib/cn.js";
import { LIFECYCLE, PAYMENTS, PENSIONER, MONTHS, disbursementFor } from "../../data/pensioner.js";
import { formatINR, basicPension, commutation, retirementGratuity } from "../../lib/pension.js";

const YEARS = [2024, 2025, 2026];

function monthsOf(year) {
  return Array.from({ length: 12 }, (_, i) => ({ idx: i, name: MONTHS[i], disb: disbursementFor(year, i + 1) }));
}
function lastCredited(year) {
  const m = monthsOf(year).filter((x) => x.disb);
  return m.length ? m[m.length - 1].idx : null;
}

function MonthlyDisbursement() {
  const [year, setYear] = useState(2026);
  const [selIdx, setSelIdx] = useState(lastCredited(2026));
  const months = monthsOf(year);
  const credited = months.filter((m) => m.disb);
  const total = credited.reduce((s, m) => s + m.disb.amount, 0);
  const sel = selIdx != null ? months[selIdx] : null;

  const pickYear = (y) => { setYear(y); setSelIdx(lastCredited(y)); };

  return (
    <div className="space-y-4">
      {/* year toggle + summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-border bg-muted/40 p-1">
          {YEARS.map((y) => {
            const on = year === y;
            return (
              <button key={y} onClick={() => pickYear(y)}
                className={cn("rounded-lg px-4 py-1.5 text-sm font-bold transition-all",
                  on ? "bg-gradient-to-br from-primary to-primary-light text-white shadow-soft" : "text-muted-foreground hover:text-foreground")}>
                {y}
              </button>
            );
          })}
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disbursed in {year}</div>
          <div className="text-lg font-black text-foreground">{formatINR(total)} <span className="text-xs font-medium text-muted-foreground">· {credited.length} months</span></div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
        {/* month cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {months.map((m) => {
            const on = m.disb;
            const active = selIdx === m.idx;
            return (
              <motion.button
                key={m.idx}
                onClick={() => on && setSelIdx(m.idx)}
                whileHover={on ? { y: -4 } : undefined}
                whileTap={on ? { scale: 0.97 } : undefined}
                className={cn(
                  "card-shimmer relative flex flex-col rounded-xl2 border p-3.5 text-left transition-shadow",
                  on ? "bg-gradient-to-br from-success/10 via-success/[0.03] to-transparent shadow-card hover:shadow-elegant" : "border-dashed bg-muted/20",
                  active ? "border-success/50 ring-2 ring-success/30" : on ? "border-success/20" : "border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-extrabold", on ? "text-foreground" : "text-muted-foreground/60")}>{m.name}</span>
                  {on ? <Icon name="check" size={14} className="text-success" /> : <span className="text-[10px] text-muted-foreground/50">—</span>}
                </div>
                {on ? (
                  <>
                    <span className="mt-1.5 text-base font-black text-success">{formatINR(m.disb.amount)}</span>
                    <span className="text-[11px] text-muted-foreground">Credited {m.disb.date.replace(/ \d{4}$/, "")}</span>
                  </>
                ) : (
                  <span className="mt-1.5 text-[11px] text-muted-foreground/60">No pension</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* detail panel */}
        <AnimatePresence mode="wait">
          <motion.div key={`${year}-${selIdx}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col rounded-xl2 border border-border bg-gradient-to-b from-primary/[0.04] to-transparent p-5">
            {sel && sel.disb ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{sel.name} {year}</span>
                <span className="mt-1 text-3xl font-black text-success">{formatINR(sel.disb.amount)}</span>
                <StatusPill tone="ok"><span className="mt-2 inline-flex">Credited via DBT</span></StatusPill>
                <div className="mt-4 space-y-2.5 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Credited on</span><span className="font-semibold text-foreground">{sel.disb.date}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="font-semibold text-foreground">DBT</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-semibold text-foreground">{PENSIONER.bank.name.split(" ").slice(0, 2).join(" ")}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-mono text-xs font-semibold text-foreground">{PENSIONER.bank.accountMasked}</span></div>
                </div>
                <p className="mt-4 rounded-lg bg-muted/40 p-2.5 text-[11px] leading-relaxed text-muted-foreground">Amount includes Dearness Relief. Pension is credited on the 1st working day of each month.</p>
              </>
            ) : (
              <div className="grid flex-1 place-items-center text-center">
                <div>
                  <Icon name="info" size={22} className="mx-auto text-muted-foreground/40" />
                  <p className="mt-2 text-xs text-muted-foreground">Select a credited month to see its details.</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function formInfo(name) {
  const P = PENSIONER;
  const base = [
    ["Pensioner", P.name],
    ["PPO Number", P.ppo],
    ["Designation", `${P.designation} · ${P.designationLevel}`],
    ["Office", P.office],
    ["Date of retirement", "31 Mar 2024"],
  ];
  const pen = basicPension({ emoluments: P.emoluments, qualifyingYears: P.qualifyingYears }).pension;
  const com = commutation({ pension: pen, fractionPercent: 40, factor: 8.194 });
  const grat = retirementGratuity({ emoluments: P.emoluments, drPercent: 50, qualifyingYears: P.qualifyingYears }).gratuity;
  const map = {
    "Form 6A": { number: "Form 6A", title: "Single Comprehensive Pension Form",
      rows: [...base, ["Father's / Spouse's", P.fatherSpouse], ["Bank", P.bank.name], ["Account", P.bank.accountMasked], ["IFSC", P.bank.ifsc], ["Nominee", "Sunita Singh (Spouse) — 100%"]],
      note: "Submitted by the pensioner with nominations and bank mandate." },
    "Form 7": { number: "Form 7", title: "Letter to PAO — Sanction of Pension",
      rows: [...base, ["Qualifying service", `${P.qualifyingYears} years`], ["Class of pension", "Superannuation"], ["Date of commencement", "01 Apr 2024"], ["Basic pension", formatINR(pen)]],
      note: "Forwarded by the Head of Office to the Pay & Accounts Office for issue of the PPO." },
    "Form 8": { number: "Form 8", title: "Calculation of Pension & Gratuity",
      rows: [...base, ["Last emoluments", formatINR(P.emoluments)], ["Basic pension (50%)", formatINR(pen)], ["Commuted value (40%)", formatINR(com.lumpSum)], ["Reduced pension", formatINR(com.reduced)], ["Retirement gratuity", formatINR(grat)]],
      note: "Computation sheet enclosed with the pension case." },
    "Nomination": { number: "Nomination", title: "Nomination for Life-time Arrears / Gratuity",
      rows: [...base, ["Nominee 1", "Sunita Singh — Spouse — 100%"], ["Nominee 2 (contingent)", "Rohit Singh — Disabled child"]],
      note: "Nominations recorded under the CCS (Pension) Rules." },
    "Bank mandate": { number: "Bank mandate", title: "Pension Disbursement Bank Mandate",
      rows: [...base, ["Bank", P.bank.name], ["Branch", P.bank.branch], ["Account", P.bank.accountMasked], ["IFSC", P.bank.ifsc]],
      note: "Authorises credit of monthly pension via DBT to the above account." },
  };
  return map[name] || { number: name, title: name, rows: base, note: "System-generated document from the unified pension portal." };
}

function buildFormHtml(f) {
  const rows = f.rows.map(([l, v]) => `<tr><td>${l}</td><td><b>${v}</b></td></tr>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${f.number} — ${f.title}</title>
<style>body{font-family:Inter,Arial,sans-serif;color:#13294B;max-width:720px;margin:36px auto;padding:0 18px}
.sub{color:#E98A1E;font-size:11px;letter-spacing:.12em;font-weight:700;text-transform:uppercase}
h1{font-size:18px;margin:2px 0 0}.hd{border-bottom:2px solid #1B3A6B;padding-bottom:12px;margin-bottom:6px}
table{width:100%;border-collapse:collapse;margin-top:14px}td{padding:9px 10px;border-bottom:1px solid #E1E8F2;font-size:13px}
td:first-child{color:#5B6B85;width:42%}.note{margin-top:16px;font-size:12px;color:#5B6B85;line-height:1.5}
.seal{margin-top:22px;display:inline-block;border:2px dashed #1B9C57;color:#1B9C57;font-size:10px;font-weight:700;
text-transform:uppercase;padding:10px 14px;border-radius:50%}</style></head>
<body><div class="hd"><div class="sub">Government of India · Department of Pension &amp; Pensioners' Welfare</div>
<h1>${f.number} — ${f.title}</h1></div><table>${rows}</table>
<p class="note">${f.note}<br>Digitally generated from the unified pension portal — no physical signature required.</p>
<span class="seal">Digitally<br>Verified</span></body></html>`;
}

function downloadForm(f) {
  const blob = new Blob([buildFormHtml(f)], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${f.number.replace(/\s+/g, "_")}.html`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export default function TrackPension({ onBack }) {
  const [sel, setSel] = useState(LIFECYCLE.length - 1);
  const [doc, setDoc] = useState(null);
  const stage = LIFECYCLE[sel];

  return (
    <ModuleShell icon="activity" title="Track My Pension" desc="Every stage of your case, and your monthly credits — no office visits." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Stage" value="7 of 7" sub="Pension active" icon="check" tone="success" />
        <KPI label="Last credited" value={formatINR(PAYMENTS[0].gross)} sub={PAYMENTS[0].credited} icon="activity" tone="primary" />
        <KPI label="Disbursing bank" value={PENSIONER.bank.name.split(" ")[0]} sub={PENSIONER.bank.accountMasked} icon="badgeCheck" tone="saffron" />
      </div>

      <SectionCard title="Your pension lifecycle" desc="Tap any stage to see what happened." icon="listChecks">
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[640px] items-start">
            {LIFECYCLE.map((s, i) => {
              const active = i === sel;
              return (
                <div key={s.key} className="relative flex flex-1 flex-col items-center">
                  {i > 0 && <span className="absolute right-1/2 top-5 h-0.5 w-full bg-success/40" />}
                  <button onClick={() => setSel(i)} className="relative z-10">
                    <motion.span whileHover={{ scale: 1.12 }} animate={active ? { scale: 1.12 } : { scale: 1 }}
                      className={"grid h-10 w-10 place-items-center rounded-full ring-4 ring-card transition-colors " + (active ? "bg-saffron text-saffron-foreground" : "bg-success text-white")}>
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
                  <button key={d} onClick={() => setDoc(formInfo(d))}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/15 transition-colors hover:bg-primary/5 hover:ring-primary/30">
                    <Icon name="fileText" size={12} /> {d} <Icon name="download" size={11} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      <SectionCard title="Monthly disbursement" desc="Your monthly pension credits — switch the year to see each month." icon="activity">
        <MonthlyDisbursement />
      </SectionCard>

      <Modal open={!!doc} onClose={() => setDoc(null)} maxW="max-w-2xl">
        {doc && (
          <div>
            <div className="border-b-2 border-primary/20 pb-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-saffron">Government of India · DoPPW</div>
              <h3 className="text-lg font-black text-foreground">{doc.number} — {doc.title}</h3>
            </div>
            <div className="mt-3 max-h-[46vh] overflow-y-auto">
              <table className="w-full text-sm">
                <tbody>
                  {doc.rows.map(([l, v]) => (
                    <tr key={l} className="border-b border-dashed border-border">
                      <td className="py-2 pr-4 text-muted-foreground">{l}</td>
                      <td className="py-2 font-semibold text-foreground">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-xs text-muted-foreground">{doc.note}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              <Button variant="saffron" className="px-4 py-2.5" onClick={() => downloadForm(doc)}><Icon name="download" size={16} /> Download</Button>
              <Button variant="outline" className="px-4 py-2.5" onClick={() => { const w = window.open("", "_blank"); if (w) { w.document.write(buildFormHtml(doc)); w.document.close(); w.focus(); w.print(); } }}><Icon name="fileText" size={16} /> Print</Button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
