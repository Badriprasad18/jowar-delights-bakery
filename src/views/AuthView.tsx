import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Wheat } from "lucide-react";
import logo from "@/assets/jowar-logo.jpeg";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Name too short").max(100);

export function AuthView({ onAuthed }: { onAuthed: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const e1 = emailSchema.safeParse(email);
      if (!e1.success) return toast.error(e1.error.issues[0].message);
      const p1 = passSchema.safeParse(password);
      if (!p1.success) return toast.error(p1.error.issues[0].message);

      setBusy(true);
      if (mode === "signup") {
        const n1 = nameSchema.safeParse(fullName);
        if (!n1.success) { setBusy(false); return toast.error(n1.error.issues[0].message); }
        const { error } = await supabase.auth.signUp({
          email: e1.data,
          password: p1.data,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: n1.data },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in!");
        onAuthed();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: e1.data,
          password: p1.data,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        onAuthed();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 flex flex-col items-center gap-3">
        <img src={logo} alt="Jowar Delights logo" className="h-20 w-20 rounded-full ring-2 ring-primary/40" />
        <h1 className="font-serif text-3xl font-bold text-primary">Jowar Delights</h1>
        <p className="text-sm text-muted-foreground">Sign in to order fresh, healthy bakes</p>
      </div>

      <form onSubmit={submit} className="w-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex gap-2 rounded-lg bg-muted p-1">
          <button type="button" onClick={() => setMode("login")} className={`flex-1 rounded-md py-1.5 text-sm font-medium ${mode === "login" ? "bg-background shadow" : "text-muted-foreground"}`}>Login</button>
          <button type="button" onClick={() => setMode("signup")} className={`flex-1 rounded-md py-1.5 text-sm font-medium ${mode === "signup" ? "bg-background shadow" : "text-muted-foreground"}`}>Sign Up</button>
        </div>

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" maxLength={100} />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" maxLength={255} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pass">Password</Label>
          <Input id="pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" maxLength={72} />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <div className="rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-muted-foreground">
          <p className="mb-1 flex items-center gap-1.5 font-semibold text-foreground"><Wheat className="h-3.5 w-3.5 text-primary" />Roles</p>
          <p>New accounts start as <strong>User</strong>. Admins can promote accounts to <strong>Team</strong> or <strong>Admin</strong> from the admin panel.</p>
        </div>
      </form>
    </div>
  );
}
