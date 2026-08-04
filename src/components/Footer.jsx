import Icon from "../lib/icons.jsx";
import Button from "./ui/Button.jsx";
import Reveal from "./Reveal.jsx";

export default function Footer({ onLogin, onRegister }) {
  return (
    <footer className="relative mt-10">
      {/* CTA band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-br from-primary to-primary-light px-6 py-12 text-center shadow-elegant sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-saffron/30 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-2xl font-extrabold text-white sm:text-3xl">Ready to access your pension services?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-white/80">Sign in with your role, or create an account in minutes. Verification adapts automatically.</p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Button variant="saffron" onClick={onLogin} className="px-6 py-3.5 text-base"><Icon name="login" size={18} /> Login to portal</Button>
              <Button variant="outline" onClick={onRegister} className="px-6 py-3.5 text-base">Register now <Icon name="arrowRight" size={18} /></Button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* footer */}
      <div className="mt-16 border-t border-border bg-card/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-saffron text-saffron-foreground"><Icon name="shieldCheck" size={18} /></span>
              <span className="text-sm font-extrabold text-foreground">One Pension One Portal</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              An initiative of the Department of Pension &amp; Pensioners&apos; Welfare (DoPPW), Government of India — unifying
              Bhavishya, CPENGRAMS, DLC and Anubhav.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Icon name="mail" size={14} /> doppw-support@nic.in</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="phone" size={14} /> 1800-11-1960</span>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Modules</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Bhavishya</li><li>CPENGRAMS</li><li>DLC · Jeevan Pramaan</li><li>Anubhav</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Trust</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Parichay SSO</li><li>Aadhaar / e-Pramaan</li><li>DigiLocker</li><li>eSign / DSC</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground sm:px-6">
            © {new Date().getFullYear()} DoPPW, Government of India · One Nation, One Pension · Demonstration prototype.
          </div>
        </div>
      </div>
    </footer>
  );
}
