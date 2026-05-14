import { execSync } from 'child_process';

export function hideFolder(path: string) {
  try {
    execSync(`attrib +h "${path}"`);
  } catch {
    console.error('No se pudo ocultar la carpeta');
  }
}
