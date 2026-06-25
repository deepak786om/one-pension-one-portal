import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, InfoRow, SuccessNote, Modal, Field, Textarea } from "../../components/ui/kit.jsx";
import { HOD_ANUBHAV } from "../../data/hod.js";

export default function HodAnubhav({ onBack }) {
  const [rows, setRows] = useState(HOD_ANUBHAV.map((r) => ({ ...r })));
  const [open, setOpen] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === open);

  const decide = (status, msg) => {
    setRows((rs) => rs.map((r) => r.id === open ? { ...r, status } : r));
    setFlash(msg); setOpen(null); setShowReturn(false); setReason(""); setTimeout(() => setFlash(""), 2600);
  };

  return (
    <ModuleShell icon="bookOpen" title="Anubhav Recommendations" desc="Review service experiences recommended by Heads of Office and publish them to the Anubhav portal." onBack={onBack}>
      {flash && <SuccessNote title="Done">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Awaiting decision" value={rows.filter((r) => r.status === "Awaiting HOD").length} sub="to review" icon="bookOpen" tone="saffron" />
        <KPI label="Published" value={rows.filter((r) => r.status === "Published").length} sub="on Anubhav portal" icon="check" tone="success" />
        <KPI label="Returned" value={rows.filter((r) => r.status === "Returned").length} sub="for revision" icon="repeat" tone="primary" />
      </div>
      <div className="space-y-3">
        {rows.map((a) => (
          <div key={a.id} className="rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-foreground">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.author} · {a.category} · {a.office}</div>
              </div>
              <StatusPill tone={a.status === "Published" ? "ok" : a.status === "Returned" ? "warn" : undefined}>{a.status}</StatusPill>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
            <Button variant="outline" className="mt-3 px-4 py-2" onClick={() => setOpen(a.id)}>{a.status === "Awaiting HOD" ? "Review" : "View"} <Icon name="arrowRight" size={15} /></Button>
          </div>
        ))}
      </div>
      <Modal open={!!sel} onClose={() => { setOpen(null); setShowReturn(false); }} maxW="max-w-lg">
        {sel && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{sel.title}</h3>
            <p className="text-sm text-muted-foreground">{sel.author}</p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Category" value={sel.category} />
              <InfoRow label="Office" value={sel.office} />
              <InfoRow label="Status" value={<StatusPill tone={sel.status === "Published" ? "ok" : undefined}>{sel.status}</StatusPill>} />
            </div>
            <p className="mt-3 rounded-xl bg-muted/30 p-3.5 text-sm text-foreground">{sel.excerpt}</p>
            {sel.status === "Awaiting HOD" && (showReturn ? (
              <div className="mt-4">
                <Field label="Reason for return" required><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What should the author revise?" /></Field>
                <div className="mt-2 flex gap-2">
                  <Button variant="saffron" disabled={reason.trim().length < 6} onClick={() => decide("Returned", "Write-up returned to the author for revision.")}>Confirm return</Button>
                  <Button variant="outline" onClick={() => setShowReturn(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="saffron" onClick={() => decide("Published", "Write-up published to the Anubhav portal.")}><Icon name="check" size={16} /> Publish to Anubhav</Button>
                <Button variant="outline" onClick={() => setShowReturn(true)}><Icon name="repeat" size={16} /> Return</Button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
