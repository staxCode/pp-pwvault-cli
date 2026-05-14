// Handler delgado — solo orquesta interacción + servicios + presentación
import prompts from 'prompts';
import chalk from 'chalk';
import Table from 'cli-table3';

import { unlockVault, listEntries } from '../../core/services/vault.service';

export async function listCommand() {
  const masterPwResponse = await prompts({
    type: 'password',
    name: 'masterPassword',
    message: 'Master Password:',
  });

  const { vault } = await unlockVault(masterPwResponse.masterPassword);

  const entries = listEntries(vault);

  if (!entries.length) {
    console.log(chalk.yellow('No hay credenciales'));
    return;
  }

  const table = new Table({
    head: [chalk.cyan('#'), chalk.cyan('Servicio')],
    colWidths: [5, 50],
    style: {
      'padding-left': 2,
      'padding-right': 2,
    },
  });

  entries.forEach((entry, index) => {
    table.push([index + 1, entry.service]);
  });

  console.log(table.toString());
}
