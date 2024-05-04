import { glob } from "glob-promise";
import { baseUrl, prefix } from "..";
import moduleRequestManager from "../http/module-request-manager";
import fs from "node:fs";
import path from "node:path";
import * as tar from 'tar'
import { Module } from "../types/types";
import chalk from "chalk";
import { HttpRequestManager } from "../http/http-request-manager";
import Logger from "./logger";

const TEMPORARY_FOLDER = "temporary";
const DEPRECATED_FOLDER = "deprecated";

export class DownloadManager {

  private async handleRequestError(action: string, error: any) {
    Logger.error(`Error during ${action}: ${error.message}`);
    throw error;
  }

  public async downloadModuleFile(id: string) {
    try {
      const requestManager = new HttpRequestManager();
      const arrayBuffer = await requestManager.downloadFile(`${baseUrl}/modules/${id}/download`);
      const fileBuffer = Buffer.from(arrayBuffer);
      const module = await moduleRequestManager.getModule(id);
      return { fileBuffer, module };
    } catch (error) {
      await this.handleRequestError("downloading module file", error);
    }
  }

  public async downloadModuleFolder(id: string, dest: string) {
    try {
      const { fileBuffer, module } = await this.downloadModuleFile(id);
      const folderPath = path.join(process.cwd(), dest, module.githubRepo);
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(path.join(folderPath, module.githubRepo + ".tar.gz"), fileBuffer);
    } catch (error) {
      await this.handleRequestError("downloading module folder", error);
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
      await this.handleRequestError("extracting module file", error);
    }
  }

  public async clearModuleFolder(module: Module, dest: string) {
    try {
      const folderPath = path.join(process.cwd(), dest);
      fs.rmSync(path.join(folderPath, module.githubRepo), { recursive: true });
    } catch (error) {
      await this.handleRequestError("clearing module folder", error);
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
      await this.handleRequestError("copying config files", error);
    }
  }

  public async removeTemporaryFolder() {
    try {
      fs.rmSync(path.join(process.cwd(), TEMPORARY_FOLDER), { recursive: true });
    } catch (error) {
      await this.handleRequestError("removing temporary folder", error);
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
      await this.handleRequestError("moving old config files into the deprecated folder", error);
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
      Logger.success(`Module ${module.githubRepo} updated successfully`);
    } catch (error) {
      await this.handleRequestError("updating module", error);
    }
  }

  public async addModule(id: string, dest: string) {
    try {
      const module = await moduleRequestManager.getModule(id);
      if (fs.existsSync(path.join(process.cwd(), dest, module.githubRepo))) {
        Logger.error(`Module ${module.githubRepo} already exists, use update command instead`);
        return;
      }
      await this.downloadModuleFolder(id, dest);
      await this.extractModuleFile(module, dest);
      Logger.success(`Module ${module.githubRepo} added successfully`);
    } catch (error) {
      await this.handleRequestError("adding module", error);
    }
  }
}