import { deriveKey, generateSalt } from '../../core/crypto/key.service';
import { encrypt } from '../../core/crypto/encrypt.service';
import { decrypt } from '../../core/crypto/decrypt.service';

describe('Crypto roundtrip', () => {
  it('cifra y descifra correctamente un vault completo', async () => {
    const password = 'miPasswordMaestra';
    const salt = generateSalt();
    const key = await deriveKey(password, salt);

    const vaultData = JSON.stringify({
      version: 1,
      createdAt: new Date().toISOString(),
      entries: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          service: 'GitHub',
          username: 'usuario@correo.com',
          password: 'supersecreto',
          notes: 'nota opcional',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });

    const encrypted = encrypt(vaultData, key);
    const decrypted = decrypt(encrypted, key);

    expect(decrypted).toBe(vaultData);

    const parsed = JSON.parse(decrypted);
    expect(parsed.entries.length).toBe(1);
    expect(parsed.entries[0].service).toBe('GitHub');
  });

  it('falla si se usa contraseña incorrecta', async () => {
    const salt = generateSalt();
    const correctKey = await deriveKey('correcta', salt);
    const wrongKey = await deriveKey('incorrecta', salt);

    const encrypted = encrypt('{"data":"secreto"}', correctKey);

    expect(() => decrypt(encrypted, wrongKey)).toThrow();
  });

  it('cifrados del mismo contenido son distintos (IV único)', async () => {
    const salt = generateSalt();
    const key = await deriveKey('password', salt);
    const data = '{"data":"secreto"}';

    const e1 = encrypt(data, key);
    const e2 = encrypt(data, key);

    expect(e1.iv).not.toBe(e2.iv);
    expect(e1.data).not.toBe(e2.data);
  });
});
