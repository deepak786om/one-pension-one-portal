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


function anubhavWindow() {
  const NOW = new Date("2026-06-30");
  const dor = new Date(PENSIONER.retiredOn);
  const open = new Date(dor); open.setMonth(open.getMonth() - 8);     // 8 months before retirement
  const close = new Date(dor); close.setFullYear(close.getFullYear() + 3); // 3 years after retirement
  const fmt = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const day = 86400000;
  const pct = Math.max(0, Math.min(100, ((NOW - open) / (close - open)) * 100));
  const daysLeft = Math.max(0, Math.round((close - NOW) / day));
  return { openStr: fmt(open), closeStr: fmt(close), pct, daysLeft, weeksLeft: Math.round(daysLeft / 7), monthsLeft: Math.round(daysLeft / 30.44), closed: NOW > close };
}

const DEMO_SUB = {
  author: PENSIONER.name, designation: PENSIONER.designation, ministry: PENSIONER.ministry,
  office: PENSIONER.office, pan: PENSIONER.pan, ppo: PENSIONER.ppo, photo: false,
  status: "Published", date: "12 Jun 2026", ref: "ANB-2026-0000",
  category: "Government process re-engineering",
  title: "Re-engineering a long-pending office process (sample)",
  content:
    "When I took charge of the section, a routine approval moved between several desks and often took weeks longer than it should have. " +
    "I mapped each hand-off, removed the duplicated checks, and introduced a single shared checklist so that nothing was re-entered twice.\n\n" +
    "We trialled the change on a small batch of cases, measured the time saved honestly, and only then rolled it out across the section. The waiting time fell sharply and, just as importantly, the change outlasted my own posting.",
  innovation: "A one-page reconciliation checklist completed before a case leaves the desk, which cut downstream objections substantially.",
  award: "Departmental commendation, 2023, for process improvement.",
  leadership: "Mentored the team through the transition with short weekly reviews so they owned the new way of working.",
  skills: ["Process re-engineering", "Team mentoring", "Citizen service"],
  suggestions: "Standardise the checklist across comparable offices so every desk speaks the same language.",
  volunteer: "Yes", feedbackEmail: "Yes",
};

function AnubhavStatusCard({ submitted, data, onSimulate }) {
  const w = anubhavWindow();
  const STEPS = ["Submitted", "HOO recommends", "HOD approves", "Published"];
  const doneUpto = submitted ? 1 : 0;
  return (
    <SectionCard title="Your Anubhav status" desc="Where your experience stands, and how long you have to publish it." icon="bookMarked"
      action={submitted
        ? <span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success"><Icon name="badgeCheck" size={14} /> Awaiting HOO recommendation</span>
        : <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron/12 px-3 py-1 text-xs font-bold text-saffron"><Icon name="info" size={14} /> Not yet submitted</span>}>
      <div className="flex items-start">
        {STEPS.map((s, i) => {
          const done = i < doneUpto, cur = submitted && i === doneUpto;
          const color = done ? "#1B9C57" : cur ? "#E98A1E" : "#CBD5E1";
          return (
            <div key={s} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span className="h-0.5 flex-1" style={{ background: i === 0 ? "transparent" : (i <= doneUpto ? "#1B9C57" : "#E2E8F0") }} />
                <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-white" style={{ background: color }}>{done ? <Icon name="check" size={13} /> : <span className="text-[11px] font-bold">{i + 1}</span>}</span>
                <span className="h-0.5 flex-1" style={{ background: i === STEPS.length - 1 ? "transparent" : (i < doneUpto ? "#1B9C57" : "#E2E8F0") }} />
              </div>
              <span className="mt-1.5 text-center text-[10.5px] font-semibold leading-tight" style={{ color: cur ? "#E98A1E" : "#64748B" }}>{s}</span>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-5 rounded-xl border p-3.5", w.closed ? "border-red-200 bg-red-50/50" : submitted ? "border-success/20 bg-success/[0.04]" : "border-saffron/25 bg-saffron/[0.06]")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-foreground"><Icon name="clock" size={15} className="text-saffron" /> Publish by <b>{w.closeStr}</b></div>
          <span className={cn("text-sm font-extrabold", w.closed ? "text-red-600" : "text-saffron")}>{w.closed ? "Window closed" : `~${w.weeksLeft} weeks left`}</span>
        </div>
        <div className="relative mt-2.5 h-2 rounded-full bg-slate-200">
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: w.pct + "%", background: w.closed ? "#EF4444" : "#E98A1E" }} />
          <span className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow" style={{ left: w.pct + "%", background: w.closed ? "#EF4444" : "#E98A1E" }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Eligibility window: 8 months before retirement to 3 years after — {w.openStr} &rarr; {w.closeStr} (a 44-month window).{submitted ? "" : " You can still publish your Anubhav."}</p>
      </div>
      {!submitted && onSimulate && (
        <button onClick={onSimulate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/[0.03] px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/[0.07]">
          <Icon name="repeat" size={14} /> Demo: Simulate submission
        </button>
      )}
    </SectionCard>
  );
}

export default function Anubhav({ onBack }) {
  const [submitted, setSubmitted] = useState(ANUBHAV.submitted);
  const [data, setData] = useState(null); // snapshot shown after submit
  const [form, setForm] = useState({ category: "", content: "", innovation: "", award: "", leadership: "", suggestions: "", volunteer: "", feedbackEmail: "" });
  const [skills, setSkills] = useState([]);
  const [accept, setAccept] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSkill = (s) => setSkills((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);

  // declaration-gated: needs a category, some content, and the declaration accepted
  const valid = !!form.category && form.content.trim().length > 0 && accept;

  const submit = () => {
    setData({
      ...form,
      skills: [...skills],
      ref: "ANB-2026-" + Math.floor(1000 + Math.random() * 8999),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setSubmitted(true);
  };

  const simulateSubmit = () => {
    setData({
      category: DEMO_SUB.category, content: DEMO_SUB.content, innovation: DEMO_SUB.innovation,
      award: DEMO_SUB.award, leadership: DEMO_SUB.leadership, suggestions: DEMO_SUB.suggestions,
      skills: [...DEMO_SUB.skills], volunteer: DEMO_SUB.volunteer, feedbackEmail: DEMO_SUB.feedbackEmail,
      ref: "ANB-2026-" + Math.floor(1000 + Math.random() * 8999),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setSubmitted(true);
  };

  if (submitted) {
    const d = data || { category: "Government process re-engineering", content: "Your write-up has been recorded and forwarded to your Head of Office.", skills: [], ref: "ANB-2026-0000", date: "Today" };
    return (
      <ModuleShell icon="bookOpen" title="Anubhav — Your Experience" desc="Your service experience, submitted to the National Anubhav Awards Scheme." onBack={onBack}>
        <AnubhavStatusCard submitted data={d} />
        <SectionCard title="Your Anubhav write-up" icon="bookMarked"
          action={<span className="inline-flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1 text-xs font-bold text-success"><Icon name="badgeCheck" size={14} /> Submitted</span>}>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <InfoRow label="Reference" value={<span className="font-mono">{d.ref}</span>} />
            <InfoRow label="Submitted on" value={d.date} />
            <InfoRow label="Category of work" value={d.category} />
            <InfoRow label="Status" value={<StatusPill>Forwarded to HOO</StatusPill>} />
          </div>

          <div className="mt-4">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Your Anubhav</div>
            <p className="mt-1.5 whitespace-pre-line rounded-xl bg-muted/30 p-3.5 text-sm leading-relaxed text-foreground">{d.content}</p>
          </div>

          {(d.innovation || d.award || d.leadership) && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {d.innovation && <div className="rounded-xl border border-border p-3"><div className="text-xs font-bold text-primary">Innovation / exceptional work</div><p className="mt-1 text-sm text-muted-foreground">{d.innovation}</p></div>}
              {d.award && <div className="rounded-xl border border-border p-3"><div className="text-xs font-bold text-primary">Awards / medals</div><p className="mt-1 text-sm text-muted-foreground">{d.award}</p></div>}
              {d.leadership && <div className="rounded-xl border border-border p-3"><div className="text-xs font-bold text-primary">Leadership qualities</div><p className="mt-1 text-sm text-muted-foreground">{d.leadership}</p></div>}
            </div>
          )}

          {d.skills && d.skills.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Skills</div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {d.skills.map((s) => <span key={s} className="rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">{s}</span>)}
              </div>
            </div>
          )}

          {d.suggestions && (
            <div className="mt-4">
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Suggestions</div>
              <p className="mt-1.5 rounded-xl bg-muted/30 p-3.5 text-sm text-foreground">{d.suggestions}</p>
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground"><Icon name="info" size={12} className="mr-1 inline text-primary" /> Only one write-up is allowed per retirement. Once your HOO recommends it, the HOD publishes it on the Anubhav portal.</p>
        </SectionCard>
      </ModuleShell>
    );
  }

  return (
    <ModuleShell icon="bookOpen" title="Anubhav — Share Your Experience" desc="Publish your service experience under the National Anubhav Awards Scheme." onBack={onBack}>
      <AnubhavStatusCard submitted={false} onSimulate={simulateSubmit} />
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

          <label className={cn("flex items-start gap-2.5 rounded-xl p-3.5 text-xs text-foreground transition-colors", accept ? "bg-success/8 ring-1 ring-success/25" : "bg-muted/30")}>
            <input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B3A6B]" />
            <span>I declare the information is true, not sensitive to national security, not against any gender/caste/religion, not political, and does not disclose my identity or violate the Official Secrets Act, 1923. <b className="text-foreground">I Accept.</b></span>
          </label>

          <div className="flex gap-2">
            <Button variant="saffron" disabled={!valid} onClick={submit}>
              <Icon name="arrowRight" size={16} /> {accept ? "Submit write-up" : "Accept the declaration to submit"}
            </Button>
            <Button variant="outline" onClick={onBack}>Cancel</Button>
          </div>
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
