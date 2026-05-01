import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Users, Package } from "lucide-react";
import { OrderList } from "@/components/jowar/OrderList";

type ProfileRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
};

type RoleRow = { user_id: string; role: "admin" | "team" | "user" };

export function AdminView() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roleMap, setRoleMap] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(true);
  const [emailToPromote, setEmailToPromote] = useState("");

  const load = async () => {
    setLoading(true);
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (p.error) toast.error(p.error.message);
    if (r.error) toast.error(r.error.message);
    setProfiles((p.data ?? []) as ProfileRow[]);
    const map: Record<string, Set<string>> = {};
    (r.data as RoleRow[] ?? []).forEach((row) => {
      map[row.user_id] = map[row.user_id] ?? new Set();
      map[row.user_id].add(row.role);
    });
    setRoleMap(map);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setRole = async (userId: string, role: "admin" | "team" | "user", assign: boolean) => {
    if (assign) {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
      toast.success(`Granted ${role}`);
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
      toast.success(`Removed ${role}`);
    }
    load();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage orders, users and roles</p>
      </div>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold"><Package className="h-5 w-5 text-primary" />All Orders</h2>
        <OrderList scope="all" canEdit />
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 font-serif text-xl font-bold"><Users className="h-5 w-5 text-primary" />Users & Roles</h2>
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
            <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <div className="col-span-4">User</div>
              <div className="col-span-3">Phone</div>
              <div className="col-span-5">Roles</div>
            </div>
            {profiles.map((p) => {
              const userRoles = roleMap[p.id] ?? new Set();
              return (
                <div key={p.id} className="grid grid-cols-12 items-center gap-2 border-b border-border/60 px-4 py-3 text-sm last:border-0">
                  <div className="col-span-4">
                    <div className="font-medium text-foreground">{p.full_name || "—"}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{p.id.slice(0, 8)}…</div>
                  </div>
                  <div className="col-span-3 text-muted-foreground">{p.phone || "—"}</div>
                  <div className="col-span-5 flex flex-wrap gap-2">
                    {(["user", "team", "admin"] as const).map((role) => {
                      const has = userRoles.has(role);
                      return (
                        <Button
                          key={role}
                          size="sm"
                          variant={has ? "default" : "outline"}
                          className="h-7 px-2 text-xs"
                          onClick={() => setRole(p.id, role, !has)}
                        >
                          {has ? "✓ " : "+ "}{role}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {profiles.length === 0 && <div className="px-4 py-8 text-center text-muted-foreground">No users yet</div>}
          </div>
        )}
      </section>
    </div>
  );
}
