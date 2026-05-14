import crypto from 'crypto';

export function encrypt(data: string, key: Buffer) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    key,
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(data, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64'),
  };
}
