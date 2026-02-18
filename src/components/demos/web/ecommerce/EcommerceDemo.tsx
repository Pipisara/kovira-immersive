import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Star, Search, Heart, ChevronRight, Package } from "lucide-react";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    rating: number;
    reviews: number;
    emoji: string;
    badge?: string;
}

const products: Product[] = [
    { id: "p1", name: "Wireless Headphones", price: 129, category: "Electronics", rating: 4.8, reviews: 2341, emoji: "🎧", badge: "Bestseller" },
    { id: "p2", name: "Smart Watch", price: 249, category: "Electronics", rating: 4.6, reviews: 1892, emoji: "⌚", badge: "New" },
    { id: "p3", name: "Running Shoes", price: 89, category: "Sports", rating: 4.7, reviews: 3102, emoji: "👟" },
    { id: "p4", name: "Coffee Maker", price: 79, category: "Home", rating: 4.5, reviews: 987, emoji: "☕", badge: "Sale" },
    { id: "p5", name: "Yoga Mat", price: 45, category: "Sports", rating: 4.9, reviews: 4521, emoji: "🧘", badge: "Top Rated" },
    { id: "p6", name: "Desk Lamp", price: 59, category: "Home", rating: 4.4, reviews: 756, emoji: "💡" },
];

interface CartItem extends Product { qty: number; }

export default function EcommerceDemo() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [search, setSearch] = useState("");
    const [checkoutDone, setCheckoutDone] = useState(false);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    const addToCart = (p: Product) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === p.id);
            if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...p, qty: 1 }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
    const toggleWishlist = (id: string) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const itemCount = cart.reduce((s, i) => s + i.qty, 0);

    const handleCheckout = () => {
        setCheckoutDone(true);
        setTimeout(() => {
            setCart([]);
            setCartOpen(false);
            setCheckoutDone(false);
        }, 2500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col overflow-hidden relative">

            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-t-xl border-b border-border/40 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[10px] text-muted-foreground">
                    🔒 shop.kovira.demo
                </div>
            </div>

            {/* Store content */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f13] rounded-b-xl">
                {/* Store header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                        <Search size={11} className="text-white/40" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search products…"
                            className="flex-1 bg-transparent text-[11px] text-white placeholder:text-white/30 outline-none" />
                    </div>
                    <button onClick={() => setCartOpen(true)}
                        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[11px] font-bold hover:bg-purple-400 transition-colors">
                        <ShoppingCart size={12} />
                        Cart
                        {itemCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Products grid */}
                <div className="p-4 grid grid-cols-2 gap-3">
                    {filtered.map(p => (
                        <motion.div key={p.id} whileHover={{ y: -2 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-3 hover:border-purple-500/40 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-3xl">{p.emoji}</span>
                                <button onClick={() => toggleWishlist(p.id)}
                                    className={`transition-colors ${wishlist.includes(p.id) ? "text-red-400" : "text-white/30 hover:text-red-400"}`}>
                                    <Heart size={13} fill={wishlist.includes(p.id) ? "currentColor" : "none"} />
                                </button>
                            </div>
                            {p.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">
                                    {p.badge}
                                </span>
                            )}
                            <p className="text-[11px] font-semibold text-white mt-1 leading-tight">{p.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star size={9} className="fill-amber-400 text-amber-400" />
                                <span className="text-[9px] text-white/50">{p.rating} ({p.reviews.toLocaleString()})</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-bold text-purple-400">${p.price}</span>
                                <button onClick={() => addToCart(p)}
                                    className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-400 text-[10px] font-medium hover:bg-purple-500/30 transition-colors">
                                    Add
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cart drawer */}
            <AnimatePresence>
                {cartOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex justify-end bg-background/70 backdrop-blur-sm rounded-xl">
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-56 h-full bg-card border-l border-border flex flex-col rounded-r-xl">
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <h4 className="font-bold text-sm">Cart ({itemCount})</h4>
                                <button onClick={() => setCartOpen(false)}
                                    className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
                                    <X size={12} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-24 text-muted-foreground gap-2">
                                        <Package size={24} className="opacity-40" />
                                        <span className="text-xs">Your cart is empty</span>
                                    </div>
                                ) : cart.map(item => (
                                    <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/30">
                                        <span className="text-xl">{item.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-purple-400">${(item.price * item.qty).toFixed(0)}</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs text-muted-foreground">×{item.qty}</span>
                                            <button onClick={() => removeFromCart(item.id)}
                                                className="w-4 h-4 rounded flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors">
                                                <X size={9} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {cart.length > 0 && (
                                <div className="p-3 border-t border-border">
                                    <div className="flex justify-between text-sm font-bold mb-3">
                                        <span>Total</span>
                                        <span className="text-purple-400">${total.toFixed(0)}</span>
                                    </div>
                                    <button onClick={handleCheckout}
                                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${checkoutDone
                                            ? "bg-green-500 text-white"
                                            : "bg-purple-500 text-white hover:bg-purple-400"}`}>
                                        {checkoutDone ? "✓ Order Placed!" : <><ChevronRight size={13} /> Checkout</>}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
