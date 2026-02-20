import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ShoppingCart, Bell, Filter, Star, Minus, Plus,
    UtensilsCrossed, Coffee, Pizza, Sandwich, Salad,
    ChevronRight, Flame, Menu, X, ArrowLeft
} from "lucide-react";

// Types
interface Category {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface Product {
    id: number;
    name: string;
    subName?: string;
    price: number;
    originalPrice?: number;
    rating: number;
    image: string;
    category: string;
    count: number;
}

// Mock Data
const categories: Category[] = [
    { id: "veg-mania", name: "Veg. Mania", icon: <div className="text-xl">🍔</div> },
    { id: "sandwich", name: "Sandwich", icon: <div className="text-xl">🥪</div> },
    { id: "club-veg", name: "Club Veg.", icon: <div className="text-xl">🥗</div> },
    { id: "veg-pizza", name: "Veg. Pizza", icon: <div className="text-xl">🍕</div> },
    { id: "burger", name: "Burger", icon: <div className="text-xl">🍔</div> },
    { id: "macaroni", name: "Macaroni", icon: <div className="text-xl">🍝</div> },
    { id: "french-fries", name: "French Fries", icon: <div className="text-xl">🍟</div> },
    { id: "beverages", name: "Beverages", icon: null }, // Header
    { id: "hot-coffee", name: "Hot-Coffee", icon: <div className="text-xl">☕</div> },
    { id: "ice-tea", name: "Ice-Tea", icon: <div className="text-xl">🥤</div> },
];

const products: Product[] = [
    {
        id: 1,
        name: "Veg. Mania Burger",
        subName: "with lettuce",
        price: 16.36,
        originalPrice: 26.49,
        rating: 4,
        image: "/images/restaurant/burger.jpg",
        category: "veg-mania",
        count: 2
    },
    {
        id: 2,
        name: "Mexican Patty",
        subName: "With Veg. Sammi",
        price: 8.28,
        originalPrice: 12.05,
        rating: 4,
        image: "/images/restaurant/sandwich.jpg",
        category: "sandwich",
        count: 0
    },
    {
        id: 3,
        name: "Turkish Cuisine",
        subName: "Pizza",
        price: 22.54,
        originalPrice: 28.00,
        rating: 5,
        image: "/images/restaurant/pizza.jpg",
        category: "veg-pizza",
        count: 0
    },
    {
        id: 4,
        name: "Veg. Mania Burger",
        subName: "with lettuce",
        price: 20.16,
        originalPrice: 22.96,
        rating: 5,
        image: "/images/restaurant/burger.jpg",
        category: "burger",
        count: 0
    }
];

const ingredients = [
    { name: "Carrot", image: "/images/restaurant/carrot.jpg" },
    { name: "Lettuce", image: "/images/restaurant/lettuce.jpg" },
    { name: "Tomato", image: "/images/restaurant/tomato.jpg" },
    { name: "Cucumber", image: "/images/restaurant/cucumber.jpg" },
];

export default function RestaurantDemo() {
    const [selectedCategory, setSelectedCategory] = useState("veg-mania");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    // Initial load selection handled differently to prevent layout shift issues on small screens
    // We start with null and let user click, or auto-select on mount if screen is large (logic omitted for simplicity)

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setShowDetailPanel(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-800"
        >
            {/* Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border-b border-slate-200 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4 px-3 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-500 shadow-sm">
                    cafe-delight.kovira.demo
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute inset-0 bg-black/50 z-20 md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside className={`
                    absolute inset-y-0 left-0 z-30 bg-white border-r border-slate-100 flex flex-col transition-all duration-300
                    ${isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 md:translate-x-0 md:w-20 lg:w-64"}
                `}>
                    <div className="p-6 flex items-center justify-between md:justify-center lg:justify-start">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                                <UtensilsCrossed size={20} />
                            </div>
                            <h1 className="text-2xl font-bold font-display md:hidden lg:block">Cafe</h1>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden">
                            <X size={20} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 space-y-1">
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3 px-2 md:hidden lg:block">Main Menu</p>
                        {categories.map((cat) => {
                            if (cat.name === "Beverages") {
                                return <p key={cat.id} className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-6 mb-3 px-2 md:hidden lg:block">{cat.name}</p>
                            }
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    title={cat.name}
                                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${selectedCategory === cat.id
                                            ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                            : "text-slate-500 hover:bg-slate-50"
                                        } md:justify-center lg:justify-start`}
                                >
                                    <span className={`p-1 rounded-md shrink-0 ${selectedCategory === cat.id ? "bg-white/20" : "bg-slate-100"}`}>{cat.icon}</span>
                                    <span className="font-medium text-sm md:hidden lg:block">{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative overflow-hidden md:ml-20 lg:ml-64 transition-all duration-300 w-full">
                    {/* Header */}
                    <header className="px-4 md:px-8 py-5 flex items-center justify-between shrink-0 gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-600">
                            <Menu size={24} />
                        </button>

                        <div className="hidden sm:block relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search By Food Name.."
                                className="w-full pl-10 pr-10 py-2.5 bg-white border-none rounded-2xl shadow-sm text-sm focus:ring-2 focus:ring-orange-100 outline-none"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <Filter size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4 ml-auto">
                            <button className="relative w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-500">
                                <ShoppingCart size={20} />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                            </button>
                            <button className="relative w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:text-orange-500">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">1</span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 flex gap-8">
                        {/* Product Grid */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-slate-800 text-orange-400">Delicious Menu</h2>
                                <div className="md:hidden flex px-3 py-1 bg-orange-500 text-white rounded-lg items-center gap-1 shadow-md cursor-pointer">
                                    <Flame size={14} className="fill-white" />
                                    <span className="text-xs font-bold">Offers</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() => handleProductClick(product)}
                                        className={`group relative bg-white rounded-[2rem] p-5 pb-8 cursor-pointer transition-all duration-300 border border-transparent hover:border-orange-100 hover:shadow-xl hover:-translate-y-1 ${selectedProduct?.id === product.id ? "ring-2 ring-orange-500/20 shadow-lg" : "shadow-sm"
                                            }`}
                                    >
                                        <div className="relative mb-4 h-32 flex items-center justify-center">
                                            <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500 bg-slate-100">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400";
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <h3 className="font-bold text-slate-800 leading-tight mb-1">{product.name}</h3>
                                            <p className="text-sm text-slate-500 font-medium mb-3">{product.subName}</p>

                                            <div className="flex justify-center gap-0.5 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < product.rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
                                                    />
                                                ))}
                                            </div>

                                            <div className="flex items-center justify-center gap-3 mb-4">
                                                <span className="text-lg font-bold text-orange-500">${product.price}</span>
                                            </div>

                                            <div className="flex justify-center">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                                    <Plus size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail View (Desktop Fixed) */}
                        <div className="hidden 2xl:flex w-[340px] flex-col flex-shrink-0">
                            <AnimatePresence mode="wait">
                                {selectedProduct ? (
                                    <DetailCard product={selectedProduct} onClose={() => setSelectedProduct(null)} isStatic={true} />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                                        <UtensilsCrossed size={48} className="mb-4 opacity-50" />
                                        <p className="text-center">Select an item to view details</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </main>

                {/* Mobile/Tablet Detail Drawer */}
                <AnimatePresence>
                    {showDetailPanel && selectedProduct && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowDetailPanel(false)}
                                className="absolute inset-0 bg-black/60 z-40 2xl:hidden"
                            />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="absolute top-0 right-0 bottom-0 w-full sm:w-[400px] z-50 p-4 2xl:hidden"
                            >
                                <DetailCard
                                    product={selectedProduct}
                                    onClose={() => setShowDetailPanel(false)}
                                    isStatic={false}
                                />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function DetailCard({ product, onClose, isStatic }: { product: Product, onClose: () => void, isStatic: boolean }) {
    const [count, setCount] = useState(product.count || 1);

    return (
        <motion.div
            initial={isStatic ? { opacity: 0, y: 20 } : { opacity: 1 }}
            animate={isStatic ? { opacity: 1, y: 0 } : { opacity: 1 }}
            exit={isStatic ? { opacity: 0, y: 20 } : { opacity: 1 }}
            className="bg-white rounded-[2.5rem] p-6 shadow-2xl h-full flex flex-col overflow-y-auto relative"
        >
            {!isStatic && (
                <button onClick={onClose} className="absolute top-4 left-4 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 z-10">
                    <ArrowLeft size={20} />
                </button>
            )}

            <div className="w-full relative h-48 mb-6 mt-2 flex-shrink-0">
                <img
                    src={product.image.replace("burger.jpg", "sandwich-detail.jpg")} // Hack to use the wide detailed image for demo
                    alt="Detailed"
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = product.image;
                    }}
                />
            </div>

            <div className="w-full mb-6">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-slate-800 leading-tight w-2/3">{product.name}</h2>
                    <div className="text-right">
                        <span className="block text-xl font-bold text-orange-500">${product.price}</span>
                        {product.originalPrice && <span className="text-xs text-slate-300 line-through">${product.originalPrice}</span>}
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">Description</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Features fresh, savory herbs, and zesty condiments. Savor the essence in <span className="text-orange-400 font-medium">every bite!</span>
                    </p>
                </div>

                <div className="mb-8">
                    <h4 className="text-sm font-bold text-slate-700 mb-3">Ingredients</h4>
                    <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-50/50 p-2 border border-transparent hover:border-orange-200">
                            <div className="w-full h-full bg-orange-200 rounded-full opacity-50" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-50/50 p-2 border border-transparent hover:border-orange-200">
                            <div className="w-full h-full bg-green-200 rounded-full opacity-50" />
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-50/50 p-2 border border-transparent hover:border-orange-200">
                            <div className="w-full h-full bg-red-200 rounded-full opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => setCount(Math.max(1, count - 1))} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-orange-500">
                        <Minus size={14} />
                    </button>
                    <span className="font-bold text-lg w-4 text-center">{count}</span>
                    <button onClick={() => setCount(count + 1)} className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 shadow-md shadow-orange-500/30">
                        <Plus size={14} />
                    </button>
                </div>
                <button className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-500/30 hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    Add To Cart
                </button>
            </div>
        </motion.div>
    );
}
