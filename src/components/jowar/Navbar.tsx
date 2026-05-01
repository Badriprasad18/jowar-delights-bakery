import { ShoppingCart, Cookie } from "lucide-react";
import logo from "@/assets/jowar-logo.jpeg";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

type View = "home" | "shop" | "cart" | "checkout";

export function Navbar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => setView("home")} className="flex items-center gap-3">
          <img src={logo} alt="Jowar Delights logo" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40" />
          <div className="text-left">
            <div className="font-serif text-lg font-bold leading-none text-primary">Jowar Delights</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Artisanal • Healthy</div>
          </div>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          <button onClick={() => setView("home")} className={navCls(view === "home")}>Home</button>
          <button onClick={() => setView("shop")} className={navCls(view === "shop")}>Shop</button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setView("shop")}>
            <Cookie className="h-4 w-4" />
          </Button>
          <Button onClick={() => setView("cart")} variant="secondary" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground shadow-[var(--shadow-gold)]">
                {totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

function navCls(active: boolean) {
  return `text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;
}

export type { View };