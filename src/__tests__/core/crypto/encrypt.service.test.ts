import { encrypt } from '../../../core/crypto/encrypt.service';
import { deriveKey, generateSalt } from '../../../core/crypto/key.service';

describe('encrypt()', () => {
  const plaintext = JSON.stringify({
    version: 1,
    entries: [{ service: 'test', username: 'user', password: 'pass' }],
  });
  let key: Buffer;

  beforeAll(async () => {
    const salt = generateSalt();
    key = await deriveKey('testPassword', salt);
  });

  it('retorna un objeto con iv, tag y data en base64', () => {
    const result = encrypt(plaintext, key);
    expect(result).toHaveProperty('iv');
    expect(result).toHaveProperty('tag');
    expect(result).toHaveProperty('data');
    expect(() => Buffer.from(result.iv, 'base64')).not.toThrow();
    expect(() => Buffer.from(result.tag, 'base64')).not.toThrow();
    expect(() => Buffer.from(result.data, 'base64')).not.toThrow();
  });

  it('no contiene el texto plano en la salida', () => {
    const result = encrypt(plaintext, key);
    expect(result.data).not.toContain('testPassword');
    expect(result.data).not.toContain('test');
    expect(result.data).not.toContain('user');
  });

  it('produce distinto iv en cada llamada (mismos datos)', () => {
    const result1 = encrypt(plaintext, key);
    const result2 = encrypt(plaintext, key);
    expect(result1.iv).not.toBe(result2.iv);
  });
});
