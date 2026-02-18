import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Tag, X } from "lucide-react";
import { CartItem, TAX_RATE, DISCOUNT_RATE } from "./pos-data";

interface PosCheckoutProps {
    cart: CartItem[];
    discountApplied: boolean;
    receiptVisible: boolean;
    onQtyChange: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onToggleDiscount: () => void;
    onCheckout: () => void;
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
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = discountApplied ? subtotal * DISCOUNT_RATE : 0;
    const tax = (subtotal - discount) * TAX_RATE;
    const total = subtotal - discount + tax;

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-foreground">Current Order</h3>
                <span className="text-xs text-muted-foreground">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                <AnimatePresence initial={false}>
                    {cart.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm gap-2"
                        >
                            <span className="text-3xl">🛒</span>
                            <span>Add items to get started</span>
                        </motion.div>
                    ) : (
                        cart.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/30"
                            >
                                <span className="text-lg">{item.emoji}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{item.name}</p>
                                    <p className="text-xs text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onQtyChange(item.id, -1)}
                                        className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-primary/20 transition-colors"
                                    >
                                        <Minus size={10} />
                                    </button>
                                    <span className="text-xs w-4 text-center font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => onQtyChange(item.id, 1)}
                                        className="w-5 h-5 rounded flex items-center justify-center bg-secondary hover:bg-primary/20 transition-colors"
                                    >
                                        <Plus size={10} />
                                    </button>
                                    <button
                                        onClick={() => onRemove(item.id)}
                                        className="w-5 h-5 rounded flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors ml-1"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Totals */}
            <div className="mt-3 pt-3 border-t border-border/40 space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountApplied && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex justify-between text-xs text-green-400"
                    >
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                    </motion.div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-foreground pt-1 border-t border-border/40">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
                <button
                    onClick={onToggleDiscount}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${discountApplied
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : "border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                >
                    <Tag size={12} />
                    {discountApplied ? "10% OFF" : "Discount"}
                </button>
                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0}
                    className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed glow-primary"
                >
                    Checkout ${total.toFixed(2)}
                </button>
            </div>

            {/* Receipt overlay */}
            <AnimatePresence>
                {receiptVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                    >
                        <div className="w-full max-w-[240px] bg-card border border-primary/30 rounded-2xl p-5 shadow-2xl glow-primary">
                            <div className="text-center mb-4">
                                <div className="text-3xl mb-2">🧾</div>
                                <h4 className="font-bold text-sm text-foreground">Payment Successful!</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                            <div className="space-y-1 mb-4 max-h-28 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">{item.emoji} {item.name} ×{item.quantity}</span>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border/40 pt-2 mb-4">
                                <div className="flex justify-between text-sm font-bold">
                                    <span>Total Paid</span>
                                    <span className="text-primary">${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mb-3">Thank you for your order! 🎉</p>
                            <button
                                onClick={onCloseReceipt}
                                className="w-full py-2 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1"
                            >
                                <X size={12} /> New Order
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
