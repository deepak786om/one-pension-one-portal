import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Select, Input, Textarea, DataTable, StatusPill, SuccessNote } from "../../components/ui/kit.jsx";
import { GRIEVANCE_CATEGORIES, GRIEVANCE_PERTAINS, PENSION_TYPES, GRIEVANCES, PENSIONER, newGrievanceRegNo } from "../../data/pensioner.js";

export default function Grievances({ onBack }) {
  const [tab, setTab] = useState("track");
  const [list, setList] = useState(GRIEVANCES);
  const [form, setForm] = useState({ pertains: "", category: "", ptype: PENSIONER.pensionType, subject: "", details: "" });
  const [regNo, setRegNo] = useState(null);
  const [appealFor, setAppealFor] = useState(null);
  const [feedbackFor, setFeedbackFor] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.pertains && form.category && form.ptype && form.subject.trim().length > 3 && form.details.trim().length > 12;

  const lodge = () => {
    const rn = newGrievanceRegNo();
    setRegNo(rn);
    setList((l) => [{ regNo: rn, category: form.category, lodged: "Today", status: "New", sla: "30 days left", canAppeal: false }, ...l]);
  };

  const cols = useMemo(() => [
    { key: "regNo", label: "Registration No.", render: (r) => <span className="font-mono text-xs">{r.regNo}</span> },
    { key: "category", label: "Category" },
    { key: "lodged", label: "Lodged" },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
    {
      key: "act", label: "Action", render: (r) => (
        r.status === "Resolved"
          ? <div className="flex gap-1.5">
              <button onClick={() => setAppealFor(r)} className="rounded-md border border-border px-2 py-1 text-xs font-semibold hover:border-primary/40">Appeal</button>
              <button onClick={() => setFeedbackFor(r)} className="rounded-md border border-border px-2 py-1 text-xs font-semibold hover:border-primary/40">Feedback</button>
            </div>
          : <span className="text-xs text-muted-foreground">{r.sla}</span>
      ),
    },
  ], []);

  return (
    <ModuleShell icon="messageCircle" title="Grievances" desc="Lodge a pension grievance, track it under a 30-day SLA, appeal or rate the resolution." onBack={onBack}>
      <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
        {[["track", "My grievances"], ["lodge", "Lodge new"]].map(([k, l]) => (
          <button key={k} onClick={() => { setTab(k); setRegNo(null); }}
            className={"flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors " + (tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-primary")}>
            {l}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "track" ? (
          <motion.div key="track" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <SectionCard title="Your grievances" desc="Coded actions and SLA tracked end to end." icon="listChecks">
              <DataTable columns={cols} rows={list} empty="You have no grievances yet." />
            </SectionCard>

            {appealFor && (
              <SectionCard title="File an appeal" desc={`Against ${appealFor.regNo}`} icon="scale">
                <Field label="Why are you appealing?" required hint="Explain why the resolution is unsatisfactory.">
                  <Textarea placeholder="Describe your reason for appeal…" id="appealText" />
                </Field>
                <div className="mt-3 flex gap-2">
                  <Button variant="saffron" onClick={() => { setAppealFor(null); }}>Submit appeal</Button>
                  <Button variant="outline" onClick={() => setAppealFor(null)}>Cancel</Button>
                </div>
              </SectionCard>
            )}
            {feedbackFor && (
              <SectionCard title="Rate the resolution" desc={`For ${feedbackFor.regNo}`} icon="messageCircle">
                <div className="flex items-center gap-2">
                  {["Very poor", "Poor", "Okay", "Good", "Excellent"].map((x, i) => (
                    <button key={x} onClick={() => setFeedbackFor(null)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:border-saffron hover:text-saffron">
                      {i + 1}★
                    </button>
                  ))}
                </div>
              </SectionCard>
            )}
          </motion.div>
        ) : (
          <motion.div key="lodge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {regNo ? (
              <div className="space-y-4">
                <SuccessNote title="Grievance lodged">
                  Your registration number is <b className="font-mono text-foreground">{regNo}</b>. You'll get updates by SMS &amp; email; it will be addressed within the 30-day SLA.
                </SuccessNote>
                <Button variant="outline" onClick={() => { setTab("track"); setRegNo(null); }}><Icon name="listChecks" size={16} /> View my grievances</Button>
              </div>
            ) : (
              <SectionCard title="Lodge a new grievance" desc="Filed against your PPO so it routes to the right office." icon="messageCircle">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Grievance pertains to" required>
                    <Select options={GRIEVANCE_PERTAINS} value={form.pertains} onChange={(e) => set("pertains", e.target.value)} />
                  </Field>
                  <Field label="Category" required>
                    <Select options={GRIEVANCE_CATEGORIES} value={form.category} onChange={(e) => set("category", e.target.value)} />
                  </Field>
                  <Field label="Pension type" required>
                    <Select options={PENSION_TYPES} value={form.ptype} onChange={(e) => set("ptype", e.target.value)} />
                  </Field>
                  <Field label="Subject" required>
                    <Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="One-line summary" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Details" required hint="Describe the issue with dates and any reference numbers.">
                      <Textarea value={form.details} onChange={(e) => set("details", e.target.value)} placeholder="Explain your grievance…" />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Attach supporting document (optional)">
                      <input type="file" className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary" />
                    </Field>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button variant="saffron" disabled={!valid} onClick={lodge}>
                    <Icon name="arrowRight" size={16} /> {valid ? "Submit grievance" : "Complete the required fields"}
                  </Button>
                  <Button variant="outline" onClick={onBack}>Cancel</Button>
                </div>
              </SectionCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ModuleShell>
  );
}
