import { encrypt } from '../../../core/crypto/encrypt.service';
import { decrypt } from '../../../core/crypto/decrypt.service';
import { deriveKey, generateSalt } from '../../../core/crypto/key.service';

describe('decrypt()', () => {
  const plaintext = JSON.stringify({
    version: 1,
    createdAt: new Date().toISOString(),
    entries: [],
  });
  let key: Buffer;
  let encrypted: { iv: string; tag: string; data: string };

  beforeAll(async () => {
    const salt = generateSalt();
    key = await deriveKey('testPassword', salt);
    encrypted = encrypt(plaintext, key);
  });

  it('descifra correctamente un mensaje cifrado', () => {
    const decrypted = decrypt(encrypted, key);
    expect(decrypted).toBe(plaintext);
  });

  it('lanza error si el tag de autenticación no coincide', () => {
    const tampered = { ...encrypted, tag: Buffer.alloc(16).toString('base64') };
    expect(() => decrypt(tampered, key)).toThrow();
  });

  it('lanza error si la clave es incorrecta', async () => {
    const wrongSalt = generateSalt();
    const wrongKey = await deriveKey('wrongPassword', wrongSalt);
    expect(() => decrypt(encrypted, wrongKey)).toThrow();
  });
});
