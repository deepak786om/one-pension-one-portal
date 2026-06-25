import { useState } from "react";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Input, SuccessNote } from "../../components/ui/kit.jsx";
import { cn } from "../../lib/cn.js";
import { MASTERS } from "../../data/admin.js";

export default function Masters({ onBack }) {
  const tabs = Object.keys(MASTERS);
  const [tab, setTab] = useState(tabs[0]);
  const [data, setData] = useState(MASTERS);
  const [val, setVal] = useState("");
  const [flash, setFlash] = useState("");
  const add = () => {
    if (!val.trim()) return;
    setData((d) => ({ ...d, [tab]: [val.trim(), ...d[tab]] }));
    setFlash(`Added "${val.trim()}" to ${tab}.`); setVal(""); setTimeout(() => setFlash(""), 2200);
  };
  const remove = (item) => setData((d) => ({ ...d, [tab]: d[tab].filter((x) => x !== item) }));
  return (
    <ModuleShell icon="database" title="Master Data" desc="Maintain the reference lists that drive the portal — ministries, banks, categories and offices." onBack={onBack}>
      {flash && <SuccessNote title="Updated">{flash}</SuccessNote>}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn("rounded-xl border px-4 py-2 text-sm font-semibold transition-colors", tab === t ? "border-primary bg-primary/8 text-primary" : "border-border bg-white text-muted-foreground hover:border-primary/40")}>
            {t} <span className="ml-1 text-xs opacity-70">{data[t].length}</span>
          </button>
        ))}
      </div>
      <SectionCard title={tab} desc="Add or remove entries." icon="database">
        <div className="mb-3 flex gap-2">
          <Input value={val} onChange={(e) => setVal(e.target.value)} placeholder={`New ${tab.replace(/s$/, "").toLowerCase()}…`} />
          <Button variant="saffron" className="px-4 py-2.5" disabled={!val.trim()} onClick={add}><Icon name="arrowRight" size={16} /> Add</Button>
        </div>
        <div className="space-y-1.5">
          {data[tab].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{item}</span>
              <button onClick={() => remove(item)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Icon name="x" size={14} /></button>
            </div>
          ))}
        </div>
      </SectionCard>
    </ModuleShell>
  );
}
