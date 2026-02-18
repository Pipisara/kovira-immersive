export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
    options?: string[];
    course?: string; // e.g., 'Appetizer', 'Main Course', 'Dessert'
}

export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    serviceCharge: number;
    tax: number;
    total: number;
    timestamp: Date;
    orderType: string;
}

export const products: Product[] = [
    { id: "p1", name: "Super Delicious Pizza", category: "Pizzas", price: 12.0, image: "🍕" },
    { id: "p2", name: "Super Delicious Chicken", category: "Food", price: 15.0, image: "🍗" },
    { id: "p3", name: "Super Delicious Burger", category: "Food", price: 10.0, image: "🍔" },
    { id: "p4", name: "Super Delicious Chips", category: "Food", price: 5.0, image: "🍟" },
    { id: "p5", name: "Salmon Steak", category: "Fish", price: 21.0, image: "🐟" },
    { id: "p6", name: "Red Wine", category: "Wine", price: 8.0, image: "🍷" },
    { id: "p7", name: "Cocktail", category: "Bar", price: 9.0, image: "🍸" },
    { id: "p8", name: "Onion Soup", category: "Soup", price: 6.0, image: "🥣" },
];

export const TAX_RATE = 0.08;
export const DISCOUNT_RATE = 0.1;
export const SERVICE_CHARGE = 0.05;

