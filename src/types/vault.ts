export type VaultEntry = {
  id: string;
  service: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Vault = {
  version: number;
  createdAt: string;
  entries: VaultEntry[];
};
