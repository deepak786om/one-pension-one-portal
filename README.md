# One Pension, One Portal — React app

A unified **Department of Pension & Pensioners' Welfare (DoPPW)** pensioners' portal that brings
**Bhavishya, CPENGRAMS, DLC (Jeevan Pramaan) and Anubhav** under one identity.

Built with **Vite + React 18 + Tailwind CSS + Framer Motion** and **lucide-react** icons.

## Highlights

- **Animated, illustrative landing** — hero with banner crossfade and floating chips, four-pillar cards with hover illustration, an animated lifecycle timeline, and a CTA band.
- **RBAC Login** — pick a role (grouped by category) → role-appropriate authentication → a dashboard that shows **only** the services that role is authorised to use.
- **Dynamic, form-driven CTAs**
  - *Login:* the sign-in button enables and relabels based on field validity; OTP roles get a two-phase **Send OTP → Verify & sign in** flow with inline validation ticks.
  - *Registration:* a live progress bar counts completed required fields; the submit button stays disabled and shows **"Fill N required fields to continue"** until the role's form is valid, then becomes **"Submit registration request."**
- **Role-adaptive Registration** — fields and verification steps change per role; **Organisation / System Admin is intentionally excluded** (provisioned from the backend). Admin can still sign in.

## Run locally

Requires **Node.js 18+**.

```bash
npm install
npm run dev      # http://localhost:5173
```

Build and preview a production bundle:

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this folder to a GitHub (or GitLab/Bitbucket) repository.
2. In Vercel, **Add New → Project** and import the repo.
3. Vercel auto-detects **Vite**. Defaults are correct:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. **Deploy.** That's it — a single-page app served from `dist`.

No environment variables are required. The whole journey (landing → login → register → dashboards) runs client-side.

## Project structure

```
src/
  App.jsx                  # landing + portal journey state machine
  data/rbac.js             # roles, modules, registration configs (single source of truth)
  lib/icons.jsx            # name → lucide-react icon resolver
  lib/cn.js                # className helper
  components/
    Navbar.jsx  Hero.jsx  Pillars.jsx  Services.jsx  HowItWorks.jsx  Footer.jsx
    Reveal.jsx             # scroll-in animation wrapper
    PortalShell.jsx        # portal chrome + screen transition wrapper
    ui/Button.jsx          # animated button
  screens/
    Login.jsx  Auth.jsx  Register.jsx  Dashboard.jsx
public/banners/            # hero images
```

## Customise

- **Roles, services, registration fields/verification** all live in `src/data/rbac.js`. Add a service to `MODULES`, reference its key in a role's `modules[]`, and it appears on that role's dashboard automatically.
- **Palette** is in `tailwind.config.js` (`primary` navy, `saffron`, `success` green) and the gradient meshes in `src/index.css`.

> Demonstration prototype. Authentication, OTP and submissions are simulated client-side — wire them to your real APIs where indicated in `screens/Auth.jsx` and `screens/Register.jsx`.
