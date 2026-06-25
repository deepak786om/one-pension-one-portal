import { useState } from "react";
import { motion } from "framer-motion";
import ModuleShell from "../pensioner/ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, Select, Field, SuccessNote, Modal, InfoRow } from "../../components/ui/kit.jsx";
import { RETIREES } from "../../data/hoo.js";

const UTILS = [
  { key: "eppo", title: "Download ePPO / eSSA", sub: "Pull the electronic PPO and Special Seal Authority for an issued case.", icon: "fileText" },
  { key: "idcard", title: "Pensioner Identity Card", sub: "Generate the pensioner identity card for a retiree.", icon: "badgeCheck" },
  { key: "undertaking", title: "Update Undertaking", sub: "Record the pensioner's undertaking for excess-payment recovery.", icon: "fileCheck" },
  { key: "manual", title: "Recovery Head / Manual PPO", sub: "Capture recovery heads or issue a manual PPO where required.", icon: "database" },
];

export default function HooUtilities({ onBack }) {
  const [active, setActive] = useState(null);
  const [caseName, setCaseName] = useState("");
  const [flash, setFlash] = useState("");
  const issued = RETIREES.filter((r) => r.ppo);

  const run = () => {
    const u = UTILS.find((x) => x.key === active);
    setActive(null);
    setFlash(`${u.title}: generated for ${caseName || "selected case"} (demo).`);
    setCaseName(""); setTimeout(() => setFlash(""), 2600);
  };

  return (
    <ModuleShell icon="database" title="Utilities" desc="Day-to-day office utilities for issued and in-progress pension cases." onBack={onBack}>
      {flash && <SuccessNote title="Done">{flash}</SuccessNote>}
      <div className="grid gap-4 sm:grid-cols-2">
        {UTILS.map((u) => (
          <motion.button key={u.key} onClick={() => setActive(u.key)} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            className="card-shimmer flex items-start gap-3.5 rounded-xl2 border border-border bg-card p-5 text-left shadow-card transition-shadow hover:border-primary/40 hover:shadow-elegant">
            <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-primary/8 text-primary"><Icon name={u.icon} size={20} /></span>
            <div>
              <div className="text-sm font-bold text-foreground">{u.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{u.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} maxW="max-w-md">
        {active && (
          <div>
            <h3 className="text-lg font-extrabold text-foreground">{UTILS.find((u) => u.key === active).title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{UTILS.find((u) => u.key === active).sub}</p>
            <div className="mt-4">
              <Field label={active === "eppo" ? "Select an issued case" : "Select a retiree"} required>
                <Select
                  options={(active === "eppo" ? issued : RETIREES).map((r) => `${r.name} · ${r.ppo || r.pan}`)}
                  value={caseName} onChange={(e) => setCaseName(e.target.value)} />
              </Field>
            </div>
            <Button variant="saffron" className="mt-4 w-full justify-center" disabled={!caseName} onClick={run}>
              <Icon name="arrowRight" size={16} /> {caseName ? "Generate" : "Pick a case"}
            </Button>
          </div>
        )}
      </Modal>
    </ModuleShell>
  );
}
