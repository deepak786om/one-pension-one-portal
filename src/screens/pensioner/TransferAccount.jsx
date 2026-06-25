import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Input, Select, InfoRow, SuccessNote } from "../../components/ui/kit.jsx";
import { PENSIONER } from "../../data/pensioner.js";

const AGENCIES = ["State Bank of India", "Punjab National Bank", "Bank of Baroda", "HDFC Bank", "ICICI Bank", "India Post Payments Bank", "Other"];
const REASONS = ["Relocation / change of city", "Better branch access", "Bank merger", "Service issues with current bank", "Other"];

export default function TransferAccount({ onBack }) {
  const [form, setForm] = useState({ agency: "", branch: "", ifsc: "", account: "", reason: "" });
  const [ref, setRef] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const ifscOk = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifsc.trim());
  const valid = form.agency && form.branch.trim().length > 2 && ifscOk && form.account.trim().length >= 6 && form.reason;

  const submit = () => setRef("TRF-2026-" + Math.floor(100000 + Math.random() * 899999));

  return (
    <ModuleShell icon="repeat" title="Transfer Pension Account" desc="Move your pension disbursement to another bank or branch." onBack={onBack}>
      <SectionCard title="Current disbursing account" icon="badgeCheck">
        <InfoRow label="Bank" value={PENSIONER.bank.name} />
        <InfoRow label="Branch" value={PENSIONER.bank.branch} />
        <InfoRow label="Account" value={PENSIONER.bank.accountMasked} />
        <InfoRow label="IFSC" value={PENSIONER.bank.ifsc} />
      </SectionCard>

      {ref ? (
        <SuccessNote title="Transfer request submitted">
          Reference <b className="font-mono text-foreground">{ref}</b>. Your case will move via the old and new disbursing agencies; pension continues meanwhile. Track it under Grievances if needed.
        </SuccessNote>
      ) : (
        <SectionCard title="New disbursing account" desc="Enter the destination bank details." icon="repeat">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New bank / disbursing agency" required><Select options={AGENCIES} value={form.agency} onChange={(e) => set("agency", e.target.value)} /></Field>
            <Field label="Branch" required><Input value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="Branch name & city" /></Field>
            <Field label="IFSC" required error={form.ifsc && !ifscOk ? "Enter a valid 11-character IFSC" : ""}>
              <Input value={form.ifsc} onChange={(e) => set("ifsc", e.target.value.toUpperCase())} placeholder="e.g. SBIN0000691" />
            </Field>
            <Field label="New account number" required><Input value={form.account} onChange={(e) => set("account", e.target.value)} placeholder="Account number" /></Field>
            <div className="sm:col-span-2">
              <Field label="Reason for transfer" required><Select options={REASONS} value={form.reason} onChange={(e) => set("reason", e.target.value)} /></Field>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="saffron" disabled={!valid} onClick={submit}>
              <Icon name="arrowRight" size={16} /> {valid ? "Submit transfer request" : "Complete the details above"}
            </Button>
            <Button variant="outline" onClick={onBack}>Cancel</Button>
          </div>
        </SectionCard>
      )}
    </ModuleShell>
  );
}
