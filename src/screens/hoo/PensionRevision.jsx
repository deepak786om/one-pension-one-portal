import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, InfoRow, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { REVISION_CASES } from "../../data/hoo.js";
import { formatINR } from "../../lib/pension.js";

export default function PensionRevision({ onBack }) {
  const [rows, setRows] = useState(REVISION_CASES.map((r) => ({ ...r })));
  const [open, setOpen] = useState(null);
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === open);

  const forward = () => {
    setRows((rs) => rs.map((r) => r.id === open ? { ...r, status: "Forwarded to PAO" } : r));
    setFlash(`Revision for ${sel.name} forwarded to PAO.`); setOpen(null); setTimeout(() => setFlash(""), 2400);
  };

  const cols = [
    { key: "name", label: "Pensioner", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.ppo}</div></div> },
    { key: "reason", label: "Reason" },
    { key: "old", label: "Old", render: (r) => formatINR(r.old) },
    { key: "revised", label: "Revised", render: (r) => <span className="font-semibold text-success">{formatINR(r.revised)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
  ];

  return (
    <ModuleShell icon="repeat" title="Pension Revision" desc="Revise pension on pay-commission fixation or restoration, and forward to PAO." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The revised authority will be issued by the PAO.</SuccessNote>}
      <SectionCard title="Revision cases" icon="repeat">
        <DataTable columns={cols} rows={rows} onRowClick={(r) => setOpen(r.id)} />
      </SectionCard>
      <Modal open={!!sel} onClose={() => setOpen(null)} maxW="max-w-lg">
        {sel && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{sel.name}</h3>
            <p className="text-sm text-muted-foreground">{sel.ppo} · {sel.reason}</p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Existing pension" value={formatINR(sel.old)} />
              <InfoRow label="Revised pension" value={formatINR(sel.revised)} />
              <InfoRow label="Difference" value={formatINR(sel.revised - sel.old)} />
              <InfoRow label="Arrears (est. 12m)" value={formatINR((sel.revised - sel.old) * 12)} />
            </div>
            {sel.status !== "Forwarded to PAO" ? (
              <Button variant="saffron" className="mt-5 w-full justify-center" onClick={forward}><Icon name="arrowUpRight" size={16} /> Compute & forward to PAO</Button>
            ) : <div className="mt-5 rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Already forwarded to PAO</div>}
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
