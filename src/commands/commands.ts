import { DownloadManager } from "../utils/download-manager";
import { verifyDynasty } from "../utils/utils";

export function updateModuleCommand(module_id: string) {
  verifyDynasty();
  const downloadManager = new DownloadManager();
  downloadManager.updateModule(module_id, "src/modules");
}

export function addModuleCommand(module_id: string) {
  verifyDynasty();
  const downloadManager = new DownloadManager();
  downloadManager.addModule(module_id, "src/modules");
}