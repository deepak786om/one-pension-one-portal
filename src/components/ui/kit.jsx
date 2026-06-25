import { motion } from "framer-motion";
import Icon from "../../lib/icons.jsx";
import { cn } from "../../lib/cn.js";

// ---- status pill ----
const STATUS_TONES = {
  ok: "bg-success/12 text-success",
  warn: "bg-saffron/15 text-saffron",
  info: "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
};
function toneFor(label = "") {
  const s = label.toLowerCase();
  if (/(resolved|credited|submitted|active|published|approved|valid|done)/.test(s)) return "ok";
  if (/(pending|with |returned|review|draft|due|progress|graded)/.test(s)) return "warn";
  if (/(new|issued|live|ongoing)/.test(s)) return "info";
  return "muted";
}
export function StatusPill({ children, tone }) {
  const t = tone || toneFor(typeof children === "string" ? children : "");
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold", STATUS_TONES[t])}>{children}</span>;
}

// ---- KPI card ----
export function KPI({ label, value, sub, icon, tone = "primary" }) {
  const tones = {
    primary: "from-primary to-primary-light",
    saffron: "from-saffron to-saffron-light",
    success: "from-success to-emerald-500",
  };
  return (
    <div className="rounded-xl2 border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        {icon && (
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br text-white", tones[tone])}>
            <Icon name={icon} size={16} />
          </span>
        )}
      </div>
      <div className="mt-2 text-xl font-extrabold text-foreground">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}

// ---- section card ----
export function SectionCard({ title, desc, icon, action, children, className }) {
  return (
    <section className={cn("rounded-xl2 border border-border bg-card p-5 shadow-card sm:p-6", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {icon && <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/8 text-primary"><Icon name={icon} size={18} /></span>}
            <div>
              {title && <h3 className="text-base font-extrabold text-foreground">{title}</h3>}
              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

// ---- form primitives ----
export function Field({ label, required, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-saffron">*</span>}
      </span>
      {children}
      {error ? <span className="mt-1 block text-[11px] font-medium text-saffron">{error}</span> : hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15";

export function Input({ className, ...props }) {
  return <input className={cn(inputBase, className)} {...props} />;
}
export function Textarea({ className, ...props }) {
  return <textarea className={cn(inputBase, "min-h-[96px] resize-y", className)} {...props} />;
}
export function Select({ options = [], placeholder = "Select…", className, ...props }) {
  return (
    <select className={cn(inputBase, "appearance-none bg-[length:1.1rem] pr-9", className)} {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// ---- info row (label : value) ----
export function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-2 last:border-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ---- simple data table ----
export function DataTable({ columns, rows, empty = "Nothing here yet." }) {
  if (!rows || rows.length === 0) {
    return <div className="rounded-xl border border-dashed border-border bg-muted/40 py-8 text-center text-sm text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            {columns.map((c) => (
              <th key={c.key} className="whitespace-nowrap px-3.5 py-2.5 font-bold">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border/70 hover:bg-primary/[0.03]">
              {columns.map((c) => (
                <td key={c.key} className="whitespace-nowrap px-3.5 py-2.5 text-foreground">
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- vertical stepper ----
export function Stepper({ steps, current }) {
  return (
    <ol className="relative ml-3 border-l-2 border-border">
      {steps.map((s, i) => {
        const state = s.done ? "done" : i === current ? "current" : "todo";
        return (
          <li key={s.key || i} className="mb-5 ml-6 last:mb-0">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "absolute -left-[0.72rem] grid h-6 w-6 place-items-center rounded-full ring-4 ring-card",
                state === "done" && "bg-success text-white",
                state === "current" && "bg-saffron text-saffron-foreground animate-pulseRing",
                state === "todo" && "bg-muted text-muted-foreground"
              )}
            >
              <Icon name={state === "todo" ? "info" : "check"} size={13} />
            </motion.span>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-foreground">{s.label}</h4>
              {s.date && <span className="text-[11px] text-muted-foreground">· {s.date}</span>}
            </div>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </li>
        );
      })}
    </ol>
  );
}

// ---- success banner ----
export function SuccessNote({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl2 border border-success/30 bg-gradient-to-b from-success/10 to-transparent p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-success text-white"><Icon name="check" size={20} /></span>
        <div>
          <h4 className="text-sm font-extrabold text-foreground">{title}</h4>
          <div className="mt-1 text-sm text-muted-foreground">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
