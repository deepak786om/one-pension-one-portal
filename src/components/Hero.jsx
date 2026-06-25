import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "./ui/Button.jsx";

const BANNERS = ["/banners/banner1.png", "/banners/banner2.png", "/banners/banner3.png"];
const TRUST = ["Parichay SSO", "Aadhaar", "DigiLocker", "eSign / DSC"];
const FLOATERS = [
  { icon: "badgeCheck", label: "PPO issued", tone: "text-success", top: "12%", left: "4%", d: 0 },
  { icon: "fingerprint", label: "Life certificate verified", tone: "text-primary", top: "68%", left: "0%", d: 0.6 },
  { icon: "messageCircle", label: "Grievance resolved", tone: "text-saffron", top: "26%", right: "2%", d: 1.1 },
];

export default function Hero({ onLogin, onRegister }) {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-32">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 mesh-bg" />
      <div className="pointer-events-none absolute inset-0 -z-10 dot-grid opacity-60" />
      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-saffron/20 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="pointer-events-none absolute -right-24 top-24 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
            animate={{ x: [0, -24, 0], y: [0, 28, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        {/* left copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary"
          >
            <Icon name="sparkles" size={14} className="text-saffron" /> One Nation · One Pension · One Portal
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-foreground sm:text-5xl"
          >
            The entire pensioner journey, <span className="text-gradient">unified under one identity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Sanction &amp; tracking, digital life certificate, grievance redressal and recognition — four legacy systems,
            now one seamless, role-aware portal stitched together by your PPO.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button variant="saffron" onClick={onLogin} className="px-6 py-3.5 text-base">
              <Icon name="login" size={18} /> Login / Register
            </Button>
            <Button variant="outline" onClick={onRegister} className="px-6 py-3.5 text-base">
              Create an account <Icon name="arrowRight" size={18} />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Secured by</span>
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70">
                <Icon name="shieldCheck" size={15} className="text-success" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl2 border border-border bg-card shadow-elegant">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={idx}
                src={BANNERS[idx]}
                alt="One Pension One Portal"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/45 via-primary/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
              <span className="glass rounded-lg px-3 py-1.5 text-xs font-semibold text-primary">Integrated Pensioners&apos; Portal</span>
              <div className="flex gap-1.5">
                {BANNERS.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-saffron" : "w-1.5 bg-white/70"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* floating chips */}
          {FLOATERS.map((f) => (
            <motion.div
              key={f.label}
              className="absolute hidden items-center gap-2 rounded-xl border border-border bg-white/90 px-3 py-2 text-xs font-semibold shadow-soft backdrop-blur sm:flex"
              style={{ top: f.top, left: f.left, right: f.right }}
              initial={{ opacity: 0, y: 10 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: f.d }}
            >
              <Icon name={f.icon} size={16} className={f.tone} /> {f.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
