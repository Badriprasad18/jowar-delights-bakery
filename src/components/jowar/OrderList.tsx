import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export type OrderRow = {
  id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  address: string;
  items: Array<{ id: string; name: string; price: number; qty: number; unit: string }>;
  subtotal: number;
  discount: number;
  total: number;
  status: "pending" | "confirmed" | "out_for_delivery" | "delivered" | "cancelled";
  created_at: string;
  notes: string | null;
};

const STATUSES = ["pending", "confirmed", "out_for_delivery", "delivered", "cancelled"] as const;

const statusColor: Record<OrderRow["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  confirmed: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  out_for_delivery: "bg-purple-500/15 text-purple-600 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-600 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-600 border-red-500/30",
};

export function OrderList({ scope, canEdit }: { scope: "all" | "mine"; canEdit: boolean }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (scope === "mine") {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setOrders([]); setLoading(false); return; }
      q = q.eq("user_id", user.id);
    }
    const { data, error } = await q;
    if (error) toast.error(error.message);
    setOrders((data ?? []) as unknown as OrderRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [scope]);

  const updateStatus = async (id: string, status: OrderRow["status"]) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
        <Package className="mx-auto mb-3 h-10 w-10 opacity-50" />
        No orders yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor[o.status]}`}>
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-1 font-semibold text-foreground">{o.customer_name}</div>
              <div className="text-xs text-muted-foreground">{o.phone} • {new Date(o.created_at).toLocaleString()}</div>
              <div className="mt-1 max-w-md text-xs text-muted-foreground">{o.address}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">₹{o.total}</div>
              <div className="text-[11px] text-muted-foreground">COD</div>
            </div>
          </div>

          <div className="mt-3 space-y-1 border-t border-border/60 pt-3 text-sm">
            {o.items.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-muted-foreground">{it.qty}× {it.name}</span>
                <span>₹{it.qty * it.price}</span>
              </div>
            ))}
            {o.discount > 0 && (
              <div className="flex justify-between text-accent"><span>Discount</span><span>-₹{o.discount}</span></div>
            )}
          </div>

          {canEdit && (
            <div className="mt-4 flex items-center gap-3 border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">Update status:</span>
              <Select value={o.status} onValueChange={(v) => updateStatus(o.id, v as OrderRow["status"])}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
