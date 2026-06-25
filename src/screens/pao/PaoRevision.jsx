import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, InfoRow, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { PAO_REVISIONS } from "../../data/pao.js";
import { formatINR } from "../../lib/pension.js";

export default function PaoRevision({ onBack }) {
  const [rows, setRows] = useState(PAO_REVISIONS.map((r) => ({ ...r })));
  const [open, setOpen] = useState(null);
  const [flash, setFlash] = useState("");
  const sel = rows.find((r) => r.id === open);

  const issue = () => {
    setRows((rs) => rs.map((r) => r.id === open ? { ...r, status: "Authority issued" } : r));
    setFlash(`Revised authority issued for ${sel.name}.`); setOpen(null); setTimeout(() => setFlash(""), 2400);
  };
  const cols = [
    { key: "name", label: "Pensioner", render: (r) => <div><div className="font-semibold text-foreground">{r.name}</div><div className="text-xs text-muted-foreground">{r.ppo}</div></div> },
    { key: "reason", label: "Reason" },
    { key: "revised", label: "Revised", render: (r) => <span className="font-semibold text-success">{formatINR(r.revised)}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
  ];
  return (
    <ModuleShell icon="repeat" title="Revision Authorities" desc="Issue revised pension payment authorities on pay-commission or restoration." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The disbursing bank and CPAO have been updated.</SuccessNote>}
      <SectionCard title="Revision cases from HOO" icon="repeat"><DataTable columns={cols} rows={rows} onRowClick={(r) => setOpen(r.id)} /></SectionCard>
      <Modal open={!!sel} onClose={() => setOpen(null)} maxW="max-w-lg">
        {sel && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{sel.name}</h3>
            <p className="text-sm text-muted-foreground">{sel.ppo} · {sel.reason}</p>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Existing" value={formatINR(sel.old)} />
              <InfoRow label="Revised" value={formatINR(sel.revised)} />
              <InfoRow label="Monthly difference" value={formatINR(sel.revised - sel.old)} />
              <InfoRow label="Arrears (est. 12m)" value={formatINR((sel.revised - sel.old) * 12)} />
            </div>
            {sel.status !== "Authority issued"
              ? <Button variant="saffron" className="mt-5 w-full justify-center" onClick={issue}><Icon name="badgeCheck" size={16} /> Issue revised authority</Button>
              : <div className="mt-5 rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">Authority already issued</div>}
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
