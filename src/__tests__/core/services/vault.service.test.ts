import { createEmptyVault, addEntry, findEntry, listEntries } from '../../../core/services/vault.service';
import { Vault } from '../../../core/models/vault.model';

describe('createEmptyVault()', () => {
  let vault: Vault;

  beforeAll(() => {
    vault = createEmptyVault();
  });

  it('retorna un vault sin entradas', () => {
    expect(vault.entries).toEqual([]);
  });

  it('asigna la version correcta', () => {
    expect(vault.version).toBe(1);
  });

  it('asigna createdAt como string ISO', () => {
    expect(vault.createdAt).toEqual(expect.any(String));
    expect(new Date(vault.createdAt).toISOString()).toBe(vault.createdAt);
  });
});

describe('addEntry()', () => {
  let vault: Vault;

  beforeEach(() => {
    vault = createEmptyVault();
  });

  it('agrega una entrada al vault', () => {
    const updated = addEntry(vault, {
      service: 'github',
      username: 'user1',
      password: 'pass123',
    });
    expect(updated.entries.length).toBe(1);
    expect(updated.entries[0].service).toBe('github');
  });

  it('asigna id UUID', () => {
    const updated = addEntry(vault, {
      service: 'test',
      username: 'u',
      password: 'p',
    });
    expect(updated.entries[0].id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it('no muta el vault original', () => {
    const original = vault;
    addEntry(vault, {
      service: 'test',
      username: 'u',
      password: 'p',
    });
    expect(original.entries.length).toBe(0);
  });

  it('asigna createdAt y updatedAt', () => {
    const updated = addEntry(vault, {
      service: 'test',
      username: 'u',
      password: 'p',
    });
    const entry = updated.entries[0];
    expect(entry.createdAt).toEqual(expect.any(String));
    expect(entry.updatedAt).toEqual(expect.any(String));
    expect(entry.createdAt).toBe(entry.updatedAt);
  });

  it('agrega multiples entradas', () => {
    const data = [
      { service: 'a', username: 'u1', password: 'p1' },
      { service: 'b', username: 'u2', password: 'p2' },
      { service: 'c', username: 'u3', password: 'p3' },
    ];

    let updated = vault;
    for (const d of data) {
      updated = addEntry(updated, d);
    }

    expect(updated.entries.length).toBe(3);
  });

  it('guarda notas opcionales', () => {
    const updated = addEntry(vault, {
      service: 'test',
      username: 'u',
      password: 'p',
      notes: 'nota importante',
    });
    expect(updated.entries[0].notes).toBe('nota importante');
  });

  it('deja notes como undefined si no se provee', () => {
    const updated = addEntry(vault, {
      service: 'test',
      username: 'u',
      password: 'p',
    });
    expect(updated.entries[0].notes).toBeUndefined();
  });
});

describe('findEntry()', () => {
  let vault: Vault;

  beforeEach(() => {
    vault = createEmptyVault();
    vault = addEntry(vault, { service: 'GitHub', username: 'u', password: 'p' });
    vault = addEntry(vault, { service: 'gitlab', username: 'u2', password: 'p2' });
  });

  it('encuentra por nombre exacto', () => {
    const entry = findEntry(vault, 'gitlab');
    expect(entry).toBeDefined();
    expect(entry!.service).toBe('gitlab');
  });

  it('es case-insensitive', () => {
    const entry = findEntry(vault, 'github');
    expect(entry).toBeDefined();
    expect(entry!.service).toBe('GitHub');
  });

  it('retorna undefined si no existe', () => {
    const entry = findEntry(vault, 'nonexistent');
    expect(entry).toBeUndefined();
  });
});

describe('listEntries()', () => {
  it('retorna todas las entradas', () => {
    const vault = createEmptyVault();
    const withEntries = addEntry(
      addEntry(vault, { service: 'a', username: 'u', password: 'p' }),
      { service: 'b', username: 'u', password: 'p' },
    );
    expect(listEntries(withEntries).length).toBe(2);
  });

  it('retorna array vacío si no hay entradas', () => {
    const vault = createEmptyVault();
    expect(listEntries(vault)).toEqual([]);
  });
});
