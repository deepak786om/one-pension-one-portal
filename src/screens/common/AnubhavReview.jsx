import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, SuccessNote, Field, Textarea, Breadcrumb } from "../../components/ui/kit.jsx";
import AnubhavDetail from "./AnubhavDetail.jsx";
import { ANUBHAV_SUBMISSIONS } from "../../data/anubhav.js";

const STAGE = {
  HOO: { actionable: "Awaiting HOO recommendation", primary: "Recommend to HOD", next: "Awaiting HOD approval", icon: "arrowUpRight",
    desc: "Review pensioners' service experiences and recommend them to the Head of Department.", done: "recommended to the HOD" },
  HOD: { actionable: "Awaiting HOD approval", primary: "Publish to Anubhav", next: "Published", icon: "check",
    desc: "Review experiences recommended by Heads of Office and publish them to the Anubhav portal.", done: "published to the Anubhav portal" },
};

export default function AnubhavReview({ stage, onBack }) {
  const cfg = STAGE[stage];
  const [rows, setRows] = useState(ANUBHAV_SUBMISSIONS.map((r) => ({ ...r })));
  const [openId, setOpenId] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === openId);

  const decide = (status, msg) => {
    setRows((rs) => rs.map((r) => r.id === openId ? { ...r, status } : r));
    setFlash(msg); setOpenId(null); setShowReturn(false); setReason(""); setTimeout(() => setFlash(""), 2800);
  };

  if (sel) {
    const canAct = sel.status === cfg.actionable;
    return (
      <ModuleShell icon="bookOpen" title={sel.title} desc={`${sel.author} · ${sel.designation}`} onBack={() => { setOpenId(null); setShowReturn(false); }}>
        <Breadcrumb items={[{ label: "Anubhav write-ups", onClick: () => setOpenId(null) }, { label: sel.author }]} />
        <AnubhavDetail sub={sel} />
        {canAct ? (
          <SectionCard title="Your decision" desc={stage === "HOO" ? "Recommend this experience to the HOD, or return it to the author for revision." : "Publish this experience to the Anubhav portal, or return it for revision."} icon="scale">
            {!showReturn ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="saffron" onClick={() => decide(cfg.next, `Write-up ${cfg.done}.`)}><Icon name={cfg.icon} size={16} /> {cfg.primary}</Button>
                <Button variant="outline" onClick={() => setShowReturn(true)}><Icon name="repeat" size={16} /> Return for revision</Button>
              </div>
            ) : (
              <div>
                <Field label="Reason for return" required hint="Shared with the author so they can revise and resubmit."><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What should the author revise?" /></Field>
                <div className="mt-2 flex gap-2">
                  <Button variant="saffron" disabled={reason.trim().length < 6} onClick={() => decide("Returned", "Write-up returned to the author for revision.")}>Confirm return</Button>
                  <Button variant="outline" onClick={() => setShowReturn(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </SectionCard>
        ) : (
          <SuccessNote title={`Status: ${sel.status}`}>{sel.status === "Published" ? "This experience is live on the Anubhav portal." : sel.status === "Returned" ? "This write-up was returned to the author for revision." : "This write-up is at another stage of review."}</SuccessNote>
        )}
      </ModuleShell>
    );
  }

  const queue = rows.filter((r) => r.status === cfg.actionable);
  return (
    <ModuleShell icon="bookOpen" title="Anubhav Recommendations" desc={cfg.desc} onBack={onBack}>
      {flash && <SuccessNote title="Done">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Awaiting you" value={queue.length} sub={stage === "HOO" ? "to recommend" : "to publish"} icon="bookOpen" tone="saffron" />
        <KPI label="Published" value={rows.filter((r) => r.status === "Published").length} sub="on Anubhav" icon="check" tone="success" />
        <KPI label="Returned" value={rows.filter((r) => r.status === "Returned").length} sub="for revision" icon="repeat" tone="primary" />
      </div>
      <SectionCard title="Write-ups" desc="Open any write-up to read the full submission before deciding." icon="bookMarked">
        <div className="space-y-3">
          {rows.map((a) => {
            const tone = a.status === "Published" ? "ok" : a.status === "Returned" ? "warn" : a.status === cfg.actionable ? undefined : "muted";
            return (
              <button key={a.id} onClick={() => setOpenId(a.id)} className="block w-full rounded-xl2 border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-elegant">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.author} · {a.category} · {a.office}</div>
                  </div>
                  <StatusPill tone={tone}>{a.status}</StatusPill>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.content.split("\n")[0]}</p>
                <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-primary">{a.status === cfg.actionable ? "Review full write-up" : "View full write-up"} <Icon name="arrowRight" size={13} /></span>
              </button>
            );
          })}
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
