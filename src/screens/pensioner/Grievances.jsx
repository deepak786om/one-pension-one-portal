import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import {
  SectionCard, Field, Select, Input, Textarea, StatusPill, SuccessNote,
  Breadcrumb, RadioPills, StarRating, Modal, InfoRow,
} from "../../components/ui/kit.jsx";
import {
  GRIEVANCE_CATEGORIES, GRIEVANCE_PERTAINS, PENSION_TYPES, GRIEVANCES, PENSIONER, newGrievanceRegNo,
} from "../../data/pensioner.js";

function iconForAction(a = "") {
  const s = a.toLowerCase();
  if (s.includes("lodged")) return "messageCircle";
  if (s.includes("forward")) return "repeat";
  if (s.includes("resolved")) return "check";
  if (s.includes("appeal")) return "scale";
  if (s.includes("acknowledg") || s.includes("admit")) return "badgeCheck";
  return "activity";
}

function HistoryTimeline({ items, accent = "primary" }) {
  const dot = accent === "saffron" ? "bg-saffron" : "bg-primary";
  return (
    <div className="space-y-1">
      {items.map((h, i) => {
        const actorIcon = /^you/i.test(h.actor) ? "userCheck" : "building";
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={"grid h-11 w-11 flex-shrink-0 place-items-center rounded-full text-white shadow-soft ring-4 ring-card " + dot}>
                <Icon name={iconForAction(h.action)} size={16} />
              </span>
              {i < items.length - 1 && <span className="my-1 w-0.5 flex-1 bg-border" />}
            </div>
            <div className="mb-2 flex-1 rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="text-sm font-extrabold text-foreground">{h.action}</h4>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{h.date}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Icon name={actorIcon} size={12} /> {h.actor}
              </div>
              {h.remark && <p className="mt-2.5 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">{h.remark}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Grievances({ onBack }) {
  const [list, setList] = useState(GRIEVANCES);
  const [view, setView] = useState({ name: "list" });
  const [modal, setModal] = useState(null); // grievance shown in the details popup
  const sel = view.g ? list.find((g) => g.id === view.g) : null;

  // lodge form
  const [behalf, setBehalf] = useState("self");
  const [form, setForm] = useState({ pertains: "", category: "", ptype: PENSIONER.pensionType, subject: "", details: "" });
  const [other, setOther] = useState({ name: "", ppo: "", relation: "", bank: "", account: "", ifsc: "", mobile: "" });
  const [newReg, setNewReg] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setO = (k, v) => setOther((o) => ({ ...o, [k]: v }));
  const otherOk = behalf === "self" || (other.name.trim() && other.ppo.trim() && other.relation && other.bank.trim() && other.ifsc.trim());
  const valid = form.pertains && form.category && form.ptype && form.subject.trim().length > 3 && form.details.trim().length > 12 && otherOk;

  // appeal / feedback
  const [reason, setReason] = useState("");
  const [stars, setStars] = useState(0);
  const [fbRemark, setFbRemark] = useState("");

  const goList = () => { setView({ name: "list" }); setNewReg(null); };

  const lodge = () => {
    const rn = newGrievanceRegNo();
    const entry = {
      id: "g" + (list.length + 1), regNo: rn, category: form.category, subject: form.subject,
      pertains: form.pertains, pensionType: form.ptype, lodged: "Today", status: "New", sla: "30 days left",
      onBehalf: behalf === "other" ? { ...other } : null, appeal: null,
      history: [{ date: "Today", actor: behalf === "other" ? `You (on behalf of ${other.name})` : "You", action: "Grievance lodged", remark: form.subject }],
    };
    setList((l) => [entry, ...l]);
    setNewReg(rn);
  };

  const submitAppeal = () => {
    setList((l) => l.map((g) => g.id === sel.id ? {
      ...g, status: "Under appeal",
      appeal: { date: "Today", reason, status: "Under appeal", history: [{ date: "Today", actor: "You", action: "Appeal filed", remark: reason }] },
    } : g));
    setReason(""); goList();
  };
  const submitFeedback = () => { setStars(0); setFbRemark(""); goList(); };

  return (
    <ModuleShell icon="messageCircle" title="Grievances" desc="Lodge a pension grievance, track it under a 30-day SLA, appeal or rate the resolution." onBack={onBack}>
      <Breadcrumb items={[
        { label: "Grievances", onClick: goList },
        ...(view.name === "lodge" ? [{ label: "Lodge new grievance" }] : []),
        ...(view.name === "history" ? [{ label: sel?.regNo }] : []),
        ...(view.name === "appeal" ? [{ label: sel?.regNo, onClick: () => setView({ name: "history", g: sel.id }) }, { label: "Appeal" }] : []),
        ...(view.name === "feedback" ? [{ label: sel?.regNo }, { label: "Feedback" }] : []),
      ]} />

      <AnimatePresence mode="wait">
        {/* ---------------- LIST ---------------- */}
        {view.name === "list" && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-extrabold text-foreground">Your grievances</h3>
              <Button variant="saffron" onClick={() => setView({ name: "lodge" })} className="px-4 py-2.5">
                <Icon name="messageCircle" size={16} /> Lodge new grievance
              </Button>
            </div>

            <div className="space-y-3">
              {list.map((g) => (
                <div key={g.id} className="rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-primary">{g.regNo}</span>
                        {g.onBehalf && <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">On behalf · {g.onBehalf.relation}</span>}
                      </div>
                      <div className="mt-1 text-sm font-bold text-foreground">{g.subject}</div>
                      <div className="text-xs text-muted-foreground">{g.category} · lodged {g.lodged}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <StatusPill>{g.status}</StatusPill>
                      <span className="text-[11px] text-muted-foreground">{g.sla}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-border/70 pt-3">
                    <button onClick={() => setModal(g)} className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">
                      <Icon name="search" size={14} /> View details
                    </button>
                    <button onClick={() => setView({ name: "history", g: g.id })} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40">
                      <Icon name="listChecks" size={14} /> Tracking history
                    </button>
                    {g.appeal && (
                      <button onClick={() => setView({ name: "history", g: g.id })} className="inline-flex items-center gap-1.5 rounded-lg border border-saffron/40 bg-saffron/10 px-3 py-1.5 text-xs font-semibold text-saffron">
                        <Icon name="scale" size={14} /> Track appeal
                      </button>
                    )}
                    {g.status === "Resolved" && !g.appeal && (
                      <button onClick={() => setView({ name: "appeal", g: g.id })} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40">
                        <Icon name="scale" size={14} /> File appeal
                      </button>
                    )}
                    {g.status === "Resolved" && (
                      <button onClick={() => setView({ name: "feedback", g: g.id })} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40">
                        <Icon name="check" size={14} /> Give feedback
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------------- LODGE ---------------- */}
        {view.name === "lodge" && (
          <motion.div key="lodge" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            {newReg ? (
              <div className="space-y-4">
                <SuccessNote title="Grievance lodged">
                  Registration number <b className="font-mono text-foreground">{newReg}</b>. You'll get SMS &amp; email updates; it will be addressed within the 30-day SLA.
                </SuccessNote>
                <Button variant="outline" onClick={goList}><Icon name="listChecks" size={16} /> Back to my grievances</Button>
              </div>
            ) : (
              <SectionCard title="Lodge a new grievance" desc="Filed against the PPO so it routes to the right office." icon="messageCircle">
                <Field label="Who is this grievance for?" required>
                  <RadioPills options={[{ value: "self", label: "Myself" }, { value: "other", label: "On behalf of someone else" }]} value={behalf} onChange={setBehalf} />
                </Field>

                <AnimatePresence>
                  {behalf === "other" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 overflow-hidden rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
                      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Pensioner's details</div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Pensioner's name" required><Input value={other.name} onChange={(e) => setO("name", e.target.value)} placeholder="Full name" /></Field>
                        <Field label="Their PPO number" required><Input value={other.ppo} onChange={(e) => setO("ppo", e.target.value)} placeholder="PPO-YYYY-XXX-NNNNNNN" /></Field>
                        <Field label="Your relation" required><Select options={["Spouse", "Son", "Daughter", "Parent", "Guardian", "Other"]} value={other.relation} onChange={(e) => setO("relation", e.target.value)} /></Field>
                        <Field label="Their mobile"><Input value={other.mobile} onChange={(e) => setO("mobile", e.target.value)} placeholder="+91…" /></Field>
                        <Field label="Disbursing bank" required><Input value={other.bank} onChange={(e) => setO("bank", e.target.value)} placeholder="Bank name" /></Field>
                        <Field label="Account number"><Input value={other.account} onChange={(e) => setO("account", e.target.value)} placeholder="Account no." /></Field>
                        <Field label="IFSC" required><Input value={other.ifsc} onChange={(e) => setO("ifsc", e.target.value.toUpperCase())} placeholder="e.g. PUNB0123400" /></Field>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Grievance pertains to" required><Select options={GRIEVANCE_PERTAINS} value={form.pertains} onChange={(e) => set("pertains", e.target.value)} /></Field>
                  <Field label="Category" required><Select options={GRIEVANCE_CATEGORIES} value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
                  <Field label="Pension type" required><Select options={PENSION_TYPES} value={form.ptype} onChange={(e) => set("ptype", e.target.value)} /></Field>
                  <Field label="Subject" required><Input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="One-line summary" /></Field>
                  <div className="sm:col-span-2">
                    <Field label="Details" required hint="Describe the issue with dates and any reference numbers.">
                      <Textarea value={form.details} onChange={(e) => set("details", e.target.value)} placeholder="Explain the grievance…" />
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
                  <Button variant="outline" onClick={goList}>Cancel</Button>
                </div>
              </SectionCard>
            )}
          </motion.div>
        )}

        {/* ---------------- HISTORY ---------------- */}
        {view.name === "history" && sel && (
          <motion.div key="history" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <SectionCard title={sel.subject} desc={`${sel.regNo} · ${sel.category}`} icon="messageCircle" action={<StatusPill>{sel.status}</StatusPill>}>
              {sel.onBehalf && (
                <div className="mb-4 rounded-xl bg-muted/40 p-3 text-xs">
                  <span className="font-bold text-foreground">On behalf of {sel.onBehalf.name}</span> ({sel.onBehalf.relation}) · PPO {sel.onBehalf.ppo} · {sel.onBehalf.bank}
                </div>
              )}
              <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Tracking history</div>
              <HistoryTimeline items={sel.history} />
            </SectionCard>

            {sel.appeal && (
              <SectionCard title="Appeal" desc={`Filed on ${sel.appeal.date}`} icon="scale" action={<StatusPill tone="warn">{sel.appeal.status}</StatusPill>}>
                <p className="mb-3 rounded-xl bg-saffron/10 p-3 text-xs text-foreground"><b>Reason:</b> {sel.appeal.reason}</p>
                <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-3">Appeal history</div>
                <HistoryTimeline items={sel.appeal.history} accent="saffron" />
              </SectionCard>
            )}
            <Button variant="outline" onClick={goList}><Icon name="chevronLeft" size={16} /> Back to my grievances</Button>
          </motion.div>
        )}

        {/* ---------------- APPEAL ---------------- */}
        {view.name === "appeal" && sel && (
          <motion.div key="appeal" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <SectionCard title="File an appeal" desc={`Against ${sel.regNo}`} icon="scale">
              <Field label="Reason for appealing" required>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="State why you are appealing the resolution…" className="min-h-[120px]" />
              </Field>
              <div className="mt-3 flex gap-2">
                <Button variant="saffron" disabled={reason.trim().length < 10} onClick={submitAppeal}>
                  <Icon name="arrowRight" size={16} /> {reason.trim().length < 10 ? "Add your reason" : "Submit appeal"}
                </Button>
                <Button variant="outline" onClick={goList}>Cancel</Button>
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* ---------------- FEEDBACK ---------------- */}
        {view.name === "feedback" && sel && (
          <motion.div key="feedback" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <SectionCard title="Rate the resolution" desc={`For ${sel.regNo}`} icon="check">
              <div className="py-2"><StarRating value={stars} onChange={setStars} /></div>
              <div className="mt-3">
                <Field label="Remarks (optional)">
                  <Textarea value={fbRemark} onChange={(e) => setFbRemark(e.target.value)} placeholder="Tell us anything about how this was handled…" />
                </Field>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="saffron" disabled={!stars} onClick={submitFeedback}>
                  <Icon name="check" size={16} /> {stars ? "Submit feedback" : "Pick a rating"}
                </Button>
                <Button variant="outline" onClick={goList}>Cancel</Button>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- VIEW DETAILS POPUP ---------------- */}
      <Modal open={!!modal} onClose={() => setModal(null)} maxW="max-w-lg">
        {modal && (
          <div>
            <div className="border-b border-border pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-semibold text-primary">{modal.regNo}</span>
                <StatusPill>{modal.status}</StatusPill>
                {modal.onBehalf && <span className="rounded-full bg-primary/8 px-2 py-0.5 text-[10px] font-bold text-primary">On behalf · {modal.onBehalf.relation}</span>}
              </div>
              <h3 className="mt-1.5 text-lg font-black text-foreground">{modal.subject}</h3>
            </div>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <InfoRow label="Category" value={modal.category} />
              <InfoRow label="Pertains to" value={modal.pertains || "—"} />
              <InfoRow label="Pension type" value={modal.pensionType || "—"} />
              <InfoRow label="Lodged" value={modal.lodged} />
              <InfoRow label="SLA" value={modal.sla} />
              <InfoRow label="Status" value={modal.status} />
            </div>
            {modal.onBehalf && (
              <div className="mt-2 rounded-xl bg-muted/40 p-3 text-xs">
                <span className="font-bold text-foreground">On behalf of {modal.onBehalf.name}</span> ({modal.onBehalf.relation}) · PPO {modal.onBehalf.ppo} · {modal.onBehalf.bank}
              </div>
            )}
            <div className="mt-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Latest activity</div>
              <div className="max-h-[34vh] space-y-2 overflow-y-auto">
                {[...modal.history].reverse().map((h, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-foreground">{h.action}</span>
                      <span className="text-[11px] text-muted-foreground">{h.date}</span>
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-primary">{h.actor}</div>
                    {h.remark && <p className="mt-1 text-xs text-muted-foreground">{h.remark}</p>}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
              <Button variant="saffron" className="px-4 py-2" onClick={() => { const id = modal.id; setModal(null); setView({ name: "history", g: id }); }}><Icon name="listChecks" size={15} /> Full tracking history</Button>
              <Button variant="outline" className="px-4 py-2" onClick={() => setModal(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
