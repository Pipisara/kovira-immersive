import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings2, Repeat, Printer, DollarSign, Tag as TagIcon, X, Plus, Minus, Trash2 } from "lucide-react";
import { CartItem, TAX_RATE, DISCOUNT_RATE, SERVICE_CHARGE } from "./pos-data";

interface PosCheckoutProps {
    cart: CartItem[];
    discountApplied: boolean;
    receiptVisible: boolean;
    onQtyChange: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onToggleDiscount: () => void;
    onCheckout: (orderType: string) => void;
    onCloseReceipt: () => void;
}

export default function PosCheckout({
    cart,
    discountApplied,
    receiptVisible,
    onQtyChange,
    onRemove,
    onToggleDiscount,
    onCheckout,
    onCloseReceipt,
}: PosCheckoutProps) {
    const [activeOrderType, setActiveOrderType] = useState("Dine In");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = discountApplied ? subtotal * DISCOUNT_RATE : 0;
    const serviceCharge = subtotal * SERVICE_CHARGE;
    const tax = (subtotal - discount + serviceCharge) * TAX_RATE;
    const total = subtotal - discount + serviceCharge + tax;

    const orderTypes = ["Dine In", "Takeout", "Curbside"];

    return (
        <div className="flex-1 flex flex-col min-h-0 text-slate-900">
            {/* Header / Customer Info - Ultra Compact */}
            <div className="mb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">Johnson Mitchell</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">
                            JULY 2024 • 00:00PM
                        </p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-[8px] ring-1 ring-slate-100 shadow-sm">
                        IE
                    </div>
                </div>
            </div>

            {/* Quick Actions - Compact */}
            <div className="flex gap-1 mb-3">
                {[Settings2, Repeat, Printer, DollarSign].map((Icon, i) => (
                    <button key={i} className="p-1 px-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-slate-400">
                        <Icon className="w-3 h-3" />
                    </button>
                ))}
                <button
                    onClick={onToggleDiscount}
                    className={`p-1 px-1.5 rounded-lg border transition-all ${discountApplied ? "bg-[#ffbd4f] border-transparent text-white" : "border-slate-200 text-slate-400"}`}
                >
                    <TagIcon className="w-3 h-3" />
                </button>
            </div>

            {/* Order Type Tabs - Ultra Compact */}
            <div className="flex gap-1 mb-3 bg-slate-100/50 p-0.5 rounded-lg">
                {orderTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveOrderType(type)}
                        className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase transition-all ${activeOrderType === type
                            ? "bg-white text-[#00b274] shadow-sm shadow-black/5"
                            : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>


            {/* Order Info Bar - Ultra Compact */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 px-0.5">
                <div>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Order</p>
                    <p className="text-[9px] font-black text-slate-900">#0476</p>
                </div>
                <div className="text-center">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter">Table</p>
                    <p className="text-[9px] font-black text-slate-900">#1</p>
                </div>
                <div className="text-right font-black text-[9px] text-[#00b274] bg-[#00b274]/5 px-1.5 py-0.5 rounded">Austin K.</div>
            </div>

            {/* Cart Items - Flex-1 and Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-3 scrollbar-none">
                <AnimatePresence initial={false}>
                    {cart.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-slate-50/50 p-3 rounded-2xl border border-transparent hover:border-slate-100 transition-all"
                        >
                            <div className="flex justify-between items-start mb-1 gap-2">
                                <span className="text-[11px] font-black text-slate-900 flex-1 truncate">
                                    {item.name} x{item.quantity}
                                </span>
                                <span className="text-[11px] font-black text-slate-900 shrink-0">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-2">
                                <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase">
                                    {item.category === 'Pizzas' ? 'Main' : 'Appetizer'}
                                </span>
                                {item.id === 'p1' && (
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 bg-orange-50 text-orange-500 rounded uppercase">Special</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center bg-white rounded-lg p-0.5 shadow-sm border border-slate-100">
                                    <button onClick={() => onQtyChange(item.id, -1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 transition-colors"><Minus className="w-3 h-3" /></button>
                                    <span className="px-1.5 text-[10px] font-black text-slate-900">{item.quantity}</span>
                                    <button onClick={() => onQtyChange(item.id, 1)} className="p-1 hover:bg-slate-50 rounded text-slate-400 transition-colors"><Plus className="w-3 h-3" /></button>
                                </div>
                                <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Totals - More Compact */}
            <div className="space-y-1 py-3 border-t border-slate-100 h-fit bg-white sticky bottom-0">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Sub Total</span>
                    <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                    <div className="flex justify-between text-[10px] text-orange-400 font-bold uppercase">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                    </div>
                )}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                    <span>Service (5%)</span>
                    <span className="text-slate-900">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase pb-1 border-b border-dashed border-slate-100">
                    <span>Tax (8%)</span>
                    <span className="text-slate-900">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-black pt-2">
                    <span className="text-slate-900 uppercase tracking-tighter">Total</span>
                    <span className="text-[#00b274]">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Action Buttons - Compact */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => alert("Printing invoice...")}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 font-black text-xs hover:bg-slate-200 transition-colors text-slate-900 uppercase tracking-tighter"
                    >
                        Print
                    </button>
                    <button
                        onClick={() => alert("Order sent to kitchen!")}
                        className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-black text-xs hover:bg-orange-600 transition-colors uppercase tracking-tighter shadow-lg shadow-orange-500/20"
                    >
                        Fire
                    </button>
                </div>

                <button
                    onClick={() => onCheckout(activeOrderType)}
                    disabled={cart.length === 0}
                    className="w-full py-3 rounded-xl bg-[#00b274] text-white font-black text-sm hover:bg-[#009a63] disabled:opacity-50 transition-all shadow-lg shadow-green-500/20 uppercase tracking-tight"
                >
                    Charge ${total.toFixed(2)}
                </button>
            </div>


            {/* Receipt Modal (Simulated overlay from previous, adapted) */}
            <AnimatePresence>
                {receiptVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                                        <Plus className="w-6 h-6 rotate-45" />
                                    </div>
                                </div>
                                <h4 className="text-2xl font-bold">Payment Success!</h4>
                                <p className="text-muted-foreground text-sm">Receipt #0476-1203</p>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-4 mb-6">
                                <span>Charged</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={onCloseReceipt}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-bold hover:opacity-90 transition-all"
                            >
                                Done
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

