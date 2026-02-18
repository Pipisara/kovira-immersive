import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, X, User } from "lucide-react";

const services = [
    { id: "consult", name: "IT Consultation", duration: "60 min", price: "$150", emoji: "💼" },
    { id: "audit", name: "Security Audit", duration: "90 min", price: "$280", emoji: "🔒" },
    { id: "setup", name: "Network Setup", duration: "120 min", price: "$350", emoji: "🌐" },
    { id: "support", name: "Tech Support", duration: "30 min", price: "$75", emoji: "🛠️" },
];

const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
];

const bookedSlots = ["10:00 AM", "02:00 PM"];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
}

type Step = "service" | "date" | "time" | "confirm" | "done";

export default function BookingDemo() {
    const today = new Date();
    const [step, setStep] = useState<Step>("service");
    const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const calDays = getCalendarDays(year, month);
    const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    const reset = () => {
        setStep("service");
        setSelectedService(null);
        setSelectedDay(null);
        setSelectedTime(null);
        setName("");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="h-full flex flex-col overflow-hidden">

            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary/80 rounded-t-xl border-b border-border/40 shrink-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background/60 border border-border/30 text-[10px] text-muted-foreground">
                    🔒 book.kovira.demo
                </div>
            </div>

            {/* Booking content */}
            <div className="flex-1 overflow-y-auto bg-[#0f0f13] rounded-b-xl p-4">
                {/* Progress bar */}
                {step !== "done" && (
                    <div className="flex items-center gap-1.5 mb-4">
                        {(["service", "date", "time", "confirm"] as Step[]).map((s, i) => (
                            <div key={s} className={`flex-1 h-1 rounded-full transition-all ${["service", "date", "time", "confirm"].indexOf(step) >= i
                                    ? "bg-violet-500"
                                    : "bg-white/10"
                                }`} />
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1: Service */}
                    {step === "service" && (
                        <motion.div key="service" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Step 1 of 4</p>
                            <h3 className="text-sm font-bold text-white mb-3">Choose a Service</h3>
                            <div className="space-y-2">
                                {services.map(svc => (
                                    <motion.button key={svc.id} whileHover={{ x: 4 }}
                                        onClick={() => { setSelectedService(svc); setStep("date"); }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedService?.id === svc.id
                                            ? "bg-violet-500/20 border-violet-500/50"
                                            : "bg-white/5 border-white/10 hover:border-violet-500/30"}`}>
                                        <span className="text-2xl">{svc.emoji}</span>
                                        <div className="flex-1">
                                            <p className="text-[11px] font-semibold text-white">{svc.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock size={8} /> {svc.duration}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-violet-400">{svc.price}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Date */}
                    {step === "date" && (
                        <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <button onClick={() => setStep("service")} className="text-white/40 hover:text-white transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <div>
                                    <p className="text-white/60 text-[10px] uppercase tracking-widest">Step 2 of 4</p>
                                    <h3 className="text-sm font-bold text-white">Pick a Date</h3>
                                </div>
                            </div>
                            {/* Mini calendar */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <button onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
                                        className="text-white/40 hover:text-white transition-colors"><ChevronLeft size={14} /></button>
                                    <span className="text-[11px] font-semibold text-white">{monthName}</span>
                                    <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
                                        className="text-white/40 hover:text-white transition-colors"><ChevronRight size={14} /></button>
                                </div>
                                <div className="grid grid-cols-7 gap-0.5 mb-1">
                                    {daysOfWeek.map(d => (
                                        <div key={d} className="text-center text-[9px] text-white/30 font-medium py-0.5">{d[0]}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-0.5">
                                    {calDays.map((day, i) => (
                                        <button key={i} disabled={!day || (day < today.getDate() && month === today.getMonth() && year === today.getFullYear())}
                                            onClick={() => day && setSelectedDay(day)}
                                            className={`aspect-square flex items-center justify-center rounded-lg text-[10px] transition-all ${!day ? "" : selectedDay === day
                                                ? "bg-violet-500 text-white font-bold"
                                                : day < today.getDate() && month === today.getMonth() && year === today.getFullYear()
                                                    ? "text-white/20 cursor-not-allowed"
                                                    : "text-white/70 hover:bg-violet-500/20 hover:text-violet-400 cursor-pointer"}`}>
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {selectedDay && (
                                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    onClick={() => setStep("time")}
                                    className="w-full mt-3 py-2.5 rounded-xl bg-violet-500 text-white text-xs font-bold hover:bg-violet-400 transition-colors">
                                    Continue →
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    {/* Step 3: Time */}
                    {step === "time" && (
                        <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <button onClick={() => setStep("date")} className="text-white/40 hover:text-white transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <div>
                                    <p className="text-white/60 text-[10px] uppercase tracking-widest">Step 3 of 4</p>
                                    <h3 className="text-sm font-bold text-white">Select a Time</h3>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {timeSlots.map(slot => {
                                    const isBooked = bookedSlots.includes(slot);
                                    return (
                                        <button key={slot} disabled={isBooked}
                                            onClick={() => { setSelectedTime(slot); setStep("confirm"); }}
                                            className={`py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${isBooked
                                                ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                                                : selectedTime === slot
                                                    ? "bg-violet-500/20 border-violet-500/50 text-violet-400"
                                                    : "bg-white/5 border-white/10 text-white/70 hover:border-violet-500/40 hover:text-violet-400"}`}>
                                            <Clock size={10} />
                                            {slot}
                                            {isBooked && <span className="text-[9px]">(Booked)</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirm */}
                    {step === "confirm" && (
                        <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex items-center gap-2 mb-3">
                                <button onClick={() => setStep("time")} className="text-white/40 hover:text-white transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <div>
                                    <p className="text-white/60 text-[10px] uppercase tracking-widest">Step 4 of 4</p>
                                    <h3 className="text-sm font-bold text-white">Confirm Booking</h3>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 mb-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40">Service</span>
                                    <span className="text-white font-medium">{selectedService?.name}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40">Date</span>
                                    <span className="text-white font-medium">{new Date(year, month, selectedDay!).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-white/40">Time</span>
                                    <span className="text-white font-medium">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between text-xs border-t border-white/10 pt-2">
                                    <span className="text-white/40">Total</span>
                                    <span className="text-violet-400 font-bold">{selectedService?.price}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 mb-3">
                                <User size={12} className="text-white/40" />
                                <input value={name} onChange={e => setName(e.target.value)}
                                    placeholder="Your name…"
                                    className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none" />
                            </div>
                            <button onClick={() => setStep("done")} disabled={!name.trim()}
                                className="w-full py-2.5 rounded-xl bg-violet-500 text-white text-xs font-bold hover:bg-violet-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                Confirm Booking
                            </button>
                        </motion.div>
                    )}

                    {/* Done */}
                    {step === "done" && (
                        <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center text-center py-4">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mb-4">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </motion.div>
                            <h3 className="text-sm font-bold text-white mb-1">Booking Confirmed!</h3>
                            <p className="text-xs text-white/50 mb-1">{name}</p>
                            <p className="text-xs text-violet-400 font-medium mb-1">{selectedService?.name}</p>
                            <p className="text-xs text-white/40 mb-4">
                                {new Date(year, month, selectedDay!).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {selectedTime}
                            </p>
                            <p className="text-xs text-white/30 mb-4">A confirmation has been sent to your email.</p>
                            <button onClick={reset}
                                className="px-6 py-2 rounded-xl bg-secondary text-xs font-medium hover:bg-secondary/80 transition-colors text-foreground">
                                Book Another
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
