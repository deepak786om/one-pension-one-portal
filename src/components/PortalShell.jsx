import { motion } from "framer-motion";
import Icon from "../lib/icons.jsx";

export function Screen({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PortalShell({ onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[60] overflow-y-auto mesh-bg"
    >
      <div className="pointer-events-none fixed inset-0 dot-grid opacity-50" />

      <header className="sticky top-0 z-40 flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground sm:px-6">
        <button onClick={onClose} className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-saffron text-saffron-foreground">
            <Icon name="shieldCheck" size={17} />
          </span>
          <span className="text-sm font-bold">One Pension, One Portal</span>
        </button>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/20"
        >
          <Icon name="x" size={15} /> Close
        </button>
      </header>

      <div className="relative">{children}</div>
    </motion.div>
  );
}
