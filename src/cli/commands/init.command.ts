// Handler delgado — solo orquesta interacción + servicios + repositorios
import fs from 'fs';
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';

import { APP_DIR } from '../../shared/constants';
import { hideFolder } from '../../infrastructure/filesystem/hidden.service';
import { createDefaultConfig } from '../../infrastructure/storage/config.repository';
import { saveVault } from '../../infrastructure/storage/vault.repository';
import { deriveKey, generateSalt } from '../../core/crypto/key.service';
import { encrypt } from '../../core/crypto/encrypt.service';
import { createEmptyVault } from '../../core/services/vault.service';

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

  const spinner = ora('Derivando clave de cifrado...').start();

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

  spinner.succeed(chalk.green('Vault inicializado correctamente'));
}
