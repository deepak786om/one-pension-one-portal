import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable, Field, Textarea, Select, SuccessNote, HistoryTrail, Breadcrumb, InfoRow } from "../../components/ui/kit.jsx";
import { GO_QUEUE, ACTION_CODES } from "../../data/grievance.js";
import AiContentInsight from "../../components/ui/AiContentInsight.jsx";
import { AiSummaryButton } from "../../components/ui/AiCaseSummary.jsx";
import { buildGrievanceSummary } from "../../lib/aiSummary.js";
import { getAiDefaultOpen } from "../../lib/prefs.js";

export default function GrievanceQueue({ onBack }) {
  const [rows, setRows] = useState(GO_QUEUE.map((r) => ({ ...r })));
  const [openId, setOpenId] = useState(null);
  const [code, setCode] = useState("10");
  const [text, setText] = useState("");
  const [office, setOffice] = useState("");
  const [flash, setFlash] = useState("");
  const [aiOpen, setAiOpen] = useState(getAiDefaultOpen());
  const sel = rows.find((r) => r.id === openId);

  const act = () => {
    const c = ACTION_CODES.find((x) => x.code === code);
    const newStatus = code === "10" ? "Disposed" : code === "20" ? "Awaiting clarification" : "Forwarded";
    setRows((rs) => rs.map((r) => r.id === openId ? {
      ...r, status: newStatus, atr: code === "10" ? text : r.atr,
      history: [...r.history, { date: "Today", actor: "You (GO)", action: `${c.label} (Action ${code})`, remark: code === "4A" ? `Forwarded to ${office}` : text }],
    } : r));
    setFlash(`Action ${code} recorded.`); setOpenId(null); setText(""); setOffice(""); setTimeout(() => setFlash(""), 2400);
  };

  if (sel) {
    return (
      <ModuleShell icon="messageCircle" title={sel.subject} desc={`${sel.regNo} · ${sel.category}`} onBack={() => setOpenId(null)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: "Redressal queue", onClick: () => setOpenId(null) }, { label: sel.regNo }]} />
          <AiSummaryButton open={aiOpen} onToggle={() => setAiOpen((o) => !o)} />
        </div>
        {aiOpen && <AiContentInsight summary={buildGrievanceSummary(sel)} />}
        <div className="grid gap-4 sm:grid-cols-3">
          <KPI label="From" value={sel.from} icon="userCheck" tone="primary" />
          <KPI label="SLA" value={sel.sla} icon="activity" tone={sel.sla.includes("Overdue") ? "saffron" : "primary"} />
          <KPI label="Status" value={sel.status} icon="info" tone={sel.status === "Disposed" ? "success" : "primary"} />
        </div>
        <SectionCard title="Grievance details" icon="info">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <InfoRow label="Registration no." value={<span className="font-mono">{sel.regNo}</span>} />
            <InfoRow label="From" value={sel.from} />
            <InfoRow label="Category" value={sel.category} />
            <InfoRow label="Subject" value={sel.subject} />
            <InfoRow label="Lodged on" value={sel.lodged} />
            <InfoRow label="SLA" value={sel.sla} />
            <InfoRow label="Status" value={sel.status} />
            {sel.atr && <InfoRow label="Action Taken Report" value={sel.atr} />}
          </div>
        </SectionCard>
        {sel.status !== "Disposed" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <SectionCard title="History" icon="activity"><HistoryTrail items={sel.history} /></SectionCard>
            <SectionCard title="Take action" desc="Record a coded action on this grievance." icon="scale">
              <Field label="Action"><Select options={ACTION_CODES.map((c) => `${c.code} — ${c.label}`)} value={`${code} — ${ACTION_CODES.find((c) => c.code === code).label}`} onChange={(e) => setCode(e.target.value.split(" — ")[0])} /></Field>
              {code === "4A" && <Field label="Forward to office" required><Select options={["SBI Pension Cell", "PAO (NR) Delhi", "CGHS Wellness Centre", "Head of Office (NR)"]} value={office} onChange={(e) => setOffice(e.target.value)} /></Field>}
              {code !== "4A" && <Field label={code === "10" ? "Action Taken Report (reply)" : "Clarification sought"} required><Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={code === "10" ? "Describe the resolution…" : "What clarification is required from the complainant?"} /></Field>}
              <div className="mt-3 flex gap-2">
                <Button variant="saffron" disabled={code === "4A" ? !office : text.trim().length < 6} onClick={act}><Icon name="arrowRight" size={16} /> Record Action {code}</Button>
                <Button variant="outline" onClick={() => setOpenId(null)}>Cancel</Button>
              </div>
            </SectionCard>
          </div>
        ) : (
          <SectionCard title="History" icon="activity"><HistoryTrail items={sel.history} /></SectionCard>
        )}
      </ModuleShell>
    );
  }

  const cols = [
    { key: "regNo", label: "Reg. no.", render: (r) => <div><div className="font-mono text-xs font-semibold text-primary">{r.regNo}</div><div className="text-sm font-semibold text-foreground">{r.subject}</div></div> },
    { key: "category", label: "Category" },
    { key: "sla", label: "SLA", render: (r) => <span className={"text-xs font-semibold " + (r.sla.includes("Overdue") ? "text-red-600" : "text-muted-foreground")}>{r.sla}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "Disposed" ? "ok" : undefined}>{r.status}</StatusPill> },
    { key: "go", label: "", render: () => <Icon name="chevronRight" size={16} className="text-muted-foreground" /> },
  ];
  return (
    <ModuleShell icon="messageCircle" title="Grievance Redressal Queue" desc="Work your assigned grievances with coded actions and a 30-day SLA." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The complainant has been notified.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-4">
        <KPI label="Open" value={rows.filter((r) => r.status === "Open").length} icon="listChecks" tone="saffron" />
        <KPI label="Awaiting" value={rows.filter((r) => r.status === "Awaiting clarification").length} sub="clarification" icon="messageCircle" tone="primary" />
        <KPI label="Overdue" value={rows.filter((r) => r.sla.includes("Overdue")).length} icon="info" tone="saffron" />
        <KPI label="Disposed" value={rows.filter((r) => r.status === "Disposed").length} icon="check" tone="success" />
      </div>
      <SectionCard title="Queue" icon="listChecks"><DataTable columns={cols} rows={rows} onRowClick={(r) => setOpenId(r.id)} /></SectionCard>
    </ModuleShell>
  );
}
