import { createEmptyVault, addEntry, findEntry, listEntries } from '../../core/services/vault.service';

describe('Vault flow', () => {
  it('ciclo completo: crear → agregar → listar → buscar', () => {
    let vault = createEmptyVault();
    expect(vault.entries.length).toBe(0);

    vault = addEntry(vault, { service: 'GitHub', username: 'user1', password: 'pass1' });
    vault = addEntry(vault, { service: 'GitLab', username: 'user2', password: 'pass2', notes: 'nota' });
    vault = addEntry(vault, { service: 'AWS', username: 'user3', password: 'pass3' });

    const entries = listEntries(vault);
    expect(entries.length).toBe(3);

    const found = findEntry(vault, 'github');
    expect(found).toBeDefined();
    expect(found!.username).toBe('user1');
    expect(found!.password).toBe('pass1');

    const notFound = findEntry(vault, 'Nonexistent');
    expect(notFound).toBeUndefined();
  });

  it('agregar no afecta entradas anteriores', () => {
    let vault = createEmptyVault();
    vault = addEntry(vault, { service: 's1', username: 'u1', password: 'p1' });
    vault = addEntry(vault, { service: 's2', username: 'u2', password: 'p2' });

    const s1 = findEntry(vault, 's1');
    expect(s1!.username).toBe('u1');
  });
});
