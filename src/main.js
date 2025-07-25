#!/usr/bin/env node
import {
  copy_components_files,
  copy_hooks_files,
  copy_template_files,
  get_prompts,
  run,
} from "./lib/utils.js";
import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DEPENDENCIES, DEV_DEPENDENCIES } from "./lib/constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Manage Ctrl+C command
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n👋 Exiting..."));
  process.exit(0);
});

async function main() {
  let project_path = "";

  try {
    const { project_name, package_manager, components } = await get_prompts();

    // Creating folder and copying files
    project_path = path.resolve(project_name);

    if (fs.existsSync(project_path)) {
      console.error(chalk.red("❌  A folder with that name already exists"));
      process.exit(1);
    }

    console.log(
      chalk.blue("📁 Creating project in:"),
      chalk.bold(project_name)
    );

    fs.mkdirSync(project_path, { recursive: true });
    const template_path = path.join(__dirname, "template");
    const components_path = path.join(__dirname, "ui", "components");
    const hooks_path = path.join(__dirname, "ui", "hooks");

    copy_template_files(template_path, project_path);
    copy_components_files(components_path, project_path, components);
    copy_hooks_files(hooks_path, components_path, project_path, components);

    // Initialize package.json
    console.log(chalk.cyan("📦 Initializing and configure package.json..."));

    const package_json = {
      name: project_name,
      version: "1.0.0",
      private: true,
      scripts: {
        dev: "next dev --turbopack",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
    };

    const package_json_path = path.join(project_path, "package.json");
    fs.writeFileSync(package_json_path, JSON.stringify(package_json, null, 2));

    // Install dependencies
    console.log(chalk.cyan("⬇️ Installing dependencies..."));

    components.forEach((e) => {
      const component_path = path.resolve(components_path, `${e}.json`);

      if (fs.existsSync(component_path) === false) {
        throw new Error(`Component ${e} not found`);
      }

      const json = JSON.parse(fs.readFileSync(component_path, "utf-8"));

      json.forEach((e) => {
        DEPENDENCIES.push(e);
      });
    });

    if (package_manager === "npm") {
      run(`npm install ${DEPENDENCIES.join(" ")}`, project_path);
      run(`npm install ${DEV_DEPENDENCIES.join(" ")} -D`, project_path);
    }

    if (package_manager === "pnpm") {
      run(`pnpm add ${DEPENDENCIES.join(" ")}`, project_path);
      run(`pnpm add ${DEV_DEPENDENCIES.join(" ")} -D`, project_path);
    }

    if (package_manager === "yarn") {
      run(`yarn add ${DEPENDENCIES.join(" ")}`, project_path);
      run(`yarn add ${DEV_DEPENDENCIES.join(" ")} -D`, project_path);
    }

    console.log(chalk.green("\n✅ Project created successfully! 🚀"));
    process.exit(0);
  } catch (error) {
    console.error(chalk.red("❌ Internal error"), error.message);
    if (fs.existsSync(project_path) === true) {
      fs.rmSync(project_path, { recursive: true, force: true });
    }
    process.exit(1);
  }
}

main();
