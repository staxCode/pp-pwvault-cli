import argon2 from 'argon2';
import crypto from 'crypto';

export async function deriveKey(
  masterPassword: string,
  salt: Buffer,
) {
  const hash = await argon2.hash(masterPassword, {
    type: argon2.argon2id,
    salt,
    raw: true,
    hashLength: 32,
  });

  return Buffer.from(hash);
}

export function generateSalt() {
  return crypto.randomBytes(16);
}
