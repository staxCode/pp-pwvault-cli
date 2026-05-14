export class VaultNotFoundError extends Error {
  constructor() {
    super('Vault no encontrado');
    this.name = 'VaultNotFoundError';
  }
}

export class DecryptError extends Error {
  constructor() {
    super('Error al descifrar — contraseña incorrecta o vault corrupto');
    this.name = 'DecryptError';
  }
}

export class EntryNotFoundError extends Error {
  constructor(service: string) {
    super(`Servicio "${service}" no encontrado`);
    this.name = 'EntryNotFoundError';
  }
}
