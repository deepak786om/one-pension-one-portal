import { motion } from "framer-motion";
import Icon from "../../lib/icons.jsx";

export default function ModuleShell({ icon, title, desc, onBack, action, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28 }}
      className="mx-auto max-w-5xl px-4 py-8 sm:px-6"
    >
      <button onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <Icon name="chevronLeft" size={16} /> Back to dashboard
      </button>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl2 bg-gradient-to-br from-primary to-primary-light text-white shadow-soft">
            <Icon name={icon} size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">{title}</h1>
            {desc && <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}
