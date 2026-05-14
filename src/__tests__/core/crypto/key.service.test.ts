import { deriveKey, generateSalt } from '../../../core/crypto/key.service';

describe('generateSalt()', () => {
  it('genera un buffer de 16 bytes', () => {
    const salt = generateSalt();
    expect(salt).toBeInstanceOf(Buffer);
    expect(salt.length).toBe(16);
  });

  it('genera valores distintos en cada llamada', () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    expect(salt1.equals(salt2)).toBe(false);
  });
});

describe('deriveKey()', () => {
  const password = 'testMasterPassword123';
  let salt: Buffer;

  beforeEach(() => {
    salt = generateSalt();
  });

  it('genera una clave de 32 bytes', async () => {
    const key = await deriveKey(password, salt);
    expect(key).toBeInstanceOf(Buffer);
    expect(key.length).toBe(32);
  });

  it('produce el mismo resultado con misma password + salt', async () => {
    const key1 = await deriveKey(password, salt);
    const key2 = await deriveKey(password, salt);
    expect(key1.equals(key2)).toBe(true);
  });

  it('produce distinto resultado con distinto salt', async () => {
    const otherSalt = generateSalt();
    const key1 = await deriveKey(password, salt);
    const key2 = await deriveKey(password, otherSalt);
    expect(key1.equals(key2)).toBe(false);
  });

  it('produce distinto resultado con distinta password', async () => {
    const key1 = await deriveKey(password, salt);
    const key2 = await deriveKey('differentPassword', salt);
    expect(key1.equals(key2)).toBe(false);
  });
});
