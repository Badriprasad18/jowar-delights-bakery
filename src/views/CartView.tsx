import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { View } from "@/components/jowar/Navbar";

export function CartView({ setView }: { setView: (v: View) => void }) {
  const { items, inc, dec, remove, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="font-serif text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Add some delicious jowar treats to get started!</p>
        <Button className="mt-6" onClick={() => setView("shop")}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold text-foreground">Your Cart</h1>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
            <img src={i.image} alt={i.name} loading="lazy" width={768} height={768} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{i.name}</h3>
              <p className="text-xs text-muted-foreground">{i.unit} • ₹{i.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => dec(i.id)}>
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-8 text-center font-semibold">{i.qty}</span>
              <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => inc(i.id)}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
              <span className="font-bold text-primary">₹{i.price * i.qty}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove(i.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-primary/40 bg-card p-6 shadow-[var(--shadow-gold)]">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>
        <div className="mt-2 flex justify-between text-xl font-bold text-foreground">
          <span>Total</span>
          <span className="text-primary">₹{totalPrice}</span>
        </div>
        <Button className="mt-5 w-full" size="lg" onClick={() => setView("checkout")}>
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}