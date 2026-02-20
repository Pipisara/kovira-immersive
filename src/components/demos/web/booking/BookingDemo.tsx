import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Search,
    Star,
    MessageCircle,
    Video,
    Phone,

    Clock,
    Filter,
    CheckCircle2,
    X,
    Heart,
    Shield,
    Award,
} from "lucide-react";

/* ─────────────────────────── DATA ─────────────────────────── */

const DOCTORS = [
    {
        id: 1,
        name: "Dr. Ralph Edwards",
        specialty: "Dermatologist",
        rate: 30,
        rating: 4.9,
        reviews: 128,
        available: true,
        avatar: "RE",
        color: "#6366f1",
        bio: "15+ years of experience in dermatology, treating a wide range of conditions from eczema and acne to melanoma screening.",
        tags: ["Skin Allergy Treatment", "Acne Scar Removal"],
        experience: 15,
        patients: "2.4k",
    },
    {
        id: 2,
        name: "Dr. Albert Baja",
        specialty: "Dentist",
        rate: 25,
        rating: 4.7,
        reviews: 95,
        available: true,
        avatar: "AB",
        color: "#0ea5e9",
        bio: "Specialist in cosmetic and restorative dentistry with a gentle approach to patient care.",
        tags: ["Teeth Whitening", "Root Canal"],
        experience: 10,
        patients: "1.8k",
    },
    {
        id: 3,
        name: "Dr. Leslie Alexander",
        specialty: "Psychiatrist",
        rate: 40,
        rating: 4.8,
        reviews: 211,
        available: false,
        avatar: "LA",
        color: "#a855f7",
        bio: "Board-certified psychiatrist focusing on anxiety, depression, and cognitive behavioral therapy.",
        tags: ["CBT", "Anxiety Disorders"],
        experience: 12,
        patients: "3.1k",
    },
    {
        id: 4,
        name: "Dr. Courtney Henry",
        specialty: "Cardiologist",
        rate: 50,
        rating: 4.9,
        reviews: 317,
        available: true,
        avatar: "CH",
        color: "#ef4444",
        bio: "Expert in preventive cardiology and heart disease management with cutting-edge diagnostic tools.",
        tags: ["Heart Disease", "ECG Analysis"],
        experience: 18,
        patients: "5.2k",
    },
    {
        id: 5,
        name: "Dr. Ronald Richards",
        specialty: "Neurologist",
        rate: 45,
        rating: 4.6,
        reviews: 183,
        available: true,
        avatar: "RR",
        color: "#f59e0b",
        bio: "Specializes in epilepsy, migraines, and neurodegenerative diseases.",
        tags: ["Epilepsy", "Migraine"],
        experience: 14,
        patients: "2.9k",
    },
    {
        id: 6,
        name: "Dr. Floyd Miles",
        specialty: "Gastroenterologist",
        rate: 35,
        rating: 4.5,
        reviews: 142,
        available: false,
        avatar: "FM",
        color: "#10b981",
        bio: "Focuses on digestive health, treating conditions of the stomach, intestines, and liver.",
        tags: ["IBS", "Colonoscopy"],
        experience: 11,
        patients: "1.6k",
    },
    {
        id: 7,
        name: "Prof. Brooklyn Green",
        specialty: "Oncologist",
        rate: 60,
        rating: 5.0,
        reviews: 89,
        available: true,
        avatar: "BG",
        color: "#ec4899",
        bio: "Professor of oncology with research background in targeted cancer therapies.",
        tags: ["Chemotherapy", "Tumor Biology"],
        experience: 22,
        patients: "1.2k",
    },
    {
        id: 8,
        name: "Prof. Eleanor Pena",
        specialty: "Immunologist",
        rate: 55,
        rating: 4.8,
        reviews: 76,
        available: true,
        avatar: "EP",
        color: "#14b8a6",
        bio: "Leading researcher in autoimmune disorders and allergy immunotherapy.",
        tags: ["Allergy Testing", "Auto-immune"],
        experience: 19,
        patients: "980",
    },
];

const SPECIALTIES = ["All", "Dermatologist", "Dentist", "Cardiologist", "Neurologist", "Psychiatrist"];

const TIME_SLOTS = [
    { label: "09:00 AM", period: "Morning" },
    { label: "10:30 AM", period: "Morning" },
    { label: "11:00 AM", period: "Morning" },
    { label: "12:30 PM", period: "Afternoon" },
    { label: "01:30 PM", period: "Afternoon" },
    { label: "03:00 PM", period: "Afternoon" },
    { label: "04:30 PM", period: "Evening" },
    { label: "06:00 PM", period: "Evening" },
];

const BOOKED = ["10:30 AM", "01:30 PM"];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function getCalDays(year: number, month: number) {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const arr: (number | null)[] = Array(first).fill(null);
    for (let i = 1; i <= total; i++) arr.push(i);
    return arr;
}

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export default function BookingDemo() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS[0]);
    const [search, setSearch] = useState("");
    const [specialty, setSpecialty] = useState("All");
    const [booked, setBooked] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const calDays = getCalDays(year, month);
    const monthName = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const filtered = useMemo(() =>
        DOCTORS.filter(d =>
            (specialty === "All" || d.specialty === specialty) &&
            d.name.toLowerCase().includes(search.toLowerCase())
        ), [specialty, search]);

    const handleBook = () => {
        if (!selectedTime || booked) return;
        setBooked(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const resetBooking = () => {
        setBooked(false);
        setSelectedTime(null);
    };

    const selectedDateLabel = new Date(year, month, selectedDay)
        .toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    return (
        <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "#f0f4ff" }}>
            {/* Browser chrome */}
            <div style={{ background: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                </div>
                <div style={{ flex: 1, margin: "0 8px", padding: "3px 10px", borderRadius: 6, background: "#f3f4f6", border: "1px solid #e5e7eb", fontSize: 10, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                    🔒 appointments.kovira.demo
                </div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#fff", fontWeight: 700 }}>
                    RZ
                </div>
            </div>

            {/* Main layout */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>

                {/* ── LEFT PANEL: Calendar + Time Slots ── */}
                <div style={{ width: 200, background: "#ffffff", borderRight: "1px solid #e8ecf4", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
                        {/* Header */}
                        <h2 style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 10 }}>Booking Appointment</h2>

                        {/* Calendar */}
                        <div style={{ background: "#f8f9ff", borderRadius: 10, padding: "8px 6px", marginBottom: 10, border: "1px solid #e8ecf4" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <button onClick={prevMonth} style={{ border: "none", background: "none", cursor: "pointer", color: "#6b7280", padding: 2 }}>
                                    <ChevronLeft size={13} />
                                </button>
                                <span style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{monthName}</span>
                                <button onClick={nextMonth} style={{ border: "none", background: "none", cursor: "pointer", color: "#6b7280", padding: 2 }}>
                                    <ChevronRight size={13} />
                                </button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 3 }}>
                                {DAYS_SHORT.map(d => (
                                    <div key={d} style={{ textAlign: "center", fontSize: 8, color: "#9ca3af", fontWeight: 600, padding: "1px 0" }}>{d}</div>
                                ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                                {calDays.map((day, i) => {
                                    const isPast = day && day < today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    const isSel = day === selectedDay;
                                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    return (
                                        <button key={i} disabled={!day || !!isPast}
                                            onClick={() => day && setSelectedDay(day)}
                                            style={{
                                                aspectRatio: "1", border: "none", borderRadius: 5, fontSize: 9, cursor: day && !isPast ? "pointer" : "default",
                                                background: isSel ? "#6366f1" : isToday ? "#ede9fe" : "transparent",
                                                color: isSel ? "#fff" : isPast ? "#d1d5db" : isToday ? "#6366f1" : "#374151",
                                                fontWeight: isSel || isToday ? 700 : 400,
                                                transition: "all .15s",
                                            }}>
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected date label */}
                        <p style={{ fontSize: 9, color: "#6b7280", fontWeight: 600, marginBottom: 8, paddingLeft: 2 }}>
                            {new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                        </p>

                        {/* Time Slots */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {TIME_SLOTS.map(slot => {
                                const isBooked = BOOKED.includes(slot.label);
                                const isSel = selectedTime === slot.label;
                                return (
                                    <button key={slot.label} disabled={isBooked}
                                        onClick={() => !isBooked && setSelectedTime(slot.label)}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "5px 8px", borderRadius: 7, border: `1px solid ${isSel ? "#6366f1" : "#e5e7eb"}`,
                                            background: isSel ? "#ede9fe" : isBooked ? "#f9fafb" : "#fff",
                                            cursor: isBooked ? "not-allowed" : "pointer", transition: "all .15s",
                                        }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                            <Clock size={9} color={isSel ? "#6366f1" : "#9ca3af"} />
                                            <span style={{ fontSize: 10, fontWeight: 600, color: isSel ? "#6366f1" : isBooked ? "#d1d5db" : "#374151" }}>
                                                {slot.label}
                                            </span>
                                        </div>
                                        {isBooked ? (
                                            <span style={{ fontSize: 8, color: "#d1d5db", background: "#f3f4f6", padding: "1px 4px", borderRadius: 4 }}>Taken</span>
                                        ) : (
                                            <span style={{ fontSize: 8, color: isSel ? "#6366f1" : "#9ca3af" }}>{slot.period}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Patient Concerns */}
                        <div style={{ marginTop: 12, padding: "8px", background: "#fef9f0", borderRadius: 8, border: "1px solid #fde68a" }}>
                            <p style={{ fontSize: 9, fontWeight: 700, color: "#92400e", marginBottom: 5 }}>Patient Concerns</p>
                            <p style={{ fontSize: 8.5, color: "#78350f", lineHeight: 1.5, marginBottom: 5 }}>
                                25 years old Male. I've been feeling unwell for a week. Almost every day I experience:
                            </p>
                            <ul style={{ paddingLeft: 12, margin: 0 }}>
                                {["Back pain", "Mild burning", "Blurry vision (occasionally)"].map(c => (
                                    <li key={c} style={{ fontSize: 8, color: "#78350f", marginBottom: 2 }}>• {c}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── MIDDLE PANEL: Doctor List ── */}
                <div style={{ flex: 1, background: "#f0f4ff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Search + Filter bar */}
                    <div style={{ padding: "10px 10px 8px", background: "#f0f4ff", flexShrink: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "5px 8px" }}>
                                <Search size={11} color="#9ca3af" />
                                <input value={search} onChange={e => setSearch(e.target.value)}
                                    placeholder="Search Doctor…"
                                    style={{ border: "none", outline: "none", background: "none", fontSize: 10, color: "#374151", flex: 1 }} />
                            </div>
                            <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", fontSize: 10, color: "#6b7280" }}>
                                <Filter size={11} /> Filter
                            </button>
                        </div>
                        {/* Specialty pills */}
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {SPECIALTIES.map(s => (
                                <button key={s} onClick={() => setSpecialty(s)}
                                    style={{
                                        padding: "3px 8px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 9, fontWeight: 600,
                                        background: specialty === s ? "#6366f1" : "#fff",
                                        color: specialty === s ? "#fff" : "#6b7280",
                                        boxShadow: specialty === s ? "0 2px 8px rgba(99,102,241,.3)" : "none",
                                        transition: "all .15s",
                                    }}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Doctor list — scrollable grid */}
                    <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, alignContent: "start" }}>
                        <AnimatePresence>
                            {filtered.map(doc => {
                                const isSel = selectedDoctor.id === doc.id;
                                return (
                                    <motion.div key={doc.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={() => setSelectedDoctor(doc)}
                                        style={{
                                            background: "#fff", borderRadius: 12, padding: "10px", cursor: "pointer",
                                            border: `1.5px solid ${isSel ? "#6366f1" : "#e8ecf4"}`,
                                            boxShadow: isSel ? "0 4px 16px rgba(99,102,241,.15)" : "0 1px 4px rgba(0,0,0,.05)",
                                            transition: "all .2s",
                                        }}>
                                        {/* Avatar + availability */}
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                                            <div style={{ position: "relative", flexShrink: 0 }}>
                                                <div style={{
                                                    width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${doc.color}22, ${doc.color}44)`,
                                                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: doc.color,
                                                    border: `2px solid ${doc.color}33`,
                                                }}>
                                                    {doc.avatar}
                                                </div>
                                                <div style={{
                                                    position: "absolute", bottom: -2, right: -2, width: 9, height: 9, borderRadius: "50%",
                                                    background: doc.available ? "#22c55e" : "#9ca3af", border: "1.5px solid #fff",
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 10, fontWeight: 700, color: "#111827", marginBottom: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</p>
                                                <p style={{ fontSize: 9, color: "#6366f1", fontWeight: 600 }}>{doc.specialty}</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                                                    <Star size={8} fill="#f59e0b" color="#f59e0b" />
                                                    <span style={{ fontSize: 9, color: "#374151", fontWeight: 600 }}>{doc.rating}</span>
                                                    <span style={{ fontSize: 8, color: "#9ca3af" }}>({doc.reviews})</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                            <span style={{ fontSize: 9, color: "#6b7280" }}>${doc.rate}<span style={{ color: "#9ca3af" }}>/hr</span></span>
                                            <span style={{
                                                fontSize: 8, padding: "2px 6px", borderRadius: 20, fontWeight: 600,
                                                background: doc.available ? "#dcfce7" : "#f3f4f6",
                                                color: doc.available ? "#16a34a" : "#9ca3af",
                                            }}>
                                                {doc.available ? "Available" : "Busy"}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", gap: 5 }}>
                                            <button onClick={e => { e.stopPropagation(); setSelectedDoctor(doc); }}
                                                style={{
                                                    flex: 1, padding: "4px 0", borderRadius: 7, border: "none",
                                                    background: isSel ? "#6366f1" : "#ede9fe", color: isSel ? "#fff" : "#6366f1",
                                                    fontSize: 9, fontWeight: 700, cursor: "pointer", transition: "all .15s",
                                                }}>
                                                Book Now
                                            </button>
                                            <button onClick={e => e.stopPropagation()}
                                                style={{ padding: "4px 7px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", color: "#6b7280" }}>
                                                <MessageCircle size={10} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                        {filtered.length === 0 && (
                            <div style={{ gridColumn: "span 2", textAlign: "center", padding: 24, color: "#9ca3af", fontSize: 11 }}>
                                No doctors found
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT PANEL: Doctor Detail ── */}
                <div style={{ width: 190, background: "#ffffff", borderLeft: "1px solid #e8ecf4", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={selectedDoctor.id}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>

                            <p style={{ fontSize: 9, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Detail Doctor</p>

                            {/* Big avatar */}
                            <div style={{ textAlign: "center", marginBottom: 10 }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: 18, background: `linear-gradient(135deg, ${selectedDoctor.color}22, ${selectedDoctor.color}55)`,
                                    display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px",
                                    fontSize: 22, fontWeight: 800, color: selectedDoctor.color,
                                    boxShadow: `0 8px 24px ${selectedDoctor.color}33`,
                                    border: `2px solid ${selectedDoctor.color}44`,
                                }}>
                                    {selectedDoctor.avatar}
                                </div>
                                <p style={{ fontSize: 11, fontWeight: 800, color: "#111827", marginBottom: 2 }}>{selectedDoctor.name}</p>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                                    <span style={{ fontSize: 9, color: "#6366f1", fontWeight: 600 }}>{selectedDoctor.specialty}</span>
                                    <span style={{ fontSize: 9, color: "#d1d5db" }}>·</span>
                                    <span style={{ fontSize: 9, color: "#16a34a", fontWeight: 600 }}>${selectedDoctor.rate}/hr</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={9} fill={i < Math.floor(selectedDoctor.rating) ? "#f59e0b" : "#e5e7eb"} color="none" />
                                    ))}
                                    <span style={{ fontSize: 9, color: "#6b7280" }}>{selectedDoctor.rating}</span>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, marginBottom: 10 }}>
                                {[
                                    { icon: <Award size={10} color="#6366f1" />, val: `${selectedDoctor.experience}+`, label: "Years" },
                                    { icon: <Heart size={10} color="#ef4444" />, val: selectedDoctor.patients, label: "Patients" },
                                    { icon: <Shield size={10} color="#10b981" />, val: `${selectedDoctor.reviews}`, label: "Reviews" },
                                ].map(s => (
                                    <div key={s.label} style={{ background: "#f8f9ff", borderRadius: 8, padding: "5px 4px", textAlign: "center" }}>
                                        <div style={{ marginBottom: 2 }}>{s.icon}</div>
                                        <p style={{ fontSize: 10, fontWeight: 800, color: "#111827" }}>{s.val}</p>
                                        <p style={{ fontSize: 8, color: "#9ca3af" }}>{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Bio */}
                            <div style={{ marginBottom: 10 }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#374151", marginBottom: 4 }}>About</p>
                                <p style={{ fontSize: 9, color: "#6b7280", lineHeight: 1.6 }}>{selectedDoctor.bio}</p>
                            </div>

                            {/* Tags */}
                            <div style={{ marginBottom: 10 }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Specializations</p>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {selectedDoctor.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: 8, padding: "2px 7px", borderRadius: 20, background: "#ede9fe", color: "#6366f1", fontWeight: 600 }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Selected slot summary */}
                            {selectedTime && (
                                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                    style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "7px 8px", marginBottom: 10 }}>
                                    <p style={{ fontSize: 9, fontWeight: 700, color: "#16a34a", marginBottom: 3 }}>Selected Slot</p>
                                    <p style={{ fontSize: 9, color: "#15803d" }}>
                                        {new Date(year, month, selectedDay).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: "#14532d" }}>{selectedTime}</p>
                                </motion.div>
                            )}

                            {/* Action buttons */}
                            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
                                <button style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                                    <Video size={12} />
                                </button>
                                <button style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                                    <Phone size={12} />
                                </button>
                                <button style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                                    <MessageCircle size={12} />
                                </button>
                            </div>

                            {/* Book button */}
                            <button onClick={handleBook}
                                disabled={!selectedTime || !selectedDoctor.available}
                                style={{
                                    width: "100%", padding: "8px 0", borderRadius: 10, border: "none",
                                    background: !selectedTime || !selectedDoctor.available
                                        ? "#f3f4f6"
                                        : booked
                                            ? "#dcfce7"
                                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    color: !selectedTime || !selectedDoctor.available ? "#9ca3af" : booked ? "#16a34a" : "#fff",
                                    fontSize: 10, fontWeight: 700, cursor: selectedTime && selectedDoctor.available ? "pointer" : "not-allowed",
                                    transition: "all .2s",
                                    boxShadow: selectedTime && selectedDoctor.available && !booked ? "0 4px 14px rgba(99,102,241,.4)" : "none",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                                }}>
                                {!selectedDoctor.available ? (
                                    <><X size={11} /> Not Available</>
                                ) : booked ? (
                                    <><CheckCircle2 size={11} /> Booked!</>
                                ) : !selectedTime ? (
                                    "Select a Time Slot"
                                ) : (
                                    "Book Now"
                                )}
                            </button>
                            {booked && (
                                <button onClick={resetBooking}
                                    style={{ width: "100%", marginTop: 5, padding: "5px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 9, cursor: "pointer", fontWeight: 600 }}>
                                    Reset
                                </button>
                            )}

                            {/* Review snippet */}
                            <div style={{ marginTop: 10, padding: "8px", background: "#fafafa", borderRadius: 8, border: "1px solid #f3f4f6" }}>
                                <p style={{ fontSize: 9, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Top Review</p>
                                <p style={{ fontSize: 8.5, color: "#6b7280", lineHeight: 1.6, fontStyle: "italic" }}>
                                    "Dr. {selectedDoctor.name.split(" ")[1]} was always very caring and listening, does an amazing job in terms of explaining."
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 4 }}>
                                    {[...Array(5)].map((_, i) => <Star key={i} size={7} fill="#f59e0b" color="none" />)}
                                    <span style={{ fontSize: 8, color: "#9ca3af" }}>Verified Patient</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Booking Success Toast ── */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            borderRadius: 12, padding: "10px 18px",
                            display: "flex", alignItems: "center", gap: 8,
                            boxShadow: "0 8px 32px rgba(99,102,241,.4)",
                            zIndex: 99,
                        }}>
                        <CheckCircle2 size={16} color="#fff" />
                        <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#fff", margin: 0 }}>Appointment Booked!</p>
                            <p style={{ fontSize: 9, color: "rgba(255,255,255,.7)", margin: 0 }}>
                                {selectedDoctor.name} · {selectedTime} · {new Date(year, month, selectedDay).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
