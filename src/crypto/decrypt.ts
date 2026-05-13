import crypto from 'crypto';

export function decrypt(
  encryptedData: {
    iv: string;
    tag: string;
    data: string;
  },
  key: Buffer,
) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(encryptedData.iv, 'base64'),
  );

  decipher.setAuthTag(
    Buffer.from(encryptedData.tag, 'base64'),
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedData.data, 'base64'),
    ),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
