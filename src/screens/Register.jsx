import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "../components/ui/Button.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { REG_ROLES, getRole } from "../data/rbac.js";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldValid(type, val, fileChosen) {
  if (type === "file") return !!fileChosen;
  if (!val) return false;
  if (type === "email") return emailRe.test(val);
  if (type === "tel") return val.replace(/\D/g, "").length >= 6;
  return val.trim().length > 0;
}

function Rich({ text }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) => (i % 2 ? <b key={i} className="text-foreground">{p}</b> : <span key={i}>{p}</span>));
}

export default function Register({ initialRole, onBackToLogin }) {
  const [roleId, setRoleId] = useState(initialRole && REG_ROLES.some((r) => r.id === initialRole) ? initialRole : REG_ROLES[0].id);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const role = getRole(roleId);

  // reset form when role changes
  useEffect(() => {
    setValues({});
    setFiles({});
  }, [roleId]);

  const requiredIdx = useMemo(
    () => role.reg.fields.map((f, i) => (f[2] ? i : -1)).filter((i) => i >= 0),
    [role]
  );
  const remaining = requiredIdx.filter((i) => !fieldValid(role.reg.fields[i][1], values[i], files[i])).length;
  const total = requiredIdx.length;
  const done = total - remaining;
  const canSubmit = remaining === 0;
  const progress = total ? Math.round((done / total) * 100) : 100;

  if (submitted) {
    return (
      <Screen className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl2 border border-border bg-card p-8 text-center shadow-elegant"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-success to-emerald-500 text-white"
          >
            <Icon name="check" size={30} />
          </motion.div>
          <h2 className="mt-4 text-2xl font-extrabold text-foreground">Registration submitted</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your <b className="text-foreground">{role.label}</b> request has been recorded (demo).{" "}
            <Rich text={role.reg.approver} />
          </p>
          <Button variant="saffron" onClick={onBackToLogin} className="mx-auto mt-6">
            <Icon name="chevronLeft" size={16} /> Back to sign-in
          </Button>
        </motion.div>
      </Screen>
    );
  }

  return (
    <Screen className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          <Icon name="userCheck" size={14} className="text-saffron" /> Create your account
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Register on the One Pension Portal</h1>
        <p className="mt-3 text-muted-foreground">Pick your stakeholder role — the form fields and the required verification steps adapt automatically.</p>
      </div>

      {/* role chips */}
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {REG_ROLES.map((r) => {
          const active = r.id === roleId;
          return (
            <motion.button
              key={r.id}
              onClick={() => setRoleId(r.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors " +
                (active
                  ? "border-transparent bg-gradient-to-br from-primary to-primary-light text-white shadow-soft"
                  : "border-border bg-white/70 text-foreground backdrop-blur hover:border-primary/40")
              }
            >
              <Icon name={r.icon} size={15} /> {r.label}
            </motion.button>
          );
        })}
      </div>

      {/* card */}
      <motion.div layout className="mt-7 rounded-xl2 border border-border bg-card p-6 shadow-elegant sm:p-7">
        <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white"><Icon name={role.icon} size={22} /></span>
          <div>
            <div className="text-lg font-extrabold text-foreground">{role.label}</div>
            <div className="text-xs text-muted-foreground">Provide the details below to submit your registration request.</div>
          </div>
        </div>

        {/* progress */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Required fields completed</span>
            <span className={canSubmit ? "text-success" : "text-primary"}>{done}/{total}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={"h-full rounded-full " + (canSubmit ? "bg-success" : "bg-gradient-to-r from-primary to-primary-light")}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={roleId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {role.reg.fields.map((f, i) => {
              const [label, type, required] = f;
              const ok = fieldValid(type, values[i], files[i]);
              return (
                <label key={i} className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-foreground">
                    {label}
                    {required && <span className="ml-0.5 text-saffron">*</span>}
                  </span>
                  {type === "file" ? (
                    <input
                      type="file"
                      onChange={(e) => setFiles((s) => ({ ...s, [i]: e.target.files && e.target.files.length > 0 }))}
                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-xs text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary"
                    />
                  ) : (
                    <div className="relative">
                      <input
                        type={type}
                        value={values[i] || ""}
                        onChange={(e) => setValues((s) => ({ ...s, [i]: e.target.value }))}
                        placeholder={label}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-9 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15"
                      />
                      <AnimatePresence>
                        {ok && (values[i] || "").length > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                            <Icon name="check" size={16} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </label>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* verification */}
        <div className="mt-6 rounded-2xl border border-success/30 bg-gradient-to-b from-success/8 to-transparent p-4">
          <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-success">
            <Icon name="listChecks" size={14} /> Required verification for this role
          </div>
          <ul className="grid gap-2">
            {role.reg.verify.map((v, i) => (
              <motion.li
                key={v}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-2.5 text-sm text-foreground"
              >
                <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-success text-white"><Icon name="check" size={12} /></span>
                {v}
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
            <Icon name="info" size={14} className="mt-0.5 flex-shrink-0 text-primary" />
            <span>Approval — <Rich text={role.reg.approver} /></span>
          </div>
        </div>

        {/* dynamic CTA */}
        <Button variant={canSubmit ? "saffron" : "primary"} full disabled={!canSubmit} onClick={() => setSubmitted(true)} className="mt-6">
          <Icon name={canSubmit ? "arrowRight" : "info"} size={17} />
          {canSubmit ? "Submit registration request" : `Fill ${remaining} required field${remaining > 1 ? "s" : ""} to continue`}
        </Button>
      </motion.div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <button onClick={onBackToLogin} className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
          Sign in <Icon name="arrowRight" size={14} />
        </button>
      </p>
    </Screen>
  );
}
