import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Pillars from "./components/Pillars.jsx";
import Services from "./components/Services.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import Footer from "./components/Footer.jsx";
import PortalShell from "./components/PortalShell.jsx";

import Login from "./screens/Login.jsx";
import Register from "./screens/Register.jsx";
import Dashboard from "./screens/Dashboard.jsx";

// view: "landing" | "login" | "register" | "dashboard"
export default function App() {
  const [view, setView] = useState("landing");
  const [roleId, setRoleId] = useState(null);

  const inPortal = view !== "landing";

  // lock body scroll while the portal overlay is open
  useEffect(() => {
    document.body.style.overflow = inPortal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [inPortal]);

  const openLogin = () => setView("login");
  const openRegister = () => setView("register");
  const goLanding = () => setView("landing");

  return (
    <div className="min-h-screen">
      {/* landing */}
      <Navbar onLogin={openLogin} onRegister={openRegister} />
      <main>
        <Hero onLogin={openLogin} onRegister={openRegister} />
        <Pillars />
        <Services onLogin={openLogin} />
        <HowItWorks />
      </main>
      <Footer onLogin={openLogin} onRegister={openRegister} />

      {/* portal journey overlay */}
      <AnimatePresence>
        {inPortal && (
          <PortalShell key="shell" onClose={goLanding}>
            <AnimatePresence mode="wait">
              {view === "login" && (
                <Login
                  key="login"
                  onSignIn={(id) => { setRoleId(id); setView("dashboard"); }}
                  onRegister={openRegister}
                />
              )}
              {view === "register" && (
                <Register key="register" initialRole={roleId} onBackToLogin={openLogin} />
              )}
              {view === "dashboard" && (
                <Dashboard key={"dash-" + roleId} roleId={roleId} onLogout={openLogin} />
              )}
            </AnimatePresence>
          </PortalShell>
        )}
      </AnimatePresence>
    </div>
  );
}
