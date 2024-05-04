export enum Role {
  ADMIN = "admin",
  USER = "user",
}

export interface Module {
  id: string;
  name: string;
  githubRepo: string;
  githubOwner: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  username: string;
  discordId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}