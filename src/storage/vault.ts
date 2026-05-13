import fs from 'fs';
import prompts from 'prompts';

import { VAULT_PATH } from './paths';
import { Vault } from '../types/vault';
import { deriveKey } from '../crypto/key';
import { decrypt } from '../crypto/decrypt';
import { encrypt } from '../crypto/encrypt';

export function createEmptyVault(): Vault {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    entries: [],
  };
}

export function saveVault(data: any) {
  fs.writeFileSync(
    VAULT_PATH,
    JSON.stringify(data, null, 2),
  );
}

export function readVault() {
  const raw = fs.readFileSync(VAULT_PATH, 'utf8');
  return JSON.parse(raw);
}

export async function unlockVault() {
  const response = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Master Password:',
  });

  const encryptedVault = readVault();

  const key = await deriveKey(
    response.masterPassword,
    Buffer.from(encryptedVault.salt, 'base64'),
  );

  const decrypted = decrypt(
    {
      iv: encryptedVault.iv,
      tag: encryptedVault.tag,
      data: encryptedVault.data,
    },
    key,
  );

  return {
    vault: JSON.parse(decrypted),
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
