import { useRef, useState } from "react";
import { Sparkles, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FN_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/scope-project`;

export const PREFILL_EVENT = "prefill-contact";

const ProjectScoper = () => {
  const [form, setForm] = useState({ goal: "", audience: "", features: "", timeline: "", budget: "" });
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.goal.trim().length < 10) { setError("Please describe your project in at least 10 characters."); return; }
    setError(""); setOutput(""); setLoading(true);
    const ctrl = new AbortController(); abortRef.current = ctrl;
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify(form),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again later.");
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((o) => o + dec.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError("Connection problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendToSandeep = () => {
    const message = `Project goal: ${form.goal}\n\nAI-generated scope:\n${output}`.slice(0, 1000);
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: { reason: "freelance", message } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="glass rounded-2xl p-8 max-w-5xl mx-auto mt-8">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Scope your project with AI</h3>
      </div>
      <p className="text-muted-foreground mb-6">
        Describe your idea and get a suggested scope, timeline phases and next steps in seconds.
      </p>
      <form onSubmit={generate} className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="sc-goal">What do you want to build?</Label>
          <Textarea id="sc-goal" rows={3} maxLength={1500} value={form.goal} onChange={set("goal")}
            placeholder="e.g. A booking app for my yoga studio with AI class recommendations" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sc-aud">Who is it for?</Label>
          <Input id="sc-aud" maxLength={500} value={form.audience} onChange={set("audience")} placeholder="Your users" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sc-feat">Must-have features</Label>
          <Input id="sc-feat" maxLength={1500} value={form.features} onChange={set("features")} placeholder="Login, payments, dashboard…" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sc-time">Timeline</Label>
          <Input id="sc-time" maxLength={200} value={form.timeline} onChange={set("timeline")} placeholder="e.g. 2 months" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sc-bud">Budget range (optional)</Label>
          <Input id="sc-bud" maxLength={200} value={form.budget} onChange={set("budget")} placeholder="e.g. ₹1–2 lakh" />
        </div>
        <div className="md:col-span-2 flex gap-3">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating…</> : <><Sparkles className="w-4 h-4 mr-2" />Generate scope</>}
          </Button>
          {loading && <Button type="button" variant="outline" onClick={() => abortRef.current?.abort()}>Stop</Button>}
        </div>
      </form>

      {error && <p className="text-sm text-destructive mt-4">{error}</p>}

      {output && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl bg-secondary/50 p-6 whitespace-pre-wrap text-sm leading-relaxed">{output}</div>
          <p className="text-xs text-muted-foreground">This is an AI-generated estimate, not a quote. Cost and timing are confirmed on a call.</p>
          {!loading && (
            <Button onClick={sendToSandeep} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Send className="w-4 h-4 mr-2" />Send this to Sandeep
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectScoper;
