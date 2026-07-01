import { motion } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Reveal from "./Reveal.jsx";

const SERVICES = [
  { icon: "badgeCheck", label: "View & Verify PPO", desc: "Inspect your Pension Payment Order any time." },
  { icon: "activity", label: "Track My Pension", desc: "Live status of sanction and monthly credit." },
  { icon: "fingerprint", label: "Digital Life Certificate", desc: "Submit Jeevan Pramaan in minutes." },
  { icon: "messageCircle", label: "Lodge a Grievance", desc: "Raise and follow up under a 30-day SLA." },
  { icon: "calculator", label: "Pension Calculators", desc: "Pension, gratuity, commutation & DR." },
  { icon: "bookOpen", label: "Share your Anubhav", desc: "Publish your service experience." },
  { icon: "heartHandshake", label: "Family & Nominee", desc: "Keep your particulars up to date." },
  { icon: "repeat", label: "Transfer Account", desc: "Move between disbursing agencies." },
];

export default function Services({ onLogin }) {
  return (
    <section id="services" className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span className="h-px w-5 bg-primary" /> Everything in one place
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Services at your fingertips</h2>
            <p className="mt-3 text-muted-foreground">Sign in and your dashboard shows only what your role is authorised to use.</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) * 0.06}>
              <motion.button
                onClick={onLogin}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 20 }}
                className="group flex h-full w-full flex-col items-start rounded-xl2 border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-elegant"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/8 text-primary transition-colors duration-300 group-hover:bg-saffron group-hover:text-saffron-foreground">
                  <Icon name={s.icon} size={20} />
                </span>
                <span className="mt-4 text-sm font-bold text-foreground">{s.label}</span>
                <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <Icon name="arrowRight" size={13} />
                </span>
              </motion.button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
