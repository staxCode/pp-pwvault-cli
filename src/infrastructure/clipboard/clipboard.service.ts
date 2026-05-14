import { execSync } from 'child_process';
import os from 'os';

export function copyToClipboard(text: string) {
  const sanitized = text.trim();

  const platform = os.platform();

  if (platform === 'win32') {
    execSync(`echo ${sanitized} | clip`);
  } else if (platform === 'darwin') {
    execSync(`echo ${sanitized} | pbcopy`);
  } else {
    execSync(`echo ${sanitized} | xclip -selection clipboard`);
  }
}
