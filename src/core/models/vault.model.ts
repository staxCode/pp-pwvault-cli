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

export type EncryptedVault = {
  salt: string;
  iv: string;
  tag: string;
  data: string;
};

export type NewEntryData = {
  service: string;
  username: string;
  password: string;
  notes?: string;
};
