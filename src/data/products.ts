export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  preorder?: boolean;
  image: string;
  badges?: string[];
};

export const CATEGORIES = [
  "Cookies",
  "Muffins",
  "Cakes",
  "Breads & Bases",
  "Biscuits & Rusks",
] as const;

export const BADGE_OPTIONS = [
  "Gluten-Free",
  "Diabetic-Friendly",
  "Vegan",
  "No Preservatives",
  "High-Fiber",
  "Sugar-Free",
] as const;

import c1 from "@/assets/products/c1.jpg";
import c2 from "@/assets/products/c2.jpg";
import c3 from "@/assets/products/c3.jpg";
import c4 from "@/assets/products/c4.jpg";
import m1 from "@/assets/products/m1.jpg";
import m2 from "@/assets/products/m2.jpg";
import m3 from "@/assets/products/m3.jpg";
import m4 from "@/assets/products/m4.jpg";
import k1 from "@/assets/products/k1.jpg";
import k2 from "@/assets/products/k2.jpg";
import k3 from "@/assets/products/k3.jpg";
import k4 from "@/assets/products/k4.jpg";
import b1 from "@/assets/products/b1.jpg";
import b2 from "@/assets/products/b2.jpg";
import b3 from "@/assets/products/b3.jpg";
import r1 from "@/assets/products/r1.jpg";
import r2 from "@/assets/products/r2.jpg";
import r3 from "@/assets/products/r3.jpg";

export const PRODUCTS: Product[] = [
  { id: "c1", name: "Classic Jowar Butter Cookies", price: 180, unit: "200g Box", category: "Cookies", image: c1 },
  { id: "c2", name: "Choco-Chip Jowar Cookies", price: 200, unit: "200g Box", category: "Cookies", image: c2 },
  { id: "c3", name: "Almond & Date Jowar Cookies", price: 220, unit: "200g Box", category: "Cookies", image: c3 },
  { id: "c4", name: "Coconut Jowar Cookies", price: 190, unit: "200g Box", category: "Cookies", image: c4 },

  { id: "m1", name: "Banana Walnut Muffin", price: 60, unit: "1 Piece", category: "Muffins", image: m1 },
  { id: "m2", name: "Blueberry Muffin", price: 70, unit: "1 Piece", category: "Muffins", image: m2 },
  { id: "m3", name: "Chocolate Muffin", price: 70, unit: "1 Piece", category: "Muffins", image: m3 },
  { id: "m4", name: "Carrot Cinnamon Muffin", price: 65, unit: "1 Piece", category: "Muffins", image: m4 },

  { id: "k1", name: "Jowar Vanilla Sponge Cake", price: 550, unit: "500g", category: "Cakes", preorder: true, image: k1 },
  { id: "k2", name: "Jowar Chocolate Cake", price: 650, unit: "500g", category: "Cakes", preorder: true, image: k2 },
  { id: "k3", name: "Jowar Date & Walnut Cake", price: 600, unit: "500g", category: "Cakes", preorder: true, image: k3 },
  { id: "k4", name: "Jowar Fruit & Nut Cake", price: 700, unit: "500g", category: "Cakes", preorder: true, image: k4 },

  { id: "b1", name: "Jowar Sandwich Bread", price: 120, unit: "400g loaf", category: "Breads & Bases", image: b1 },
  { id: "b2", name: "Jowar Multigrain Bread", price: 140, unit: "400g loaf", category: "Breads & Bases", image: b2 },
  { id: "b3", name: "Jowar Pizza Base", price: 90, unit: "2 pcs pack", category: "Breads & Bases", image: b3 },

  { id: "r1", name: "Jowar Jeera Biscuits", price: 160, unit: "200g pack", category: "Biscuits & Rusks", image: r1 },
  { id: "r2", name: "Jowar Ajwain Biscuits", price: 160, unit: "200g pack", category: "Biscuits & Rusks", image: r2 },
  { id: "r3", name: "Jowar Milk Rusk", price: 140, unit: "250g pack", category: "Biscuits & Rusks", image: r3 },
];