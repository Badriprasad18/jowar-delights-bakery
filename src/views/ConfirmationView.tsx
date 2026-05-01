import { CheckCircle2, Package, Phone, MapPin, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { View } from "@/components/jowar/Navbar";

export type ConfirmedOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  items: Array<{ id: string; name: string; price: number; qty: number; unit: string }>;
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
};

export function ConfirmationView({
  order,
  setView,
}: {
  order: ConfirmedOrder | null;
  setView: (v: View) => void;
}) {
  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">No recent order</h2>
        <Button className="mt-6" onClick={() => setView("shop")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-primary/40 bg-card p-8 text-center shadow-[var(--shadow-gold)]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you, {order.customerName}. We'll call you shortly to confirm delivery.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5">
          <Package className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order #</span>
          <span className="font-mono text-sm font-bold text-primary">{order.orderNumber}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 font-serif text-lg font-bold">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between">
              <span className="text-muted-foreground">{i.qty}× {i.name} <span className="text-xs">({i.unit})</span></span>
              <span className="font-medium">₹{i.qty * i.price}</span>
            </div>
          ))}
        </div>
        <div className="my-4 h-px bg-border" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
          {order.discount > 0 && (
            <div className="flex justify-between text-accent"><span>Discount</span><span>-₹{order.discount}</span></div>
          )}
          <div className="mt-2 flex justify-between text-lg font-bold">
            <span>Total (COD)</span>
            <span className="text-primary">₹{order.total}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-3 text-sm">
            <Phone className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <div className="text-xs uppercase text-muted-foreground">Phone</div>
              <div className="font-medium">{order.phone}</div>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-3 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <div className="text-xs uppercase text-muted-foreground">Delivery Address</div>
              <div className="font-medium leading-tight">{order.address}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl border border-accent/40 bg-accent/10 p-3 text-sm">
          <Banknote className="mt-0.5 h-4 w-4 text-accent" />
          <div>
            <div className="font-semibold text-foreground">Cash on Delivery</div>
            <div className="text-xs text-muted-foreground">Please keep ₹{order.total} ready when your order arrives.</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => setView("orders")} variant="outline">View My Orders</Button>
        <Button onClick={() => setView("shop")}>Continue Shopping</Button>
      </div>
    </div>
  );
}