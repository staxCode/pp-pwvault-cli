// Handler delgado — solo orquesta: prompt → servicio → infraestructura
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';

import { unlockVault, saveEncryptedVault, addEntry } from '../../core/services/vault.service';
import { readVault } from '../../infrastructure/storage/vault.repository';

export async function addCommand() {
  const masterPwResponse = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Master Password:',
  });

  const spinner = ora('Desbloqueando vault...').start();
  const { vault, key } = await unlockVault(masterPwResponse.masterPassword);
  spinner.succeed(chalk.green('Vault desbloqueado'));

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

  const updatedVault = addEntry(vault, response);

  const savingSpinner = ora('Guardando credencial...').start();
  const encryptedVault = readVault();

  saveEncryptedVault(
    updatedVault,
    key,
    encryptedVault.salt,
  );

  savingSpinner.succeed(chalk.green('Credencial guardada'));
}
