import { DownloadManager } from "../utils/download-manager";
import Logger from "../utils/logger";
import { getModuleId, getStringAccessibleModules, isAccessibleModule, verifyDynasty } from "../utils/utils";

export async function updateModuleCommand(moduleName: string) {
  verifyDynasty();
  if(!(await isAccessibleModule(moduleName))) {
    Logger.error(`Module ${moduleName} is not accessible. Accessible modules: ${await getStringAccessibleModules()}`);
    process.exit(1);
  }
  const downloadManager = new DownloadManager();
  const module_id = await getModuleId(moduleName);
  downloadManager.updateModule(module_id, "src/modules");
}

export async function addModuleCommand(moduleName: string) {
  verifyDynasty();
  if (!(await isAccessibleModule(moduleName))) {
    Logger.error(`Module ${moduleName} is not accessible. Accessible modules: ${await getStringAccessibleModules()}`);
    process.exit(1);
  }
  const module_id = await getModuleId(moduleName);
  const downloadManager = new DownloadManager();
  downloadManager.addModule(module_id, "src/modules");
}

export async function getModuleListCommand() {
  verifyDynasty();
  const modules = await getStringAccessibleModules();
  Logger.info(`Accessible modules: ${modules}`);
}