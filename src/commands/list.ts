import { unlockVault } from '../storage/vault';

export async function listCommand() {
  const { vault } = await unlockVault();

  if (!vault.entries.length) {
    console.log('No hay credenciales');
    return;
  }

  vault.entries.forEach((entry: any, index: number) => {
    console.log(`[${index + 1}] ${entry.service}`);
  });
}
