import { glob } from "glob-promise";
import { baseUrl, secretKey } from ".";
import moduleRequestManager from "./http/module-request-manager";
import fs from "node:fs";
import path from "node:path";
import * as tar from 'tar'
import { Module } from "./types";
import chalk from "chalk";
import { getEnvVariables } from "./utils/utils";

const TEMPORARY_FOLDER = "temporary";
const DEPRECATED_FOLDER = "deprecated";

export class DownloadManager {

  public async downloadModuleFile(id: string) {
    const response = await fetch(baseUrl + "/modules/" + id + "/download", { headers: { "Secret-Key": secretKey }});

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const module = await moduleRequestManager.getModule(id);
    return { fileBuffer, module };
  }

  public async downloadModuleFolder(id: string, dest: string) {
    try {
      const { fileBuffer, module } = await this.downloadModuleFile(id);
      const folderPath = path.join(process.cwd(), dest, module.githubRepo);
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(path.join(folderPath, module.githubRepo + ".tar.gz"), fileBuffer);
    } catch (error) {
      throw Error("An error occured while downloading the module folder");
    }
  }

  public async extractModuleFile(module: Module, dest: string) {
    try {
      const folderPath = path.join(process.cwd(), dest, module.githubRepo);
      const pathExtract = path.join(folderPath, module.githubRepo + ".tar.gz");
      await tar.extract({
        file: pathExtract,
        cwd: folderPath,
      });

      fs.rmSync(pathExtract);
    } catch (error) {
      throw Error("An error occured while extracting the module file");
    }
  }

  public async clearModuleFolder(module: Module, dest: string) {
    try {
      const folderPath = path.join(process.cwd(), dest);
      fs.rmSync(path.join(folderPath, module.githubRepo), { recursive: true });
    } catch (error) {
      throw Error("An error occured while clearing the module folder");
    }
  }

  public async copyConfigFiles(module: Module, dest: string) {
    try {
      const folderPath = path.join(process.cwd(), dest, module.githubRepo);
      const configPaths = glob.sync("**/*.yml", { cwd: folderPath });
      for (const configPath of configPaths) {
        fs.mkdirSync(path.join(process.cwd(), TEMPORARY_FOLDER, path.dirname(configPath)), { recursive: true });
        fs.copyFileSync(path.join(folderPath, configPath), path.join(process.cwd(), TEMPORARY_FOLDER, configPath));
      }
    } catch (error) {
      throw Error("An error occured while copying the config files");
    }
  }

  public async removeTemporaryFolder() {
    try{
      fs.rmSync(path.join(process.cwd(), TEMPORARY_FOLDER), { recursive: true });
    } catch (error) {
      throw Error("An error occured while removing the temporary folder");
    }
  }

  public async moveOldConfigIntoDeprecateFolder(module: Module, dest: string) {
    try {
      const temporaryFolderPath = path.join(process.cwd(), TEMPORARY_FOLDER);
      const deprecatedFolderPath = path.join(process.cwd(), dest, module.githubRepo, DEPRECATED_FOLDER);
      const configPaths = glob.sync("**/*.yml", { cwd: temporaryFolderPath });
      for (const configPath of configPaths) {
        fs.mkdirSync(path.join(deprecatedFolderPath, path.dirname(configPath)), { recursive: true });
        fs.copyFileSync(path.join(temporaryFolderPath, configPath), path.join(deprecatedFolderPath, configPath));
      }
    } catch (error) {
      throw Error("An error occured while moving the old config files into the deprecated folder");
    }
  }

  public async updateModule(id: string, dest: string) {
    try {
      const module = await moduleRequestManager.getModule(id);
      await this.copyConfigFiles(module, dest);
      await this.clearModuleFolder(module, dest);
      await this.downloadModuleFolder(id, dest);
      await this.extractModuleFile(module, dest);
      await this.moveOldConfigIntoDeprecateFolder(module, dest);
      await this.removeTemporaryFolder();
      console.log(chalk.green(`Module ${module.githubRepo} updated successfully`));
    } catch (error) {
      console.error(chalk.red(error));
    }
  }

  public async addModule(id: string, dest: string) {
    const module = await moduleRequestManager.getModule(id);
    if(fs.existsSync(path.join(process.cwd(), dest, module.githubRepo))) {
      console.error(chalk.red("Module already exists"));
      return;
    }
    await this.downloadModuleFolder(id, dest);
    await this.extractModuleFile(module, dest);
    console.log(chalk.green(`Module ${module.githubRepo} added successfully`));
  }
}