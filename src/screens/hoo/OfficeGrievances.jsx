import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, Field, Textarea, SuccessNote, Breadcrumb, KPI, InfoRow } from "../../components/ui/kit.jsx";
import { HOO_GRIEVANCES } from "../../data/hoo.js";
import AiContentInsight from "../../components/ui/AiContentInsight.jsx";
import { AiSummaryButton } from "../../components/ui/AiCaseSummary.jsx";
import { buildGrievanceSummary } from "../../lib/aiSummary.js";
import { getAiDefaultOpen } from "../../lib/prefs.js";

export default function OfficeGrievances({ onBack }) {
  const [list, setList] = useState(HOO_GRIEVANCES.map((g) => ({ ...g })));
  const [openId, setOpenId] = useState(null);
  const [atr, setAtr] = useState("");
  const [flash, setFlash] = useState("");
  const [aiOpen, setAiOpen] = useState(getAiDefaultOpen());
  const sel = list.find((g) => g.id === openId);
  const open = list.filter((g) => g.status === "Open");

  const resolve = () => {
    setList((l) => l.map((g) => g.id === openId ? {
      ...g, status: "Resolved",
      history: [...g.history, { date: "Today", actor: "You (HOO)", action: "Resolved with ATR", remark: atr }],
    } : g));
    setFlash("Grievance disposed with Action Taken Report."); setAtr(""); setOpenId(null); setTimeout(() => setFlash(""), 2400);
  };

  if (sel) {
    return (
      <ModuleShell icon="messageCircle" title={sel.subject} desc={`${sel.regNo} · from ${sel.from}`} onBack={() => setOpenId(null)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: "Office Grievances", onClick: () => setOpenId(null) }, { label: sel.regNo }]} />
          <AiSummaryButton open={aiOpen} onToggle={() => setAiOpen((o) => !o)} />
        </div>
        {aiOpen && <AiContentInsight summary={buildGrievanceSummary({ ...sel, category: sel.category || "Pension processing" })} />}
        <div className="grid gap-4 sm:grid-cols-3">
          <KPI label="From" value={sel.from} icon="userCheck" tone="primary" />
          <KPI label="SLA" value={sel.sla} icon="activity" tone={sel.sla.includes("Overdue") ? "saffron" : "primary"} />
          <KPI label="Status" value={sel.status} icon="info" tone={sel.status === "Resolved" ? "success" : "primary"} />
        </div>
        <SectionCard title="Grievance details" icon="info">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <InfoRow label="Registration no." value={<span className="font-mono">{sel.regNo}</span>} />
            <InfoRow label="From" value={sel.from} />
            <InfoRow label="Category" value={sel.category || "Pension processing"} />
            <InfoRow label="Subject" value={sel.subject} />
            <InfoRow label="Lodged on" value={sel.lodged} />
            <InfoRow label="SLA" value={sel.sla} />
          </div>
        </SectionCard>
        {sel.status === "Open" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="History" icon="activity">
              <ol className="relative ml-3 border-l-2 border-border">
                {sel.history.map((h, i) => (
                  <li key={i} className="mb-4 ml-5 last:mb-0">
                    <span className="absolute -left-[0.65rem] grid h-5 w-5 place-items-center rounded-full bg-primary text-white ring-4 ring-card"><Icon name="check" size={11} /></span>
                    <div className="flex flex-wrap items-center gap-x-2"><span className="text-sm font-bold text-foreground">{h.action}</span><span className="text-[11px] text-muted-foreground">· {h.date}</span></div>
                    <div className="text-xs font-medium text-primary">{h.actor}</div>
                    {h.remark && <p className="mt-0.5 text-xs text-muted-foreground">{h.remark}</p>}
                  </li>
                ))}
              </ol>
            </SectionCard>
            <SectionCard title="Take action" desc="Record your action to dispose this grievance." icon="scale">
              <Field label="Action taken / reply" required>
                <Textarea value={atr} onChange={(e) => setAtr(e.target.value)} placeholder="Describe the action taken and resolution…" className="min-h-[110px]" />
              </Field>
              <div className="mt-3 flex gap-2">
                <Button variant="saffron" disabled={atr.trim().length < 10} onClick={resolve}><Icon name="check" size={16} /> {atr.trim().length < 10 ? "Add your ATR" : "Resolve with ATR"}</Button>
                <Button variant="outline" onClick={() => setOpenId(null)}>Cancel</Button>
              </div>
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="History" icon="activity" action={<StatusPill tone="ok">{sel.status}</StatusPill>}>
            <ol className="relative ml-3 border-l-2 border-border">
              {sel.history.map((h, i) => (
                <li key={i} className="mb-4 ml-5 last:mb-0">
                  <span className="absolute -left-[0.65rem] grid h-5 w-5 place-items-center rounded-full bg-primary text-white ring-4 ring-card"><Icon name="check" size={11} /></span>
                  <div className="flex flex-wrap items-center gap-x-2"><span className="text-sm font-bold text-foreground">{h.action}</span><span className="text-[11px] text-muted-foreground">· {h.date}</span></div>
                  <div className="text-xs font-medium text-primary">{h.actor}</div>
                  {h.remark && <p className="mt-0.5 text-xs text-muted-foreground">{h.remark}</p>}
                </li>
              ))}
            </ol>
          </SectionCard>
        )}
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="messageCircle" title="Office Grievances" desc="Grievances routed to your office. Act and file an Action Taken Report within the SLA." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The pensioner has been notified.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Open", open.length, "warn"], ["Overdue", list.filter((g) => g.sla.includes("Overdue")).length, "warn"], ["Resolved", list.filter((g) => g.status === "Resolved").length, "ok"]].map(([l, n, t]) => (
          <div key={l} className="rounded-xl2 border border-border bg-card p-4 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{l}</div>
            <div className="mt-1 text-2xl font-black text-foreground">{n}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-primary">{g.regNo}</span>
                <span className={"text-[11px] font-semibold " + (g.sla.includes("Overdue") ? "text-red-600" : "text-muted-foreground")}>{g.sla}</span>
              </div>
              <div className="mt-0.5 text-sm font-bold text-foreground">{g.subject}</div>
              <div className="text-xs text-muted-foreground">from {g.from} · lodged {g.lodged}</div>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill>{g.status}</StatusPill>
              <Button variant="outline" className="px-4 py-2" onClick={() => setOpenId(g.id)}>{g.status === "Open" ? "Action" : "View"} <Icon name="arrowRight" size={15} /></Button>
            </div>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}
