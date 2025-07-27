import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import prompts from "prompts";
import { execSync } from "node:child_process";

export async function get_prompts() {
  const responses = await prompts([
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
            "⚠️ Use only letters, numbers, dashes, and underscores."
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
      choices: [{ title: "Accordion", value: "accordion" }],
    },
    {
      onCancel: () => {
        console.log(chalk.yellow("\n👋 Exiting..."));
        process.exit(0);
      },
    },
  ]);

  return responses;
}

export function copy_template_files(src, project_path) {
  try {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const src_path = path.join(src, entry.name);
      const dest_path = path.join(project_path, entry.name);

      if (entry.isDirectory()) {
        fs.mkdirSync(dest_path, { recursive: true });
        copy_template_files(src_path, dest_path);
      } else {
        fs.copyFileSync(src_path, dest_path);
      }
    }
  } catch (error) {
    throw error;
  }
}

export function copy_components_files(src, project_path, components) {
  try {
    components.forEach((e) => {
      const component_path = path.resolve(src, `${e}.tsx`);
      const dest_path = path.resolve(project_path, "src", "components", "ui");

      if (fs.existsSync(component_path) === false) {
        throw new Error(`Component ${e} not found`);
      }

      if (fs.existsSync(dest_path) === false) {
        fs.mkdirSync(dest_path, { recursive: true });
      }

      fs.copyFileSync(component_path, path.join(dest_path, `${e}.tsx`));
    });
  } catch (error) {
    throw error;
  }
}

export function copy_hooks_files(
  src,
  components_path,
  project_path,
  components
) {
  const map = {};

  try {
    components.forEach((e) => {
      const hook = map[e];
      const component_path = path.resolve(components_path, `${e}.tsx`);

      if (fs.existsSync(component_path) === false) {
        throw new Error(`Component ${e} not found`);
      }

      if (hook === undefined) {
        console.warn(`No hook mapping found for component ${e}, skipping.`);
        return;
      }

      const hook_path = path.resolve(src, `${hook}.ts`);
      const dest_path = path.resolve(project_path, "src", "hooks");

      if (fs.existsSync(hook_path) === false) {
        throw new Error(`Hook ${hook} not found for component ${e}`);
      }

      if (fs.existsSync(dest_path) === false) {
        fs.mkdirSync(dest_path, { recursive: true });
      }

      fs.copyFileSync(hook_path, path.join(dest_path, `${hook}.ts`));
    });
  } catch (error) {
    throw error;
  }
}

export function run(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: "inherit" });
  } catch (error) {
    throw error;
  }
}
