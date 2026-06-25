import { motion } from "framer-motion";
import Icon from "../lib/icons.jsx";
import { Screen } from "../components/PortalShell.jsx";
import { ROLES, ROLE_GROUPS } from "../data/rbac.js";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

export default function Login({ onSelectRole, onRegister }) {
  return (
    <Screen className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
          <Icon name="shieldCheck" size={14} className="text-saffron" /> Secure Single Sign-On
        </span>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Sign in to your unified pension portal</h1>
        <p className="mt-3 text-muted-foreground">
          Choose your role to continue. With Role-Based Access Control you will only ever see the services you are authorised to use.
        </p>
      </div>

      <div className="mt-10 space-y-9">
        {ROLE_GROUPS.map((group) => (
          <div key={group}>
            <h3 className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {group}
              <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
            </h3>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {ROLES.filter((r) => r.group === group).map((r) => (
                <motion.button
                  key={r.id}
                  variants={item}
                  onClick={() => onSelectRole(r.id)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="group flex items-center gap-3.5 rounded-2xl border border-border bg-white/80 p-4 text-left shadow-card backdrop-blur transition-shadow hover:border-primary/40 hover:shadow-elegant"
                >
                  <span className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-light text-white transition-colors group-hover:from-saffron group-hover:to-saffron-light group-hover:text-saffron-foreground">
                    <Icon name={r.icon} size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold leading-tight text-foreground">{r.label}</span>
                    <span className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                      {r.modules.length} service{r.modules.length > 1 ? "s" : ""}
                    </span>
                  </span>
                  <Icon name="chevronRight" size={18} className="flex-shrink-0 text-muted-foreground opacity-40 transition-all group-hover:translate-x-1 group-hover:text-saffron group-hover:opacity-100" />
                </motion.button>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        New to the portal?{" "}
        <button onClick={onRegister} className="inline-flex items-center gap-1 font-bold text-primary hover:underline">
          Create an account <Icon name="arrowRight" size={14} />
        </button>
      </p>
    </Screen>
  );
}
