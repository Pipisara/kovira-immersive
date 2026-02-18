import { useState } from "react";
import { motion } from "framer-motion";
import { Product, CartItem } from "./pos-data";
import PosProducts from "./PosProducts";
import PosCheckout from "./PosCheckout";

export default function PosDemo() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [receiptVisible, setReceiptVisible] = useState(false);

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

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setReceiptVisible(true);
    };

    const handleCloseReceipt = () => {
        setReceiptVisible(false);
        setCart([]);
        setDiscountApplied(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col"
        >
            {/* POS Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        KOVIRA POS — Live Demo
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
            </div>

            {/* Main layout */}
            <div className="flex-1 grid grid-cols-[1fr_220px] gap-4 min-h-0 overflow-hidden">
                {/* Products panel */}
                <div className="overflow-hidden">
                    <PosProducts onAdd={addToCart} />
                </div>

                {/* Checkout panel */}
                <div className="glass rounded-xl p-3 overflow-hidden flex flex-col">
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
            </div>
        </motion.div>
    );
}
