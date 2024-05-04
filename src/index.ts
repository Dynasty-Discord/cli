#!/usr/bin/env node

import { program } from "commander";
import { addModuleCommand, updateModuleCommand } from "./commands/commands";
import { getEnvVariables } from "./utils/utils";
import chalk from "chalk";
export const baseUrl = "http://localhost:3333/api/v1";
export const secretKey: string = getEnvVariables()["USER_SECRET_KEY"];
export const prefix = `[${chalk.yellow('DynastyCLI')}]`


program
  .version("1.0.0")
  .name("DynastyCLI")
  .description("CLI tool for DynastyCore")


const moduleCmd = program.command('module');

moduleCmd.command('update')
  .description('Update a module')
  .argument('<module_id>', 'Module ID to update')
  .action((module_id) => updateModuleCommand(module_id))

moduleCmd.command('add')
  .description('Add a new module')
  .argument('<module_id>', 'Module ID to add')
  .action((module_id) => addModuleCommand(module_id))

program.parse(process.argv);