import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Star, ChevronRight, X, Users, Calendar } from "lucide-react";

const menuItems = [
    { name: "Truffle Risotto", price: "$24", emoji: "🍚", tag: "Chef's Pick" },
    { name: "Grilled Salmon", price: "$28", emoji: "🐟", tag: "Popular" },
    { name: "Wagyu Burger", price: "$32", emoji: "🍔", tag: "New" },
    { name: "Tiramisu", price: "$12", emoji: "🍮", tag: "Dessert" },
    { name: "Caesar Salad", price: "$16", emoji: "🥗", tag: "Healthy" },
    { name: "Pasta Carbonara", price: "$22", emoji: "🍝", tag: "Classic" },
];

type BookingStep = "idle" | "form" | "success";

export default function SampleSiteDemo() {
    const [bookingStep, setBookingStep] = useState<BookingStep>("idle");
    const [formData, setFormData] = useState({ name: "", date: "", guests: "2" });

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStep("success");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col overflow-hidden"
        >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-t-xl border-b border-border/40">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[10px] text-muted-foreground">
                    🔒 bistro-lumiere.kovira.demo
                </div>
            </div>

            {/* Website content */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f13] rounded-b-xl relative">
                {/* Hero banner */}
                <div className="relative h-36 bg-gradient-to-br from-amber-900/40 via-orange-900/20 to-background flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: "radial-gradient(circle at 30% 50%, #f59e0b 0%, transparent 60%), radial-gradient(circle at 70% 50%, #ea580c 0%, transparent 60%)"
                    }} />
                    <div className="relative text-center z-10">
                        <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-medium mb-1">Fine Dining</p>
                        <h2 className="text-2xl font-bold text-white font-display">Bistro Lumière</h2>
                        <div className="flex items-center justify-center gap-3 mt-1.5 text-[10px] text-white/60">
                            <span className="flex items-center gap-1"><MapPin size={9} /> Paris, France</span>
                            <span className="flex items-center gap-1"><Star size={9} className="fill-amber-400 text-amber-400" /> 4.9</span>
                            <span className="flex items-center gap-1"><Clock size={9} /> Open Now</span>
                        </div>
                    </div>
                </div>

                {/* Book a table CTA */}
                <div className="px-4 py-3 border-b border-white/5">
                    <button
                        onClick={() => setBookingStep("form")}
                        className="w-full py-2.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                    >
                        <Calendar size={13} />
                        Book a Table
                        <ChevronRight size={13} />
                    </button>
                </div>

                {/* Menu */}
                <div className="px-4 py-3">
                    <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Our Menu</p>
                    <div className="grid grid-cols-2 gap-2">
                        {menuItems.map((item) => (
                            <motion.div
                                key={item.name}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:border-amber-500/40 transition-colors"
                            >
                                <div className="text-2xl mb-1.5">{item.emoji}</div>
                                <p className="text-[11px] font-semibold text-white leading-tight">{item.name}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-amber-400 text-[11px] font-bold">{item.price}</span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        {item.tag}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Booking modal */}
            <AnimatePresence>
                {bookingStep !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="w-full max-w-[280px] bg-card border border-border rounded-2xl p-5 shadow-2xl"
                        >
                            {bookingStep === "form" ? (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-sm">Reserve a Table</h4>
                                        <button
                                            onClick={() => setBookingStep("idle")}
                                            className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <form onSubmit={handleBook} className="space-y-3">
                                        <div>
                                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="John Smith"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-amber-500/50 transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Guests</label>
                                            <div className="flex gap-2 mt-1">
                                                {["1", "2", "3", "4", "5+"].map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, guests: g })}
                                                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${formData.guests === g
                                                                ? "bg-amber-500/20 border-amber-500/60 text-amber-400"
                                                                : "border-border text-muted-foreground hover:border-amber-500/40"
                                                            }`}
                                                    >
                                                        {g}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-2.5 rounded-lg bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Users size={14} />
                                            Confirm Reservation
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-2">
                                    <div className="text-4xl mb-3">🎉</div>
                                    <h4 className="font-bold text-sm mb-1">Reservation Confirmed!</h4>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {formData.name || "Guest"} · {formData.guests} guests
                                    </p>
                                    {formData.date && (
                                        <p className="text-xs text-amber-400 font-medium mb-4">
                                            {new Date(formData.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mb-4">
                                        A confirmation has been sent to your email. We look forward to seeing you!
                                    </p>
                                    <button
                                        onClick={() => { setBookingStep("idle"); setFormData({ name: "", date: "", guests: "2" }); }}
                                        className="px-5 py-2 rounded-lg bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors"
                                    >
                                        Done
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
