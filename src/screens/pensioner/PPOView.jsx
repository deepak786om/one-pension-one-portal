import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, InfoRow, Field, Select, Textarea, StatusPill, SuccessNote } from "../../components/ui/kit.jsx";
import { PENSIONER } from "../../data/pensioner.js";
import { formatINR } from "../../lib/pension.js";

const FIELDS = [
  "Name spelling", "Date of birth", "Bank account / IFSC", "Pension amount",
  "Qualifying service", "Family / nominee details", "Other",
];

export default function PPOView({ onBack }) {
  const [show, setShow] = useState(false);
  const [field, setField] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const valid = field && details.trim().length > 8;

  return (
    <ModuleShell icon="badgeCheck" title="PPO — View & Verify" desc="Your Pension Payment Order on record. Check it and raise a correction if anything is wrong." onBack={onBack}>
      <SectionCard
        title="Pension Payment Order"
        desc={`PPO No. ${PENSIONER.ppo}`}
        icon="fileText"
        action={
          <button onClick={() => window.print()} className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 sm:inline-flex">
            <Icon name="fileText" size={14} /> Print
          </button>
        }
      >
        <div className="grid gap-x-8 sm:grid-cols-2">
          <div>
            <InfoRow label="Pensioner" value={PENSIONER.name} />
            <InfoRow label="PPO Number" value={PENSIONER.ppo} />
            <InfoRow label="Pension Type" value={PENSIONER.pensionType} />
            <InfoRow label="Date of Retirement" value="31 Mar 2024" />
            <InfoRow label="Qualifying Service" value={`${PENSIONER.qualifyingYears} years`} />
          </div>
          <div>
            <InfoRow label="Basic Pension" value={formatINR(PENSIONER.basicPension) + " / month"} />
            <InfoRow label="Disbursing Bank" value={PENSIONER.bank.name} />
            <InfoRow label="Account" value={PENSIONER.bank.accountMasked} />
            <InfoRow label="IFSC" value={PENSIONER.bank.ifsc} />
            <InfoRow label="Status" value={<StatusPill>Active</StatusPill>} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="ghost" className="px-4 py-2.5"><Icon name="badgeCheck" size={16} /> Download e-PPO (DigiLocker)</Button>
          {!show && !done && (
            <Button variant="outline" className="px-4 py-2.5" onClick={() => setShow(true)}>
              <Icon name="messageCircle" size={16} /> Report a correction
            </Button>
          )}
        </div>
      </SectionCard>

      {done ? (
        <SuccessNote title="Correction request submitted">
          Your request about <b className="text-foreground">{field}</b> has been logged and routed to your Head of Office for verification. You can track it under Grievances.
        </SuccessNote>
      ) : show ? (
        <SectionCard title="Report a correction" desc="Tell us what's wrong — it goes to your HOO/PAO for verification." icon="messageCircle">
          <div className="grid gap-4">
            <Field label="Which detail is incorrect?" required>
              <Select options={FIELDS} value={field} onChange={(e) => setField(e.target.value)} />
            </Field>
            <Field label="Describe the correction" required hint="Mention the correct value and any supporting reference.">
              <Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. My IFSC should be SBIN0000691, not the one printed." />
            </Field>
            <div className="flex gap-2">
              <Button variant="saffron" disabled={!valid} onClick={() => setDone(true)}>
                <Icon name="arrowRight" size={16} /> {valid ? "Submit correction request" : "Add the details above"}
              </Button>
              <Button variant="outline" onClick={() => setShow(false)}>Cancel</Button>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </ModuleShell>
  );
}
