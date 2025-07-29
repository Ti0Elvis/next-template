import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE_PATH = path.join(__dirname, "template");
const COMPONENTS_PATH = path.join(__dirname, "app", "components", "ui");
const HOOKS_PATH = path.join(__dirname, "app", "hooks");

const DEPENDENCIES = [
  "@tanstack/react-query",
  "axios",
  "class-variance-authority",
  "clsx",
  "cookies-next",
  "date-fns",
  "lucide-react",
  "next",
  "next-auth",
  "next-themes",
  "react",
  "react-dom",
  "tailwind-merge",
];

const DEV_DEPENDENCIES = [
  "@eslint/eslintrc",
  "@tailwindcss/postcss",
  "@types/node",
  "@types/react",
  "@types/react-dom",
  "eslint",
  "eslint-config-next",
  "tailwindcss",
  "tw-animate-css",
  "typescript",
];

const COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "switch",
];

export {
  __dirname,
  __filename,
  TEMPLATE_PATH,
  COMPONENTS_PATH,
  HOOKS_PATH,
  DEPENDENCIES,
  DEV_DEPENDENCIES,
  COMPONENTS,
};
