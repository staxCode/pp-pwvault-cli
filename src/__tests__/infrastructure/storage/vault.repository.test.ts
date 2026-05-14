import fs from 'fs';

jest.mock('fs');

const mockFs = fs as jest.Mocked<typeof fs>;

import { readVault, saveVault, vaultExists } from '../../../infrastructure/storage/vault.repository';
import { VAULT_PATH } from '../../../shared/constants';
import { EncryptedVault } from '../../../core/models/vault.model';

const fakeEncryptedVault: EncryptedVault = {
  salt: 'dGVzdHNhbHQ=',
  iv: 'dGVzdGl2',
  tag: 'dGVzdHRhZw==',
  data: 'dGVzdGRhdGE=',
};

describe('readVault()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retorna un EncryptedVault válido', () => {
    mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(fakeEncryptedVault));
    const result = readVault();
    expect(result).toEqual(fakeEncryptedVault);
    expect(mockFs.readFileSync).toHaveBeenCalledWith(VAULT_PATH, 'utf8');
  });

  it('lanza error si vault.dat no existe', () => {
    mockFs.readFileSync.mockImplementationOnce(() => {
      throw new Error('ENOENT: no such file or directory');
    });
    expect(() => readVault()).toThrow();
  });
});

describe('saveVault()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('escribe el archivo en disco', () => {
    saveVault(fakeEncryptedVault);
    expect(mockFs.writeFileSync).toHaveBeenCalledWith(
      VAULT_PATH,
      JSON.stringify(fakeEncryptedVault, null, 2),
    );
  });
});

describe('vaultExists()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('retorna true si el archivo existe', () => {
    mockFs.existsSync.mockReturnValueOnce(true);
    expect(vaultExists()).toBe(true);
    expect(mockFs.existsSync).toHaveBeenCalledWith(VAULT_PATH);
  });

  it('retorna false si el archivo no existe', () => {
    mockFs.existsSync.mockReturnValueOnce(false);
    expect(vaultExists()).toBe(false);
  });
});
