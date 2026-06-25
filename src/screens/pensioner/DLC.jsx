import { useState } from "react";
import { motion } from "framer-motion";
import ModuleShell from "./ModuleShell.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../lib/icons.jsx";
import { SectionCard, DataTable, StatusPill, KPI, SuccessNote, Modal, Input } from "../../components/ui/kit.jsx";
import { DLC_METHODS, DLC_HISTORY, DLC_STATUS, DLC_CAMPS, PENSIONER, newPramaanId } from "../../data/pensioner.js";

function AppLogo({ size = 44 }) {
  return (
    <span className="grid place-items-center rounded-2xl bg-gradient-to-br from-primary to-saffron text-white shadow-soft" style={{ width: size, height: size }}>
      <Icon name="landmark" size={size * 0.5} />
    </span>
  );
}

export default function DLC({ onBack }) {
  const [appFor, setAppFor] = useState(null);   // biometric method -> app popup
  const [success, setSuccess] = useState(null); // pramaan id after submit
  const [history, setHistory] = useState(DLC_HISTORY);
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [city, setCity] = useState("");
  const [pin, setPin] = useState("");

  const launchApp = () => {
    const m = appFor;
    setAppFor(null);
    // simulate the One Pension app completing biometric auth
    const id = newPramaanId();
    setHistory((h) => [{ year: "2026", date: "Today", mode: m.title, id, status: "Submitted" }, ...h]);
    setSuccess(id);
  };

  const camps = [...DLC_CAMPS].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 5);
  const useGPS = () => { setLocating(true); setTimeout(() => { setLocating(false); setLocated(true); }, 1200); };
  const findByInput = () => setLocated(true);

  const cols = [
    { key: "year", label: "Year" }, { key: "date", label: "Date" }, { key: "mode", label: "Mode" },
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

      {success && (
        <SuccessNote title="Digital Life Certificate generated">
          Your Jeevan Pramaan ID <b className="font-mono text-foreground">{success}</b> is created and shared with {PENSIONER.bank.name}. Your pension continues uninterrupted.
        </SuccessNote>
      )}

      <SectionCard title="Submit from the One Pension app" desc="Pick a biometric method — it opens the One Pension app to authenticate." icon="fingerprint">
        <div className="grid gap-3 sm:grid-cols-3">
          {DLC_METHODS.map((x) => (
            <motion.button key={x.key} onClick={() => setAppFor(x)} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              className="card-shimmer group flex flex-col items-start gap-2 rounded-xl2 border border-border bg-white p-4 text-left shadow-card transition-shadow hover:border-primary/40 hover:shadow-elegant">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-primary transition-colors group-hover:bg-saffron group-hover:text-saffron-foreground"><Icon name={x.icon} size={20} /></span>
              <span className="text-sm font-bold text-foreground">{x.title}</span>
              <span className="text-xs text-muted-foreground">{x.sub}</span>
            </motion.button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Locate DLC Camp near me" desc="Walk in with your Aadhaar — an operator submits your DLC on the spot." icon="mapPin">
        <div className="grid gap-3 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
          <Button variant="outline" onClick={useGPS} className="px-4 py-2.5">
            <Icon name="mapPin" size={16} /> {locating ? "Locating…" : "Use my location"}
          </Button>
          <div><label className="mb-1 block text-xs font-semibold text-foreground">City</label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. New Delhi" /></div>
          <div><label className="mb-1 block text-xs font-semibold text-foreground">PIN code</label><Input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="e.g. 110078" /></div>
          <Button variant="saffron" onClick={findByInput} className="px-4 py-2.5"><Icon name="arrowRight" size={16} /> Find camps</Button>
        </div>

        {located && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Top 5 nearest camps {city || pin ? `· ${city || pin}` : "· near you"}</div>
            {camps.map((c) => (
              <div key={c.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3.5 hover:border-primary/30">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-primary/8 text-primary"><Icon name="mapPin" size={15} /></span>
                  <div>
                    <div className="text-sm font-bold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.address}</div>
                    <div className="mt-0.5 text-xs font-medium text-primary"><Icon name="phone" size={11} className="mr-1 inline" />{c.contact}</div>
                  </div>
                </div>
                <span className="rounded-full bg-saffron/15 px-2.5 py-1 text-xs font-bold text-saffron">{c.distanceKm} km</span>
              </div>
            ))}
          </motion.div>
        )}
      </SectionCard>

      <SectionCard title="DLC history" desc="Your previous life certificates." icon="listChecks">
        <DataTable columns={cols} rows={history} />
      </SectionCard>

      {/* One Pension app popup */}
      <Modal open={!!appFor} onClose={() => setAppFor(null)}>
        <div className="flex flex-col items-center text-center">
          <AppLogo />
          <h3 className="mt-3 text-lg font-extrabold text-foreground">Open the One Pension app</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            We'll launch the <b className="text-foreground">One Pension</b> app to complete <b className="text-foreground">{appFor?.title}</b> for your Digital Life Certificate.
          </p>
          <div className="mt-4 w-full rounded-xl bg-muted/40 p-3 text-left text-xs text-muted-foreground">
            <Icon name="info" size={13} className="mr-1 inline text-primary" />
            Keep your Aadhaar-linked mobile handy. The app uses UIDAI authentication; nothing is stored on this device.
          </div>
          <Button variant="saffron" className="mt-4 w-full justify-center" onClick={launchApp}>
            <Icon name="fingerprint" size={16} /> Open One Pension App
          </Button>
          <button onClick={() => setAppFor(null)} className="mt-2 text-xs font-medium text-muted-foreground hover:text-foreground">Not now</button>
        </div>
      </Modal>
    </ModuleShell>
  );
}
