# Kovira Immersive

Welcome to **Kovira Immersive**, a cutting-edge web application built to deliver a stunning and interactive user experience. This project leverages the power of modern web technologies to create a performant, responsive, and visually appealing interface, featuring immersive 3D elements and smooth animations.

## 🚀 Features

-   **Immersive Hero Section**: captivating first impression with 3D/interactive elements.
-   **Responsive Design**: Fully optimized for all devices, from desktops to mobile phones.
-   **Modern UI/UX**: Built with a sleek design system using **shadcn-ui** and **Tailwind CSS**.
-   **Smooth Animations**: Enhanced user engagement with **Framer Motion**.
-   **3D Graphics**: Integrated 3D experiences using **React Three Fiber**.
-   **Form Handling**: Robust form validation and management.
-   **Performance Optimized**: Fast loading times and optimized assets powered by **Vite**.

## 🛠️ Technology Stack

This project is built using the following technologies:

-   **Frontend Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn-ui](https://ui.shadcn.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **3D Rendering**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
-   **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

-   **Node.js** (v18.0.0 or higher)
-   **npm** (or yarn/pnpm/bun)

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
    # or
    yarn install
    # or
    bun install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    bun dev
    ```

    The application will be available at `http://localhost:8080` (or the port shown in your terminal).

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run preview`: Locally preview the production build.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run test`: Runs the test suite using Vitest.

## 📂 Project Structure

```
kovira-immersive/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components (Hero, Navbar, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and libraries
│   ├── pages/           # Application pages (Index, NotFound)
│   ├── App.tsx          # Main application component with routing
│   └── main.tsx         # Entry point
├── .eslintrc.js         # ESLint configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by the Kovira Team.
