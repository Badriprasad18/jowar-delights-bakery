import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, X, Save } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/context/ProductsContext";
import { CATEGORIES, BADGE_OPTIONS, type Product } from "@/data/products";

const EMPTY: Omit<Product, "id"> = {
  name: "",
  price: 0,
  unit: "",
  category: CATEGORIES[0],
  image: "",
  badges: [],
};

export function ProductManager() {
  const { products, addProduct, updateProduct, removeProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<Product, "id">>(EMPTY);
  const [showNew, setShowNew] = useState(false);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setShowNew(false);
    setDraft({
      name: p.name, price: p.price, unit: p.unit, category: p.category,
      image: p.image, badges: p.badges ?? [], preorder: p.preorder,
    });
  };

  const startNew = () => {
    setShowNew(true);
    setEditingId(null);
    setDraft(EMPTY);
  };

  const cancel = () => { setEditingId(null); setShowNew(false); setDraft(EMPTY); };

  const validate = () => {
    if (!draft.name.trim()) return "Name is required";
    if (!draft.unit.trim()) return "Quantity unit is required (e.g. 200g Box)";
    if (!Number.isFinite(draft.price) || draft.price <= 0) return "Price must be greater than 0";
    return null;
  };

  const save = () => {
    const err = validate();
    if (err) return toast.error(err);
    if (editingId) {
      updateProduct(editingId, draft);
      toast.success("Product updated");
    } else {
      addProduct({ ...draft, image: draft.image || "/placeholder.svg" });
      toast.success("Product added");
    }
    cancel();
  };

  const toggleBadge = (b: string) => {
    const has = (draft.badges ?? []).includes(b);
    setDraft({ ...draft, badges: has ? draft.badges!.filter((x) => x !== b) : [...(draft.badges ?? []), b] });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    removeProduct(id);
    toast.success("Product removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{products.length} products (frontend state — resets on refresh)</p>
        {!showNew && !editingId && (
          <Button size="sm" onClick={startNew}><Plus className="mr-1 h-4 w-4" />Add Product</Button>
        )}
      </div>

      {(showNew || editingId) && (
        <div className="rounded-2xl border border-primary/40 bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold">{editingId ? "Edit Product" : "New Product"}</h3>
            <Button size="sm" variant="ghost" onClick={cancel}><X className="h-4 w-4" /></Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Name</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Jowar Honey Cookies" />
            </div>
            <div className="space-y-1.5">
              <Label>Price (₹)</Label>
              <Input type="number" value={draft.price || ""} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} placeholder="180" />
            </div>
            <div className="space-y-1.5">
              <Label>Quantity Unit</Label>
              <Input value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} placeholder="200g Box" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Image URL (optional)</Label>
              <Input value={typeof draft.image === "string" ? draft.image : ""} onChange={(e) => setDraft({ ...draft, image: e.target.value })} placeholder="https://… or /placeholder.svg" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((b) => {
                  const on = (draft.badges ?? []).includes(b);
                  return (
                    <Button key={b} type="button" size="sm" variant={on ? "default" : "outline"} className="h-7 text-xs" onClick={() => toggleBadge(b)}>
                      {on ? "✓ " : "+ "}{b}
                    </Button>
                  );
                })}
              </div>
            </div>
            <label className="sm:col-span-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!draft.preorder} onChange={(e) => setDraft({ ...draft, preorder: e.target.checked })} />
              Pre-order item (e.g. fresh cakes)
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={cancel}>Cancel</Button>
            <Button onClick={save}><Save className="mr-1 h-4 w-4" />Save</Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-12 gap-2 border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-12 items-center gap-2 border-b border-border/60 px-4 py-3 text-sm last:border-0">
            <div className="col-span-5">
              <div className="font-medium text-foreground">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.unit}{p.badges && p.badges.length > 0 && ` • ${p.badges.join(", ")}`}</div>
            </div>
            <div className="col-span-2 text-muted-foreground">{p.category}</div>
            <div className="col-span-2 font-semibold text-primary">₹{p.price}</div>
            <div className="col-span-3 flex justify-end gap-1.5">
              <Button size="sm" variant="outline" className="h-8" onClick={() => startEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive" onClick={() => remove(p.id, p.name)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {products.length === 0 && <div className="px-4 py-8 text-center text-muted-foreground">No products. Add one to get started.</div>}
      </div>
    </div>
  );
}