import { motion } from "framer-motion";
import { products, Product } from "./pos-data";

interface PosProductsProps {
    onAdd: (product: Product) => void;
}

export default function PosProducts({ onAdd }: PosProductsProps) {
    const categories = Array.from(new Set(products.map((p) => p.category)));

    return (
        <div className="flex flex-col gap-4 h-full overflow-y-auto pr-1">
            {categories.map((cat) => (
                <div key={cat}>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                        {cat}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {products
                            .filter((p) => p.category === cat)
                            .map((product) => (
                                <ProductButton key={product.id} product={product} onAdd={onAdd} />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ProductButton({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onAdd(product)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-secondary/60 border border-border/40 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer group"
        >
            <span className="text-2xl">{product.emoji}</span>
            <span className="text-xs font-medium text-foreground/90 text-center leading-tight">
                {product.name}
            </span>
            <span className="text-xs font-bold text-primary">${product.price.toFixed(2)}</span>
        </motion.button>
    );
}
