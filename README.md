# Muncher Partner Dashboard Frontend

This repository contains the frontend for the Muncher Partner Dashboard app, which serves as a management and administration panel for restaurants and partners in the Muncher food delivery platform.

The application is built using Next.js 16+, Tailwind CSS 4, and TypeScript.

---

## About

**Muncher Partner Dashboard** is the web interface allowing restaurant partners to manage their menus, orders, analytics, and other settings within the Muncher food delivery ecosystem. This codebase contains only the frontend for the partner dashboard. It is meant to be used together with the overall Muncher food delivery backend and services.

Key Features:

- Built with [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) utility-first design
- Authentication-ready (Clerk integration)
- Modern code linting and formatting (ESLint, Prettier)
- Database integration via DrizzleORM
- Local and production database support (PostgreSQL/Neon)
- Live development reload and production build ready
- Testing setup (Vitest, Playwright, Storybook)
- Logging, monitoring, i18n, and more
- Secure by default (Arcjet, Sentry integration, etc.)

---

## Getting Started

To set up the frontend locally:

```shell
git clone <this-repo-url> muncher-partner-dashboard
cd muncher-partner-dashboard
npm install
```

Run the application in development mode:

```shell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For database, authentication, analytics, code linting, and other environment variable setup, see `.env.example` or ask the team for access details.

---

## License

This project is licensed under the MIT License.

---

_Muncher – Food Delivery Platform_
