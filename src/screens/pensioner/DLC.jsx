import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, SuccessNote, InfoRow } from "../../components/ui/kit.jsx";
import { DLC_METHODS, DLC_HISTORY, DLC_STATUS, PENSIONER, newPramaanId } from "../../data/pensioner.js";

const CAMPS = [
  { place: "SBI Connaught Place, New Delhi", date: "28 Jun 2026", slots: "9:00 AM – 4:00 PM" },
  { place: "CSC Lajpat Nagar, New Delhi", date: "30 Jun 2026", slots: "10:00 AM – 5:00 PM" },
  { place: "India Post GPO, New Delhi", date: "02 Jul 2026", slots: "9:30 AM – 3:30 PM" },
];

export default function DLC({ onBack }) {
  const [method, setMethod] = useState(null); // method key
  const [step, setStep] = useState(0); // 0 consent, 1 capturing, 2 done
  const [consent, setConsent] = useState(false);
  const [pramaanId, setPramaanId] = useState(null);
  const [history, setHistory] = useState(DLC_HISTORY);

  const m = DLC_METHODS.find((x) => x.key === method);
  const isCamp = method === "camp";

  const reset = () => { setMethod(null); setStep(0); setConsent(false); setPramaanId(null); };

  const authenticate = () => {
    setStep(1);
    setTimeout(() => {
      const id = newPramaanId();
      setPramaanId(id);
      setHistory((h) => [{ year: "2026", date: "Today", mode: m.title, id, status: "Submitted" }, ...h]);
      setStep(2);
    }, 1400);
  };

  const cols = [
    { key: "year", label: "Year" },
    { key: "date", label: "Date" },
    { key: "mode", label: "Mode" },
    { key: "id", label: "Pramaan ID", render: (r) => <span className="font-mono text-xs">{r.id}</span> },
    { key: "status", label: "Status", render: (r) => <StatusPill>{r.status}</StatusPill> },
  ];

  return (
    <ModuleShell icon="fingerprint" title="Digital Life Certificate" desc="Submit your annual Jeevan Pramaan so your pension continues without a branch visit." onBack={onBack}>
      <div className="grid gap-4 sm:grid-cols-3">
        <KPI label="Current status" value={<StatusPill>{DLC_STATUS.current}</StatusPill>} sub="For 2025" icon="check" tone="success" />
        <KPI label="Valid till" value={DLC_STATUS.validTill} icon="badgeCheck" tone="primary" />
        <KPI label="Next due" value={DLC_STATUS.nextDue} sub="Submit any time from October" icon="info" tone="saffron" />
      </div>

      {!method && (
        <SectionCard title="How would you like to submit?" desc="Pick a method — all generate a verified Jeevan Pramaan ID shared with your bank." icon="fingerprint">
          <div className="grid gap-3 sm:grid-cols-2">
            {DLC_METHODS.map((x) => (
              <motion.button
                key={x.key}
                onClick={() => setMethod(x.key)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center gap-3.5 rounded-xl2 border border-border bg-white p-4 text-left shadow-card transition-shadow hover:border-primary/40 hover:shadow-elegant"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-saffron group-hover:text-saffron-foreground">
                  <Icon name={x.icon} size={20} />
                </span>
                <span>
                  <span className="block text-sm font-bold text-foreground">{x.title}</span>
                  <span className="block text-xs text-muted-foreground">{x.sub}</span>
                </span>
                <Icon name="chevronRight" size={18} className="ml-auto text-muted-foreground opacity-40 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </motion.button>
            ))}
          </div>
        </SectionCard>
      )}

      {/* CAMP finder */}
      {isCamp && (
        <SectionCard title="Nearby DLC camps" desc="Walk in with your Aadhaar — an operator submits your DLC on the spot." icon="mapPin"
          action={<Button variant="outline" className="px-3 py-2" onClick={reset}>Change method</Button>}>
          <div className="space-y-2.5">
            {CAMPS.map((c) => (
              <div key={c.place} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-2.5">
                  <Icon name="mapPin" size={16} className="text-primary" />
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.place}</div>
                    <div className="text-xs text-muted-foreground">{c.date} · {c.slots}</div>
                  </div>
                </div>
                <StatusPill tone="info">Open</StatusPill>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* biometric flow */}
      {m && !isCamp && (
        <SectionCard title={m.title} desc={m.sub} icon={m.icon}
          action={step === 0 ? <Button variant="outline" className="px-3 py-2" onClick={reset}>Change method</Button> : null}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="consent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <InfoRow label="Pensioner" value={PENSIONER.name} />
                  <InfoRow label="PPO Number" value={PENSIONER.ppo} />
                  <InfoRow label="Aadhaar" value={PENSIONER.aadhaarMasked} />
                  <InfoRow label="Disbursing bank" value={PENSIONER.bank.name} />
                </div>
                <label className="mt-4 flex items-start gap-2.5 text-sm text-foreground">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B3A6B]" />
                  <span>I consent to use my Aadhaar for biometric authentication to generate a Digital Life Certificate (Jeevan Pramaan).</span>
                </label>
                <Button variant="saffron" disabled={!consent} onClick={authenticate} className="mt-4">
                  <Icon name="fingerprint" size={16} /> {consent ? `Authenticate with ${m.title}` : "Give consent to continue"}
                </Button>
              </motion.div>
            )}
            {step === 1 && (
              <motion.div key="capturing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary animate-pulseRing"><Icon name="fingerprint" size={30} /></span>
                <p className="mt-4 text-sm font-medium text-muted-foreground">Authenticating with UIDAI…</p>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <SuccessNote title="Digital Life Certificate generated">
                  Your Jeevan Pramaan ID <b className="font-mono text-foreground">{pramaanId}</b> is created and shared with {PENSIONER.bank.name}. Your pension continues uninterrupted.
                </SuccessNote>
                <Button variant="outline" onClick={reset}><Icon name="chevronLeft" size={16} /> Done</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionCard>
      )}

      <SectionCard title="DLC history" desc="Your previous life certificates." icon="listChecks">
        <DataTable columns={cols} rows={history} />
      </SectionCard>
    </ModuleShell>
  );
}
