export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  preorder?: boolean;
};

export const CATEGORIES = [
  "Cookies",
  "Muffins",
  "Cakes",
  "Breads & Bases",
  "Biscuits & Rusks",
] as const;

export const PRODUCTS: Product[] = [
  { id: "c1", name: "Classic Jowar Butter Cookies", price: 180, unit: "200g Box", category: "Cookies" },
  { id: "c2", name: "Choco-Chip Jowar Cookies", price: 200, unit: "200g Box", category: "Cookies" },
  { id: "c3", name: "Almond & Date Jowar Cookies", price: 220, unit: "200g Box", category: "Cookies" },
  { id: "c4", name: "Coconut Jowar Cookies", price: 190, unit: "200g Box", category: "Cookies" },

  { id: "m1", name: "Banana Walnut Muffin", price: 60, unit: "1 Piece", category: "Muffins" },
  { id: "m2", name: "Blueberry Muffin", price: 70, unit: "1 Piece", category: "Muffins" },
  { id: "m3", name: "Chocolate Muffin", price: 70, unit: "1 Piece", category: "Muffins" },
  { id: "m4", name: "Carrot Cinnamon Muffin", price: 65, unit: "1 Piece", category: "Muffins" },

  { id: "k1", name: "Jowar Vanilla Sponge Cake", price: 550, unit: "500g", category: "Cakes", preorder: true },
  { id: "k2", name: "Jowar Chocolate Cake", price: 650, unit: "500g", category: "Cakes", preorder: true },
  { id: "k3", name: "Jowar Date & Walnut Cake", price: 600, unit: "500g", category: "Cakes", preorder: true },
  { id: "k4", name: "Jowar Fruit & Nut Cake", price: 700, unit: "500g", category: "Cakes", preorder: true },

  { id: "b1", name: "Jowar Sandwich Bread", price: 120, unit: "400g loaf", category: "Breads & Bases" },
  { id: "b2", name: "Jowar Multigrain Bread", price: 140, unit: "400g loaf", category: "Breads & Bases" },
  { id: "b3", name: "Jowar Pizza Base", price: 90, unit: "2 pcs pack", category: "Breads & Bases" },

  { id: "r1", name: "Jowar Jeera Biscuits", price: 160, unit: "200g pack", category: "Biscuits & Rusks" },
  { id: "r2", name: "Jowar Ajwain Biscuits", price: 160, unit: "200g pack", category: "Biscuits & Rusks" },
  { id: "r3", name: "Jowar Milk Rusk", price: 140, unit: "250g pack", category: "Biscuits & Rusks" },
];

// Update this WhatsApp number for the bakery
export const WHATSAPP_NUMBER = "919999999999";