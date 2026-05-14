// Capa de infraestructura — depende de fs. Mockear fs en tests unitarios.
import fs from 'fs';
import { VAULT_PATH } from '../../shared/constants';
import { EncryptedVault } from '../../core/models/vault.model';

export function readVault(): EncryptedVault {
  const raw = fs.readFileSync(VAULT_PATH, 'utf8');
  return JSON.parse(raw);
}

export function saveVault(data: EncryptedVault) {
  fs.writeFileSync(
    VAULT_PATH,
    JSON.stringify(data, null, 2),
  );
}

export function vaultExists(): boolean {
  return fs.existsSync(VAULT_PATH);
}
