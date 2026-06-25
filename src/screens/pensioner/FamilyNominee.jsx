import { useState } from "react";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Field, Input, Select, DataTable, StatusPill, SuccessNote } from "../../components/ui/kit.jsx";
import { NOMINEES } from "../../data/pensioner.js";

const RELATIONS = ["Spouse", "Son", "Daughter", "Father", "Mother", "Disabled child", "Other dependent"];
const TYPES = ["Family Pension", "Contingent", "Gratuity nominee"];

export default function FamilyNominee({ onBack }) {
  const [list, setList] = useState(NOMINEES);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "", type: "Family Pension", share: "", dob: "" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const totalShare = list.filter((n) => n.type === "Family Pension").reduce((a, n) => a + Number(n.share || 0), 0);
  const newShare = Number(form.share || 0);
  const overflow = form.type === "Family Pension" && totalShare + newShare > 100;
  const valid = form.name.trim().length > 2 && form.relation && form.type && form.dob && !overflow;

  const add = () => {
    setList((l) => [...l, { ...form, share: Number(form.share || 0), id: "n" + (l.length + 1) }]);
    setForm({ name: "", relation: "", type: "Family Pension", share: "", dob: "" });
    setAdding(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  const cols = [
    { key: "name", label: "Name", render: (r) => <span className="font-semibold">{r.name}</span> },
    { key: "relation", label: "Relation" },
    { key: "type", label: "Type", render: (r) => <StatusPill tone="info">{r.type}</StatusPill> },
    { key: "share", label: "Share %", render: (r) => (r.type === "Family Pension" ? r.share + "%" : "—") },
    { key: "dob", label: "Date of birth" },
  ];

  return (
    <ModuleShell icon="heartHandshake" title="Family & Nominee" desc="Maintain your family pension beneficiaries and gratuity nominees." onBack={onBack}>
      {saved && <SuccessNote title="Beneficiary saved">Your nominee details have been updated and sent for record.</SuccessNote>}

      <SectionCard title="Your beneficiaries" desc={`Family-pension share allotted: ${totalShare}% of 100%`} icon="users"
        action={!adding && <Button variant="ghost" className="px-3 py-2" onClick={() => setAdding(true)}><Icon name="userCheck" size={15} /> Add</Button>}>
        <DataTable columns={cols} rows={list} empty="No beneficiaries on record." />
      </SectionCard>

      {adding && (
        <SectionCard title="Add a beneficiary" icon="userCheck">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Name as per Aadhaar" /></Field>
            <Field label="Relation" required><Select options={RELATIONS} value={form.relation} onChange={(e) => set("relation", e.target.value)} /></Field>
            <Field label="Type" required><Select options={TYPES} value={form.type} onChange={(e) => set("type", e.target.value)} placeholder="Select type" /></Field>
            <Field label="Date of birth" required><Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} /></Field>
            {form.type === "Family Pension" && (
              <Field label="Family-pension share %" required error={overflow ? `Exceeds 100% (only ${100 - totalShare}% left)` : ""}>
                <Input type="number" value={form.share} onChange={(e) => set("share", e.target.value)} placeholder={`Up to ${100 - totalShare}`} />
              </Field>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button variant="saffron" disabled={!valid} onClick={add}>
              <Icon name="check" size={16} /> {valid ? "Save beneficiary" : overflow ? "Share exceeds 100%" : "Fill the required fields"}
            </Button>
            <Button variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </SectionCard>
      )}
    </ModuleShell>
  );
}
