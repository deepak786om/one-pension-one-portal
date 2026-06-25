import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../lib/icons.jsx";
import Button from "./ui/Button.jsx";
import { cn } from "../lib/cn.js";

const LINKS = [
  ["Services", "services"],
  ["How it works", "how"],
  ["Pillars", "pillars"],
];

export default function Navbar({ onLogin, onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-border shadow-card" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron text-saffron-foreground shadow-glow">
            <Icon name="shieldCheck" size={18} />
          </span>
          <span className="text-left leading-tight">
            <span className="block text-sm font-extrabold text-foreground">One Pension, One Portal</span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">DoPPW · Government of India</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" onClick={onRegister} className="px-4 py-2.5">
            <Icon name="userCheck" size={16} /> Register
          </Button>
          <Button variant="saffron" onClick={onLogin} className="px-4 py-2.5">
            <Icon name="login" size={16} /> Login
          </Button>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-lg text-foreground md:hidden">
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border glass md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {LINKS.map(([label, id]) => (
                <button key={id} onClick={() => go(id)} className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground/80 hover:bg-primary/5">
                  {label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={onRegister} full className="py-2.5"><Icon name="userCheck" size={16} /> Register</Button>
                <Button variant="saffron" onClick={onLogin} full className="py-2.5"><Icon name="login" size={16} /> Login</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
