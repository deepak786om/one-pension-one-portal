import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, StepList, EvidenceChecklist, InfoRow, SuccessNote, Breadcrumb, Modal, Field, Input, Select, RadioPills, HistoryTrail } from "../../components/ui/kit.jsx";
import { newPPO } from "../../data/hoo.js";

// Generic family-pension / EOP case processor.
// Skeleton: Intimation & claim → Eligibility/Attributability → Documents → Computation → Sanction → PPO (auto by PAO).
// All FRS-specific content (forms, eligibility, calculation) is supplied by the wrapper via props.
export default function CaseProcessor({
  title, icon, desc, cases, onBack,
  subtypeTone, claim, eligTitle, sanctionLabel,
  eligFor, docsFor, sanctionFor, computeFor, computeTitle, beneficiaryFor, beneficiaryTitle, addConfig,
}) {
  const [rows, setRows] = useState(cases.map((c) => ({ ...c, step: c.start ?? 0, history: c.history || [{ date: c.dol || "On opening", actor: "Head of Office", action: "Case opened", remark: `${c.subtype} · ${c.relation.includes("Self") ? c.event : "beneficiary " + c.name}` }] })));
  const [view, setView] = useState({ name: "list" });   // list | case | task(calc|profile) | new
  const [modal, setModal] = useState(null);              // claim | elig | docs | sanction
  const [checks, setChecks] = useState([]);
  const [claimRef, setClaimRef] = useState("");
  const [primaryDoc, setPrimaryDoc] = useState(false);
  const [flash, setFlash] = useState("");
  const [nf, setNf] = useState({});                      // new-case form values
  const [nfSub, setNfSub] = useState(null);              // new-case sub-type
  const [pan, setPan] = useState("");                    // PAN for EIS lookup
  const [fetchedKeys, setFetchedKeys] = useState([]);    // fields auto-filled from EIS
  const sel = view.id ? rows.find((c) => c.id === view.id) : null;
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2400); };
  const set = (id, step, extra = {}, hist = null) => setRows((rs) => rs.map((c) => {
    if (c.id !== id) return c;
    const history = hist ? [...(c.history || []), { date: "Today", actor: hist.actor || "You (HOO)", action: hist.action, remark: hist.remark || "" }] : (c.history || []);
    return { ...c, step, ...extra, history };
  }));
  const toggle = (k) => setChecks((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k]);
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));
  const openNew = () => { setNfSub(addConfig.subtypes[0]); setNf({}); setPan(""); setFetchedKeys([]); setView({ name: "new" }); };
  const panValid = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(pan.trim());
  const fetchEis = () => {
    const sub = nfSub || addConfig.subtypes[0];
    const data = addConfig.fetch(pan.trim().toUpperCase(), sub);
    setNf((s) => ({ ...s, ...data, pan: pan.trim().toUpperCase() }));
    setFetchedKeys(Object.keys(data));
    say(`Fetched ${Object.keys(data).length} field(s) from EIS for PAN ${pan.trim().toUpperCase()}.`);
  };
  const createCase = () => {
    const built = addConfig.build(nf, nfSub);
    const id = "N" + (rows.length + 1) + Date.now().toString().slice(-3);
    const c = { id, subtype: nfSub, step: 0, ppo: "", ...built, history: [{ date: "Today", actor: "You (HOO)", action: "Case registered", remark: `${nfSub} — new case${nf.pan ? " · PAN " + nf.pan : ""}` }] };
    setRows((rs) => [c, ...rs]);
    setView({ name: "case", id });
    say("Case registered — start the workflow at step 1.");
  };

  const stepsFor = (c) => [
    { key: "claim", label: claim.label, actor: "HOO" },
    { key: "elig", label: eligTitle(c), actor: "HOO" },
    { key: "docs", label: "Document verification", actor: "HOO" },
    { key: "calc", label: "Computation", actor: "HOO" },
    { key: "sanction", label: sanctionLabel, actor: "HOO" },
    { key: "ppo", label: "PPO issued", actor: "PAO" },
  ];
  const ACT = (c) => ({
    0: { kind: "modal", modal: "claim" },
    1: { kind: "modal", modal: "elig" },
    2: { kind: "modal", modal: "docs" },
    3: { kind: "page", task: "calc" },
    4: { kind: "modal", modal: "sanction" },
    5: { kind: "auto", actor: "PAO" },
  }[c.step]);

  // ---------- COMPUTATION TASK PAGE ----------
  if (view.name === "task" && sel && view.task === "calc") {
    const comp = computeFor(sel);
    const bene = beneficiaryFor(sel);
    const beneTitle = beneficiaryTitle ? beneficiaryTitle(sel) : "Beneficiary & bank details";
    const items = [
      { key: "comp", label: "Computation reviewed & correct", data: comp.rows.slice(0, 4) },
      { key: "bank", label: beneTitle.startsWith("Employee") ? "Employee bank details enclosed" : "Beneficiary bank details enclosed", data: bene },
      { key: "basis", label: "Rate / category / period correct", data: [["Basis", comp.note]] },
    ];
    const allDone = items.every((i) => checks.includes(i.key));
    return (
      <ModuleShell icon="calculator" title={computeTitle} desc={`${sel.name} · ${sel.subtype}`} onBack={() => setView({ name: "case", id: sel.id })}>
        <Breadcrumb items={[{ label: title, onClick: () => setView({ name: "list" }) }, { label: sel.name, onClick: () => setView({ name: "case", id: sel.id }) }, { label: "Computation" }]} />
        <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{computeTitle}</div>
          <div className="grid gap-x-8 sm:grid-cols-2">{comp.rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
          <p className="mt-3 rounded-lg bg-saffron/10 p-2.5 text-xs font-medium text-saffron">{comp.note}</p>
        </div>
        <SectionCard title={beneTitle} desc="The basis for the bank confirmation below." icon="userCheck">
          <div className="grid gap-x-8 sm:grid-cols-2">{bene.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
        </SectionCard>
        <SectionCard title="Confirm before forwarding" desc="Each item shows the figures or particulars it confirms — review, then confirm." icon="fileCheck">
          <EvidenceChecklist items={items} checked={checks} onToggle={toggle} />
          <Button variant="saffron" className="mt-4 w-full justify-center" disabled={!allDone} onClick={() => { set(sel.id, 4, {}, { action: "Computation confirmed", remark: comp.note }); setChecks([]); setView({ name: "case", id: sel.id }); say("Computation confirmed — ready to sanction."); }}>
            <Icon name="check" size={16} /> {allDone ? "Confirm computation" : "Confirm all items"}
          </Button>
        </SectionCard>
      </ModuleShell>
    );
  }

  // ---------- CASE PROFILE (nested; keeps case details out of the main view) ----------
  if (view.name === "task" && sel && view.task === "profile") {
    const isSelf = sel.relation.includes("Self");
    return (
      <ModuleShell icon="userCheck" title={`${sel.name} — case profile`} desc={sel.subtype} onBack={() => setView({ name: "case", id: sel.id })}>
        <Breadcrumb items={[{ label: title, onClick: () => setView({ name: "list" }) }, { label: sel.name, onClick: () => setView({ name: "case", id: sel.id }) }, { label: "Profile" }]} />
        <SectionCard title="Case details" icon="info">
          <div className="grid gap-x-8 sm:grid-cols-2">
            <InfoRow label={isSelf ? "Employee" : "Beneficiary"} value={`${sel.name} (${sel.relation})`} />
            {!isSelf && <InfoRow label="Deceased" value={`${sel.deceased} · ${sel.deceasedDesig}`} />}
            <InfoRow label="Sub-type" value={<StatusPill tone={subtypeTone(sel.subtype)}>{sel.subtype}</StatusPill>} />
            {sel.trigger && <InfoRow label="Trigger" value={sel.trigger} />}
            {sel.deceasedPpo && <InfoRow label="Deceased's PPO" value={sel.deceasedPpo} />}
            {sel.eopCategory && <InfoRow label="EOP category" value={`Category ${sel.eopCategory}${sel.disabilityPct ? ` · ${sel.disabilityPct}% disability` : ""}`} />}
            {isSelf && sel.event && <InfoRow label="Event" value={sel.event} />}
            <InfoRow label="Date of event" value={sel.dol} />
            <InfoRow label={isSelf ? "Last pay" : "Last pay of deceased"} value={"₹" + sel.lastPay.toLocaleString("en-IN")} />
            {sel.qualifyingYears ? <InfoRow label="Qualifying service" value={`${sel.qualifyingYears} years`} /> : null}
            {sel.age ? <InfoRow label="Age" value={`${sel.age} years`} /> : null}
            <InfoRow label="PPO" value={sel.ppo || "Pending"} />
          </div>
          <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
            <InfoRow label="Bank" value={sel.bank} />
            <InfoRow label="Account" value={sel.account} />
            <InfoRow label="IFSC" value={sel.ifsc} />
            <InfoRow label="Aadhaar" value={sel.aadhaar} />
          </div>
          <p className="mt-3 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">{sel.note}</p>
        </SectionCard>
      </ModuleShell>
    );
  }

  // ---------- CASE DETAIL ----------
  if (view.name === "case" && sel) {
    const steps = stepsFor(sel);
    const a = ACT(sel);
    const profileLabel = sel.relation.includes("Self") ? "employee" : "beneficiary";
    const openCurrent = () => {
      if (sel.step >= 6 || a.kind === "auto") return;
      setChecks([]);
      if (a.kind === "page") setView({ name: "task", id: sel.id, task: a.task });
      else { setPrimaryDoc(false); setClaimRef(""); setModal(a.modal); }
    };
    const renderAction = () => {
      if (sel.step >= 6) return <div className="rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">PPO {sel.ppo} issued · SSA to bank</div>;
      if (a.kind === "auto") return (
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 rounded-xl border border-saffron/30 bg-saffron/[0.06] p-3.5 text-sm">
            <Icon name="activity" size={16} className="mt-0.5 flex-shrink-0 text-saffron" />
            <span className="text-foreground">Awaiting <b>the PAO</b> — PPO issuance. This updates automatically once the PAO issues the PPO.</span>
          </div>
          <Button variant="outline" className="w-full justify-center border-dashed text-xs" onClick={() => { const ppo = newPPO(); set(sel.id, 6, { ppo }, { actor: "PAO", action: "PPO issued", remark: ppo }); say(`PPO ${ppo} issued (auto-update from PAO).`); }}>
            <Icon name="repeat" size={14} /> Demo: Simulate PAO PPO issue
          </Button>
        </div>
      );
      return <Button variant="saffron" className="w-full justify-center" onClick={openCurrent}><Icon name="arrowRight" size={16} /> {steps[sel.step].label}</Button>;
    };

    return (
      <ModuleShell icon={icon} title={sel.name} desc={`${sel.subtype} · ${sel.relation.includes("Self") ? sel.event : "beneficiary of " + sel.deceased}`} onBack={() => setView({ name: "list" })}>
        {flash && <SuccessNote title={flash}>The case record and its history have been updated.</SuccessNote>}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb items={[{ label: title, onClick: () => setView({ name: "list" }) }, { label: sel.name }]} />
          <Button variant="outline" className="px-4 py-2 text-xs" onClick={() => setView({ name: "task", id: sel.id, task: "profile" })}><Icon name="userCheck" size={14} /> View {profileLabel} profile</Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Processing" desc="Each step captures the required data; the PPO step updates from the PAO." icon="listChecks">
            <StepList steps={steps} current={sel.step} onOpen={openCurrent} />
            <div className="mt-4">{renderAction()}</div>
          </SectionCard>
          <SectionCard title="Case history" icon="activity"><HistoryTrail items={sel.history} /></SectionCard>
        </div>

        <Modal open={modal === "claim"} onClose={() => setModal(null)} maxW="max-w-md">
          <h3 className="text-lg font-extrabold text-foreground">{claim.label}</h3>
          <p className="text-sm text-muted-foreground">Record the intimation and the claim.</p>
          <div className="mt-4 space-y-4">
            <Field label="Claim / diary reference" required><Input value={claimRef} onChange={(e) => setClaimRef(e.target.value)} placeholder="e.g. FP/2026/0142" /></Field>
            <label className="flex items-center gap-2.5 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" checked={primaryDoc} onChange={(e) => setPrimaryDoc(e.target.checked)} className="h-4 w-4 accent-[#1B3A6B]" />
              <span className="text-foreground">{claim.doc} received & complete</span>
            </label>
          </div>
          <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!claimRef || !primaryDoc} onClick={() => { set(sel.id, 1, {}, { action: "Intimation & claim recorded", remark: `Ref ${claimRef} · ${claim.doc} received` }); setModal(null); say("Intimation recorded."); }}><Icon name="arrowRight" size={16} /> {claimRef && primaryDoc ? "Record claim" : "Complete the fields"}</Button>
        </Modal>

        {[["elig", eligTitle(sel), eligFor, 2, "Confirm eligibility"], ["docs", "Document verification", docsFor, 3, "Confirm documents"], ["sanction", sanctionLabel, sanctionFor, 5, "Sanction & forward"]].map(([key, heading, builder, next, cta]) => (
          <Modal key={key} open={modal === key} onClose={() => setModal(null)} maxW="max-w-2xl">
            <h3 className="text-lg font-extrabold text-foreground">{heading}</h3>
            <p className="text-sm text-muted-foreground">Review each item's particulars, then confirm.</p>
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1"><EvidenceChecklist items={builder(sel)} checked={checks} onToggle={toggle} /></div>
            <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!builder(sel).every((i) => checks.includes(i.key))} onClick={() => { set(sel.id, next, {}, { action: `${heading} confirmed`, remark: `${builder(sel).length} item(s) verified` }); setModal(null); setChecks([]); say(`${heading} confirmed.`); }}>
              <Icon name={key === "sanction" ? "arrowUpRight" : "check"} size={16} /> {cta}
            </Button>
          </Modal>
        ))}
      </ModuleShell>
    );
  }

  // ---------- REGISTER NEW CASE ----------
  if (view.name === "new" && addConfig) {
    const sub = nfSub || addConfig.subtypes[0];
    const fields = addConfig.fields(sub);
    const fetched = fetchedKeys.length > 0;
    const valid = fetched && fields.filter((f) => f.required).every((f) => String(nf[f.key] ?? "").trim() !== "");
    const eisBadge = <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-bold text-success align-middle"><Icon name="check" size={10} /> EIS</span>;
    return (
      <ModuleShell icon={icon} title={`Register — ${title}`} desc="Create a new case and start the workflow." onBack={() => setView({ name: "list" })}>
        <Breadcrumb items={[{ label: title, onClick: () => setView({ name: "list" }) }, { label: "Register new case" }]} />
        <SectionCard title="Case sub-type" desc="The sub-type sets the forms, eligibility and computation that follow." icon="listChecks">
          <RadioPills options={addConfig.subtypes} value={sub} onChange={(v) => { setNfSub(v); setNf({}); setFetchedKeys([]); }} />
          <p className="mt-2 text-xs text-muted-foreground">{addConfig.hint ? addConfig.hint(sub) : ""}</p>
        </SectionCard>

        <SectionCard title="Fetch from EIS" desc={`Enter the ${sub.includes("Disability") ? "employee's" : "employee / pensioner's"} PAN — the service record is fetched automatically from EIS.`} icon="badgeCheck">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <Field label="PAN" required hint="Format: ABCDE1234F"><Input value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCPV1234L" maxLength={10} /></Field>
            </div>
            <Button variant="primary" className="px-5 py-2.5" disabled={!panValid} onClick={fetchEis}><Icon name="download" size={15} /> {fetched ? "Re-fetch" : "Fetch details"}</Button>
          </div>
          {fetched
            ? <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-success/8 px-3 py-2 text-xs font-semibold text-success"><Icon name="check" size={13} /> {fetchedKeys.length} field(s) fetched from EIS for PAN {nf.pan}. Review them and enter the remaining details below.</p>
            : <p className="mt-3 text-xs text-muted-foreground">Authenticated via Parichay SSO. For the demo, any valid-format PAN returns a record; the seeded PANs ABCPV1234L / PQRSM5678N / LMNOP4321Q return specific records.</p>}
        </SectionCard>

        {fetched && (
          <SectionCard title="Case particulars" desc="Fields marked EIS were fetched automatically (editable if a correction is needed). Enter the rest." icon="fileText">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => {
                const isEis = fetchedKeys.includes(f.key);
                return (
                  <Field key={f.key} label={<span>{f.label}{isEis && eisBadge}</span>} required={f.required} hint={f.hint}>
                    {f.type === "select"
                      ? <Select options={f.options} value={nf[f.key] || ""} onChange={(e) => setN(f.key, e.target.value)} />
                      : <Input type={f.type === "number" ? "number" : "text"} value={nf[f.key] || ""} onChange={(e) => setN(f.key, e.target.value)} placeholder={f.placeholder || ""} className={isEis ? "border-success/40 bg-success/[0.03]" : ""} />}
                  </Field>
                );
              })}
            </div>
            <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!valid} onClick={createCase}>
              <Icon name="arrowRight" size={16} /> {valid ? "Create case & start workflow" : "Complete the required fields"}
            </Button>
          </SectionCard>
        )}
      </ModuleShell>
    );
  }

  // ---------- LIST ----------
  return (
    <ModuleShell icon={icon} title={title} desc={desc} onBack={onBack}
      action={addConfig && <Button variant="saffron" className="px-4 py-2.5" onClick={openNew}><Icon name="fileText" size={15} /> Register new case</Button>}>
      <p className="-mt-2 mb-3 text-sm text-muted-foreground">{rows.length} {rows.length === 1 ? "case" : "cases"}</p>
      <div className="space-y-3">
        {rows.map((c) => {
          const steps = stepsFor(c);
          return (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-primary/8 text-primary"><Icon name={icon} size={18} /></span>
                <div>
                  <div className="text-sm font-bold text-foreground">{c.name} <span className="font-normal text-muted-foreground">· {c.relation}</span></div>
                  <div className="text-xs text-muted-foreground">{c.relation.includes("Self") ? c.event : "Beneficiary of " + c.deceased} · {c.dol}</div>
                  <div className="mt-1.5"><StatusPill tone={subtypeTone(c.subtype)}>{c.subtype}</StatusPill> <span className="ml-1 text-xs text-muted-foreground">{c.ppo ? `PPO ${c.ppo}` : (steps[c.step] ? steps[c.step].label : "Completed")}</span></div>
                </div>
              </div>
              <Button variant="outline" className="px-4 py-2" onClick={() => { setChecks([]); setView({ name: "case", id: c.id }); }}>Process <Icon name="arrowRight" size={15} /></Button>
            </div>
          );
        })}
      </div>
    </ModuleShell>
  );
}
