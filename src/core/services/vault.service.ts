import crypto from 'crypto';
import { Vault, VaultEntry, NewEntryData, EncryptedVault } from '../models/vault.model';
import { VAULT_VERSION } from '../../shared/constants';
import { deriveKey } from '../crypto/key.service';
import { encrypt } from '../crypto/encrypt.service';
import { decrypt } from '../crypto/decrypt.service';
import { readVault, saveVault } from '../../infrastructure/storage/vault.repository';
import { DecryptError } from '../../shared/errors';

export async function unlockVault(masterPassword: string) {
  const encryptedVault = readVault();

  const key = await deriveKey(
    masterPassword,
    Buffer.from(encryptedVault.salt, 'base64'),
  );

  let decrypted: string;
  try {
    decrypted = decrypt(
      {
        iv: encryptedVault.iv,
        tag: encryptedVault.tag,
        data: encryptedVault.data,
      },
      key,
    );
  } catch {
    throw new DecryptError();
  }

  return {
    vault: JSON.parse(decrypted) as Vault,
    key,
  };
}

export function saveEncryptedVault(
  vault: Vault,
  key: Buffer,
  salt: string,
) {
  const encrypted = encrypt(
    JSON.stringify(vault),
    key,
  );

  saveVault({
    salt,
    ...encrypted,
  });
}

// Función pura — no depende de I/O, ideal para test unitario
export function createEmptyVault(): Vault {
  return {
    version: VAULT_VERSION,
    createdAt: new Date().toISOString(),
    entries: [],
  };
}

// Función pura — retorna un nuevo vault sin mutar el original
export function addEntry(vault: Vault, data: NewEntryData): Vault {
  const entry: VaultEntry = {
    id: crypto.randomUUID(),
    service: data.service,
    username: data.username,
    password: data.password,
    notes: data.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    ...vault,
    entries: [...vault.entries, entry],
  };
}

export function findEntry(vault: Vault, service: string): VaultEntry | undefined {
  return vault.entries.find(
    (entry) => entry.service.toLowerCase() === service.toLowerCase(),
  );
}

export function listEntries(vault: Vault): VaultEntry[] {
  return vault.entries;
}
