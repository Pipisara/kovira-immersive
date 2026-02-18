import { useState } from "react";
import { motion } from "framer-motion";
import { products, Product } from "./pos-data";
import { Wine, Utensils, Beer, Soup, Pizza, Fish, Plus, Search } from "lucide-react";

interface PosProductsProps {
    onAdd: (product: Product) => void;
}

const categories = [
    { name: "Bar", icon: Beer },
    { name: "Food", icon: Utensils },
    { name: "Wine", icon: Wine },
    { name: "Soup", icon: Soup },
    { name: "Pizzas", icon: Pizza },
    { name: "Fish", icon: Fish },
];

export default function PosProducts({ onAdd }: PosProductsProps) {
    const [activeCategory, setActiveCategory] = useState("Food");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = products.filter((p) => {
        const matchesCategory = activeCategory === "All" || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col gap-3 h-full overflow-hidden">
            {/* Search Bar - Ultra Compact */}
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#00b274]/50 text-slate-900"
                />
            </div>

            {/* Category Selector - Compact */}
            <div>
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <h2 className="text-[11px] font-black uppercase text-slate-400 tracking-tighter">Category</h2>
                    <div className="flex gap-1">
                        <Plus className="w-3 h-3 text-[#00b274]" />
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.name;
                        return (
                            <button
                                key={cat.name}
                                onClick={() => setActiveCategory(cat.name)}
                                className={`flex flex-col items-center justify-center min-w-[60px] h-[64px] border rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-[#00b274] border-transparent text-white shadow-md shadow-green-500/20"
                                    : "bg-white border-slate-100 text-slate-400 hover:border-[#00b274]/30"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                                <span className="text-[9px] font-bold leading-none">{cat.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* Special Menu / Grid */}
            <div className="flex-1 overflow-y-auto pr-1 scroll-smooth scrollbar-none">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-[#f8faf8] z-10 py-1">
                    <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-tighter">Special Menu</h3>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-[9px] text-[#00b274] font-bold hover:underline"
                        >
                            Reset
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pb-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onAdd={onAdd} />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-12 text-center">
                            <p className="text-slate-400 text-sm">No products found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
        >
            <div className="w-16 h-16 flex items-center justify-center text-3xl mb-2 bg-slate-50 rounded-full overflow-hidden shrink-0">
                {product.image}
            </div>
            <h4 className="text-[11px] font-bold text-center mb-2 leading-tight min-h-[30px] text-slate-900 line-clamp-2">
                {product.name}
            </h4>
            <button
                onClick={() => onAdd(product)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#00b274] hover:bg-[#009a63] text-white transition-colors"
            >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold">ADD</span>
            </button>
        </motion.div>
    );
}



