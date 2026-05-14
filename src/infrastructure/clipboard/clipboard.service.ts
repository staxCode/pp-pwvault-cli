import { execSync } from 'child_process';

export function copyToClipboard(text: string) {
  execSync(`echo ${text.trim()} | clip`);
}
