import fs from 'fs';
import prompts from 'prompts';

import { APP_DIR } from '../storage/paths';
import { hideFolder } from '../utils/hidden';
import { createDefaultConfig } from '../storage/config';
import { createEmptyVault, saveVault } from '../storage/vault';
import { deriveKey, generateSalt } from '../crypto/key';
import { encrypt } from '../crypto/encrypt';

export async function initCommand() {
  if (!fs.existsSync(APP_DIR)) {
    fs.mkdirSync(APP_DIR);
  }

  hideFolder(APP_DIR);

  createDefaultConfig();

  const response = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Master Password:',
  });

  const salt = generateSalt();

  const key = await deriveKey(
    response.masterPassword,
    salt,
  );

  const vault = createEmptyVault();

  const encrypted = encrypt(
    JSON.stringify(vault),
    key,
  );

  saveVault({
    salt: salt.toString('base64'),
    ...encrypted,
  });

  console.log('Vault inicializado correctamente');
}
