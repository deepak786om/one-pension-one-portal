import { useState } from "react";
import { motion } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Select, Textarea, RadioPills, InfoRow, StatusPill } from "../../components/ui/kit.jsx";
import { cn } from "../../lib/cn.js";
import { ANUBHAV, ANUBHAV_CATEGORIES, ANUBHAV_SKILLS, PENSIONER } from "../../data/pensioner.js";

function IdentityBanner() {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-3.5 text-xs text-muted-foreground">
      <Icon name="info" size={13} className="mr-1 inline text-primary" />
      Submitting as <b className="text-foreground">{PENSIONER.name}</b> · {PENSIONER.designation} · {PENSIONER.ministry} · PAN {PENSIONER.pan} — auto-pulled from your Profile. Personal &amp; service details are not re-asked, and your identity must not appear in the write-up.
    </div>
  );
}

export default function Anubhav({ onBack }) {
  const [submitted, setSubmitted] = useState(ANUBHAV.submitted);
  const [form, setForm] = useState({ category: "", content: "", innovation: "", award: "", leadership: "", suggestions: "", volunteer: "", feedbackEmail: "" });
  const [skills, setSkills] = useState([]);
  const [accept, setAccept] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => setSkills((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);
  const valid = form.category && form.content.trim().length > 40 && accept;

  if (submitted) {
    return (
      <ModuleShell icon="bookOpen" title="Anubhav — Your Experience" desc="Your service experience, submitted to the National Anubhav Awards Scheme." onBack={onBack}>
        <SectionCard title="Your Anubhav write-up" icon="bookMarked"
          action={<span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success"><Icon name="badgeCheck" size={14} /> Submitted</span>}>
          <InfoRow label="Category of work" value={form.category || "Government process re-engineering"} />
          <InfoRow label="Status" value={<StatusPill>Submitted to HOO</StatusPill>} />
          <div className="mt-3 rounded-xl bg-muted/30 p-3.5 text-sm text-foreground">{form.content || "Your write-up has been recorded and forwarded to your Head of Office for grading."}</div>
          <p className="mt-3 text-xs text-muted-foreground"><Icon name="info" size={12} className="mr-1 inline text-primary" /> Only one write-up is allowed per retirement. Once your HOO recommends it, the HOD publishes it on the Anubhav portal.</p>
        </SectionCard>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="bookOpen" title="Anubhav — Share Your Experience" desc="Publish your service experience under the National Anubhav Awards Scheme." onBack={onBack}>
      <SectionCard title="Anubhav write-up" desc="One write-up per retirement. Fields marked * are required." icon="bookOpen">
        <div className="grid gap-4">
          <IdentityBanner />
          <Field label="Category of work" required>
            <Select options={ANUBHAV_CATEGORIES} value={form.category} onChange={(e) => set("category", e.target.value)} />
          </Field>
          <Field label="Your Anubhav (the experience to be highlighted)" required hint="Up to ~5000 words. Do not mention your name, designation or contact details.">
            <Textarea value={form.content} onChange={(e) => set("content", e.target.value)} maxLength={5000} placeholder="Describe your commendable work / contribution…" className="min-h-[150px]" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Innovation / exceptional work (optional)"><Textarea value={form.innovation} onChange={(e) => set("innovation", e.target.value)} /></Field>
            <Field label="Awards / medals / certificates (optional)"><Textarea value={form.award} onChange={(e) => set("award", e.target.value)} /></Field>
          </div>
          <Field label="Leadership qualities (optional)"><Textarea value={form.leadership} onChange={(e) => set("leadership", e.target.value)} /></Field>

          <Field label="Skills (choose any that apply)">
            <div className="flex flex-wrap gap-2">
              {ANUBHAV_SKILLS.map((s) => {
                const on = skills.includes(s);
                return (
                  <button key={s} type="button" onClick={() => toggleSkill(s)}
                    className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", on ? "border-primary bg-primary/8 text-primary" : "border-border bg-white text-muted-foreground hover:border-primary/40")}>
                    {on && <Icon name="check" size={12} className="mr-1 inline" />}{s}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Suggestions to improve your line of work (optional)" hint="Up to ~2000 words.">
            <Textarea value={form.suggestions} onChange={(e) => set("suggestions", e.target.value)} maxLength={2000} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Willing to volunteer for social work?"><RadioPills options={["Yes", "No"]} value={form.volunteer} onChange={(v) => set("volunteer", v)} /></Field>
            <Field label="Receive feedback by email?"><RadioPills options={["Yes", "No"]} value={form.feedbackEmail} onChange={(v) => set("feedbackEmail", v)} /></Field>
          </div>

          <Field label="Upload a recent photograph (.jpg, ≤50 KB) — optional">
            <input type="file" accept=".jpg,.jpeg" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary" />
          </Field>

          <label className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3.5 text-xs text-foreground">
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B3A6B]" />
            <span>I declare the information is true, not sensitive to national security, not against any gender/caste/religion, not political, and does not disclose my identity or violate the Official Secrets Act, 1923. <b className="text-foreground">I Accept.</b></span>
          </label>

          <div className="flex gap-2">
            <Button variant="saffron" disabled={!valid} onClick={() => setSubmitted(true)}>
              <Icon name="arrowRight" size={16} /> {valid ? "Submit write-up" : "Complete the required fields"}
            </Button>
            <Button variant="outline" onClick={onBack}>Cancel</Button>
          </div>
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
