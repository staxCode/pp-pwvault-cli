import { Command } from 'commander';

import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { getCommand } from './commands/get';

const program = new Command();

program
  .name('pwvault')
  .description('Password Manager CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Inicializar vault')
  .action(initCommand);

program
  .command('add')
  .description('Agregar password')
  .action(addCommand);

program
  .command('list')
  .description('Listar servicios')
  .action(listCommand);

program
  .command('get <service>')
  .description('Obtener credencial')
  .action(getCommand);

program.parse();
