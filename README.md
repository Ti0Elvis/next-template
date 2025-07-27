# UI Project Generator

A **command-line tool** to scaffold a modern **Next.js + TailwindCSS** project with optional prebuilt UI components and hooks — inspired by [shadcn/ui](https://ui.shadcn.com/).

> ⚠️ This tool does **not** aim to replace or take credit for [shadcn/ui]. It is simply a utility for convenience and faster setup in personal and internal projects. All UI components are sourced directly from shadcn.

---

## 🔌 React Query Included

React Query ([`@tanstack/react-query`](https://tanstack.com/query/latest)) is pre-configured for efficient and scalable data fetching:

- ✅ Includes a `QueryClient` setup in `src/providers/query-provider.tsx`
- ✅ Wraps the application with `QueryClientProvider` (already wired in your layout)
- ✅ Enables usage of `useQuery`, `useMutation`, and other React Query hooks out of the box

## ✨ Features

- 🔧 Choose a **project name** and **package manager** (`npm` or `pnpm`)
- 🎨 Select UI components to include (e.g., Accordion, Alert, Button)
- ⚡ Automatically sets up:
  - A **Next.js + TailwindCSS** project
  - Preselected **UI components** and **hooks**
  - Project structure under `src/` (with `components/ui`, `hooks`, `lib`, etc.)
  - **React Query** integration with [`@tanstack/react-query`](https://tanstack.com/query/latest)
  - All required dependencies and devDependencies

---

## 🛠️ Usage

Using npm:

```bash
npx @tioelvis/next-template
```

Using pnpm:

```bash
pnpx @tioelvis/next-template
```
