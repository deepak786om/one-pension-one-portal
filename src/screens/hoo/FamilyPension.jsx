import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, StatusPill, StepList, EvidenceChecklist, InfoRow, SuccessNote, Breadcrumb, Modal, Field, Input } from "../../components/ui/kit.jsx";
import { FAMILY_CASES, newPPO, eligEvidence, docsEvidence, sanctionEvidence, beneficiaryRows } from "../../data/hoo.js";
import { formatINR } from "../../lib/pension.js";

const KIND_TONE = { "In-Service Death": "warn", "Death after retirement": "info", "EOP / EOFP": "ok" };
const START = { "In-Service Death": 2, "Death after retirement": 1, "EOP / EOFP": 1 };

const STEPS = (kind) => [
  { key: "claim", label: "Intimation & claim (Form 14)", actor: "HOO" },
  { key: "elig", label: kind === "EOP / EOFP" ? "Attributability & eligibility" : "Eligibility determination", actor: "HOO" },
  { key: "docs", label: "Document verification", actor: "HOO" },
  { key: "calc", label: "Computation", actor: "HOO" },
  { key: "sanction", label: "Sanction (Form 18) → PAO", actor: "HOO" },
  { key: "ppo", label: "PPO issued", actor: "PAO" },
];

function deathGratuityFactor(y) { if (y < 1) return 2; if (y < 5) return 6; if (y < 11) return 12; if (y < 20) return 20; return 33; }
function computeFP(c) {
  const normal = Math.round(c.lastPay * 0.3);
  const enhanced = Math.round(c.lastPay * 0.5);
  const dr = 50;
  const period = c.kind === "In-Service Death" ? "Enhanced rate for 10 years from the day after death" : c.kind === "Death after retirement" ? "Enhanced rate for 7 years or until age 67, whichever is earlier" : "As per the EOP category";
  const periodShort = c.kind === "In-Service Death" ? "10 years (enhanced)" : c.kind === "Death after retirement" ? "7 yrs / until age 67" : "Per EOP category";
  const gratuity = c.kind === "In-Service Death" ? Math.min(deathGratuityFactor(c.qualifyingYears) * c.lastPay, 2500000) : 0;
  return {
    normal, enhanced, dr, gratuity, period, periodShort,
    rows: [
      ["Last pay of the deceased", formatINR(c.lastPay)],
      ["Normal family pension (30%)", formatINR(normal)],
      ["Enhanced family pension (50%)", formatINR(enhanced)],
      ["Dearness Relief", dr + "%"],
      ["Monthly (enhanced + DR)", formatINR(enhanced + Math.round(enhanced * dr / 100))],
      ["Monthly (normal + DR)", formatINR(normal + Math.round(normal * dr / 100))],
      ...(gratuity ? [["Death gratuity", formatINR(gratuity)]] : []),
    ],
  };
}

export default function FamilyPension({ onBack }) {
  const [cases, setCases] = useState(FAMILY_CASES.map((c) => ({ ...c, step: START[c.kind] })));
  const [view, setView] = useState({ name: "list" });   // list | case | task(calc)
  const [modal, setModal] = useState(null);             // claim | elig | docs | sanction
  const [checks, setChecks] = useState([]);
  const [claimRef, setClaimRef] = useState("");
  const [form14, setForm14] = useState(false);
  const [flash, setFlash] = useState("");
  const sel = view.id ? cases.find((c) => c.id === view.id) : null;
  const say = (m) => { setFlash(m); setTimeout(() => setFlash(""), 2400); };
  const set = (id, step, extra = {}) => setCases((cs) => cs.map((c) => c.id === id ? { ...c, step, ...extra } : c));

  const ACT = (c) => ({
    0: { kind: "modal", modal: "claim", cta: "Record intimation & Form 14" },
    1: { kind: "modal", modal: "elig", cta: c.kind === "EOP / EOFP" ? "Examine attributability & eligibility" : "Determine eligibility" },
    2: { kind: "modal", modal: "docs", cta: "Verify documents" },
    3: { kind: "page", task: "calc", cta: "Compute family pension" },
    4: { kind: "modal", modal: "sanction", cta: "Sanction (Form 18) & forward to PAO" },
    5: { kind: "auto", actor: "PAO", cta: "PPO issuance by the PAO", sim: "Simulate PAO PPO issue" },
  }[c.step]);

  // ----- COMPUTATION TASK PAGE -----
  if (view.name === "task" && sel && view.task === "calc") {
    const fp = computeFP(sel);
    const bene = beneficiaryRows(sel);
    const items = [
      { key: "rate", label: "Rate & period correct",
        data: [["Normal rate", "30% = " + formatINR(fp.normal)], ["Enhanced rate", "50% = " + formatINR(fp.enhanced)], ["Enhanced period", fp.periodShort], ["Dearness Relief", fp.dr + "%"]] },
      { key: "bank", label: "Beneficiary bank details enclosed", data: bene },
      sel.kind === "In-Service Death"
        ? { key: "grat", label: "Death gratuity computed", data: [["Death gratuity", formatINR(fp.gratuity)], ["Qualifying service", `${sel.qualifyingYears} years`], ["Ceiling", "₹25,00,000"]], flag: "Within ceiling", flagTone: "ok" }
        : { key: "grat", label: "Arrears computed", data: [["Death gratuity", "N.A. (post-retirement)"], ["Arrears from", sel.dol], ["Computed to", "date of sanction"]] },
    ];
    const allDone = items.every((i) => checks.includes(i.key));
    return (
      <ModuleShell icon="calculator" title="Family pension computation" desc={`${sel.name} · ${sel.kind}`} onBack={() => setView({ name: "case", id: sel.id })}>
        <Breadcrumb items={[{ label: "Family Pension & EOP", onClick: () => setView({ name: "list" }) }, { label: sel.name, onClick: () => setView({ name: "case", id: sel.id }) }, { label: "Computation" }]} />
        <div className="rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
          <div className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Family pension — computation</div>
          <div className="grid gap-x-8 sm:grid-cols-2">{fp.rows.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
          <p className="mt-3 rounded-lg bg-saffron/10 p-2.5 text-xs font-medium text-saffron">{fp.period}</p>
        </div>
        <SectionCard title="Beneficiary & bank details" desc="Pulled from the verified claim — the basis for the bank confirmation below." icon="userCheck">
          <div className="grid gap-x-8 sm:grid-cols-2">{bene.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
        </SectionCard>
        <SectionCard title="Confirm before forwarding" desc="Each item shows the figures or particulars it is confirming — review, then confirm." icon="fileCheck">
          <EvidenceChecklist items={items} checked={checks} onToggle={(k) => setChecks((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k])} />
          <Button variant="saffron" className="mt-4 w-full justify-center" disabled={!allDone} onClick={() => { set(sel.id, 4); setChecks([]); setView({ name: "case", id: sel.id }); say("Computation confirmed — ready to sanction."); }}>
            <Icon name="check" size={16} /> {allDone ? "Confirm computation" : "Confirm all items"}
          </Button>
        </SectionCard>
      </ModuleShell>
    );
  }

  // ----- CASE DETAIL -----
  if (view.name === "case" && sel) {
    const steps = STEPS(sel.kind);
    const a = ACT(sel);
    const openCurrent = () => {
      if (sel.step >= 6 || a.kind === "auto") return;
      setChecks([]);
      if (a.kind === "page") setView({ name: "task", id: sel.id, task: a.task });
      else { setForm14(false); setClaimRef(""); setModal(a.modal); }
    };
    const renderAction = () => {
      if (sel.step >= 6) return <div className="rounded-xl bg-success/10 p-3 text-center text-sm font-semibold text-success">PPO {sel.ppo} issued · SSA to bank</div>;
      if (a.kind === "auto") {
        return (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5 rounded-xl border border-saffron/30 bg-saffron/[0.06] p-3.5 text-sm">
              <Icon name="activity" size={16} className="mt-0.5 flex-shrink-0 text-saffron" />
              <span className="text-foreground">Awaiting <b>the PAO</b> — {a.cta}. This updates automatically once the PAO issues the family-pension PPO.</span>
            </div>
            <Button variant="outline" className="w-full justify-center border-dashed text-xs" onClick={() => { const ppo = newPPO(); set(sel.id, 6, { ppo }); say(`Family-pension PPO ${ppo} issued (auto-update from PAO).`); }}>
              <Icon name="repeat" size={14} /> Demo: {a.sim}
            </Button>
          </div>
        );
      }
      return <Button variant="saffron" className="w-full justify-center" onClick={openCurrent}><Icon name="arrowRight" size={16} /> {a.cta}</Button>;
    };

    return (
      <ModuleShell icon="heartHandshake" title={sel.name} desc={`${sel.kind} · beneficiary of ${sel.deceased}`} onBack={() => setView({ name: "list" })}>
        {flash && <SuccessNote title={flash}>The case record has been updated.</SuccessNote>}
        <Breadcrumb items={[{ label: "Family Pension & EOP", onClick: () => setView({ name: "list" }) }, { label: sel.name }]} />
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Case details" icon="info">
            <InfoRow label="Beneficiary" value={`${sel.name} (${sel.relation})`} />
            <InfoRow label="Deceased" value={`${sel.deceased} · ${sel.deceasedDesig}`} />
            <InfoRow label="Type" value={<StatusPill tone={KIND_TONE[sel.kind]}>{sel.kind}</StatusPill>} />
            <InfoRow label="Date of event" value={sel.dol} />
            <InfoRow label="Last pay of deceased" value={formatINR(sel.lastPay)} />
            <InfoRow label="PPO" value={sel.ppo || "Pending"} />
            <p className="mt-3 rounded-xl bg-muted/30 p-3 text-xs text-muted-foreground">{sel.note}</p>
          </SectionCard>
          <SectionCard title="Processing" desc="Each step captures the required data; the PPO step updates from the PAO." icon="listChecks">
            <StepList steps={steps} current={sel.step} onOpen={openCurrent} />
            <div className="mt-4">{renderAction()}</div>
          </SectionCard>
        </div>

        <Modal open={modal === "claim"} onClose={() => setModal(null)} maxW="max-w-md">
          <h3 className="text-lg font-extrabold text-foreground">Intimation & claim</h3>
          <p className="text-sm text-muted-foreground">Record the death intimation and the family-pension claim.</p>
          <div className="mt-4 space-y-4">
            <Field label="Claim / diary reference" required><Input value={claimRef} onChange={(e) => setClaimRef(e.target.value)} placeholder="e.g. FP/2026/0142" /></Field>
            <label className="flex items-center gap-2.5 rounded-xl border border-border p-3 text-sm">
              <input type="checkbox" checked={form14} onChange={(e) => setForm14(e.target.checked)} className="h-4 w-4 accent-[#1B3A6B]" />
              <span className="text-foreground">Form 14 (application for family pension) received & complete</span>
            </label>
          </div>
          <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!claimRef || !form14} onClick={() => { set(sel.id, 1); setModal(null); say("Intimation recorded."); }}><Icon name="arrowRight" size={16} /> {claimRef && form14 ? "Record claim" : "Complete the fields"}</Button>
        </Modal>

        <Modal open={modal === "elig"} onClose={() => setModal(null)} maxW="max-w-2xl">
          <h3 className="text-lg font-extrabold text-foreground">{sel.kind === "EOP / EOFP" ? "Attributability & eligibility" : "Eligibility determination"}</h3>
          <p className="text-sm text-muted-foreground">Review the particulars against each condition under the CCS (Pension) Rules, then confirm.</p>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1"><EvidenceChecklist items={eligEvidence(sel)} checked={checks} onToggle={(k) => setChecks((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k])} /></div>
          <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!eligEvidence(sel).every((i) => checks.includes(i.key))} onClick={() => { set(sel.id, 2); setModal(null); setChecks([]); say("Eligibility confirmed."); }}><Icon name="check" size={16} /> Confirm eligibility</Button>
        </Modal>

        <Modal open={modal === "docs"} onClose={() => setModal(null)} maxW="max-w-2xl">
          <h3 className="text-lg font-extrabold text-foreground">Document verification</h3>
          <p className="text-sm text-muted-foreground">Review each document's details on record, then confirm.</p>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1"><EvidenceChecklist items={docsEvidence(sel)} checked={checks} onToggle={(k) => setChecks((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k])} /></div>
          <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!docsEvidence(sel).every((i) => checks.includes(i.key))} onClick={() => { set(sel.id, 3); setModal(null); setChecks([]); say("Documents verified."); }}><Icon name="check" size={16} /> Confirm documents</Button>
        </Modal>

        <Modal open={modal === "sanction"} onClose={() => setModal(null)} maxW="max-w-xl">
          <h3 className="text-lg font-extrabold text-foreground">Sanction (Form 18)</h3>
          <p className="text-sm text-muted-foreground">Confirm the sanction particulars and forward Form 18 to the PAO.</p>
          <div className="mt-4"><EvidenceChecklist items={sanctionEvidence(sel)} checked={checks} onToggle={(k) => setChecks((c) => c.includes(k) ? c.filter((x) => x !== k) : [...c, k])} /></div>
          <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!sanctionEvidence(sel).every((i) => checks.includes(i.key))} onClick={() => { set(sel.id, 5); setModal(null); setChecks([]); say("Sanctioned & forwarded to PAO."); }}><Icon name="arrowUpRight" size={16} /> Sanction & forward</Button>
        </Modal>
      </ModuleShell>
    );
  }

  // ----- LIST -----
  return (
    <ModuleShell icon="heartHandshake" title="Family Pension & EOP" desc="Process family pension on death-in-service, death after retirement, and extraordinary pension." onBack={onBack}>
      <div className="space-y-3">
        {cases.map((c) => {
          const steps = STEPS(c.kind);
          return (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl2 border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elegant">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl bg-primary/8 text-primary"><Icon name="heartHandshake" size={18} /></span>
                <div>
                  <div className="text-sm font-bold text-foreground">{c.name} <span className="font-normal text-muted-foreground">· {c.relation}</span></div>
                  <div className="text-xs text-muted-foreground">Beneficiary of {c.deceased} · event {c.dol}</div>
                  <div className="mt-1.5"><StatusPill tone={KIND_TONE[c.kind]}>{c.kind}</StatusPill> <span className="ml-1 text-xs text-muted-foreground">{c.ppo ? `PPO ${c.ppo}` : (steps[c.step] ? steps[c.step].label : "Completed")}</span></div>
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
