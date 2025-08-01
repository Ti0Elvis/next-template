#!/usr/bin/env node

import {
  copy_components,
  copy_template,
  on_cancel,
  run_command,
} from "./utils.js";
import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import prompts from "prompts";
import { COMPONENTS, DEPENDENCIES, DEV_DEPENDENCIES } from "./constants.js";

// Manage Ctrl+C command
process.on("SIGINT", () => on_cancel());

(async function () {
  let DEST;
  const CWD = path.resolve(process.cwd());

  const { is_new_project } = await prompts(
    {
      type: "confirm",
      initial: true,
      name: "is_new_project",
      message: "Is a new project?",
    },
    { onCancel: on_cancel }
  );

  if (is_new_project === true) {
    try {
      if (fs.existsSync(path.join(CWD, "next.config.ts")) === true) {
        throw new Error("Config file already exists");
      }

      const responses = await prompts(
        [
          {
            type: "text",
            name: "project_name",
            message: "What is your project named?",
            validate: (e) => {
              if (e === undefined || e.trim() === "") {
                return chalk.red("⚠️ The name is required");
              }

              if (!/^[a-zA-Z0-9-_]+$/.test(e.trim())) {
                return chalk.red(
                  "⚠️ Use only letters, numbers, dashes, and underscores"
                );
              }

              return true;
            },
          },
          {
            type: "select",
            name: "package_manager",
            message: "Which package manager would you want to use?",
            choices: [
              { title: "npm", value: "npm" },
              { title: "pnpm", value: "pnpm" },
            ],
          },
          {
            type: "multiselect",
            name: "components",
            message: "Which components do you want to install?",
            instructions: false,
            choices: COMPONENTS.map((e) => {
              return { title: e, value: e };
            }),
          },
        ],
        { onCancel: on_cancel }
      );

      const { project_name, package_manager, components } = responses;

      // Creating folder and copying files
      DEST = path.resolve(CWD, project_name);

      if (fs.existsSync(DEST) === true) {
        throw new Error("A folder with that name already exists");
      }

      console.log(chalk.blue("📁 Creating project..."));

      fs.mkdirSync(DEST, { recursive: true });

      copy_template(DEST);
      await copy_components(DEST, components);

      // Initialize package.json
      console.log(chalk.blue("📦 Initializing and configure package.json..."));

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

      const package_json_path = path.join(DEST, "package.json");

      fs.writeFileSync(
        package_json_path,
        JSON.stringify(package_json, null, 2)
      );

      // Install dependencies
      console.log(chalk.cyan("⬇️ Installing dependencies..."));

      if (package_manager === "npm") {
        run_command(`npm install ${DEPENDENCIES.join(" ")}`, DEST);
        run_command(`npm install ${DEV_DEPENDENCIES.join(" ")} -D`, DEST);
      }

      if (package_manager === "pnpm") {
        run_command(`pnpm add ${DEPENDENCIES.join(" ")}`, DEST);
        run_command(`pnpm add ${DEV_DEPENDENCIES.join(" ")} -D`, DEST);
      }

      // Finish project
      console.log(
        chalk.yellow(
          "⚠️ IMPORTANT: make sure to add your variable NEXT_PUBLIC_API in the .env file, e.g.: NEXT_PUBLIC_API=http://localhost:9000"
        )
      );

      if (components.some((e) => e === "sonner") === true) {
        console.log(
          chalk.yellow(
            "⚠️ IMPORTANT: you install the sonner component. Don't forget to add the Toaster in your layout"
          )
        );
      }

      console.log(
        chalk.green(`\n✅ Project ${project_name} created successfully! 🚀`)
      );
    } catch (error) {
      console.error(chalk.red("❌ Internal error:"), error.message);

      if (fs.existsSync(DEST) === true) {
        fs.rmSync(DEST, { recursive: true, force: true });
      }

      process.exit(1);
    }
  }

  if (is_new_project === false) {
    let package_manager;

    try {
      if (fs.existsSync(path.join(CWD, "next.config.ts")) === false) {
        throw new Error("Config file not exists");
      }

      const responses = await prompts(
        [
          {
            type: "multiselect",
            name: "components",
            message: "Which components do you want to install?",
            instructions: false,
            choices: COMPONENTS.map((e) => {
              return { title: e, value: e };
            }),
          },
          {
            type: "select",
            name: "package_manager",
            message: "Which package manager would you want to use?",
            choices: [
              { title: "npm", value: "npm" },
              { title: "pnpm", value: "pnpm" },
            ],
          },
        ],
        { onCancel: on_cancel }
      );

      const { components, package_manager } = responses;

      // Copying files
      DEST = path.resolve(CWD);

      await copy_components(DEST, components);

      // Install dependencies
      console.log(chalk.cyan("⬇️  Installing dependencies..."));

      if (package_manager === "npm") {
        run_command(`npm install ${DEPENDENCIES.join(" ")}`, DEST);
        run_command(`npm install ${DEV_DEPENDENCIES.join(" ")} -D`, DEST);
      }

      if (package_manager === "pnpm") {
        run_command(`pnpm add ${DEPENDENCIES.join(" ")}`, DEST);
        run_command(`pnpm add ${DEV_DEPENDENCIES.join(" ")} -D`, DEST);
      }

      // Finish project
      if (components.some((e) => e === "sonner") === true) {
        console.log(
          chalk.yellow(
            "⚠️ IMPORTANT: you install the sonner component. Don't forget to add the Toaster in your layout"
          )
        );
      }
      console.log(chalk.green("\n✅ Components add successfully!"));
    } catch (error) {
      console.error(chalk.red("❌ Internal error:"), error.message);

      process.exit(1);
    }
  }

  process.exit(0);
})();
