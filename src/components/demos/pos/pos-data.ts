export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    emoji: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export const products: Product[] = [
    { id: "p1", name: "Espresso", category: "Beverages", price: 3.5, emoji: "☕" },
    { id: "p2", name: "Cappuccino", category: "Beverages", price: 4.5, emoji: "🍵" },
    { id: "p3", name: "Latte", category: "Beverages", price: 5.0, emoji: "🥛" },
    { id: "p4", name: "Croissant", category: "Food", price: 3.0, emoji: "🥐" },
    { id: "p5", name: "Sandwich", category: "Food", price: 7.5, emoji: "🥪" },
    { id: "p6", name: "Muffin", category: "Food", price: 2.5, emoji: "🧁" },
    { id: "p7", name: "Cheesecake", category: "Food", price: 6.0, emoji: "🍰" },
    { id: "p8", name: "Mineral Water", category: "Beverages", price: 2.0, emoji: "💧" },
];

export const TAX_RATE = 0.08;
export const DISCOUNT_RATE = 0.1;
