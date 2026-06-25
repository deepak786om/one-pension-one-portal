import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "../components/ui/Button.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { getRole, MODULES } from "../data/rbac.js";
import { KPI, StatusPill } from "../components/ui/kit.jsx";
import { getPensionerModule } from "./pensioner/index.jsx";
import { PENSIONER, PAYMENTS, GRIEVANCES, DLC_STATUS, FORM6A } from "../data/pensioner.js";
import { formatINR } from "../lib/pension.js";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Dashboard({ roleId, onLogout }) {
  const role = getRole(roleId);
  const isPensioner = role.id === "PENSIONER";
  const [active, setActive] = useState(null);
  const [toast, setToast] = useState("");
  const [ppoGenerated, setPpoGenerated] = useState(PENSIONER.ppoGenerated);

  const openTile = (key) => {
    if (isPensioner && getPensionerModule(key)) { setActive(key); return; }
    const label = (MODULES[key] || {}).label || key;
    setToast(label + " — module coming soon");
    window.clearTimeout(openTile._t);
    openTile._t = window.setTimeout(() => setToast(""), 1900);
  };

  const ActiveModule = isPensioner && active ? getPensionerModule(active) : null;
  if (ActiveModule) {
    return (
      <AnimatePresence mode="wait">
        <ActiveModule key={active} onBack={() => setActive(null)} onSubmitted={() => { setPpoGenerated(true); setActive(null); }} />
      </AnimatePresence>
    );
  }

  const openGriev = GRIEVANCES.filter((g) => g.status !== "Resolved").length;

  return (
    <Screen className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron">
            <span className="h-px w-5 bg-saffron" /> {isPensioner ? "Pensioner Dashboard" : "Role Dashboard"}
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Welcome, {isPensioner ? PENSIONER.name : role.label}
          </h1>
          {isPensioner && <p className="text-sm text-muted-foreground">{PENSIONER.ppo} &middot; {PENSIONER.ministry}</p>}
        </div>
        <div className="flex items-center gap-2.5">
          {isPensioner && (
            <>
              <button onClick={() => setPpoGenerated((v) => !v)} title="Demo: toggle pre-PPO state"
                className="hidden items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:border-primary/40 sm:inline-flex">
                <Icon name="repeat" size={13} /> {ppoGenerated ? "Demo: pre-PPO" : "Demo: post-PPO"}
              </button>
              <Button variant="ghost" onClick={() => setActive("profile")} className="px-4 py-2.5"><Icon name="userCheck" size={16} /> My Profile</Button>
            </>
          )}
          <Button variant="dark" onClick={onLogout} className="px-4 py-2.5"><Icon name="login" size={16} /> Log out</Button>
        </div>
      </div>

      {isPensioner ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Pension" value={<StatusPill>Active</StatusPill>} sub="Disbursed monthly" icon="badgeCheck" tone="success" />
            <KPI label="Last credited" value={formatINR(PAYMENTS[0].gross)} sub={PAYMENTS[0].credited} icon="activity" tone="primary" />
            <KPI label="Life certificate" value={DLC_STATUS.current} sub={"Valid till " + DLC_STATUS.validTill} icon="fingerprint" tone="saffron" />
            <KPI label="Open grievances" value={openGriev} sub={openGriev ? "In progress" : "None pending"} icon="messageCircle" tone="primary" />
          </div>

          {!ppoGenerated && (
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setActive("form6a")}
              className="card-shimmer mt-6 flex w-full items-center justify-between gap-4 rounded-xl2 border-2 border-saffron/40 bg-gradient-to-r from-saffron/12 to-transparent p-5 text-left shadow-card transition-shadow hover:shadow-elegant"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-saffron to-saffron-light text-saffron-foreground shadow-soft"><Icon name="fileText" size={24} /></span>
                <div>
                  <div className="text-base font-extrabold text-foreground">Complete Form 6A — Pension Application</div>
                  <div className="text-sm text-muted-foreground">Submit before your PPO is generated · due {FORM6A.deadline} ({FORM6A.daysLeft} days left)</div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-saffron">Open <Icon name="arrowRight" size={15} /></span>
            </motion.button>
          )}

          <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your services</h2>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
          <Icon name="shieldCheck" size={18} className="mt-0.5 flex-shrink-0 text-primary" />
          <span>RBAC active &mdash; you are seeing <b>{role.modules.length}</b> service{role.modules.length > 1 ? "s" : ""} authorised for the <b>{role.label}</b> role. The Pensioner journey is fully built; other roles are next.</span>
        </motion.div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {role.modules.map((m) => {
          const mo = MODULES[m] || { label: m, icon: "badgeCheck", desc: "" };
          const live = isPensioner && !!getPensionerModule(m);
          return (
            <motion.button key={m} variants={item} onClick={() => openTile(m)} whileHover={{ y: -6 }} whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="card-shimmer group relative flex flex-col items-start rounded-xl2 border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-elegant">
              {live && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[10px] font-bold text-success">LIVE</span>}
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary transition-colors duration-300 group-hover:bg-saffron group-hover:text-saffron-foreground">
                <Icon name={mo.icon} size={20} />
              </span>
              <span className="mt-3.5 text-sm font-bold text-foreground">{mo.label}</span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{mo.desc}</span>
              {live && <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">Open <Icon name="arrowRight" size={13} /></span>}
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-white shadow-elegant">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
