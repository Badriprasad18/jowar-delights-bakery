import { useState } from "react";
import { CATEGORIES } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/jowar/ProductCard";
import { HealthBadges } from "@/components/jowar/Badges";

export function ShopView() {
  const [active, setActive] = useState<string>("All");
  const { products } = useProducts();
  const tabs = ["All", ...CATEGORIES];
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-foreground">Our Bakery Menu</h1>
        <p className="mt-2 text-muted-foreground">Freshly baked, lovingly crafted</p>
        <HealthBadges className="mt-4 justify-center" />
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-gold)]"
                : "border border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        ⚠️ Allergy notice: May contain nuts. Cakes require 1-day pre-order.
      </p>
    </div>
  );
}