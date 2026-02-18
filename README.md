# Kovira Immersive

Welcome to **Kovira Immersive**, a cutting-edge web application built to deliver a stunning and interactive user experience. This project leverages the power of modern web technologies to create a performant, responsive, and visually appealing interface, featuring immersive 3D elements, smooth animations, and interactive live demos of real-world systems.

## 🚀 Features

-   **Immersive Hero Section**: A captivating first impression with a full-page 3D WebGL background rendered using **React Three Fiber**.
-   **Live Experience Platform**: A comprehensive, category-based interactive demo lab featuring:
    -   **Business Systems**: POS, ERP, and Automation workflows.
    -   **Infrastructure**: Visualization of Networks, Security Threats, and Cloud Architectures.
    -   **Marketing**: Campaign Dashboards, SEO panels, and Funnel visualization.
    -   **Web Solutions**: Interactive samples of Restaurant, Ecommerce, and Booking sites.
-   **Responsive Design**: Fully optimized for all devices, from desktops to mobile phones.
-   **Modern UI/UX**: Built with a sleek design system using **shadcn/ui** and **Tailwind CSS**.
-   **Smooth Animations**: Enhanced user engagement with **GSAP** (GreenSock Animation Platform) and **Framer Motion**.
-   **3D Graphics**: Integrated 3D experiences enabling high-performance WebGL rendering.
-   **Interactive Forms**: Robust contact form with validation using **React Hook Form** and **Zod**.
-   **Performance Optimized**: Fast loading times and optimized assets powered by **Vite**, with code-splitting and lazy-loading for all interactive demos.

## 🛠️ Technology Stack

This project is built using the following technologies:

### Core
-   **[React](https://reactjs.org/)**: UI Library (v18+)
-   **[TypeScript](https://www.typescriptlang.org/)**: Static Typing
-   **[Vite](https://vitejs.dev/)**: Build Tool & Dev Server

### Styling & UI
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework
-   **[shadcn/ui](https://ui.shadcn.com/)**: Reusable components built with Radix UI and Tailwind
-   **[Lucide React](https://lucide.dev/)**: Beautiful & consistent icons

### Animations & 3D
-   **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)**: React renderer for Three.js
-   **[Drei](https://github.com/pmndrs/drei)**: Useful helpers for React Three Fiber
-   **[GSAP](https://gsap.com/)**: Professional-grade animation library for complex scroll-driven timelines
-   **[Framer Motion](https://www.framer.com/motion/)**: Production-ready motion library for React

### State & Logic
-   **[TanStack Query](https://tanstack.com/query/latest)**: Async state management
-   **[React Router](https://reactrouter.com/)**: Client-side routing
-   **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible forms
-   **[Zod](https://zod.dev/)**: TypeScript-first schema validation

## 📂 Project Structure

Here is a comprehensive overview of the project structure to help you navigate and update the codebase.

```text
kovira-immersive/
├── public/                         # Static assets (images, icons, etc.)
├── src/
│   ├── components/                 # React components
│   │   ├── ui/                     # Modular UI components (Button, Input, etc. from shadcn)
│   │   ├── sections/               # Full-page section components (primary source of truth)
│   │   │   ├── About.tsx           # "About Us" section
│   │   │   ├── Contact.tsx         # "Contact" section with form
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   ├── Hero.tsx            # Hero section overlay content
│   │   │   ├── HeroScene.tsx       # Full-page fixed 3D WebGL background (lazy-loaded)
│   │   │   ├── LiveExperience.tsx  # Main container for the interactive demo platform
│   │   │   ├── NavLink.tsx         # Individual navigation link component
│   │   │   ├── Navbar.tsx          # Top navigation bar
│   │   │   ├── Services.tsx        # "Services" listing section with scroll animation
│   │   │   ├── Testimonials.tsx    # Client testimonials carousel
│   │   │   └── WhyChooseUs.tsx     # "Why Choose Us" features grid
│   │   └── demos/                  # Interactive Demo Platform
│   │       ├── liveExperienceConfig.ts  # DATA SOURCE: Config for categories, demos, and lazy loads
│   │       ├── DemoShell.tsx       # Universal UI wrapper for all demos
│   │       ├── business/           # Business Systems Demos
│   │       │   ├── pos/            # Point of Sale (POS) Demo
│   │       │   ├── erp/            # ERP & Inventory Demo
│   │       │   └── automation/     # Workflow Automation Demo
│   │       ├── infrastructure/     # IT Infrastructure Demos
│   │       │   ├── network-visualizer/ # Network Topology Demo
│   │       │   ├── security-monitor/   # Cybersecurity Threat Demo
│   │       │   └── cloud-simulator/    # Cloud Deployment Demo
│   │       ├── marketing/          # Digital Marketing Demos
│   │       │   ├── campaign-dashboard/ # Ad Campaign Analytics Demo
│   │       │   ├── seo-panel/          # SEO Performance Demo
│   │       │   └── funnel/             # Lead Funnel Visualization Demo
│   │       └── web/                # Web Development Demos
│   │           ├── restaurant/     # Restaurant Booking Demo
│   │           ├── ecommerce/      # Online Store Demo
│   │           └── booking/        # Service Appointment Demo
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-mobile.tsx          # Hook to detect mobile viewports
│   │   └── use-toast.ts            # Hook for displaying toast notifications
│   ├── lib/                        # Utility functions
│   │   └── utils.ts                # CN (classnames) helper for Tailwind
│   ├── pages/                      # Application Route Pages
│   │   ├── Index.tsx               # Landing page (assembles all main sections)
│   │   └── NotFound.tsx            # 404 Error page
│   ├── App.tsx                     # Main App Layout (Providers, Routing)
│   ├── main.tsx                    # Application Entry Point
│   ├── index.css                   # Global CSS & Tailwind Directives
│   └── vite-env.d.ts               # Vite TypeScript definitions
├── .gitignore                      # Git ignore rules
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main HTML entry point
├── package.json                    # Project dependencies & scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration (theme, extensions)
├── tsconfig.json                   # TypeScript configuration (root)
├── tsconfig.app.json               # TypeScript configuration (app source)
├── tsconfig.node.json              # TypeScript configuration (Node/Vite config)
├── vite.config.ts                  # Vite configuration
└── vitest.config.ts                # Vitest (unit testing) configuration
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

-   **Node.js** (v18.0.0 or higher)
-   **npm** (comes with Node.js) or **yarn** / **pnpm** / **bun**

## 🏁 Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd kovira-immersive
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:8080` (or the port shown in your terminal).

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode with HMR (Hot Module Replacement).
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Locally preview the production build.
-   `npm run lint`: Lints the codebase to ensure code quality.
-   `npm run test`: Runs the unit test suite via Vitest.

## 🖊️ How to Update Content

The application is structured for easy updates. Here is where to look to change specific parts of the site:

-   **Hero Text / 3D Background**: Modify `src/components/sections/Hero.tsx` for text and `src/components/sections/HeroScene.tsx` for the 3D WebGL elements.
-   **Live Experience Demos**:
    1.  **Registry**: To add/remove demos or categories, edit `src/components/demos/liveExperienceConfig.ts`. This is the single source of truth.
    2.  **Demo Components**: Each demo is in its own folder under `src/components/demos/`.
        -   **Business**: `src/components/demos/business/`
        -   **Infrastructure**: `src/components/demos/infrastructure/`
        -   **Marketing**: `src/components/demos/marketing/`
        -   **Web**: `src/components/demos/web/`
-   **Service Offerings**: Update the data array or layout in `src/components/sections/Services.tsx`.
-   **Testimonials**: Add or remove testimonials in `src/components/sections/Testimonials.tsx`.
-   **About Section**: Edit `src/components/sections/About.tsx`.
-   **Contact Form**: The form logic and fields are in `src/components/sections/Contact.tsx`.
-   **Navigation**: Update nav links in `src/components/sections/Navbar.tsx`.
-   **Footer**: Edit links and content in `src/components/sections/Footer.tsx`.
-   **Colors / Theme**: Update `tailwind.config.ts` or `src/index.css` to change global styles and color variables.
-   **New Pages**: Create a new component in `src/pages/`, then add a route in `src/App.tsx`.

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License.
