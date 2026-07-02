import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";
import { SectionCard, KPI, StatusPill, SuccessNote, Field, Textarea, Breadcrumb, Modal, StarRating } from "../../components/ui/kit.jsx";
import AnubhavDetail from "./AnubhavDetail.jsx";
import AiContentInsight from "../../components/ui/AiContentInsight.jsx";
import { AiSummaryButton } from "../../components/ui/AiCaseSummary.jsx";
import { buildAnubhavSummary } from "../../lib/aiSummary.js";
import { getAiDefaultOpen } from "../../lib/prefs.js";
import { getReview, setReview, toggleFlag } from "../../lib/anubhavReview.js";
import { ANUBHAV_SUBMISSIONS } from "../../data/anubhav.js";

const STAGE = {
  HOO: { actionable: "Awaiting HOO recommendation", primary: "Recommend to HOD", next: "Awaiting HOD approval", icon: "arrowUpRight",
    desc: "Review pensioners' service experiences and recommend them to the Head of Department.", done: "recommended to the HOD" },
  HOD: { actionable: "Awaiting HOD approval", primary: "Publish to Anubhav", next: "Published", icon: "check",
    desc: "Review experiences recommended by Heads of Office and publish them to the Anubhav portal.", done: "published to the Anubhav portal" },
};

const LANGS = ["Auto-detect", "हिन्दी (Hindi)", "ଓଡ଼ିଆ (Odia)", "বাংলা (Bengali)", "தமிழ் (Tamil)", "मराठी (Marathi)", "English"];

function Stars({ n }) {
  return <span className="text-lg leading-none text-saffron">{"★".repeat(n)}<span className="text-muted-foreground/30">{"★".repeat(5 - n)}</span></span>;
}

function TranslateBox({ sub }) {
  const [src, setSrc] = useState("Auto-detect");
  const [shown, setShown] = useState(false);
  const fromRegional = src !== "Auto-detect" && src !== "English";
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-bold text-primary"><Icon name="bookOpen" size={14} /> Translate write-up</span>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-primary/70">via Bhashini</span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <label className="text-[11px] font-semibold text-muted-foreground">This write-up is in</label>
        <select value={src} onChange={(e) => { setSrc(e.target.value); setShown(false); }} className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-foreground">
          {LANGS.map((l) => <option key={l}>{l}</option>)}
        </select>
        <Button variant="outline" className="px-3 py-1.5 text-xs" onClick={() => setShown(true)}><Icon name="bookOpen" size={13} /> Translate to English</Button>
      </div>
      {shown && (
        <div className="mt-2.5 rounded-lg border border-primary/20 bg-white p-3">
          <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[10.5px] font-bold uppercase tracking-wide text-primary">
            <Icon name="sparkles" size={12} /> English translation · via Bhashini
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold normal-case text-primary">{fromRegional ? "Translated from " + src.replace(/\s*\(.*\)/, "") : "Source detected: English"}</span>
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{sub.content}</p>
        </div>
      )}
    </div>
  );
}

function DecisionModal({ open, mode, stage, sub, onClose, onConfirm }) {
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");
  const reject = mode === "reject";
  const title = reject ? "Reject write-up" : stage === "HOO" ? "Recommend to HOD" : "Publish to Anubhav";
  const cta = reject ? "Confirm rejection" : title;
  const enabled = reject ? remarks.trim().length >= 6 : true;
  return (
    <Modal open={open} onClose={onClose} maxW="max-w-lg">
      <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{reject ? "Record why this write-up is being rejected. A soft rating is optional." : "Add an optional soft rating and remarks — both are optional and shared with the next reviewer."}</p>
      <div className="mt-4 rounded-xl border border-border p-4">
        <div className="mb-2 text-center text-xs font-semibold text-foreground">Soft rating (optional)</div>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="mt-4">
        <Field label={reject ? "Reason / remarks" : "Remarks (optional)"} required={reject}>
          <Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder={reject ? "Why is this being rejected?" : "Any remarks for the record / next reviewer…"} />
        </Field>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant={reject ? "outline" : "saffron"} className={reject ? "!border-red-300 !text-red-600 hover:!bg-red-50" : ""} disabled={!enabled} onClick={() => onConfirm(rating || 0, remarks.trim())}>
          <Icon name={reject ? "x" : stage === "HOO" ? "arrowUpRight" : "check"} size={16} /> {cta}
        </Button>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default function AnubhavReview({ stage, onBack }) {
  const cfg = STAGE[stage];
  const [rows, setRows] = useState(ANUBHAV_SUBMISSIONS.map((r) => ({ ...r })));
  const [openId, setOpenId] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState("");
  const [aiOpen, setAiOpen] = useState(getAiDefaultOpen());
  const [decisionMode, setDecisionMode] = useState(null); // "primary" | "reject"
  const [, setTick] = useState(0);
  const sel = rows.find((r) => r.id === openId);

  const decide = (status, msg) => {
    setRows((rs) => rs.map((r) => r.id === openId ? { ...r, status } : r));
    setFlash(msg); setOpenId(null); setShowReturn(false); setReason(""); setTimeout(() => setFlash(""), 2800);
  };
  const confirmDecision = (rating, remarks) => {
    const id = sel.id;
    setReview(id, stage === "HOO" ? { hooRating: rating || undefined, hooRemarks: remarks || undefined } : { hodRating: rating || undefined, hodRemarks: remarks || undefined });
    const rejecting = decisionMode === "reject";
    setDecisionMode(null);
    if (rejecting) decide("Rejected", "Write-up rejected and recorded.");
    else decide(cfg.next, `Write-up ${cfg.done}.`);
  };

  const toneOf = (status) => status === "Published" ? "ok" : status === "Returned" || status === "Rejected" ? "warn" : status === cfg.actionable ? undefined : "muted";

  if (sel) {
    const canAct = sel.status === cfg.actionable;
    const rv = getReview(sel.id);
    const hooRating = rv.hooRating ?? sel.hooRating;
    const hooRemarks = rv.hooRemarks ?? sel.hooRemarks;
    return (
      <ModuleShell icon="bookOpen" title={sel.title} desc={`${sel.author} · ${sel.designation}`} onBack={() => { setOpenId(null); setShowReturn(false); }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: "Anubhav write-ups", onClick: () => setOpenId(null) }, { label: sel.author }]} />
          <div className="flex items-center gap-2">
            {stage === "HOD" ? (
              <button onClick={() => { toggleFlag(sel.id); setTick((t) => t + 1); }} title="Flag for Discussion"
                className={cn("inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors", rv.flagged ? "border-red-300 bg-red-50 text-red-600" : "border-border text-muted-foreground hover:border-primary/40")}>
                <Icon name="flag" size={14} /> {rv.flagged ? "Flagged for discussion" : "Flag for Discussion"}
              </button>
            ) : rv.flagged ? (
              <span title="Flagged for Discussion by the HOD" className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600"><Icon name="flag" size={14} /> Flagged for discussion</span>
            ) : null}
            <AiSummaryButton open={aiOpen} onToggle={() => setAiOpen((o) => !o)} />
          </div>
        </div>
        {aiOpen && <AiContentInsight summary={buildAnubhavSummary(sel)} />}
        <AnubhavDetail sub={sel} translate={<TranslateBox sub={sel} />} />

        {stage === "HOD" && (hooRating || hooRemarks) && (
          <SectionCard title="From the Head of Office" desc="The recommending HOO's soft rating and remarks." icon="userCheck">
            {hooRating ? <div className="flex items-center gap-2"><Stars n={hooRating} /><span className="text-sm font-bold text-foreground">{hooRating}/5</span></div> : null}
            {hooRemarks ? <p className="mt-2 rounded-xl bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground">{hooRemarks}</p> : null}
          </SectionCard>
        )}

        {canAct ? (
          <SectionCard title="Your decision" desc={stage === "HOO" ? "Recommend this experience to the HOD, or return it to the author for revision." : "Publish this experience, reject it, or return it to the author for revision."} icon="scale">
            {!showReturn ? (
              <div className="flex flex-wrap gap-2">
                <Button variant="saffron" onClick={() => setDecisionMode("primary")}><Icon name={cfg.icon} size={16} /> {cfg.primary}</Button>
                {stage === "HOD" && <Button variant="outline" className="!border-red-300 !text-red-600 hover:!bg-red-50" onClick={() => setDecisionMode("reject")}><Icon name="x" size={16} /> Reject</Button>}
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
          <SuccessNote title={`Status: ${sel.status}`}>{sel.status === "Published" ? "This experience is live on the Anubhav portal." : sel.status === "Returned" ? "This write-up was returned to the author for revision." : sel.status === "Rejected" ? "This write-up was rejected." : "This write-up is at another stage of review."}</SuccessNote>
        )}

        {decisionMode && <DecisionModal key={sel.id + decisionMode} open mode={decisionMode} stage={stage} sub={sel} onClose={() => setDecisionMode(null)} onConfirm={confirmDecision} />}
      </ModuleShell>
    );
  }

  // HOD (Level-2 approver) does not see write-ups still pending with the HOO.
  const visibleRows = stage === "HOD" ? rows.filter((r) => r.status !== "Awaiting HOO recommendation") : rows;
  const queue = visibleRows.filter((r) => r.status === cfg.actionable);
  return (
    <ModuleShell icon="bookOpen" title="Anubhav Recommendations" desc={cfg.desc} onBack={onBack}>
      {flash && <SuccessNote title="Done">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Awaiting you" value={queue.length} sub={stage === "HOO" ? "to recommend" : "to publish"} icon="bookOpen" tone="saffron" />
        <KPI label="Published" value={visibleRows.filter((r) => r.status === "Published").length} sub="on Anubhav" icon="check" tone="success" />
        <KPI label="Returned / rejected" value={visibleRows.filter((r) => r.status === "Returned" || r.status === "Rejected").length} sub="not published" icon="repeat" tone="primary" />
      </div>
      <SectionCard title="Write-ups" desc="Open any write-up to read the full submission before deciding." icon="bookMarked">
        <div className="space-y-3">
          {visibleRows.map((a) => {
            const flagged = getReview(a.id).flagged;
            return (
              <button key={a.id} onClick={() => setOpenId(a.id)} className="block w-full rounded-xl2 border border-border bg-card p-4 text-left shadow-card transition-shadow hover:shadow-elegant">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.author} · {a.category} · {a.office}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {flagged && <span title="Flagged for Discussion" className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-600"><Icon name="flag" size={12} /> Flagged</span>}
                    <StatusPill tone={toneOf(a.status)}>{a.status}</StatusPill>
                  </div>
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
