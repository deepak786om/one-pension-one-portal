import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "../components/ui/Button.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { getRole } from "../data/rbac.js";

const TRUST = ["Parichay SSO", "Aadhaar", "DigiLocker", "eSign"];
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validField(type, val) {
  if (!val) return false;
  if (type === "email") return emailRe.test(val);
  if (type === "password") return val.length >= 4;
  if (type === "tel") return val.replace(/\D/g, "").length >= 6;
  if (type === "panppo") return /^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(val.trim()) || /^[A-Za-z0-9/\-]{6,}$/.test(val.trim());
  return val.trim().length > 0;
}

export default function Auth({ roleId, onBack, onSignIn, onRegister }) {
  const role = getRole(roleId);
  const [values, setValues] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const showReg = role.id !== "ADMIN";

  const set = (i, v) => setValues((s) => ({ ...s, [i]: v }));

  const fieldsValid = useMemo(
    () => role.authFields.every((f, i) => validField(f[1], values[i] || "")),
    [role, values]
  );
  const otpValid = /^\d{6}$/.test(otp);

  // dynamic CTA derived from form state
  let cta;
  if (role.otp) {
    if (!otpSent) {
      cta = { label: fieldsValid ? "Send OTP" : "Enter details to get OTP", icon: fieldsValid ? "arrowRight" : "info", enabled: fieldsValid, action: () => setOtpSent(true) };
    } else {
      cta = { label: otpValid ? "Verify & sign in" : "Enter the 6-digit OTP", icon: otpValid ? "login" : "info", enabled: otpValid, action: () => onSignIn(role.id) };
    }
  } else {
    cta = { label: fieldsValid ? "Sign in securely" : "Enter your credentials", icon: fieldsValid ? "login" : "info", enabled: fieldsValid, action: () => onSignIn(role.id) };
  }

  return (
    <Screen className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="overflow-hidden rounded-xl2 border border-border bg-card shadow-elegant md:grid md:grid-cols-[1.05fr_1fr]">
        {/* brand panel */}
        <aside className="relative flex flex-col justify-between gap-7 overflow-hidden bg-gradient-to-br from-primary to-[#0a1f44] p-7 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-saffron/40 blur-2xl" />
          <div className="relative flex items-center gap-2 text-sm font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron text-saffron-foreground"><Icon name="shieldCheck" size={17} /></span>
            One Pension One Portal
          </div>
          <div className="relative">
            <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/10"><Icon name={role.icon} size={26} /></span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight">{role.label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              Secure, role-based access to pension sanction, life-certificate, grievance and recognition services — unified under one identity.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-2">
            {TRUST.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold">
                <Icon name="shieldCheck" size={13} className="text-saffron-light" /> {t}
              </span>
            ))}
          </div>
        </aside>

        {/* form pane */}
        <div className="flex flex-col p-7">
          <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-primary">
            <Icon name="chevronLeft" size={15} /> All roles
          </button>
          <span className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
            <Icon name="login" size={13} /> {role.authTitle}
          </span>
          <h3 className="text-2xl font-extrabold text-foreground">Welcome back</h3>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to reach your {role.label} dashboard.</p>

          <div className="mt-6 space-y-4">
            {role.authFields.map((f, i) => (
              <Field
                key={i}
                label={f[0]}
                type={f[1] === "password" ? "password" : "text"}
                placeholder={f[2]}
                value={values[i] || ""}
                onChange={(v) => set(i, v)}
                valid={validField(f[1], values[i] || "")}
              />
            ))}

            <AnimatePresence>
              {role.otp && otpSent && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Field
                    label="One-Time Password (OTP)"
                    inputMode="numeric"
                    value={otp}
                    onChange={(v) => setOtp(v.replace(/\D/g, "").slice(0, 6))}
                    valid={otpValid}
                    hint="Demo: enter any 6 digits"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* dynamic CTA */}
          <Button variant="saffron" full disabled={!cta.enabled} onClick={cta.action} className="mt-6">
            <Icon name={cta.icon} size={17} /> {cta.label}
          </Button>
          {role.otp && otpSent && (
            <button onClick={() => setOtpSent(false)} className="mt-2 text-center text-xs text-muted-foreground hover:text-primary">
              Edit details
            </button>
          )}

          {showReg && (
            <p className="mt-4 text-sm text-muted-foreground">
              Don&apos;t have access yet?{" "}
              <button onClick={onRegister} className="font-bold text-primary hover:underline">Register</button>
            </p>
          )}
        </div>
      </div>
    </Screen>
  );
}

function Field({ label, type = "text", value, onChange, valid, hint, inputMode, placeholder }) {
  const showTick = valid && value;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span>
      <div className="relative">
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 pr-10 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
        <AnimatePresence>
          {showTick && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-success"
            >
              <Icon name="check" size={17} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
