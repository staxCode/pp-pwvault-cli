import path from 'path';
import os from 'os';

export const APP_DIR = path.join(os.homedir(), '.pwvault');
export const CONFIG_PATH = path.join(APP_DIR, 'config.json');
export const VAULT_PATH = path.join(APP_DIR, 'vault.dat');

export const VAULT_VERSION = 1;
