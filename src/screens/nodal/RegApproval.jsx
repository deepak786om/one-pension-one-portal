import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, KPI, StatusPill, DataTable, InfoRow, SuccessNote, Field, Textarea, HistoryTrail, Breadcrumb } from "../../components/ui/kit.jsx";
import { REG_REQUESTS } from "../../data/nodal.js";

export default function RegApproval({ onBack }) {
  const [rows, setRows] = useState(REG_REQUESTS.map((r) => ({ ...r })));
  const [openId, setOpenId] = useState(null);
  const [reason, setReason] = useState("");
  const [showRej, setShowRej] = useState(false);
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === openId);

  const decide = (status, remark) => {
    setRows((rs) => rs.map((r) => r.id === openId ? { ...r, status, history: [...r.history, { date: "Today", actor: "You (Nodal)", action: status, remark }] } : r));
    setFlash(`Request ${status.toLowerCase()}.`); setOpenId(null); setShowRej(false); setReason(""); setTimeout(() => setFlash(""), 2400);
  };

  if (sel) {
    const allChecks = Object.values(sel.checks).every(Boolean);
    return (
      <ModuleShell icon="badgeCheck" title={sel.name} desc={`${sel.role} · ${sel.office}`} onBack={() => setOpenId(null)}>
        <Breadcrumb items={[{ label: "Registration requests", onClick: () => setOpenId(null) }, { label: sel.name }]} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard title="Applicant" icon="userCheck">
            <InfoRow label="Name" value={sel.name} />
            <InfoRow label="Role" value={sel.role} />
            <InfoRow label="Official email" value={sel.email} />
            <InfoRow label="Office" value={sel.office} />
            {sel.ddo !== "—" && <InfoRow label="DDO / PAO" value={`${sel.ddo} · ${sel.pao}`} />}
            <InfoRow label="Submitted" value={sel.submitted} />
          </SectionCard>
          <SectionCard title="Verification" desc="All checks must pass before approval." icon="fileCheck">
            <ul className="space-y-1.5">
              {Object.entries(sel.checks).map(([k, v]) => (
                <li key={k} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                  <span className="text-foreground">{k}</span>
                  <span className={"inline-flex items-center gap-1 text-xs font-bold " + (v ? "text-success" : "text-saffron")}><Icon name={v ? "check" : "info"} size={13} /> {v ? "Verified" : "Pending"}</span>
                </li>
              ))}
            </ul>
            {sel.status === "Pending" ? (
              !showRej ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="saffron" disabled={!allChecks} onClick={() => decide("Approved", "All verifications passed; added to registry.")}><Icon name="badgeCheck" size={16} /> {allChecks ? "Approve registration" : "Awaiting verifications"}</Button>
                  <Button variant="outline" onClick={() => setShowRej(true)}><Icon name="x" size={16} /> Reject</Button>
                </div>
              ) : (
                <div className="mt-4">
                  <Field label="Reason for rejection" required><Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="State why the request is rejected…" /></Field>
                  <div className="mt-2 flex gap-2">
                    <Button variant="saffron" disabled={reason.trim().length < 6} onClick={() => decide("Rejected", reason)}>Confirm rejection</Button>
                    <Button variant="outline" onClick={() => setShowRej(false)}>Cancel</Button>
                  </div>
                </div>
              )
            ) : <div className="mt-4"><StatusPill tone={sel.status === "Approved" ? "ok" : "warn"}>{sel.status}</StatusPill></div>}
          </SectionCard>
        </div>
        <SectionCard title="History" icon="activity"><HistoryTrail items={sel.history} /></SectionCard>
      </ModuleShell>
    );
  }

  const pend = rows.filter((r) => r.status === "Pending").length;
  const cols = [
    { key: "name", label: "Applicant", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.email}</div></div> },
    { key: "role", label: "Role" },
    { key: "submitted", label: "Submitted" },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "Approved" ? "ok" : r.status === "Rejected" ? "warn" : undefined}>{r.status}</StatusPill> },
    { key: "go", label: "", render: () => <Icon name="chevronRight" size={16} className="text-muted-foreground" /> },
  ];
  return (
    <ModuleShell icon="badgeCheck" title="Approve Registrations" desc="Process registration requests from officials and associations in your ministry." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The applicant has been notified.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Pending" value={pend} sub="awaiting decision" icon="listChecks" tone="saffron" />
        <KPI label="Approved" value={rows.filter((r) => r.status === "Approved").length} sub="added to registry" icon="check" tone="success" />
        <KPI label="Rejected" value={rows.filter((r) => r.status === "Rejected").length} sub="declined" icon="x" tone="primary" />
      </div>
      <SectionCard title="Registration requests" icon="listChecks"><DataTable columns={cols} rows={rows} onRowClick={(r) => setOpenId(r.id)} /></SectionCard>
    </ModuleShell>
  );
}
