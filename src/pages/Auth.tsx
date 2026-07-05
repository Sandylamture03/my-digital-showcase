import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) toast.error(error.message);
      else toast.success("Signed in");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) toast.error(error.message);
      else toast.success("Account created — signing in…");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Helmet><title>Admin — Sandeep Lamture</title><meta name="robots" content="noindex" /></Helmet>
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 w-full max-w-md space-y-5">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mode === "signin"
              ? "Restricted access."
              : "After signing up, ask Sandeep to grant admin access."}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted-foreground hover:text-primary w-full text-center"
        >
          {mode === "signin" ? "Need to create an account? Sign up" : "Have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
