import prompts from 'prompts';
import crypto from 'crypto';

import {
  unlockVault,
  saveEncryptedVault,
  readVault,
} from '../storage/vault';

export async function addCommand() {
  const { vault, key } = await unlockVault();

  const response = await prompts([
    {
      type: 'text',
      name: 'service',
      message: 'Servicio:',
    },
    {
      type: 'text',
      name: 'username',
      message: 'Usuario:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    },
    {
      type: 'text',
      name: 'notes',
      message: 'Notas:',
    },
  ]);

  vault.entries.push({
    id: crypto.randomUUID(),
    service: response.service,
    username: response.username,
    password: response.password,
    notes: response.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const encryptedVault = readVault();

  saveEncryptedVault(
    vault,
    key,
    encryptedVault.salt,
  );

  console.log('Credencial guardada');
}
