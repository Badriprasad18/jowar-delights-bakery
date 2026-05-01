import { ShoppingCart, LogOut, ShieldCheck, Users2, ClipboardList } from "lucide-react";
import logo from "@/assets/jowar-logo.jpeg";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export type View = "home" | "shop" | "cart" | "checkout" | "auth" | "admin" | "team" | "orders";

export function Navbar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { totalItems } = useCart();
  const { user, roles, signOut } = useAuth();

  const isAdmin = roles.includes("admin");
  const isTeam = roles.includes("team");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <button onClick={() => setView("home")} className="flex items-center gap-3">
          <img src={logo} alt="Jowar Delights logo" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40" />
          <div className="text-left">
            <div className="font-serif text-lg font-bold leading-none text-primary">Jowar Delights</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Artisanal • Healthy</div>
          </div>
        </button>

        <nav className="hidden items-center gap-5 md:flex">
          <button onClick={() => setView("home")} className={navCls(view === "home")}>Home</button>
          <button onClick={() => setView("shop")} className={navCls(view === "shop")}>Shop</button>
          {user && (
            <button onClick={() => setView("orders")} className={navCls(view === "orders")}>My Orders</button>
          )}
          {isTeam && !isAdmin && (
            <button onClick={() => setView("team")} className={navCls(view === "team")}>
              <Users2 className="mr-1 inline h-3.5 w-3.5" />Team
            </button>
          )}
          {isAdmin && (
            <button onClick={() => setView("admin")} className={navCls(view === "admin")}>
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button onClick={() => setView("cart")} variant="secondary" size="sm" className="relative">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground shadow-[var(--shadow-gold)]">
                {totalItems}
              </span>
            )}
          </Button>
          {user ? (
            <Button onClick={async () => { await signOut(); setView("home"); }} size="sm" variant="ghost">
              <LogOut className="h-4 w-4" />
              <span className="ml-1.5 hidden sm:inline">Sign out</span>
            </Button>
          ) : (
            <Button onClick={() => setView("auth")} size="sm">Login</Button>
          )}
        </div>
      </div>

      {/* Mobile secondary nav */}
      <div className="flex items-center justify-around border-t border-border/40 bg-card/40 px-2 py-1.5 text-xs md:hidden">
        <MobBtn active={view === "home"} onClick={() => setView("home")}>Home</MobBtn>
        <MobBtn active={view === "shop"} onClick={() => setView("shop")}>Shop</MobBtn>
        {user && <MobBtn active={view === "orders"} onClick={() => setView("orders")}>Orders</MobBtn>}
        {isTeam && !isAdmin && <MobBtn active={view === "team"} onClick={() => setView("team")}>Team</MobBtn>}
        {isAdmin && <MobBtn active={view === "admin"} onClick={() => setView("admin")}>Admin</MobBtn>}
      </div>
    </header>
  );
}

function MobBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`rounded-full px-3 py-1 ${active ? "bg-primary/15 text-primary font-semibold" : "text-muted-foreground"}`}>
      {children}
    </button>
  );
}

function navCls(active: boolean) {
  return `text-sm font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;
}
