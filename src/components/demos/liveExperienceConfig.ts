import { lazy, ComponentType } from "react";
import {
    Monitor,
    Network,
    Megaphone,
    Globe,
    ShoppingCart,
    BarChart3,
    Zap,
    Wifi,
    Shield,
    Cloud,
    TrendingUp,
    Search,
    Filter,
    UtensilsCrossed,
    Store,
    CalendarCheck,
    LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubDemo {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accentColor: string;          // Tailwind text-* class
    accentBg: string;             // Tailwind bg-*/border-* classes
    component: ComponentType;
}

export interface DemoCategory {
    id: string;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    gradient: string;             // CSS gradient string for the category card
    accentColor: string;
    accentBg: string;
    demos: SubDemo[];
}

// ─── Lazy-loaded demo components ─────────────────────────────────────────────

// Business
const PosDemo = lazy(() => import("./business/pos/PosDemo"));
const ErpDemo = lazy(() => import("./business/erp/ErpDemo"));
const AutomationDemo = lazy(() => import("./business/automation/AutomationDemo"));

// Infrastructure
const NetworkDemo = lazy(() => import("./infrastructure/network-visualizer/NetworkDemo"));
const SecurityDemo = lazy(() => import("./infrastructure/security-monitor/SecurityDemo"));
const CloudDemo = lazy(() => import("./infrastructure/cloud-simulator/CloudDemo"));

// Marketing
const CampaignDemo = lazy(() => import("./marketing/campaign-dashboard/CampaignDemo"));
const SeoDemo = lazy(() => import("./marketing/seo-panel/SeoDemo"));
const FunnelDemo = lazy(() => import("./marketing/funnel/FunnelDemo"));

// Web
const RestaurantDemo = lazy(() => import("./web/restaurant/RestaurantDemo"));
const EcommerceDemo = lazy(() => import("./web/ecommerce/EcommerceDemo"));
const BookingDemo = lazy(() => import("./web/booking/BookingDemo"));

// ─── Config ───────────────────────────────────────────────────────────────────

export const demoCategories: DemoCategory[] = [
    {
        id: "business",
        title: "Business Systems",
        subtitle: "ERP · POS · Automation",
        icon: Monitor,
        gradient: "from-blue-600/20 via-primary/10 to-transparent",
        accentColor: "text-blue-400",
        accentBg: "bg-blue-500/10 border-blue-500/30",
        demos: [
            {
                id: "pos",
                title: "POS System",
                description: "Add products, manage cart, apply discounts, and process checkout with receipt view.",
                icon: ShoppingCart,
                accentColor: "text-blue-400",
                accentBg: "bg-blue-500/10 border-blue-500/30",
                component: PosDemo,
            },
            {
                id: "erp",
                title: "ERP Dashboard",
                description: "Live KPIs, inventory tracking, order pipeline, and financial summaries.",
                icon: BarChart3,
                accentColor: "text-cyan-400",
                accentBg: "bg-cyan-500/10 border-cyan-500/30",
                component: ErpDemo,
            },
            {
                id: "automation",
                title: "Automation Flow",
                description: "Visual workflow builder showing automated business process pipelines.",
                icon: Zap,
                accentColor: "text-indigo-400",
                accentBg: "bg-indigo-500/10 border-indigo-500/30",
                component: AutomationDemo,
            },
        ],
    },
    {
        id: "infrastructure",
        title: "Networking & Infrastructure",
        subtitle: "Network · Security · Cloud",
        icon: Network,
        gradient: "from-emerald-600/20 via-teal-500/10 to-transparent",
        accentColor: "text-emerald-400",
        accentBg: "bg-emerald-500/10 border-emerald-500/30",
        demos: [
            {
                id: "network",
                title: "Network Topology",
                description: "Interactive node graph showing live connection status across your infrastructure.",
                icon: Wifi,
                accentColor: "text-emerald-400",
                accentBg: "bg-emerald-500/10 border-emerald-500/30",
                component: NetworkDemo,
            },
            {
                id: "security",
                title: "Cybersecurity Monitor",
                description: "Real-time threat feed, blocked attacks, and system health indicators.",
                icon: Shield,
                accentColor: "text-red-400",
                accentBg: "bg-red-500/10 border-red-500/30",
                component: SecurityDemo,
            },
            {
                id: "cloud",
                title: "Cloud Deployment",
                description: "Animated deployment pipeline with auto-scaling and service health visualization.",
                icon: Cloud,
                accentColor: "text-sky-400",
                accentBg: "bg-sky-500/10 border-sky-500/30",
                component: CloudDemo,
            },
        ],
    },
    {
        id: "marketing",
        title: "Digital Marketing",
        subtitle: "Analytics · SEO · Funnels",
        icon: Megaphone,
        gradient: "from-orange-600/20 via-amber-500/10 to-transparent",
        accentColor: "text-orange-400",
        accentBg: "bg-orange-500/10 border-orange-500/30",
        demos: [
            {
                id: "campaign",
                title: "Campaign Analytics",
                description: "Multi-channel campaign performance with conversion rates and ROI charts.",
                icon: TrendingUp,
                accentColor: "text-orange-400",
                accentBg: "bg-orange-500/10 border-orange-500/30",
                component: CampaignDemo,
            },
            {
                id: "seo",
                title: "SEO Analytics Panel",
                description: "Keyword rankings, backlink profile, and organic traffic trend analysis.",
                icon: Search,
                accentColor: "text-yellow-400",
                accentBg: "bg-yellow-500/10 border-yellow-500/30",
                component: SeoDemo,
            },
            {
                id: "funnel",
                title: "Lead Funnel Visualizer",
                description: "Animated funnel showing lead stages from awareness to conversion.",
                icon: Filter,
                accentColor: "text-pink-400",
                accentBg: "bg-pink-500/10 border-pink-500/30",
                component: FunnelDemo,
            },
        ],
    },
    {
        id: "web",
        title: "Web Development",
        subtitle: "Restaurant · Ecommerce · Booking",
        icon: Globe,
        gradient: "from-purple-600/20 via-violet-500/10 to-transparent",
        accentColor: "text-purple-400",
        accentBg: "bg-purple-500/10 border-purple-500/30",
        demos: [
            {
                id: "restaurant",
                title: "Restaurant Site",
                description: "Fine-dining website with interactive menu and table reservation system.",
                icon: UtensilsCrossed,
                accentColor: "text-amber-400",
                accentBg: "bg-amber-500/10 border-amber-500/30",
                component: RestaurantDemo,
            },
            {
                id: "ecommerce",
                title: "Ecommerce Demo",
                description: "Product catalog, cart management, and checkout flow for online stores.",
                icon: Store,
                accentColor: "text-purple-400",
                accentBg: "bg-purple-500/10 border-purple-500/30",
                component: EcommerceDemo,
            },
            {
                id: "booking",
                title: "Booking Website",
                description: "Service booking platform with calendar, time slots, and confirmation flow.",
                icon: CalendarCheck,
                accentColor: "text-violet-400",
                accentBg: "bg-violet-500/10 border-violet-500/30",
                component: BookingDemo,
            },
        ],
    },
];
