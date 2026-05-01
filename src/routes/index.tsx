import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CartProvider } from "@/context/CartContext";
import { Navbar, type View } from "@/components/jowar/Navbar";
import { HomeView } from "@/views/HomeView";
import { ShopView } from "@/views/ShopView";
import { CartView } from "@/views/CartView";
import { CheckoutView } from "@/views/CheckoutView";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Jowar Delights — Healthy Bakery in Bhubaneswar" },
      { name: "description", content: "Artisanal jowar (sorghum) cookies, muffins, breads & cakes. Gluten-free, diabetic-friendly, no preservatives. Order COD via WhatsApp in Bhubaneswar." },
    ],
  }),
});

function Index() {
  const [view, setView] = useState<View>("home");
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Navbar view={view} setView={setView} />
        <main>
          {view === "home" && <HomeView setView={setView} />}
          {view === "shop" && <ShopView />}
          {view === "cart" && <CartView setView={setView} />}
          {view === "checkout" && <CheckoutView setView={setView} />}
        </main>
        <footer className="border-t border-border/60 bg-card py-8 text-center text-sm text-muted-foreground">
          <p className="font-serif text-base text-primary">Jowar Delights</p>
          <p className="mt-1">Artisanal & Healthy • Bhubaneswar • Since 2026</p>
        </footer>
        <Toaster />
      </div>
    </CartProvider>
  );
}
