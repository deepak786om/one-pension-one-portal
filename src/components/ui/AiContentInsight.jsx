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

function Body({ body }) {
  if (body && body.timeline) {
    return (
      <ol className="space-y-2">
        {body.timeline.map((h, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-cyan-50 text-cyan-600"><Icon name="activity" size={11} /></span>
            <div><div className="text-[12.5px] font-semibold text-slate-700">{h.action} <span className="font-normal text-slate-400">· {h.date}</span></div>{h.remark ? <div className="text-[11.5px] text-slate-500">{h.remark}</div> : null}<div className="text-[11px] text-slate-400">{h.actor}</div></div>
          </li>
        ))}
        {body.timeline.length === 0 && <li className="text-slate-400">No actions recorded yet.</li>}
      </ol>
    );
  }
  if (body && body.list) return <ul className="list-disc space-y-1 pl-4">{body.list.map((x) => <li key={x}>{x}</li>)}</ul>;
  return <p>{body}</p>;
}

function Acc({ id, open, onToggle, icon, title, accent, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button onClick={() => onToggle(id)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
        <span className="flex items-center gap-2.5"><span className={cn("grid h-7 w-7 place-items-center rounded-lg border", TONE[accent] || TONE.slate)}><Icon name={icon} size={14} /></span><span className="text-[13px] font-bold text-slate-700">{title}</span></span>
        <Icon name="chevronRight" size={16} className={cn("text-slate-400 transition-transform", open && "rotate-90")} />
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-3 text-[13px] leading-relaxed text-slate-600">{children}</div>}
    </div>
  );
}

export default function AiContentInsight({ summary }) {
  const s = summary;
  const [modal, setModal] = useState(false);
  const first = s.detailed.sections[0] ? s.detailed.sections[0].id : "";
  const [sec, setSec] = useState(first);
  const toggle = (id) => setSec((c) => c === id ? "" : id);

  return (
    <>
      {/* OVERVIEW DIV */}
      <div className="overflow-hidden rounded-xl2 border border-slate-200 bg-white shadow-card">
        <div className="ai-sheen flex items-center justify-between gap-3 bg-gradient-to-r from-[#061B3D] to-[#0B2A55] px-4 py-2.5 text-white">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow"><Icon name="sparkles" size={15} /></span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/80">AI Insights</span>
            <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-300">{s.engineLabel}</span>
          </div>
          <span className="hidden text-[11px] font-medium text-cyan-100/70 sm:block">{s.headline}</span>
        </div>

        <div className="grid gap-3 bg-soft p-3.5 sm:grid-cols-[1.65fr_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Concise summary</span>
              <span className="text-[10.5px] font-medium text-slate-400">{s.compact.chars} / 1000 chars</span>
            </div>
            <div className="space-y-1.5 text-[12.5px] leading-relaxed text-slate-600">
              {s.compact.sections.map((b) => <p key={b.label}><b className="font-semibold text-slate-700">{b.label}.</b> {b.text}</p>)}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Key highlights</span>
            <ul className="mt-2 space-y-2">{s.highlights.map((h, i) => <li key={i} className="flex items-start gap-2 text-[12.5px] text-slate-600"><Icon name="check" size={13} className="mt-0.5 flex-shrink-0 text-emerald-500" /> <span>{h}</span></li>)}</ul>
          </div>
        </div>

        <button onClick={() => { setSec(first); setModal(true); }} className="flex w-full items-center justify-between border-t border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#0B2A55] transition-colors hover:bg-slate-50">
          <span className="flex items-center gap-2"><Icon name="database" size={15} className="text-amber-500" /> View Detailed AI Analysis</span>
          <Icon name="arrowUpRight" size={16} className="text-slate-400" />
        </button>
        <div className="border-t border-slate-100 bg-soft px-4 py-2 text-[11px] text-slate-400"><Icon name="info" size={11} className="mr-1 inline" /> Indicative analysis · does not replace formal review.</div>
      </div>

      {/* DETAILED MODAL — 70% text · 30% analytics */}
      {modal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6">
          <div className="absolute inset-0 bg-[#061B3D]/50 backdrop-blur-[2px]" style={{ animation: "fadeIn .25s ease" }} onClick={() => setModal(false)} />
          <div className="relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl2 bg-white shadow-2xl sm:flex-row" style={{ animation: "popIn .3s cubic-bezier(.2,.7,.2,1)" }} role="dialog" aria-label="AI insights detail">
            {/* LEFT 70% */}
            <div className="flex w-full flex-col sm:w-[68%]">
              <div className="ai-sheen relative flex items-start justify-between gap-3 bg-gradient-to-r from-[#061B3D] to-[#0B2A55] px-5 py-4 text-white">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow"><Icon name="sparkles" size={19} /></span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/70">AI Insights</div>
                    <div className="text-[15px] font-extrabold leading-tight">{s.serviceName}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]"><span className="rounded bg-white/10 px-2 py-0.5 font-mono text-cyan-100">{s.reference}</span><span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 font-bold text-emerald-200"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> {s.statusLabel}</span></div>
                  </div>
                </div>
                <button onClick={() => setModal(false)} aria-label="Close" className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-white/10 transition-colors hover:bg-white/20 sm:hidden"><Icon name="x" size={16} /></button>
              </div>
              <div className="flex-1 space-y-2.5 overflow-y-auto bg-soft p-4">
                {s.detailed.sections.map((b) => <Acc key={b.id} id={b.id} open={sec === b.id} onToggle={toggle} icon={b.icon} title={b.title} accent={b.accent}><Body body={b.body} /></Acc>)}
              </div>
            </div>
            {/* RIGHT 30% analytics */}
            <div className="flex w-full flex-col border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white sm:w-[32%] sm:border-l sm:border-t-0">
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="flex items-center gap-2 text-[13px] font-extrabold text-slate-700"><Icon name="activity" size={15} className="text-cyan-600" /> AI Suggestion</span>
                <button onClick={() => setModal(false)} aria-label="Close" className="hidden h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 sm:grid"><Icon name="x" size={16} /></button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 text-center"><div className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Confidence</div><div className="mt-1 text-3xl font-black text-[#0B2A55]">{s.detailed.analytics.confidence}<span className="text-lg">%</span></div></div>
                {s.detailed.analytics.meters.length > 0 && (
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3.5">
                    {s.detailed.analytics.meters.map((m) => (
                      <div key={m.label}><div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-slate-500"><span>{m.label}</span><span style={{ color: m.color }}>{m.value}</span></div><div className="mt-1.5 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: m.color }} /></div></div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {s.detailed.analytics.signals.map((k) => (
                    <div key={k.label} className={cn("rounded-lg border px-2.5 py-2", TONE[k.tone])}><div className="text-[10px] font-bold uppercase tracking-wide opacity-70">{k.label}</div><div className="truncate text-[12.5px] font-extrabold">{k.value}</div></div>
                  ))}
                </div>
                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11.5px] leading-relaxed text-slate-500"><Icon name="info" size={12} className="mr-1 inline" /> Generated from the data already in the portal — indicative only.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
