import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER } from "@/data/products";
import { toast } from "sonner";
import { Banknote } from "lucide-react";
import type { View } from "@/components/jowar/Navbar";

export function CheckoutView({ setView }: { setView: (v: View) => void }) {
  const { items, totalItems, totalPrice, clear } = useCart();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

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

  const placeOrder = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill all the fields");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    const lines = items.map((i) => `${i.qty}x ${i.name} (${i.unit}) – ₹${i.qty * i.price}`).join("\n");
    const msg =
      `Hi, I want to place a COD order:\n\n` +
      `Items:\n${lines}\n\n` +
      (discount > 0 ? `Subtotal: ₹${totalPrice}\nDiscount (10%): -₹${discount}\n` : "") +
      `Total: ₹${grandTotal}\n\n` +
      `Name: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\n` +
      `Payment: Cash on Delivery`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("Order sent to WhatsApp!");
    clear();
    setView("home");
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Checkout</h1>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" maxLength={10} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} placeholder="10-digit mobile" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea id="address" rows={4} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House no, street, area, Bhubaneswar, pincode" />
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4">
          <Banknote className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-semibold text-foreground">Cash on Delivery</p>
            <p className="text-sm text-muted-foreground">You will pay in cash at delivery.</p>
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
        <Button className="mt-5 w-full" size="lg" onClick={placeOrder}>
          Place Order via WhatsApp
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">May contain nuts</p>
      </aside>
    </div>
  );
}