import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Navbar, type View } from "@/components/jowar/Navbar";
import { HomeView } from "@/views/HomeView";
import { ShopView } from "@/views/ShopView";
import { CartView } from "@/views/CartView";
import { CheckoutView } from "@/views/CheckoutView";
import { AuthView } from "@/views/AuthView";
import { AdminView } from "@/views/AdminView";
import { TeamView } from "@/views/TeamView";
import { MyOrdersView } from "@/views/MyOrdersView";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Jowar Delights — Wholesome Jowar Bakery" },
      { name: "description", content: "Artisanal jowar (sorghum) cookies, muffins, breads & cakes. Gluten-free, diabetic-friendly, no preservatives. Order Cash on Delivery online." },
    ],
  }),
});

function Index() {
  return (
    <AuthProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </AuthProvider>
  );
}

function Shell() {
  const [view, setView] = useState<View>("home");
  const { user, roles, loading } = useAuth();

  // After login, route to role-appropriate landing page (only on first auth event)
  const [didAutoRoute, setDidAutoRoute] = useState(false);
  useEffect(() => {
    if (loading) return;
    if (user && !didAutoRoute && view === "auth") {
      if (roles.includes("admin")) setView("admin");
      else if (roles.includes("team")) setView("team");
      else setView("shop");
      setDidAutoRoute(true);
    }
  }, [user, roles, loading, view, didAutoRoute]);

  // Guard role-only pages
  const blocked =
    (view === "admin" && !roles.includes("admin")) ||
    (view === "team" && !roles.includes("team") && !roles.includes("admin")) ||
    ((view === "checkout" || view === "orders") && !user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar view={view} setView={setView} />
      <main>
        {loading ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : blocked ? (
          <AuthView onAuthed={() => { /* effect routes after roles load */ }} />
        ) : (
          <>
            {view === "home" && <HomeView setView={setView} />}
            {view === "shop" && <ShopView />}
            {view === "cart" && <CartView setView={setView} />}
            {view === "checkout" && <CheckoutView setView={setView} />}
            {view === "auth" && <AuthView onAuthed={() => setDidAutoRoute(false)} />}
            {view === "admin" && <AdminView />}
            {view === "team" && <TeamView />}
            {view === "orders" && <MyOrdersView />}
          </>
        )}
      </main>
      <footer className="border-t border-border/60 bg-card py-8 text-center text-sm text-muted-foreground">
        <p className="font-serif text-base text-primary">Jowar Delights</p>
        <p className="mt-1">Artisanal & Healthy • Since 2026</p>
      </footer>
      <Toaster />
    </div>
  );
}
