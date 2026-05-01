import { createContext, useContext, useState, type ReactNode } from "react";
import { PRODUCTS as SEED, type Product } from "@/data/products";

type Ctx = {
  products: Product[];
  addProduct: (p: Omit<Product, "id"> & { id?: string }) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
};

const ProductsCtx = createContext<Ctx | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED);

  const addProduct: Ctx["addProduct"] = (p) => {
    const id = p.id || `p_${Date.now().toString(36)}`;
    setProducts((prev) => [{ ...p, id } as Product, ...prev]);
  };
  const updateProduct: Ctx["updateProduct"] = (id, patch) =>
    setProducts((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeProduct: Ctx["removeProduct"] = (id) =>
    setProducts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ProductsCtx.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductsCtx.Provider>
  );
}

export function useProducts() {
  const c = useContext(ProductsCtx);
  if (!c) throw new Error("useProducts must be used within ProductsProvider");
  return c;
}