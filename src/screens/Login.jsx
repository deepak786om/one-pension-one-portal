import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "../components/ui/Button.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { ROLES, ROLE_GROUPS, getRole } from "../data/rbac.js";

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

// Single-page sign-in: pick a role from the dropdown and its own credential
// fields appear inline. No separate role-selection page.
export default function Login({ onSignIn, onRegister }) {
  const [roleId, setRoleId] = useState("");
  const [values, setValues] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const role = roleId ? getRole(roleId) : null;
  const set = (i, v) => setValues((s) => ({ ...s, [i]: v }));

  const pickRole = (id) => { setRoleId(id); setValues({}); setOtp(""); setOtpSent(false); };

  const fieldsValid = useMemo(
    () => !!role && role.authFields.every((f, i) => validField(f[1], values[i] || "")),
    [role, values]
  );
  const otpValid = /^\d{6}$/.test(otp);

  // dynamic CTA derived from form + role state
  let cta = { label: "Select your role to continue", icon: "info", enabled: false, action: () => {} };
  if (role) {
    if (role.otp) {
      cta = !otpSent
        ? { label: fieldsValid ? "Send OTP" : "Enter details to get OTP", icon: fieldsValid ? "arrowRight" : "info", enabled: fieldsValid, action: () => setOtpSent(true) }
        : { label: otpValid ? "Verify & sign in" : "Enter the 6-digit OTP", icon: otpValid ? "login" : "info", enabled: otpValid, action: () => onSignIn(role.id) };
    } else {
      cta = { label: fieldsValid ? "Sign in securely" : "Enter your credentials", icon: fieldsValid ? "login" : "info", enabled: fieldsValid, action: () => onSignIn(role.id) };
    }
  }

  return (
    <Screen className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-xl2 border border-border bg-card shadow-elegant">
        {/* header band */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0a1f44] p-7 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-saffron/40 blur-2xl" />
          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
            <Icon name="shieldCheck" size={13} className="text-saffron-light" /> Secure Single Sign-On
          </span>
          <h1 className="relative mt-3 text-2xl font-black tracking-tight sm:text-3xl">Sign in to your pension portal</h1>
          <p className="relative mt-2 text-sm leading-relaxed text-white/80">
            Choose your role — the right credentials appear automatically. Role-Based Access Control shows you only the services you are authorised to use.
          </p>
        </div>

        {/* form */}
        <div className="p-7">
          {/* role dropdown */}
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-foreground">Your role</span>
            <div className="relative">
              <select
                value={roleId}
                onChange={(e) => pickRole(e.target.value)}
                className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-3 pr-10 text-sm font-semibold text-foreground outline-none transition-shadow focus:border-primary focus:ring-4 focus:ring-primary/15"
              >
                <option value="" disabled>Select your role…</option>
                {ROLE_GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {ROLES.filter((r) => r.group === group).map((r) => (
                      <option key={r.id} value={r.id}>{r.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <Icon name="chevronRight" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-muted-foreground" />
            </div>
          </label>

          {/* role-specific credentials */}
          <AnimatePresence mode="wait">
            {role && (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-5"
              >
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Icon name={role.icon} size={13} /> {role.authTitle}
                </span>

                <div className="space-y-4">
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

                <Button variant="saffron" full disabled={!cta.enabled} onClick={cta.action} className="mt-6">
                  <Icon name={cta.icon} size={17} /> {cta.label}
                </Button>
                {role.otp && otpSent && (
                  <button onClick={() => setOtpSent(false)} className="mt-2 block w-full text-center text-xs text-muted-foreground hover:text-primary">
                    Edit details
                  </button>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {TRUST.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      <Icon name="shieldCheck" size={12} className="text-primary" /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            New to the portal?{" "}
            <button onClick={onRegister} className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
              Create an account <Icon name="arrowRight" size={14} />
            </button>
          </p>
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
