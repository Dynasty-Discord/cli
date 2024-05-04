import { baseUrl } from "..";
import { Module } from "../types/types";
import { HttpRequestManager } from "./http-request-manager";

class ModuleRequestManager {
  private static instance: ModuleRequestManager
  private http: HttpRequestManager = new HttpRequestManager();


  private constructor() {
    // Private constructor to prevent instantiation from outside
  }
  public static getInstance(): ModuleRequestManager {
    if (!ModuleRequestManager.instance) {
      ModuleRequestManager.instance = new ModuleRequestManager();
    }
    return ModuleRequestManager.instance;
  }
  public getModule(id: string): Promise<Module> {
    return this.http.get<Module>(`${baseUrl}/modules/${id}`);
  }
}

export default ModuleRequestManager.getInstance();
