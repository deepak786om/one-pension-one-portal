import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Select, Textarea, StatusPill, SuccessNote, DigiLockerLogo } from "../../components/ui/kit.jsx";
import { PENSIONER } from "../../data/pensioner.js";
import { formatINR } from "../../lib/pension.js";

const FIELDS = ["Name spelling", "Date of birth", "Bank account / IFSC", "Pension amount", "Qualifying service", "Family / nominee details", "Other"];

function Cell({ label, value }) {
  return (
    <div className="border-b border-dashed border-primary/15 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-primary/60">{label}</div>
      <div className="text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

export default function PPOView({ onBack }) {
  const [show, setShow] = useState(false);
  const [field, setField] = useState("");
  const [details, setDetails] = useState("");
  const [done, setDone] = useState(false);
  const valid = field && details.trim().length > 8;

  return (
    <ModuleShell icon="badgeCheck" title="PPO — View & Verify" desc="Your Pension Payment Order on record. Check it and raise a correction if anything is wrong." onBack={onBack}>
      {/* certificate */}
      <div className="relative overflow-hidden rounded-xl2 border-2 border-primary/25 bg-gradient-to-b from-primary/[0.04] to-saffron/[0.03] p-1 shadow-card">
        <div className="rounded-xl border border-primary/15 bg-white/70 p-5 sm:p-7">
          {/* watermark */}
          <Icon name="badgeCheck" size={220} className="pointer-events-none absolute -right-6 bottom-0 text-primary/[0.04]" />
          <div className="flex items-center justify-between gap-3 border-b-2 border-primary/20 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white shadow-soft"><Icon name="landmark" size={24} /></span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-widest text-saffron">Government of India</div>
                <h3 className="text-lg font-black tracking-tight text-foreground">Pension Payment Order</h3>
                <div className="text-xs text-muted-foreground">Department of Pension &amp; Pensioners' Welfare</div>
              </div>
            </div>
            <StatusPill>Active</StatusPill>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/8 px-3 py-1.5">
            <span className="text-xs font-semibold text-primary/70">PPO No.</span>
            <span className="font-mono text-sm font-extrabold text-primary">{PENSIONER.ppo}</span>
          </div>

          <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
            <Cell label="Pensioner" value={PENSIONER.name} />
            <Cell label="Pension type" value={PENSIONER.pensionType} />
            <Cell label="Date of retirement" value="31 Mar 2024" />
            <Cell label="Qualifying service" value={`${PENSIONER.qualifyingYears} years`} />
            <Cell label="Basic pension" value={formatINR(PENSIONER.basicPension) + " / month"} />
            <Cell label="Disbursing bank" value={PENSIONER.bank.name} />
            <Cell label="Account" value={PENSIONER.bank.accountMasked} />
            <Cell label="IFSC" value={PENSIONER.bank.ifsc} />
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div className="text-[11px] leading-relaxed text-muted-foreground">
              This is a system-generated record from the unified pension portal.<br />Verified against Aadhaar {PENSIONER.aadhaarMasked} and PAN {PENSIONER.pan}.
            </div>
            <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full border-2 border-dashed border-success/40 text-center text-[9px] font-bold uppercase text-success">
              Digitally<br />Verified
            </div>
          </div>
        </div>
      </div>

      {/* actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-xl border border-[#1B4AA0]/25 bg-[#1B4AA0]/[0.06] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#1B4AA0]/10">
          <DigiLockerLogo /> <span className="text-[#1B4AA0]">· Pull e-PPO</span>
        </button>
        <Button variant="ghost" className="px-4 py-2.5" onClick={() => window.print()}><Icon name="fileText" size={16} /> Print</Button>
        {!show && !done && (
          <Button variant="outline" className="px-4 py-2.5" onClick={() => setShow(true)}><Icon name="messageCircle" size={16} /> Report a correction</Button>
        )}
      </div>

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
