import { motion } from "framer-motion";
import { cn } from "../../lib/cn.js";

const VARIANTS = {
  saffron: "bg-gradient-to-br from-saffron to-saffron-light text-saffron-foreground shadow-glow",
  primary: "bg-gradient-to-br from-primary to-primary-light text-primary-foreground shadow-soft",
  outline: "bg-white text-primary border border-border hover:border-primary/50",
  ghost: "bg-primary/5 text-primary hover:bg-primary/10",
  dark: "bg-primary text-primary-foreground",
};

export default function Button({
  as = "button",
  variant = "primary",
  className = "",
  children,
  disabled = false,
  full = false,
  ...rest
}) {
  const Comp = motion[as] || motion.button;
  return (
    <Comp
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 24 }}
      disabled={disabled}
      className={cn(
        "btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold",
        "transition-[filter,opacity] duration-200 hover:brightness-[1.04] focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
        full && "w-full",
        disabled && "cursor-not-allowed opacity-50 saturate-50",
        VARIANTS[variant],
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
