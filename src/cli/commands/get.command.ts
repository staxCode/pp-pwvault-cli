// Handler delgado — solo orquesta interacción + servicios + presentación
import prompts from 'prompts';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';

import { unlockVault, findEntry } from '../../core/services/vault.service';
import { copyToClipboard } from '../../infrastructure/clipboard/clipboard.service';

export async function getCommand(service: string) {
  const masterPwResponse = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Master Password:',
  });

  const spinner = ora('Desbloqueando vault...').start();
  const { vault } = await unlockVault(masterPwResponse.masterPassword);
  spinner.succeed(chalk.green('Vault desbloqueado'));

  const entry = findEntry(vault, service);

  if (!entry) {
    console.log(chalk.red('✖ Servicio no encontrado'));
    return;
  }

  const content = [
    `${chalk.bold('Servicio')} : ${entry.service}`,
    `${chalk.bold('Usuario')}  : ${entry.username}`,
    `${chalk.bold('Password')} : ${chalk.dim(entry.password)}`,
    entry.notes ? `${chalk.bold('Notas')}    : ${entry.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  console.log(
    boxen(content, {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      title: 'Credencial',
      titleAlignment: 'center',
    }),
  );

  const clipSpinner = ora('Copiando al portapapeles...').start();
  copyToClipboard(entry.password);
  clipSpinner.succeed(chalk.green('Contraseña copiada al portapapeles'));
}
