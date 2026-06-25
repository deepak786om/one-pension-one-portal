import { motion } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Reveal from "./Reveal.jsx";

const STEPS = [
  { icon: "badgeCheck", phase: "Phase A", title: "Sanction & PPO", desc: "Bhavishya drives service verification, forms and computation to PPO issuance and DBT credit.", tone: "bg-primary" },
  { icon: "bookOpen", phase: "Phase B", title: "Recognition", desc: "At retirement, share your experience via Anubhav — graded by HOO, published by HOD.", tone: "bg-violet-500" },
  { icon: "fingerprint", phase: "Phase C", title: "Annual Validation", desc: "Each year, a Digital Life Certificate keeps your pension flowing — no branch visit needed.", tone: "bg-success" },
  { icon: "messageCircle", phase: "Phase D", title: "Redressal", desc: "Anything amiss? Lodge a grievance linked to your PPO and track it to disposal and appeal.", tone: "bg-saffron" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success">
            <span className="h-px w-5 bg-success" /> One continuous journey
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">How the lifecycle flows</h2>
          <p className="mt-3 text-muted-foreground">From your last working months to lifelong support — every stage connected by your PPO.</p>
        </Reveal>

        <div className="relative mt-14">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-0.5 bg-gradient-to-r from-primary via-success to-saffron lg:block" />
          <div className="grid gap-8 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <motion.span
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    className={`relative z-10 grid h-14 w-14 place-items-center rounded-2xl ${s.tone} text-white shadow-soft`}
                  >
                    <Icon name={s.icon} size={24} />
                  </motion.span>
                  <span className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.phase}</span>
                  <h3 className="mt-1 text-lg font-extrabold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
