import { Button } from "@/components/ui/button";
import { HealthBadges } from "@/components/jowar/Badges";
import logo from "@/assets/jowar-logo.jpeg";
import { CATEGORIES } from "@/data/products";
import { Wheat, Sparkles, Heart, Award } from "lucide-react";
import type { View } from "@/components/jowar/Navbar";

export function HomeView({ setView }: { setView: (v: View) => void }) {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <HealthBadges />
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
              Healthy <span className="text-primary">Jowar</span> Bakery in Bhubaneswar
            </h1>
            <p className="max-w-md text-base text-muted-foreground md:text-lg">
              Artisanal cookies, muffins, breads & cakes — baked with sorghum (jowar) for wholesome,
              gluten-free indulgence.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setView("shop")} className="shadow-[var(--shadow-gold)]">
                Order Now
              </Button>
              <Button size="lg" variant="outline" onClick={() => setView("shop")}>
                Browse Menu
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 -z-10 scale-110 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-gold)" }} />
              <img src={logo} alt="Jowar Delights brand logo" className="h-72 w-72 rounded-full object-cover shadow-[var(--shadow-gold)] ring-4 ring-primary/30 md:h-96 md:w-96" />
            </div>
          </div>
        </div>
      </section>

      {/* Offer banner */}
      <section className="mx-auto max-w-6xl px-4">
        <div
          className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-primary/40 p-5 text-center md:flex-row md:text-left"
          style={{ background: "var(--gradient-gold)" }}
        >
          <div className="flex items-center gap-3 text-primary-foreground">
            <Sparkles className="h-6 w-6" />
            <p className="font-semibold">Flat 10% off on orders above ₹2000 — auto-applied at checkout!</p>
          </div>
          <Button variant="secondary" onClick={() => setView("shop")}>Shop Now</Button>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-serif text-3xl font-bold text-foreground">Our Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setView("shop")}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <Wheat className="mx-auto mb-3 h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-foreground">{c}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Why Jowar */}
      <section className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center font-serif text-3xl font-bold text-foreground">Why Jowar?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: "Diabetic-Friendly", desc: "Low glycemic index keeps blood sugar steady." },
            { icon: Award, title: "100% Gluten-Free", desc: "Naturally gluten-free ancient grain — gentle on your gut." },
            { icon: Sparkles, title: "No Preservatives", desc: "Baked fresh in Bhubaneswar with clean ingredients." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}