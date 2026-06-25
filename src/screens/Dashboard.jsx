import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "../components/ui/Button.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { getRole, MODULES } from "../data/rbac.js";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function Dashboard({ roleId, onLogout }) {
  const role = getRole(roleId);
  const n = role.modules.length;
  const [toast, setToast] = useState("");

  const ping = (label) => {
    setToast(label + " — demo module");
    window.clearTimeout(ping._t);
    ping._t = window.setTimeout(() => setToast(""), 1900);
  };

  return (
    <Screen className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron">
            <span className="h-px w-5 bg-saffron" /> Role Dashboard
          </span>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Welcome, {role.label}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1.5 text-xs font-bold text-success">
            <Icon name="shieldCheck" size={14} /> Signed in
          </span>
          <Button variant="dark" onClick={onLogout} className="px-4 py-2.5">
            <Icon name="login" size={16} /> Log out
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-5 flex items-start gap-2.5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground"
      >
        <Icon name="shieldCheck" size={18} className="mt-0.5 flex-shrink-0 text-primary" />
        <span>
          RBAC active — you are seeing <b>{n}</b> service{n > 1 ? "s" : ""} authorised for the <b>{role.label}</b> role. Every other module is hidden.
        </span>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {role.modules.map((m) => {
          const mo = MODULES[m] || { label: m, icon: "badgeCheck", desc: "" };
          return (
            <motion.button
              key={m}
              variants={item}
              onClick={() => ping(mo.label)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group flex flex-col items-start rounded-xl2 border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-elegant"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-primary transition-colors duration-300 group-hover:bg-saffron group-hover:text-saffron-foreground">
                <Icon name={mo.icon} size={20} />
              </span>
              <span className="mt-3.5 text-sm font-bold text-foreground">{mo.label}</span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{mo.desc}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-white shadow-elegant"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </Screen>
  );
}
