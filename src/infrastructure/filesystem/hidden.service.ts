import { execSync } from 'child_process';
import os from 'os';

export function hideFolder(path: string) {
  if (os.platform() !== 'win32') {
    return;
  }

  try {
    execSync(`attrib +h "${path}"`);
  } catch {
    console.error('No se pudo ocultar la carpeta');
  }
}
