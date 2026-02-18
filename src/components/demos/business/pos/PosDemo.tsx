import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product, CartItem, Order, TAX_RATE, DISCOUNT_RATE, SERVICE_CHARGE } from "./pos-data";
import PosProducts from "./PosProducts";
import PosCheckout from "./PosCheckout";
import {
    LayoutDashboard,
    ListOrdered,
    History,
    Wallet,
    Settings,
    HelpCircle,
    LogOut,
    Bell,
    ChevronLeft,
    ChevronRight,
    UtensilsCrossed,
    Search,
    Clock,
    CheckCircle2
} from "lucide-react";

export default function PosDemo() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [receiptVisible, setReceiptVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("Menu");
    const [orderSearchQuery, setOrderSearchQuery] = useState("");

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const changeQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
                .filter((i) => i.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((i) => i.id !== id));
    };

    const handleCheckout = (orderType: string) => {
        if (cart.length === 0) return;

        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = discountApplied ? subtotal * DISCOUNT_RATE : 0;
        const serviceCharge = subtotal * SERVICE_CHARGE;
        const tax = (subtotal - discount + serviceCharge) * TAX_RATE;
        const total = subtotal - discount + serviceCharge + tax;

        const newOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
            items: [...cart],
            subtotal,
            discount,
            serviceCharge,
            tax,
            total,
            timestamp: new Date(),
            orderType
        };

        setOrders([newOrder, ...orders]);
        setReceiptVisible(true);
    };

    const handleCloseReceipt = () => {
        setReceiptVisible(false);
        setCart([]);
        setDiscountApplied(false);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Menu" },
        { icon: ListOrdered, label: "Order List" },
        { icon: History, label: "History" },
        { icon: Wallet, label: "Bills" },
        { icon: Settings, label: "Setting" },
        { icon: HelpCircle, label: "Help Center" },
    ];

    return (
        <div className="h-full flex flex-col md:flex-row bg-[#f8faf8] overflow-hidden font-sans text-slate-900 border border-slate-200/50 rounded-2xl relative">
            {/* Left Sidebar - Hidden on small mobile or collapsible */}
            <div className="hidden md:flex w-48 bg-white flex-col py-6 px-4 border-r border-slate-100 shrink-0">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-8 h-8 bg-[#00b274] rounded-lg flex items-center justify-center text-white">
                        <UtensilsCrossed size={16} />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-slate-900">Foodlogo</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === item.label
                                ? "bg-[#00b274]/10 text-[#00b274] font-bold border-r-2 border-[#00b274] rounded-r-none -mr-4"
                                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="text-xs">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button
                    onClick={() => alert("Logging out...")}
                    className="flex items-center gap-3 px-3 py-2 mt-auto text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-xs font-medium">Logout</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Top Profile Bar - Ultra Compact */}
                <div className="h-10 flex items-center justify-between md:justify-end px-4 gap-3 shrink-0 bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-100 md:border-none">
                    {/* Mobile menu trigger */}
                    <div className="md:hidden flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#00b274] rounded-md flex items-center justify-center text-white">
                            <UtensilsCrossed size={12} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-900 leading-none">John Deo</p>
                            <p className="text-[8px] text-slate-400 font-medium">06:33am</p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden ring-1 ring-white shadow-sm">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="User" />
                        </div>
                        <button className="p-1 rounded-full bg-white border border-slate-200 relative shadow-sm text-slate-400">
                            <Bell size={12} />
                            <span className="absolute top-0.5 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </div>

                {/* Dashboard Grid / View Router */}
                <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {activeTab === "Menu" ? (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col lg:flex-row"
                            >
                                <div className="flex-1 p-3 md:p-4 overflow-hidden">
                                    <PosProducts onAdd={addToCart} />
                                </div>

                                {/* Right Checkout Panel - Collapsible or sidebar on desktop */}
                                <div className="hidden lg:flex w-[340px] bg-white border-l border-slate-100 p-6 flex-col overflow-hidden shadow-[-4px_0_10px_rgba(0,0,0,0.01)]">
                                    <PosCheckout
                                        cart={cart}
                                        discountApplied={discountApplied}
                                        receiptVisible={receiptVisible}
                                        onQtyChange={changeQty}
                                        onRemove={removeItem}
                                        onToggleDiscount={() => setDiscountApplied((d) => !d)}
                                        onCheckout={handleCheckout}
                                        onCloseReceipt={handleCloseReceipt}
                                    />
                                </div>

                                {/* Mobile Checkout Float (Simplified) */}
                                <div className="lg:hidden p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Items: {cart.length}</p>
                                        <p className="text-sm font-black">${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab("Checkout")}
                                        className="bg-[#00b274] text-white px-6 py-2 rounded-xl text-xs font-bold"
                                    >
                                        View Cart
                                    </button>
                                </div>
                            </motion.div>
                        ) : activeTab === "Checkout" ? (
                            <motion.div
                                key="checkout"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="h-full p-4 overflow-y-auto bg-white"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <button onClick={() => setActiveTab("Menu")} className="p-2 rounded-lg bg-slate-100"><ChevronLeft size={16} /></button>
                                    <h2 className="font-bold">Checkout</h2>
                                </div>
                                <PosCheckout
                                    cart={cart}
                                    discountApplied={discountApplied}
                                    receiptVisible={receiptVisible}
                                    onQtyChange={changeQty}
                                    onRemove={removeItem}
                                    onToggleDiscount={() => setDiscountApplied((d) => !d)}
                                    onCheckout={handleCheckout}
                                    onCloseReceipt={handleCloseReceipt}
                                />
                            </motion.div>
                        ) : activeTab === "History" || activeTab === "Order List" ? (
                            <motion.div
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-4 md:p-6 h-full flex flex-col overflow-hidden"
                            >
                                <div className="max-w-4xl w-full mx-auto flex flex-col h-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sticky top-0 bg-[#f8faf8] z-10 py-2">
                                        <h2 className="text-xl font-black">{activeTab}</h2>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                placeholder="Search orders..."
                                                value={orderSearchQuery}
                                                onChange={(e) => setOrderSearchQuery(e.target.value)}
                                                className="w-full sm:w-64 pl-10 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#00b274]/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 pb-8 scroll-smooth">
                                        {orders.filter(o => o.id.toLowerCase().includes(orderSearchQuery.toLowerCase())).length === 0 ? (
                                            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <Clock size={20} className="text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 text-sm font-medium">No orders found.</p>
                                            </div>
                                        ) : (
                                            orders
                                                .filter(o => o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()))
                                                .map((order) => (
                                                    <div key={order.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="w-10 h-10 bg-[#00b274]/10 rounded-xl flex items-center justify-center text-[#00b274] shrink-0">
                                                            <CheckCircle2 size={18} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-sm truncate">{order.id}</p>
                                                            <p className="text-[10px] text-slate-400 truncate">{order.timestamp.toLocaleTimeString()}</p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-sm font-black text-slate-900">${order.total.toFixed(2)}</p>
                                                            <p className="text-[8px] font-bold uppercase text-[#00b274] bg-[#00b274]/10 px-1.5 py-0.5 rounded-md mt-1">
                                                                {order.orderType}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="other"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center h-full p-4"
                            >
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Settings size={24} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold">In Development</h3>
                                    <p className="text-slate-400 text-sm mt-1">Experimental feature.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

