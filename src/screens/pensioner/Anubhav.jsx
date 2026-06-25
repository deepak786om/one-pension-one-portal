import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Input, Textarea, StatusPill, InfoRow, SuccessNote } from "../../components/ui/kit.jsx";
import { ANUBHAV, PENSIONER } from "../../data/pensioner.js";

export default function Anubhav({ onBack }) {
  const [writing, setWriting] = useState(false);
  const [form, setForm] = useState({ title: "", tenure: "", text: "", suggestion: "" });
  const [done, setDone] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.title.trim().length > 5 && form.text.trim().length > 40;

  return (
    <ModuleShell icon="bookOpen" title="Anubhav — Share Your Experience" desc="Publish your service experience. It is graded by your HOO and published by the HOD." onBack={onBack}>
      <SectionCard title="Your existing write-up" icon="bookMarked"
        action={<StatusPill>{ANUBHAV.status}</StatusPill>}>
        <InfoRow label="Title" value={ANUBHAV.title} />
        <InfoRow label="Submitted on" value={ANUBHAV.submittedOn} />
        <InfoRow label="Grade by HOO" value={ANUBHAV.grade} />
        <InfoRow label="Published" value={ANUBHAV.published ? "Yes — visible on Anubhav portal" : "Pending"} />
      </SectionCard>

      {done ? (
        <SuccessNote title="Write-up submitted">
          Thank you. Your submission has gone to your Head of Office for grading; once recommended, the HOD will publish it on the Anubhav portal.
        </SuccessNote>
      ) : !writing ? (
        <SectionCard title="Share a new write-up" desc="One write-up is allowed per retirement event." icon="bookOpen">
          <p className="text-sm text-muted-foreground">Reflect on your tenure — notable contributions, a suggestion for your department, or advice for future officers.</p>
          <Button variant="saffron" className="mt-4" onClick={() => setWriting(true)}><Icon name="bookOpen" size={16} /> Share new write-up</Button>
        </SectionCard>
      ) : (
        <SectionCard title="New Anubhav write-up" icon="bookOpen">
          <div className="grid gap-4">
            <Field label="Title" required><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="A line that captures your journey" /></Field>
            <Field label="Tenure / department"><Input value={form.tenure} onChange={(e) => set("tenure", e.target.value)} placeholder={`e.g. ${PENSIONER.ministry}, 1991–2024`} /></Field>
            <Field label="Your experience" required hint="At least a short paragraph."><Textarea value={form.text} onChange={(e) => set("text", e.target.value)} placeholder="Share your experience…" className="min-h-[140px]" /></Field>
            <Field label="A suggestion for your department (optional)"><Textarea value={form.suggestion} onChange={(e) => set("suggestion", e.target.value)} placeholder="Something that could be improved…" /></Field>
            <div className="flex gap-2">
              <Button variant="saffron" disabled={!valid} onClick={() => setDone(true)}>
                <Icon name="arrowRight" size={16} /> {valid ? "Submit for grading" : "Add a title and your experience"}
              </Button>
              <Button variant="outline" onClick={() => setWriting(false)}>Cancel</Button>
            </div>
          </div>
        </SectionCard>
      )}
    </ModuleShell>
  );
}
