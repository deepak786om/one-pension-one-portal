import { useState } from "react";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";

const TONE = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
  amber: "text-amber-600 bg-amber-50 border-amber-200",
  rose: "text-rose-600 bg-rose-50 border-rose-200",
  violet: "text-violet-600 bg-violet-50 border-violet-200",
  cyan: "text-cyan-700 bg-cyan-50 border-cyan-200",
  slate: "text-slate-600 bg-slate-100 border-slate-200",
  orange: "text-orange-600 bg-orange-50 border-orange-200",
};
const DOT = { emerald: "bg-emerald-500", amber: "bg-amber-500", rose: "bg-rose-500", slate: "bg-slate-400" };
const BAR = { emerald: "#00C896", amber: "#F6C445", rose: "#FF7A59", violet: "#7A5AF8", cyan: "#06B6D4", slate: "#94A3B8" };

// Illuminating shimmer trigger — placed before "View profile".
export function AiSummaryButton({ open, onToggle }) {
  return (
    <button onClick={onToggle} aria-expanded={open}
      className={cn("ai-illuminate inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white", open && "is-open")}>
      <Icon name="sparkles" size={14} /> AI Summary
      <Icon name="chevronRight" size={14} className={cn("transition-transform", open && "rotate-90")} />
    </button>
  );
}

function Acc({ id, open, onToggle, icon, title, accent, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button onClick={() => onToggle(id)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2.5">
          <span className={cn("grid h-7 w-7 place-items-center rounded-lg border", accent)}><Icon name={icon} size={14} /></span>
          <span className="text-[13px] font-bold text-slate-700">{title}</span>
        </span>
        <Icon name="chevronRight" size={16} className={cn("text-slate-400 transition-transform", open && "rotate-90")} />
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-3 text-[13px] leading-relaxed text-slate-600">{children}</div>}
    </div>
  );
}

function Meter({ label, value, pct, color }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500"><span>{label}</span><span style={{ color }}>{value}</span></div>
      <div className="mt-1.5 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  );
}

export default function AiCaseSummary({ summary }) {
  const s = summary;
  const [modal, setModal] = useState(false);
  const [sec, setSec] = useState("exec");
  const toggle = (id) => setSec((c) => c === id ? "" : id);
  const riskColor = BAR[s.signals[1] ? s.signals[1].tone : "emerald"];

  return (
    <>
      {/* ---------- OVERVIEW DIV (opens on AI Summary button) ---------- */}
      <div className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-card">
        <div className="ai-sheen flex items-center justify-between gap-3 bg-gradient-to-r from-[#061B3D] to-[#0B2A55] px-4 py-2.5 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow"><Icon name="sparkles" size={15} /></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">AI Insights</span>
            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-300">{s.engineLabel}</span>
          </div>
          <span className="text-[11px] font-medium text-cyan-100/70">{s.headline}</span>
        </div>

        <div className="grid gap-3 bg-soft p-3.5 sm:grid-cols-[1.65fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Concise summary</span>
              <span className="text-[10.5px] font-medium text-slate-400">{s.charCount} / 1000 chars</span>
            </div>
            <div className="space-y-1.5 text-[12.5px] leading-relaxed text-slate-600">
              <p><b className="font-semibold text-slate-700">Understanding.</b> {s.compact.understanding}</p>
              <p><b className="font-semibold text-slate-700">Status.</b> {s.compact.status}</p>
              <p><b className="font-semibold text-slate-700">Action.</b> {s.compact.action}</p>
              <p><b className="font-semibold text-slate-700">Risk.</b> {s.compact.risk}</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Key highlights</span>
            <ul className="mt-2 space-y-2">
              {s.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-600"><Icon name="check" size={13} className="mt-0.5 flex-shrink-0 text-emerald-500" /> <span>{h}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <button onClick={() => { setSec("exec"); setModal(true); }} className="flex w-full items-center justify-between border-t border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0B2A55] transition-colors hover:bg-slate-50">
          <span className="flex items-center gap-2"><Icon name="database" size={15} className="text-amber-500" /> View Detailed AI Analysis</span>
          <Icon name="arrowUpRight" size={16} className="text-slate-400" />
        </button>
        <div className="border-t border-slate-100 bg-soft px-4 py-2 text-[11px] text-slate-400"><Icon name="info" size={11} className="mr-1 inline" /> Indicative analysis · does not replace formal departmental review.</div>
      </div>

      {/* ---------- DETAILED MODAL (70% text · 30% analytics) ---------- */}
      {modal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-[#061B3D]/50 backdrop-blur-[2px]" style={{ animation: "fadeIn .25s ease" }} onClick={() => setModal(false)} />
          <div className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl2 bg-white shadow-2xl sm:flex-row" style={{ animation: "popIn .3s cubic-bezier(.2,.7,.2,1)" }} role="dialog" aria-label="AI insights detail">

            {/* LEFT — 70% text */}
            <div className="flex w-full flex-col sm:w-[68%]">
              <div className="ai-sheen relative flex items-start justify-between gap-3 bg-gradient-to-r from-[#061B3D] to-[#0B2A55] px-5 py-4 text-white">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow"><Icon name="sparkles" size={19} /></span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/70">AI Insights</div>
                    <div className="text-[15px] font-extrabold leading-tight">{s.serviceName}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-cyan-100">{s.reference}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {s.statusLabel}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setModal(false)} aria-label="Close" className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-white/20 sm:hidden"><Icon name="x" size={16} /></button>
              </div>
              <div className="flex-1 space-y-2.5 overflow-y-auto bg-soft p-4">
                <Acc id="exec" open={sec === "exec"} onToggle={toggle} icon="scale" title="Executive summary" accent={TONE.slate}>{s.detailed.executive}</Acc>
                <Acc id="overview" open={sec === "overview"} onToggle={toggle} icon="info" title="Overview" accent={TONE.slate}>{s.detailed.overview}</Acc>
                <Acc id="journey" open={sec === "journey"} onToggle={toggle} icon="activity" title="Journey till date" accent={TONE.cyan}>
                  <div className="space-y-1.5">
                    {s.detailed.journey.completed.map((l) => <div key={l} className="flex items-center gap-2"><Icon name="check" size={13} className="text-emerald-500" /> <span className="text-slate-500">{l}</span></div>)}
                    {s.detailed.journey.current && <div className="flex items-center gap-2 font-semibold text-slate-700"><span className="h-2 w-2 rounded-full bg-amber-400" /> {s.detailed.journey.current} <span className="text-[11px] font-normal text-slate-400">· in progress</span></div>}
                    {s.detailed.journey.pending.filter((l) => l !== s.detailed.journey.current).map((l) => <div key={l} className="flex items-center gap-2 text-slate-400"><span className="h-2 w-2 rounded-full bg-slate-300" /> {l}</div>)}
                  </div>
                </Acc>
                <Acc id="pending" open={sec === "pending"} onToggle={toggle} icon="listChecks" title="Pending actions" accent={TONE.amber}>
                  {s.detailed.pending.length === 0 ? <span className="text-emerald-600">None — the case is complete.</span> : (
                    <ul className="space-y-2">{s.detailed.pending.map((p) => (<li key={p.action} className="flex items-center justify-between gap-2"><span><b className="text-slate-700">{p.action}</b> <span className="text-[11px] text-slate-400">· {p.owner}</span></span><span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", p.priority === "High" ? "bg-rose-50 text-rose-600" : p.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-slate-500")}>{p.priority}</span></li>))}</ul>
                  )}
                </Acc>
                <Acc id="missing" open={sec === "missing"} onToggle={toggle} icon="fileText" title="Missing information" accent={TONE.orange}>
                  {s.detailed.missing.length === 0 ? <span className="text-emerald-600">Nothing outstanding — all particulars on record.</span> : <ul className="list-disc space-y-1 pl-4">{s.detailed.missing.map((m) => <li key={m}>{m}</li>)}</ul>}
                </Acc>
                <Acc id="risk" open={sec === "risk"} onToggle={toggle} icon="shieldCheck" title="Risk indicators" accent={TONE.rose}>
                  <div className="space-y-1.5">{s.detailed.risks.items.map((r, i) => <div key={i} className="flex items-start gap-2"><span className={cn("mt-1 h-2 w-2 flex-shrink-0 rounded-full", DOT[r.tone] || "bg-slate-400")} /> <span className={r.tone === "emerald" ? "text-slate-500" : "text-slate-600"}>{r.text}</span></div>)}</div>
                </Acc>
                <Acc id="rec" open={sec === "rec"} onToggle={toggle} icon="check" title="Recommendations" accent={TONE.emerald}>
                  <p>{s.detailed.recommendations.action}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{s.detailed.recommendations.options.map((o) => <span key={o} className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{o}</span>)}</div>
                </Acc>
                <Acc id="pred" open={sec === "pred"} onToggle={toggle} icon="arrowUpRight" title="Predictions" accent={TONE.cyan}>{s.detailed.predictions}</Acc>
                <Acc id="obs" open={sec === "obs"} onToggle={toggle} icon="bookOpen" title="Supporting observations" accent={TONE.slate}>
                  <ul className="list-disc space-y-1 pl-4">{s.detailed.observations.map((o) => <li key={o}>{o}</li>)}</ul>
                </Acc>
              </div>
            </div>

            {/* RIGHT — 30% analytics / AI suggestion */}
            <div className="flex w-full flex-col border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white sm:w-[32%] sm:border-l sm:border-t-0">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2 text-[13px] font-extrabold text-slate-700"><Icon name="activity" size={15} className="text-cyan-600" /> AI Suggestion</span>
                <button onClick={() => setModal(false)} aria-label="Close" className="hidden h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 sm:grid"><Icon name="x" size={16} /></button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Confidence</div>
                  <div className="mt-1 text-3xl font-black text-[#0B2A55]">{s.confidence}<span className="text-lg">%</span></div>
                </div>
                <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5">
                  <Meter label="Progress" value={`${s.progressPct}%`} pct={s.progressPct} color={BAR.emerald} />
                  <Meter label="Risk" value={s.detailed.risks.level} pct={s.detailed.risks.score} color={riskColor} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {s.signals.map((k) => (
                    <div key={k.label} className={cn("rounded-lg border px-2.5 py-2", TONE[k.tone])}>
                      <div className="text-[10px] font-bold uppercase tracking-wide opacity-70">{k.label}</div>
                      <div className="truncate text-[13px] font-extrabold">{k.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Stage progress</div>
                  <div className="mt-1.5 flex items-end gap-1">
                    {s.detailed.journey.completed.map((l, i) => <div key={"c" + i} className="h-7 flex-1 rounded-sm bg-emerald-400" title={l} />)}
                    {s.detailed.journey.current && <div className="h-7 flex-1 rounded-sm bg-amber-400" title={s.detailed.journey.current} />}
                    {s.detailed.journey.pending.filter((l) => l !== s.detailed.journey.current).map((l, i) => <div key={"p" + i} className="h-7 flex-1 rounded-sm bg-slate-200" title={l} />)}
                  </div>
                  <div className="mt-1.5 text-[11px] text-slate-400">{s.detailed.journey.completed.length} done · {s.detailed.journey.pending.length} remaining</div>
                </div>
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11.5px] leading-relaxed text-slate-500"><Icon name="info" size={12} className="mr-1 inline" /> Generated from the case data already in the portal — indicative only.</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
