import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Banknote, Loader2 } from "lucide-react";
import type { View } from "@/components/jowar/Navbar";
import type { ConfirmedOrder } from "@/views/ConfirmationView";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().trim().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  address: z.string().trim().min(10, "Address must be at least 10 characters").max(500),
});

export function CheckoutView({
  setView,
  onConfirmed,
}: {
  setView: (v: View) => void;
  onConfirmed: (o: ConfirmedOrder) => void;
}) {
  const { items, totalItems, totalPrice, clear } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [busy, setBusy] = useState(false);

  const discount = totalPrice >= 2000 ? Math.round(totalPrice * 0.1) : 0;
  const grandTotal = totalPrice - discount;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">Nothing to checkout</h2>
        <Button className="mt-6" onClick={() => setView("shop")}>Browse Menu</Button>
      </div>
    );
  }

  const placeOrder = async () => {
    // Validation: empty cart guard already above; validate form
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    setBusy(true);
    try {
      const orderItems = items.map((i) => ({
        id: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit,
      }));
      const { data: inserted, error } = await supabase.from("orders").insert({
        user_id: user.id,
        customer_name: parsed.data.name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        items: orderItems,
        subtotal: totalPrice,
        discount,
        total: grandTotal,
        status: "pending",
      }).select("id, created_at").single();
      if (error) throw error;
      toast.success("Order placed! Pay cash on delivery.");
      const id = inserted?.id ?? "";
      const orderNumber = `JD-${id.slice(0, 8).toUpperCase()}`;
      onConfirmed({
        id,
        orderNumber,
        customerName: parsed.data.name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        items: orderItems,
        subtotal: totalPrice,
        discount,
        total: grandTotal,
        createdAt: inserted?.created_at ?? new Date().toISOString(),
      });
      clear();
      setView("confirmation");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Checkout</h1>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" maxLength={100} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input id="phone" type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="10-digit mobile" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Textarea id="address" rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House no, street, area, city, pincode" maxLength={500} />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <Banknote className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold text-foreground">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">You will pay in cash when your order arrives.</p>
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-primary/40 bg-card p-6 shadow-[var(--shadow-gold)]">
        <h2 className="mb-4 font-serif text-xl font-bold">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span className="text-muted-foreground">{i.qty}× {i.name}</span>
              <span className="font-medium">₹{i.qty * i.price}</span>
            </div>
          ))}
        </div>
        <div className="my-4 h-px bg-border" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Items</span><span>{totalItems}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{totalPrice}</span></div>
          {discount > 0 && (
            <div className="flex justify-between text-accent"><span>Discount (10%)</span><span>-₹{discount}</span></div>
          )}
        </div>
        <div className="mt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{grandTotal}</span>
        </div>
        <Button className="mt-5 w-full" size="lg" onClick={placeOrder} disabled={busy}>
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Place COD Order
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">May contain nuts</p>
      </aside>
    </div>
  );
}
