import { execSync } from 'child_process';

import { unlockVault } from '../storage/vault';

function copyToClipboard(text: string) {
  execSync(`echo ${text.trim()} | clip`);
}

export async function getCommand(service: string) {
  const { vault } = await unlockVault();

  const entry = vault.entries.find(
    (item: any) =>
      item.service.toLowerCase() ===
      service.toLowerCase(),
  );

  if (!entry) {
    console.log('Servicio no encontrado');
    return;
  }

  console.log('');
  console.log(`Servicio: ${entry.service}`);
  console.log(`Usuario : ${entry.username}`);
  console.log(`Password: ${entry.password}`);
  console.log('');

  copyToClipboard(entry.password);

  console.log('Password copiado al clipboard');
}
