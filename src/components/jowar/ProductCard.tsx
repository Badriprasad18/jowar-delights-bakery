import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <div className="group relative flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-gold)]">
      {product.preorder && (
        <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
          Pre-order
        </span>
      )}
      <div className="mb-4 overflow-hidden rounded-xl">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <h3 className="font-serif text-base font-semibold leading-tight text-foreground">{product.name}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{product.unit}</p>
      {product.badges && product.badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.badges.map((b) => (
            <span key={b} className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {b}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-lg font-bold text-primary">₹{product.price}</span>
        <Button
          size="sm"
          onClick={() => {
            add(product);
            toast.success("Item added to cart", { description: product.name });
          }}
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
}