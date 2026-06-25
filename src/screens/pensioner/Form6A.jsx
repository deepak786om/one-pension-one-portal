import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Input, Select, RadioPills, InfoRow, SuccessNote } from "../../components/ui/kit.jsx";
import { FORM6A, PENSIONER, NOMINEES } from "../../data/pensioner.js";

export default function Form6A({ onBack, onSubmitted }) {
  const [f, setF] = useState({
    present: PENSIONER.presentAddress, permanent: PENSIONER.presentAddress, marital: "Married",
    mobile: PENSIONER.mobile, email: PENSIONER.email, height: "", marks: "",
    bank: PENSIONER.bank.name, account: "", ifsc: PENSIONER.bank.ifsc,
    commute: "Yes", commutePct: "40", fma: "Yes",
  });
  const [accept, setAccept] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const ifscOk = /^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(f.ifsc.trim());
  const valid = f.present.trim() && f.permanent.trim() && f.mobile.trim() && f.account.trim().length >= 6 && ifscOk && accept;

  if (done) {
    return (
      <ModuleShell icon="fileText" title="Form 6A — Pension Application" desc="Single Comprehensive Pension Form" onBack={onBack}>
        <SuccessNote title="Form 6A submitted with eSign">
          Your pension application has been forwarded to your Head of Office. Once verified and the PAO issues your PPO, this form will no longer appear and your pension tracking will begin.
        </SuccessNote>
        <Button variant="outline" onClick={onBack}><Icon name="chevronLeft" size={16} /> Back to dashboard</Button>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="fileText" title="Form 6A — Pension Application" desc="Single Comprehensive Pension Form, to be submitted before your PPO is generated." onBack={onBack}>
      {/* deadline */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-saffron/30 bg-gradient-to-r from-saffron/10 to-transparent p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-saffron text-saffron-foreground"><Icon name="info" size={20} /></span>
          <div>
            <div className="text-sm font-extrabold text-foreground">Submit by {FORM6A.deadline}</div>
            <div className="text-xs text-muted-foreground">Complete your application ahead of retirement so your pension starts on time.</div>
          </div>
        </div>
        <span className="rounded-full bg-saffron/15 px-3 py-1.5 text-xs font-bold text-saffron">{FORM6A.daysLeft} days left</span>
      </div>

      {/* EIS auto-populated */}
      <SectionCard title="Fetched from EIS" desc="Verified from your service records — not editable here." icon="badgeCheck">
        <div className="grid gap-x-8 sm:grid-cols-2">
          {FORM6A.eis.map((r) => <InfoRow key={r.label} label={r.label} value={r.value} />)}
        </div>
      </SectionCard>

      {/* pensioner inputs */}
      <SectionCard title="Your details" desc="Please review and complete the fields below." icon="userCheck">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Present address" required><Input value={f.present} onChange={(e) => set("present", e.target.value)} /></Field>
          <Field label="Permanent address" required><Input value={f.permanent} onChange={(e) => set("permanent", e.target.value)} /></Field>
          <Field label="Marital status" required><Select options={["Married", "Unmarried", "Widow/Widower", "Divorced"]} value={f.marital} onChange={(e) => set("marital", e.target.value)} /></Field>
          <Field label="Mobile" required><Input value={f.mobile} onChange={(e) => set("mobile", e.target.value)} /></Field>
          <Field label="Email"><Input value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Height"><Input value={f.height} onChange={(e) => set("height", e.target.value)} placeholder="e.g. 172 cm" /></Field>
          <div className="sm:col-span-2"><Field label="Identification marks"><Input value={f.marks} onChange={(e) => set("marks", e.target.value)} placeholder="e.g. Mole on left cheek" /></Field></div>
        </div>
      </SectionCard>

      {/* family */}
      <SectionCard title="Family details (for family pension)" desc="Pulled from your nominations — manage under Family & Nominee." icon="users">
        <div className="space-y-1.5">
          {NOMINEES.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <span className="font-semibold text-foreground">{n.name} <span className="font-normal text-muted-foreground">· {n.relation}</span></span>
              <span className="text-xs text-muted-foreground">{n.type}{n.type === "Family Pension" ? ` · ${n.share}%` : ""}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* bank + options */}
      <SectionCard title="Disbursement & options" icon="repeat">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pension disbursing bank" required><Input value={f.bank} onChange={(e) => set("bank", e.target.value)} /></Field>
          <Field label="Account number" required><Input value={f.account} onChange={(e) => set("account", e.target.value)} placeholder="Account no." /></Field>
          <Field label="IFSC" required error={f.ifsc && !ifscOk ? "Enter a valid 11-character IFSC" : ""}><Input value={f.ifsc} onChange={(e) => set("ifsc", e.target.value.toUpperCase())} /></Field>
          <div />
          <Field label="Do you wish to commute pension?"><RadioPills options={["Yes", "No"]} value={f.commute} onChange={(v) => set("commute", v)} /></Field>
          {f.commute === "Yes" && <Field label="Commutation % (max 40)"><Input type="number" value={f.commutePct} onChange={(e) => set("commutePct", e.target.value)} /></Field>}
          <Field label="Opt for Fixed Medical Allowance (FMA)?"><RadioPills options={["Yes", "No"]} value={f.fma} onChange={(v) => set("fma", v)} /></Field>
        </div>
      </SectionCard>

      <label className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3.5 text-xs text-foreground">
        <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B3A6B]" />
        <span>I declare that the particulars furnished above are true and correct to the best of my knowledge, and I authorise their use for processing my pension.</span>
      </label>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => {}}><Icon name="fileText" size={16} /> Save draft</Button>
        <Button variant="saffron" disabled={!valid} onClick={() => { setDone(true); onSubmitted && onSubmitted(); }}>
          <Icon name="arrowRight" size={16} /> {valid ? "Submit with eSign → HOO" : "Complete the required fields"}
        </Button>
      </div>
    </ModuleShell>
  );
}
