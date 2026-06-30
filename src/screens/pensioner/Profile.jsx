import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, InfoRow, Field, Input, SuccessNote } from "../../components/ui/kit.jsx";
import { PENSIONER } from "../../data/pensioner.js";
import AiPreferenceCard from "../../components/ui/AiPreferenceCard.jsx";

export default function Profile({ onBack }) {
  const [edit, setEdit] = useState(false);
  const [mobile, setMobile] = useState(PENSIONER.mobile);
  const [email, setEmail] = useState(PENSIONER.email);
  const [saved, setSaved] = useState(false);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const mobileOk = mobile.replace(/\D/g, "").length >= 10;

  const save = () => { setEdit(false); setSaved(true); setTimeout(() => setSaved(false), 2600); };

  return (
    <ModuleShell icon="userCheck" title="My Profile" desc="Your identity and contact details on record." onBack={onBack}>
      {saved && <SuccessNote title="Contact details updated">An OTP-verified update has been recorded against your PPO.</SuccessNote>}

      <SectionCard title="Identity" icon="badgeCheck">
        <div className="grid gap-x-8 sm:grid-cols-2">
          <div>
            <InfoRow label="Name" value={PENSIONER.name} />
            <InfoRow label="PPO Number" value={PENSIONER.ppo} />
            <InfoRow label="PAN" value={PENSIONER.pan} />
            <InfoRow label="Aadhaar" value={PENSIONER.aadhaarMasked} />
          </div>
          <div>
            <InfoRow label="Date of birth" value="12 Mar 1964" />
            <InfoRow label="Designation" value={PENSIONER.designation} />
            <InfoRow label="Ministry / Dept" value={PENSIONER.ministry} />
            <InfoRow label="Retired on" value="31 Mar 2024" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Contact details" desc="These can be updated by you (OTP-verified)." icon="messageCircle"
        action={!edit && <Button variant="ghost" className="px-3 py-2" onClick={() => setEdit(true)}><Icon name="userCheck" size={15} /> Edit</Button>}>
        {edit ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile number" required error={mobile && !mobileOk ? "Enter a valid 10-digit mobile" : ""}>
              <Input value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </Field>
            <Field label="Email" required error={email && !emailOk ? "Enter a valid email" : ""}>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <div className="sm:col-span-2 flex gap-2">
              <Button variant="saffron" disabled={!(mobileOk && emailOk)} onClick={save}>
                <Icon name="check" size={16} /> {mobileOk && emailOk ? "Save changes" : "Fix the details above"}
              </Button>
              <Button variant="outline" onClick={() => setEdit(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div>
            <InfoRow label="Mobile" value={mobile} />
            <InfoRow label="Email" value={email} />
          </div>
        )}
      </SectionCard>

      <AiPreferenceCard />

      <SectionCard title="Bank account" desc="Change this from Transfer Pension Account." icon="repeat">
        <InfoRow label="Bank" value={PENSIONER.bank.name} />
        <InfoRow label="Branch" value={PENSIONER.bank.branch} />
        <InfoRow label="Account" value={PENSIONER.bank.accountMasked} />
        <InfoRow label="IFSC" value={PENSIONER.bank.ifsc} />
      </SectionCard>
    </ModuleShell>
  );
}
