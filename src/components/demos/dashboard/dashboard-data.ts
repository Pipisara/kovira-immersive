export interface KpiData {
    label: string;
    value: string;
    change: string;
    positive: boolean;
}

export interface OrderItem {
    id: string;
    customer: string;
    items: number;
    total: string;
    status: "completed" | "pending" | "processing";
    time: string;
}

export interface WeeklyData {
    day: string;
    sales: number;
}

export const kpiData: KpiData[] = [
    { label: "Today's Revenue", value: "$4,821", change: "+12.4%", positive: true },
    { label: "Orders", value: "138", change: "+8.1%", positive: true },
    { label: "Avg Order Value", value: "$34.94", change: "-2.3%", positive: false },
    { label: "Top Product", value: "Espresso", change: "42 sold", positive: true },
];

export const recentOrders: OrderItem[] = [
    { id: "#1042", customer: "Sarah M.", items: 3, total: "$18.50", status: "completed", time: "2 min ago" },
    { id: "#1041", customer: "James K.", items: 1, total: "$4.50", status: "completed", time: "5 min ago" },
    { id: "#1040", customer: "Priya S.", items: 5, total: "$42.00", status: "processing", time: "8 min ago" },
    { id: "#1039", customer: "Tom R.", items: 2, total: "$11.00", status: "pending", time: "12 min ago" },
    { id: "#1038", customer: "Ana L.", items: 4, total: "$29.50", status: "completed", time: "18 min ago" },
];

export const weeklyData: WeeklyData[] = [
    { day: "Mon", sales: 3200 },
    { day: "Tue", sales: 4100 },
    { day: "Wed", sales: 3800 },
    { day: "Thu", sales: 5200 },
    { day: "Fri", sales: 4800 },
    { day: "Sat", sales: 6100 },
    { day: "Sun", sales: 4821 },
];
