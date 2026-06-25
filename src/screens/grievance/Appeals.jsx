import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, Field, Textarea, RadioPills, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { GO_APPEALS } from "../../data/grievance.js";

export default function Appeals({ onBack }) {
  const [rows, setRows] = useState(GO_APPEALS.map((r) => ({ ...r })));
  const [open, setOpen] = useState(null);
  const [decision, setDecision] = useState("Upheld");
  const [reason, setReason] = useState("");
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === open);

  const decide = () => {
    setRows((rs) => rs.map((r) => r.id === open ? { ...r, status: decision } : r));
    setFlash(`Appeal ${decision.toLowerCase()}.`); setOpen(null); setReason(""); setDecision("Upheld"); setTimeout(() => setFlash(""), 2400);
  };

  return (
    <ModuleShell icon="scale" title="Appeals" desc="Decide appeals filed against grievance resolutions, within the 30-day SLA." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The appellant has been notified of the decision.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Pending" value={rows.filter((r) => r.status === "Pending").length} sub="to decide" icon="scale" tone="saffron" />
        <KPI label="Upheld" value={rows.filter((r) => r.status === "Upheld").length} icon="check" tone="success" />
        <KPI label="Rejected" value={rows.filter((r) => r.status === "Rejected").length} icon="x" tone="primary" />
      </div>
      <div className="space-y-3">
        {rows.map((a) => (
          <div key={a.id} className="rounded-xl2 border border-border bg-card p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="font-mono text-xs font-semibold text-primary">{a.regNo}</div>
                <div className="text-xs text-muted-foreground">Appellant: {a.from} · filed {a.filed}</div>
              </div>
              <StatusPill tone={a.status === "Pending" ? "warn" : a.status === "Upheld" ? "ok" : undefined}>{a.status}</StatusPill>
            </div>
            <p className="mt-2.5 rounded-lg bg-muted/40 p-3 text-sm text-foreground"><span className="font-semibold text-primary">Reason for appeal: </span>{a.reason}</p>
            {a.status === "Pending" && <Button variant="outline" className="mt-3 px-4 py-2" onClick={() => setOpen(a.id)}><Icon name="scale" size={15} /> Decide appeal</Button>}
          </div>
        ))}
      </div>
      <Modal open={!!sel} onClose={() => setOpen(null)} maxW="max-w-lg">
        {sel && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">Decide appeal</h3>
            <p className="text-sm text-muted-foreground">{sel.regNo} · {sel.from}</p>
            <div className="mt-4 space-y-4">
              <Field label="Decision"><RadioPills options={["Upheld", "Rejected"]} value={decision} onChange={setDecision} /></Field>
              <Field label="Reasoned order" required><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Record the basis for your decision…" /></Field>
            </div>
            <Button variant="saffron" className="mt-4 w-full justify-center" disabled={reason.trim().length < 8} onClick={decide}><Icon name="check" size={16} /> Record decision</Button>
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
