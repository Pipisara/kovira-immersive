import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Search, Heart, Package, ChevronDown, MapPin, Mail, Phone, Clock, ArrowRight } from "lucide-react";

// Mock Data matching the user's request
interface Product {
    id: string;
    name: string;
    category: string;
    price: number | string; // Allow ranges like "1,200 - 3,800"
    rating: number;
    image: string;
    isSale?: boolean;
    isHot?: boolean;
}

const categories = [
    { name: "Gift Item", count: 3, subs: ["Bouquet", "Pipe cleaner"] },
    { name: "Wooden Product", count: 32, subs: ["Lighting", "Rack", "Wall Shelves"] },
];

const products: Product[] = [
    { id: "p1", name: "Floating Shelves", category: "Wall Shelves", price: "1,200.00 - 3,800.00", rating: 4.5, image: "/images/ecommerce/p1.jpg", isHot: true },
    { id: "p2", name: "Honeycomb Shelves", category: "Wall Shelves", price: "900.00 - 1,100.00", rating: 4.8, image: "/images/ecommerce/p2.jpg" },
    { id: "p3", name: "Z-Line Floating Plant Holder", category: "Wall Shelves", price: "4,800.00", rating: 4.9, image: "/images/ecommerce/p3.jpg" },
    { id: "p4", name: "Wall Shelve Medium", category: "Wall Shelves", price: "6,200.00 - 7,800.00", rating: 4.6, image: "/images/ecommerce/p4.jpg" },
    { id: "p5", name: "Linear Wall Shelf", category: "Wall Shelves", price: "4,400.00 - 7,600.00", rating: 4.4, image: "/images/ecommerce/p5.jpg" },
    { id: "p6", name: "Geometric Organizer Shelf", category: "Rack", price: "7,800.00 - 14,800.00", rating: 4.7, image: "/images/ecommerce/p6.jpg", isSale: true },
    { id: "p7", name: "Lunara Light", category: "Lighting", price: "3,200.00", rating: 4.9, image: "/images/ecommerce/p7.jpg", isSale: true, isHot: true },
    { id: "p8", name: "Elegance Block Shelf (TWO)", category: "Wall Shelves", price: "4,990.00", rating: 4.5, image: "/images/ecommerce/p8.jpg" },
    // Added mock data for other categories using existing images
    { id: "p9", name: "Red Rose Bouquet", category: "Bouquet", price: "1,500.00", rating: 4.9, image: "/images/ecommerce/p6.jpg", isHot: true },
    { id: "p10", name: "DIY Pipe Cleaner Kit", category: "Pipe cleaner", price: "450.00", rating: 4.3, image: "/images/ecommerce/p5.jpg" },
];

type Page = "home" | "shop" | "about" | "contact";

export default function EcommerceDemo() {
    const [cart, setCart] = useState<Product[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>("Wall Shelves");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutComplete, setCheckoutComplete] = useState(false);
    const [page, setPage] = useState<Page>("shop");

    // Filter products
    const filteredProducts = activeCategory
        ? products.filter(p => p.category === activeCategory)
        : products;

    const addToCart = (p: Product) => {
        setCart([...cart, p]);
        setCartOpen(true);
    };

    const toggleWishlist = (id: string) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleCheckout = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            setIsCheckingOut(false);
            setCheckoutComplete(true);
            setTimeout(() => {
                setCart([]);
                setCheckoutComplete(false);
                setCartOpen(false);
            }, 2000);
        }, 1500);
    };

    const navigate = (p: Page) => {
        setPage(p);
        if (p === "shop" && !activeCategory) {
            setActiveCategory("Wall Shelves");
        }
    };

    return (
        <div className="h-full flex flex-col bg-white overflow-hidden font-sans text-gray-800">
            {/* Top Navigation Bar / Header */}
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0 bg-white z-10">
                <div className="flex items-center gap-8">
                    <div className="text-xl font-bold tracking-tight cursor-pointer" onClick={() => navigate("home")}>
                        KOVIRA<span className="text-orange-500">.</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
                        <span
                            onClick={() => navigate("home")}
                            className={`cursor-pointer hover:text-gray-900 transition-colors ${page === "home" ? "text-gray-900 font-bold" : ""}`}
                        >
                            Home
                        </span>
                        <span
                            onClick={() => navigate("shop")}
                            className={`cursor-pointer hover:text-gray-900 transition-colors ${page === "shop" ? "text-gray-900 font-bold" : ""}`}
                        >
                            Shop
                        </span>
                        <span
                            onClick={() => navigate("about")}
                            className={`cursor-pointer hover:text-gray-900 transition-colors ${page === "about" ? "text-gray-900 font-bold" : ""}`}
                        >
                            About
                        </span>
                        <span
                            onClick={() => navigate("contact")}
                            className={`cursor-pointer hover:text-gray-900 transition-colors ${page === "contact" ? "text-gray-900 font-bold" : ""}`}
                        >
                            Contact
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Search className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <div className="relative cursor-pointer" onClick={() => setCartOpen(true)}>
                        <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] items-center justify-center flex rounded-full font-bold">
                                {cart.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {page === "shop" && (
                    <>
                        {/* Sidebar */}
                        <div className="w-64 border-r border-gray-100 p-6 overflow-y-auto hidden md:block shrink-0">
                            <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
                            <div className="space-y-6">
                                <div
                                    className={`text-sm cursor-pointer font-medium mb-2 ${activeCategory === null ? "text-orange-500" : "text-gray-500 hover:text-gray-800"}`}
                                    onClick={() => setActiveCategory(null)}
                                >
                                    All Products
                                </div>
                                {categories.map((cat) => (
                                    <div key={cat.name}>
                                        <div className="flex justify-between items-center text-sm font-medium mb-2 text-gray-700">
                                            <span>{cat.name}</span>
                                            <span className="text-gray-400">({cat.count})</span>
                                        </div>
                                        <div className="pl-4 space-y-2 border-l border-gray-100 ml-1">
                                            {cat.subs.map(sub => (
                                                <div
                                                    key={sub}
                                                    onClick={() => setActiveCategory(sub)}
                                                    className={`text-sm cursor-pointer transition-colors ${activeCategory === sub ? "text-orange-500 font-medium" : "text-gray-500 hover:text-gray-800"}`}
                                                >
                                                    {sub}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10">
                                <h3 className="font-bold text-lg mb-4 text-gray-800">Hottest Deals</h3>
                                <div className="space-y-4">
                                    {products.filter(p => p.isHot).slice(0, 2).map(p => (
                                        <div key={p.id} className="group cursor-pointer" onClick={() => addToCart(p)}>
                                            <div className="relative aspect-square bg-gray-50 overflow-hidden mb-2 rounded-lg">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                {p.isSale && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Sale</span>}
                                            </div>
                                            <div className="text-sm font-medium text-gray-800 leading-tight group-hover:text-orange-500 transition-colors">{p.name}</div>
                                            <div className="text-xs text-gray-500 mt-1 line-through">৳ 3,800.00</div>
                                            <div className="text-xs font-bold text-gray-900">৳ {p.price}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {filteredProducts.length} results
                                    {activeCategory && <span className="font-medium text-gray-900 ml-1">in {activeCategory}</span>}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                                    Sort by popularity <ChevronDown size={14} />
                                </div>
                            </div>

                            {filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                                    {filteredProducts.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            className="group"
                                        >
                                            <div className="relative bg-gray-50 aspect-square mb-3 overflow-hidden rounded-sm">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                                                {product.isSale && (
                                                    <span className="absolute top-3 right-3 bg-amber-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                                                        Sale
                                                    </span>
                                                )}

                                                {/* Action Buttons Overlay */}
                                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-2 pb-6 bg-gradient-to-t from-black/20 to-transparent">
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110"
                                                    >
                                                        <ShoppingCart size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleWishlist(product.id)}
                                                        className={`w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 ${wishlist.includes(product.id) ? "text-red-500" : "text-gray-800"}`}
                                                    >
                                                        <Heart size={16} fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">{product.category}</div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer">{product.name}</h3>
                                            <div className="text-sm font-medium text-gray-600">
                                                <span className="text-xs mr-0.5">৳</span> {product.price}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                    <Package size={48} className="mb-4 opacity-50" />
                                    <p>No products found in this category.</p>
                                    <button
                                        onClick={() => setActiveCategory(null)}
                                        className="mt-4 text-orange-500 hover:underline text-sm font-medium"
                                    >
                                        View all products
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {page === "home" && (
                    <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col items-center justify-center text-center p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Minimalist Furniture for Modern Living</h1>
                            <p className="text-lg text-gray-600 mb-8">Discover our handcrafted collection of wooden shelves, lighting, and decor.</p>
                            <button
                                onClick={() => navigate("shop")}
                                className="px-8 py-3 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
                            >
                                Shop Now <ArrowRight size={18} />
                            </button>
                        </motion.div>
                        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[products[0], products[1], products[6]].map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(page === "about" || page === "contact") && (
                    <div className="flex-1 overflow-y-auto bg-white p-12 flex flex-col items-center">
                        <div className="max-w-2xl w-full">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">{page === "about" ? "About Us" : "Contact Us"}</h2>

                            {page === "about" ? (
                                <div className="space-y-6 text-gray-600">
                                    <p>Kovira Furniture started with a simple mission: to bring nature's warmth into modern homes through exceptional wooden craftsmanship.</p>
                                    <p>Since 2020, we've been designing sustainable, minimalist pieces that don't just fill a space, but define it.</p>
                                    <div className="grid grid-cols-2 gap-6 mt-8">
                                        <img src="/images/ecommerce/p1.jpg" alt="Workshop" className="rounded-xl w-full h-48 object-cover" />
                                        <img src="/images/ecommerce/p4.jpg" alt="Showroom" className="rounded-xl w-full h-48 object-cover" />
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <MapPin className="text-orange-500 mt-1" />
                                            <div>
                                                <h4 className="font-bold text-gray-900">Our Showroom</h4>
                                                <p className="text-gray-600 text-sm">123 Design Avenue, Creative District<br />Dhaka, Bangladesh</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Mail className="text-orange-500" />
                                            <span className="text-gray-600 text-sm">hello@kovira.demo</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Phone className="text-orange-500" />
                                            <span className="text-gray-600 text-sm">+880 1234 567890</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Clock className="text-orange-500" />
                                            <span className="text-gray-600 text-sm">Mon - Fri: 10:00 AM - 8:00 PM</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Cart Sidebar (Simplified for demo) */}
            <AnimatePresence>
                {cartOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm">
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            className="w-80 h-full bg-white shadow-2xl flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="font-bold text-lg">Shopping Cart</h2>
                                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                {checkoutComplete ? (
                                    <div className="h-full flex flex-col items-center justify-center text-green-500 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                            <Package size={32} />
                                        </div>
                                        <h3 className="font-bold text-lg">Order Placed!</h3>
                                        <p className="text-sm text-gray-500 mt-2">Thank you for your purchase.</p>
                                    </div>
                                ) : cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <Package size={48} className="mb-2 opacity-50" />
                                        <p>Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex gap-3">
                                                <img src={item.image} alt="" className="w-16 h-16 object-cover rounded bg-gray-100" />
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">1 x ৳ {item.price}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <button
                                    onClick={handleCheckout}
                                    disabled={cart.length === 0 || isCheckingOut || checkoutComplete}
                                    className={`w-full py-3 font-bold text-sm rounded transition-all flex items-center justify-center gap-2
                                        ${checkoutComplete ? "bg-green-500 text-white" : "bg-gray-900 text-white hover:bg-orange-600"}
                                        ${(cart.length === 0 && !checkoutComplete) ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {isCheckingOut ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : checkoutComplete ? (
                                        "ORDER CONFIRMED"
                                    ) : (
                                        "CHECKOUT"
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
