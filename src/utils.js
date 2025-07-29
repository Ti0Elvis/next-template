import {
  COMPONENTS_PATH,
  DEPENDENCIES,
  DEV_DEPENDENCIES,
  HOOKS_PATH,
  TEMPLATE_PATH,
} from "./constants.js";
import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import prompts from "prompts";
import { execSync } from "node:child_process";

function on_cancel() {
  console.log(chalk.yellow("\n👋 Exiting..."));
  process.exit(0);
}

function run_command(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: "inherit" });
  } catch (error) {
    throw error;
  }
}

function copy_template(dest) {
  try {
    fs.cpSync(TEMPLATE_PATH, dest, { recursive: true });
  } catch (error) {
    throw error;
  }
}

async function copy_components(DEST, components) {
  try {
    for (const component of components) {
      let replace = false;

      const component_path = path.resolve(COMPONENTS_PATH, `${component}.tsx`);
      const dest_folder = path.resolve(DEST, "src", "components", "ui");
      const final_dest = path.join(dest_folder, `${component}.tsx`);

      if (fs.existsSync(component_path) === false) {
        throw new Error(`Component ${component} not found`);
      }

      if (fs.existsSync(dest_folder) === false) {
        fs.mkdirSync(dest_folder, { recursive: true });
      }

      if (fs.existsSync(final_dest) === true) {
        const response = await prompts(
          [
            {
              type: "confirm",
              name: "replace",
              message: `Do you want to replace ${component}.tsx?`,
            },
          ],
          { onCancel: on_cancel }
        );

        replace = response.replace;
      }

      const json_path = path.resolve(COMPONENTS_PATH, `${component}.json`);

      if (fs.existsSync(json_path) === false) {
        throw new Error(`Json file of ${component} not found`);
      }

      const json = JSON.parse(fs.readFileSync(json_path, "utf8"));

      if (fs.existsSync(final_dest) === false || replace === true) {
        console.log(chalk.gray(`📄 Add ${component}.tsx file`));
        fs.copyFileSync(component_path, final_dest);

        for (const hook of json.hooks) {
          const hook_path = path.resolve(HOOKS_PATH, `${hook}.ts`);
          const dest_folder = path.resolve(DEST, "src", "hooks");
          const final_dest = path.join(dest_folder, `${hook}.ts`);

          if (fs.existsSync(hook_path) === false) {
            throw new Error(`Hook ${hook} not found for component ${e}`);
          }

          if (fs.existsSync(dest_folder) === false) {
            fs.mkdirSync(dest_folder, { recursive: true });
          }

          fs.copyFileSync(hook_path, final_dest);
        }
      }

      for (const support of json.supports) {
        await copy_components(DEST, [support]);
      }

      for (const dependence of json.dependencies) {
        DEPENDENCIES.push(dependence);
      }

      for (const dev_dependence of json.dev_dependence) {
        DEV_DEPENDENCIES.push(dev_dependence);
      }
    }
  } catch (error) {
    throw error;
  }
}

export { on_cancel, run_command, copy_template, copy_components };
