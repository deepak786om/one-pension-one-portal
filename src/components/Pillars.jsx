import { motion } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Reveal from "./Reveal.jsx";

const PILLARS = [
  { icon: "badgeCheck", name: "BHAVISHYA", tag: "Sanction & Tracking", desc: "Pre-retirement to PPO — service verification, forms, computation and disbursement via DBT.", accent: "from-primary to-primary-light" },
  { icon: "fingerprint", name: "DLC · Jeevan Pramaan", tag: "Digital Life Certificate", desc: "Annual proof of life through Face, Fingerprint or IRIS — pension that never stops.", accent: "from-success to-emerald-500" },
  { icon: "messageCircle", name: "CPENGRAMS", tag: "Grievance Redressal", desc: "Lodge, track and appeal pension grievances with coded actions and a 30-day SLA.", accent: "from-saffron to-saffron-light" },
  { icon: "bookOpen", name: "ANUBHAV", tag: "Recognition", desc: "Retiring officers share their service experience — graded, published and awarded.", accent: "from-violet-500 to-fuchsia-500" },
];

export default function Pillars() {
  return (
    <section id="pillars" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-saffron/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron">
            <span className="h-px w-5 bg-saffron" /> Four systems, one portal
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">The pillars we unified</h2>
          <p className="mt-3 text-muted-foreground">Each legacy system kept its strength — we joined them on a single identity and the PPO.</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full overflow-hidden rounded-xl2 border border-border bg-card p-6 shadow-card transition-shadow hover:shadow-elegant"
              >
                <div className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${p.accent} opacity-10 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`} />
                <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                  <Icon name={p.icon} size={22} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-foreground">{p.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-wide text-saffron">{p.tag}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
