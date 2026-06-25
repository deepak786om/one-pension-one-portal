import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, Field, Input, Select, SuccessNote, Modal } from "../../components/ui/kit.jsx";
import { USERS, ADMIN_ROLES } from "../../data/admin.js";

export default function UserMgmt({ onBack }) {
  const [rows, setRows] = useState(USERS.map((r) => ({ ...r })));
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [nf, setNf] = useState({ name: "", role: "HOO", office: "" });
  const [flash, setFlash] = useState("");
  const setN = (k, v) => setNf((s) => ({ ...s, [k]: v }));
  const list = rows.filter((r) => !q || (r.name + r.role + r.office).toLowerCase().includes(q.toLowerCase()));
  const add = () => {
    setRows((rs) => [{ id: "U" + (rs.length + 1), ...nf, status: "Active", last: "—" }, ...rs]);
    setAdding(false); setFlash(`${nf.name} provisioned as ${nf.role}.`); setNf({ name: "", role: "HOO", office: "" }); setTimeout(() => setFlash(""), 2400);
  };
  const toggle = (id) => setRows((rs) => rs.map((r) => r.id === id ? { ...r, status: r.status === "Active" ? "Suspended" : "Active" } : r));
  const cols = [
    { key: "name", label: "User", render: (r) => <span className="font-semibold text-foreground">{r.name}</span> },
    { key: "role", label: "Role", render: (r) => <span className="rounded-full bg-primary/8 px-2 py-0.5 text-xs font-semibold text-primary">{r.role}</span> },
    { key: "office", label: "Office" },
    { key: "last", label: "Last login" },
    { key: "status", label: "Status", render: (r) => <StatusPill tone={r.status === "Active" ? "ok" : "warn"}>{r.status}</StatusPill> },
    { key: "act", label: "", render: (r) => <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => toggle(r.id)}>{r.status === "Active" ? "Suspend" : "Activate"}</Button> },
  ];
  return (
    <ModuleShell icon="users" title="User & Role Management" desc="Provision officials, assign RBAC roles, and manage access across the portal." onBack={onBack}>
      {flash && <SuccessNote title={flash}>The user can now sign in via Parichay with their assigned role.</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Users" value={rows.length} icon="users" tone="primary" />
        <KPI label="Active" value={rows.filter((r) => r.status === "Active").length} icon="check" tone="success" />
        <KPI label="Suspended" value={rows.filter((r) => r.status === "Suspended").length} icon="info" tone="saffron" />
      </div>
      <SectionCard title="Users" icon="users" action={<Button variant="saffron" className="px-4 py-2 text-xs" onClick={() => setAdding(true)}><Icon name="users" size={14} /> Add user</Button>}>
        <div className="mb-3"><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, role or office…" /></div>
        <DataTable columns={cols} rows={list} empty="No matching users." />
      </SectionCard>
      <Modal open={adding} onClose={() => setAdding(false)} maxW="max-w-md">
        <h3 className="text-lg font-extrabold text-foreground">Provision user</h3>
        <div className="mt-4 grid gap-4">
          <Field label="Name" required><Input value={nf.name} onChange={(e) => setN("name", e.target.value)} /></Field>
          <Field label="Role (RBAC)" required><Select options={ADMIN_ROLES} value={nf.role} onChange={(e) => setN("role", e.target.value)} /></Field>
          <Field label="Office / mapping"><Input value={nf.office} onChange={(e) => setN("office", e.target.value)} /></Field>
        </div>
        <Button variant="saffron" className="mt-5 w-full justify-center" disabled={!nf.name} onClick={add}><Icon name="arrowRight" size={16} /> {nf.name ? "Provision" : "Enter a name"}</Button>
      </Modal>
    </ModuleShell>
  );
}
