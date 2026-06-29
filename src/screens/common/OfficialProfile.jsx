import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, InfoRow } from "../../components/ui/kit.jsx";
import { getRole, MODULES } from "../../data/rbac.js";
import { roleProfile } from "../registry.js";
import { getAiDefaultOpen, setAiDefaultOpen } from "../../lib/prefs.js";

export default function OfficialProfile({ roleId, onBack }) {
  const p = roleProfile(roleId);
  const role = getRole(roleId);
  const [aiPref, setAiPref] = useState(getAiDefaultOpen());
  if (!p) return null;
  const initials = p.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <ModuleShell icon="userCheck" title="My Profile" desc="Your official details and the services authorised for your role." onBack={onBack}>
      <SectionCard>
        <div className="flex flex-wrap items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-2xl font-black text-white shadow-soft">{initials}</div>
          <div>
            <div className="text-xl font-black text-foreground">{p.name}</div>
            <div className="text-sm text-muted-foreground">{p.designation}</div>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-saffron/12 px-3 py-1 text-xs font-bold text-saffron"><Icon name="shieldCheck" size={13} /> {role.label}</span>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Identity" icon="badgeCheck">{p.identity.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</SectionCard>
        <SectionCard title="Posting & jurisdiction" icon="building">{p.posting.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</SectionCard>
      </div>

      <SectionCard title="Contact & sign-in" desc="Government-issued contact and Parichay single sign-on." icon="info">
        <div className="grid gap-x-8 sm:grid-cols-2">{p.contact.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}</div>
      </SectionCard>

      <SectionCard title="Preferences" desc="Personalise how the portal assists you." icon="sparkles">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Icon name="sparkles" size={17} /></span>
            <div>
              <div className="text-sm font-bold text-foreground">Keep AI Suggestion ON</div>
              <div className="text-xs text-muted-foreground">When on, the AI overview opens by default whenever you open a case. When off, open it from the “AI Summary” button.</div>
            </div>
          </div>
          <button
            role="switch" aria-checked={aiPref} aria-label="Keep AI Suggestion ON"
            onClick={() => { const next = !aiPref; setAiDefaultOpen(next); setAiPref(next); }}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${aiPref ? "bg-emerald-500" : "bg-slate-300"}`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${aiPref ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Authorised services" desc={`RBAC — ${role.modules.length} service${role.modules.length > 1 ? "s" : ""} are enabled for the ${role.label} role.`} icon="shieldCheck">
        <div className="grid gap-3 sm:grid-cols-2">
          {role.modules.map((m) => {
            const mo = MODULES[m] || { label: m, icon: "badgeCheck", desc: "" };
            return (
              <div key={m} className="flex items-start gap-3 rounded-xl border border-border p-3.5">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-muted text-primary"><Icon name={mo.icon} size={17} /></span>
                <div><div className="text-sm font-bold text-foreground">{mo.label}</div><div className="text-xs text-muted-foreground">{mo.desc}</div></div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
