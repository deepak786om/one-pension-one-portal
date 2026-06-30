import { useState } from "react";
import Icon from "../../lib/icons.jsx";
import { SectionCard } from "./kit.jsx";
import { getAiDefaultOpen, setAiDefaultOpen } from "../../lib/prefs.js";

// Reusable "Keep AI Suggestion ON" preference — used on every profile screen.
export default function AiPreferenceCard() {
  const [on, setOn] = useState(getAiDefaultOpen());
  return (
    <SectionCard title="AI preferences" desc="Personalise how the portal assists you." icon="sparkles">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white"><Icon name="sparkles" size={17} /></span>
          <div>
            <div className="text-sm font-bold text-foreground">Keep AI Suggestion ON</div>
            <div className="text-xs text-muted-foreground">When on, the AI overview opens by default wherever it’s available. When off, you can open it any time from the “AI Summary” button.</div>
          </div>
        </div>
        <button
          role="switch" aria-checked={on} aria-label="Keep AI Suggestion ON"
          onClick={() => { const next = !on; setAiDefaultOpen(next); setOn(next); }}
          className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors ${on ? "bg-emerald-500" : "bg-slate-300"}`}>
          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${on ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
    </SectionCard>
  );
}
