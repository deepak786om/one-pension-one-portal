import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ---- KPI card (light gradient + sheen on hover) ----
export function KPI({ label, value, sub, icon, tone = "primary" }) {
  const tones = {
    primary: { bg: "from-primary/10 via-primary/[0.04] to-transparent", ring: "border-primary/15", chip: "from-primary to-primary-light" },
    saffron: { bg: "from-saffron/15 via-saffron/[0.05] to-transparent", ring: "border-saffron/20", chip: "from-saffron to-saffron-light" },
    success: { bg: "from-success/12 via-success/[0.04] to-transparent", ring: "border-success/20", chip: "from-success to-emerald-500" },
  };
  const t = tones[tone] || tones.primary;
  return (
    <div className={cn("card-shimmer rounded-xl2 border bg-gradient-to-br p-4 shadow-card transition-shadow hover:shadow-elegant", t.bg, t.ring)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        {icon && (
          <span className={cn("grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br text-white shadow-soft", t.chip)}>
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
export function DataTable({ columns, rows, empty = "Nothing here yet.", onRowClick }) {
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
            <tr key={i} onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn("border-t border-border/70 hover:bg-primary/[0.03]", onRowClick && "cursor-pointer")}>
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

// ---- breadcrumb ----
export function Breadcrumb({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {it.onClick && !last ? (
              <button onClick={it.onClick} className="font-medium text-muted-foreground transition-colors hover:text-primary">{it.label}</button>
            ) : (
              <span className={last ? "font-semibold text-foreground" : "text-muted-foreground"}>{it.label}</span>
            )}
            {!last && <Icon name="chevronRight" size={14} className="text-muted-foreground/50" />}
          </span>
        );
      })}
    </nav>
  );
}

// ---- radio pills ----
export function RadioPills({ options, value, onChange, name }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        const on = value === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors",
              on ? "border-primary bg-primary/8 text-primary" : "border-border bg-white text-muted-foreground hover:border-primary/40"
            )}
          >
            <span className={cn("grid h-4 w-4 place-items-center rounded-full border-2", on ? "border-primary" : "border-muted-foreground/40")}>
              {on && <span className="h-2 w-2 rounded-full bg-primary" />}
            </span>
            {l}
          </button>
        );
      })}
    </div>
  );
}

// ---- animated star rating ----
const STAR_LABELS = ["", "Poor", "Fair", "Good", "Better", "Excellent"];
export function StarRating({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= shown;
          return (
            <motion.button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => onChange && onChange(n)}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.9 }}
              animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-3xl leading-none"
              aria-label={`${n} star`}
            >
              <span className={active ? "text-saffron drop-shadow-sm" : "text-muted-foreground/30"}>★</span>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.span
          key={shown}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-sm font-bold text-foreground"
        >
          {shown ? STAR_LABELS[shown] : "Tap to rate"}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ---- modal / popup ----
export function Modal({ open, onClose, children, maxW = "max-w-md" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/50 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className={cn("relative w-full rounded-2xl bg-card p-6 shadow-elegant", maxW)}
          >
            <button onClick={onClose} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
              <Icon name="x" size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- DigiLocker mark (brand-style representation) ----
export function DigiLockerLogo({ size = 18 }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="7" fill="#1B4AA0" />
        <path d="M16 7l7 3v5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9v-5l7-3z" fill="#fff" />
        <rect x="12.5" y="15" width="7" height="6" rx="1.2" fill="#1B4AA0" />
        <path d="M13.6 15v-1.4a2.4 2.4 0 014.8 0V15" stroke="#1B4AA0" strokeWidth="1.3" fill="none" />
      </svg>
      <span className="text-sm font-bold text-[#1B4AA0]">DigiLocker</span>
    </span>
  );
}

// ---- shared history trail (spacious, card-based) ----
const TRAIL_ICONS = (a = "") => {
  const s = a.toLowerCase();
  if (s.includes("lodge") || s.includes("created") || s.includes("submit")) return "messageCircle";
  if (s.includes("forward") || s.includes("sent") || s.includes("export")) return "arrowUpRight";
  if (s.includes("return") || s.includes("objection")) return "repeat";
  if (s.includes("resolved") || s.includes("approved") || s.includes("issued") || s.includes("published") || s.includes("dispos")) return "check";
  if (s.includes("appeal")) return "scale";
  if (s.includes("acknowledg") || s.includes("admit") || s.includes("verif")) return "badgeCheck";
  return "activity";
};
export function HistoryTrail({ items, accent = "primary" }) {
  const dot = accent === "saffron" ? "bg-saffron" : "bg-primary";
  return (
    <div className="space-y-1">
      {items.map((h, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className={cn("grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-white shadow-soft ring-4 ring-card", dot)}>
              <Icon name={TRAIL_ICONS(h.action)} size={15} />
            </span>
            {i < items.length - 1 && <span className="my-1 w-0.5 flex-1 bg-border" />}
          </div>
          <div className="mb-2 flex-1 rounded-xl2 border border-border bg-card p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h4 className="text-sm font-extrabold text-foreground">{h.action}</h4>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">{h.date}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-primary"><Icon name="building" size={12} /> {h.actor}</div>
            {h.remark && <p className="mt-2.5 rounded-lg bg-muted/40 p-3 text-sm leading-relaxed text-muted-foreground">{h.remark}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- vertical process step list (shows owner + state per step) ----
export function StepList({ steps, current, onOpen }) {
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => {
        const done = i < current, here = i === current;
        const auto = s.actor && s.actor !== "HOO" && s.actor !== "You";
        const clickable = here && !auto && onOpen;
        const Tag = clickable ? "button" : "div";
        return (
          <Tag key={s.key || i} onClick={clickable ? () => onOpen(s) : undefined}
            className={cn("flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors",
              here ? "border-saffron/50 bg-saffron/[0.06]" : "border-border", clickable && "hover:border-saffron")}>
            <span className={cn("grid h-7 w-7 flex-shrink-0 place-items-center rounded-full text-white",
              done ? "bg-success" : here ? "bg-saffron" : "bg-muted-foreground/25")}>
              <Icon name={done ? "check" : here ? (auto ? "activity" : "arrowRight") : "info"} size={13} />
            </span>
            <div className="min-w-0 flex-1">
              <div className={cn("text-sm font-semibold", done || here ? "text-foreground" : "text-muted-foreground")}>{s.label}</div>
              {here && auto && <div className="text-[11px] font-medium text-saffron">Awaiting {s.actor} — updates automatically</div>}
              {here && !auto && <div className="text-[11px] font-medium text-primary">Action required by you</div>}
              {!here && s.sub && <div className="text-[11px] text-muted-foreground">{s.sub}</div>}
            </div>
            {done && <span className="text-[11px] font-bold text-success">Done</span>}
            {clickable && <Icon name="chevronRight" size={15} className="text-saffron" />}
          </Tag>
        );
      })}
    </ol>
  );
}

// ---- a row of verification checkboxes used inside task modals ----
export function CheckList({ items, checked, onToggle }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it) => {
        const on = checked.includes(it);
        return (
          <li key={it}>
            <button type="button" onClick={() => onToggle(it)}
              className={cn("flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                on ? "border-success/40 bg-success/[0.06]" : "border-border hover:border-primary/40")}>
              <span className={cn("grid h-5 w-5 flex-shrink-0 place-items-center rounded-md text-white", on ? "bg-success" : "bg-muted-foreground/25")}><Icon name="check" size={12} /></span>
              <span className={on ? "text-foreground" : "text-muted-foreground"}>{it}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// ---- evidence-backed checklist: shows the data the officer must review, then confirm ----
export function EvidenceChecklist({ items, checked, onToggle }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => {
        const on = checked.includes(it.key);
        return (
          <li key={it.key} className={cn("rounded-xl2 border p-4 transition-colors", on ? "border-success/40 bg-success/[0.04]" : "border-border bg-card")}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className={cn("mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-md text-white", on ? "bg-success" : "bg-muted-foreground/25")}><Icon name="check" size={12} /></span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground">{it.label}</div>
                  {it.data && (
                    <div className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
                      {it.data.map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between gap-3 border-b border-dashed border-border/70 pb-1">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className="text-right text-xs font-semibold text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {it.flag && <p className={cn("mt-2 inline-flex items-center gap-1 text-xs font-bold", it.flagTone === "warn" ? "text-saffron" : "text-success")}><Icon name={it.flagTone === "warn" ? "info" : "check"} size={12} /> {it.flag}</p>}
                </div>
              </div>
              <button type="button" onClick={() => onToggle(it.key)}
                className={cn("flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
                  on ? "bg-success/12 text-success" : "bg-primary text-primary-foreground hover:bg-primary-light")}>
                {on ? <span className="inline-flex items-center gap-1"><Icon name="check" size={13} /> Verified</span> : "Confirm"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
