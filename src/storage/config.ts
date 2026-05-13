import fs from 'fs';
import { CONFIG_PATH, VAULT_PATH } from './paths';

export function createDefaultConfig() {
  const config = {
    vaultPath: VAULT_PATH,
    autoLockMinutes: 5,
    backupEnabled: true,
  };

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
