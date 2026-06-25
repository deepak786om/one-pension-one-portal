import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, Stepper, InfoRow, SuccessNote, Breadcrumb } from "../../components/ui/kit.jsx";
import { FAMILY_CASES, newPPO } from "../../data/hoo.js";

const STEPS = ["Documents", "Eligibility", "Computation", "Forward to PAO", "PPO issued"];
const KIND_TONE = { "In-Service Death": "warn", "Death after retirement": "info", "EOP / EOFP": "ok" };

export default function FamilyPension({ onBack }) {
  const [cases, setCases] = useState(FAMILY_CASES.map((c) => ({ ...c, step: c.kind === "EOP / EOFP" ? 1 : c.kind === "Death after retirement" ? 1 : 0 })));
  const [openId, setOpenId] = useState(null);
  const sel = cases.find((c) => c.id === openId);
  const [flash, setFlash] = useState("");

  const advance = () => {
    setCases((cs) => cs.map((c) => {
      if (c.id !== openId || c.step >= 4) return c;
      const step = c.step + 1;
      return { ...c, step, ppo: step === 4 ? newPPO() : c.ppo };
    }));
    setFlash(sel.step === 3 ? "Family pension PPO generated." : `Moved to "${STEPS[Math.min(sel.step + 1, 4)]}".`);
    setTimeout(() => setFlash(""), 2200);
  };

  if (sel) {
    return (
      <ModuleShell icon="heartHandshake" title={sel.name} desc={`${sel.kind} · beneficiary of ${sel.deceased}`} onBack={() => setOpenId(null)}>
        <Breadcrumb items={[{ label: "Family Pension & EOP", onClick: () => setOpenId(null) }, { label: sel.name }]} />
        {flash && <SuccessNote title={flash}>The case record has been updated.</SuccessNote>}
        <div className="grid gap-4 sm:grid-cols-2">
          <SectionCard title="Case details" icon="info">
            <InfoRow label="Beneficiary" value={`${sel.name} (${sel.relation})`} />
            <InfoRow label="Deceased" value={sel.deceased} />
            <InfoRow label="Type" value={<StatusPill tone={KIND_TONE[sel.kind]}>{sel.kind}</StatusPill>} />
            <InfoRow label="Date of event" value={sel.dol} />
            <InfoRow label="PPO" value={sel.ppo || "Pending"} />
            <p className="mt-3 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">{sel.note}</p>
          </SectionCard>
          <SectionCard title="Processing" desc="Move the case through each step." icon="listChecks">
            <Stepper steps={STEPS} current={sel.step} />
            {sel.step < 4 ? (
              <Button variant="saffron" className="mt-4 w-full justify-center" onClick={advance}>
                <Icon name="arrowRight" size={16} /> {sel.step === 3 ? "Generate family pension PPO" : `Complete: ${STEPS[sel.step]}`}
              </Button>
            ) : (
              <div className="mt-4 rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">PPO {sel.ppo} issued · SSA to bank</div>
            )}
          </SectionCard>
        </div>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="heartHandshake" title="Family Pension & EOP" desc="Process family pension on death-in-service, death after retirement, and extraordinary pension." onBack={onBack}>
      <div className="space-y-3">
        {cases.map((c) => (
          <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-primary/8 text-primary"><Icon name="heartHandshake" size={18} /></span>
              <div>
                <div className="text-sm font-bold text-foreground">{c.name} <span className="font-normal text-muted-foreground">· {c.relation}</span></div>
                <div className="text-xs text-muted-foreground">Beneficiary of {c.deceased} · event {c.dol}</div>
                <div className="mt-1.5"><StatusPill tone={KIND_TONE[c.kind]}>{c.kind}</StatusPill> <span className="ml-1 text-xs text-muted-foreground">{c.ppo ? `PPO ${c.ppo}` : STEPS[c.step]}</span></div>
              </div>
            </div>
            <Button variant="outline" className="px-4 py-2" onClick={() => setOpenId(c.id)}>Process <Icon name="arrowRight" size={15} /></Button>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}
