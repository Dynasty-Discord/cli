#!/usr/bin/env node

import { program } from "commander";
import { addModuleCommand, updateModuleCommand } from "./commands/commands";
export const baseUrl = "http://localhost:3333/api/v1";


program
  .version("1.0.0")
  .name("DynastyCLI")
  .description("CLI tool for DynastyCore")

program.command('update-module')
  .description('Update a module')
  .argument('<module_id>', 'Module ID to update')
  .action((module_id) => updateModuleCommand(module_id))

program.command('add-module')
  .description('Add a new module')
  .argument('<module_id>', 'Module ID to add')
  .action((module_id) => addModuleCommand(module_id))

program.parse(process.argv);