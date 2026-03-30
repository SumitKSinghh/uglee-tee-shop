import productBlack from "@/assets/product-black.jpg";
import productNavy from "@/assets/product-navy.jpg";
import productGreen from "@/assets/product-green.jpg";
import productOlive from "@/assets/product-olive.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  colors: { name: string; image: string; hex: string }[];
  sizes: string[];
  features: string[];
}

export interface CartItem {
  product: Product;
  color: string;
  size: string;
  quantity: number;
}

export const product: Product = {
  id: "hot-summer-cool-friends-tee",
  name: "Hot Summer Cool Friends Oversized Tee",
  price: 849,
  description:
    "Express your chill vibes with this acid-wash oversized tee featuring our signature 'Hot Summer Cool Friends' popsicle artwork. Made from 100% premium cotton with a relaxed drop-shoulder fit. Perfect for those who embrace the ugly-cool aesthetic.",
  images: [productBlack, productNavy, productGreen, productOlive],
  colors: [
    { name: "Charcoal Black", image: productBlack, hex: "#2a2a2a" },
    { name: "Deep Navy", image: productNavy, hex: "#2a3a4a" },
    { name: "Forest Green", image: productGreen, hex: "#2a4a2a" },
    { name: "Olive Dark", image: productOlive, hex: "#3a3a2a" },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
  features: [
    "100% Premium Cotton",
    "Acid-Wash Finish",
    "Oversized Drop-Shoulder Fit",
    "Ribbed Crew Neck",
    "Machine Washable",
  ],
};

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("uglee-cart") || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem("uglee-cart", JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find(
    (c) => c.product.id === item.product.id && c.color === item.color && c.size === item.size
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(index: number) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem("uglee-cart");
}
