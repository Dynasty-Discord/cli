import { verifyDynasty } from "../utils/utils";

export function updateModuleCommand(module_id: string) {
  verifyDynasty();
  console.log(`Updating module ${module_id}`);
}