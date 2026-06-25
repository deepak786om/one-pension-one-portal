import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Select, Input, Textarea, SuccessNote } from "../../components/ui/kit.jsx";
import { ASSOC_MEMBERS, ASSOC_CATEGORIES, newRegNo } from "../../data/association.js";

export default function LodgeOnBehalf({ onBack }) {
  const [member, setMember] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [reg, setReg] = useState(null);
  const valid = member && category && subject.trim().length > 3 && details.trim().length > 12;
  const active = ASSOC_MEMBERS.filter((m) => m.status === "Active");

  if (reg) {
    return (
      <ModuleShell icon="messageCircle" title="Lodge on Behalf of Member" desc="Raise a pension grievance for one of your members." onBack={onBack}>
        <SuccessNote title="Grievance lodged">Registration number <b className="font-mono text-foreground">{reg}</b> for <b className="text-foreground">{member}</b>. The member and your association will receive status updates.</SuccessNote>
        <Button variant="outline" onClick={() => { setReg(null); setMember(""); setCategory(""); setSubject(""); setDetails(""); }}><Icon name="messageCircle" size={16} /> Lodge another</Button>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="messageCircle" title="Lodge on Behalf of Member" desc="Raise a pension grievance for one of your members." onBack={onBack}>
      <SectionCard title="New grievance" desc="Filed against the member's PPO so it routes correctly." icon="messageCircle">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Member" required>
            <Select options={active.map((m) => `${m.name} · ${m.ppo}`)} value={member} onChange={(e) => setMember(e.target.value)} />
          </Field>
          <Field label="Category" required><Select options={ASSOC_CATEGORIES} value={category} onChange={(e) => setCategory(e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Subject" required><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="One-line summary" /></Field></div>
          <div className="sm:col-span-2"><Field label="Details" required hint="Describe the issue with dates and references."><Textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Explain the grievance…" /></Field></div>
        </div>
        <div className="mt-5 flex gap-2">
          <Button variant="saffron" disabled={!valid} onClick={() => setReg(newRegNo())}><Icon name="arrowRight" size={16} /> {valid ? "Lodge grievance" : "Complete the required fields"}</Button>
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
