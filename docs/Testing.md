# Testing

Estrategia de pruebas para PWVault CLI.

## Herramientas propuestas

| Herramienta | Propósito |
|---|---|
| **Jest** | Framework de pruebas unitarias y de integración |
| **ts-jest** | Compilar TypeScript sobre la marcha en los tests |

## Estructura de tests

Los tests siguen la misma arquitectura que el código fuente:

```
src/
└── __tests__/
    ├── core/
    │   ├── crypto/
    │   │   ├── key.service.test.ts
    │   │   ├── encrypt.service.test.ts
    │   │   └── decrypt.service.test.ts
    │   ├── services/
    │   │   └── vault.service.test.ts
    │   └── models/
    │       └── vault.model.test.ts
    ├── infrastructure/
    │   ├── storage/
    │   │   ├── vault.repository.test.ts
    │   │   └── config.repository.test.ts
    │   ├── clipboard/
    │   │   └── clipboard.service.test.ts
    │   └── filesystem/
    │       └── hidden.service.test.ts
    └── integration/
        ├── vault-flow.test.ts
        └── commands-flow.test.ts
```

## Pirámide de pruebas

```
        ╱╲
       ╱  ╲
      ╱ E2E ╲          <- 1. Flujo completo: init → add → list → get
     ╱────────╲
    ╱  Integr.  ╲       <- 2. Integración crypto + repository
   ╱──────────────╲
  ╱   Unitarias     ╲    <- 3. Cada módulo de forma aislada
 ╱────────────────────╲
```

---

## Pruebas unitarias

### `core/crypto/key.service.test.ts`

```typescript
describe('deriveKey()', () => {
  it('genera una clave de 32 bytes')
  it('produce el mismo resultado con misma password + salt')
  it('produce distinto resultado con distinto salt')
  it('produce distinto resultado con distinta password')
})

describe('generateSalt()', () => {
  it('genera un buffer de 16 bytes')
  it('genera valores distintos en cada llamada')
})
```

### `core/crypto/encrypt.service.test.ts`

```typescript
describe('encrypt()', () => {
  it('retorna iv, tag y data en base64')
  it('no retorna texto plano en la salida')
  it('produce distinto iv en cada llamada (mismos datos)')
})
```

### `core/crypto/decrypt.service.test.ts`

```typescript
describe('decrypt()', () => {
  it('descifra correctamente un mensaje cifrado')
  it('lanza error si el tag de autenticación no coincide')
  it('lanza error si la clave es incorrecta')
})
```

### `core/services/vault.service.test.ts`

```typescript
describe('createEmptyVault()', () => {
  it('retorna un vault sin entradas')
  it('asigna la version correcta')
})

describe('addEntry()', () => {
  it('agrega una entrada al vault')
  it('asigna id UUID')
  it('no muta el vault original')
})

describe('findEntry()', () => {
  it('encuentra por nombre exacto')
  it('es case-insensitive')
  it('retorna undefined si no existe')
})

describe('listEntries()', () => {
  it('retorna todas las entradas')
  it('retorna array vacío si no hay')
})
```

### `infrastructure/storage/vault.repository.test.ts`

```typescript
describe('readVault()', () => {
  it('lanza error si vault.dat no existe')
  it('retorna un EncryptedVault válido')
})

describe('saveVault()', () => {
  it('escribe el archivo en disco')
  it('guarda datos recuperables con readVault')
})

describe('vaultExists()', () => {
  it('retorna true si el archivo existe')
  it('retorna false si el archivo no existe')
})
```

---

## Pruebas de integración

### `crypto + storage`

- Cifrar un vault, guardarlo en disco, leerlo y descifrarlo.
- Verificar que el contenido original se mantiene intacto tras el ciclo completo.

### `vault-flow.test.ts`

- Crear un vault vacío.
- Agregar N entradas.
- Listar entradas y verificar cantidad.
- Buscar una entrada por servicio.
- Verificar que los datos persisten tras guardar y recargar.

---

## Configuración de Jest

Instalación:

```bash
npm install -D jest ts-jest @types/jest
```

`jest.config.js`:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

Script en `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## Mocking de dependencias

### Sistema de archivos

Usar `jest.mock` para simular `fs` en los tests de repositorios:

```typescript
jest.mock('fs');
import fs from 'fs';
const mockFs = fs as jest.Mocked<typeof fs>;
```

### Clipboard (Windows)

Mockear `execSync` en `clipboard.service.test.ts`:

```typescript
jest.mock('child_process');
```

### Funciones criptográficas

Para tests de `vault.service`, mockear `key.service` y `encrypt.service`/`decrypt.service` para aislar la lógica de negocio pura.

## Cobertura esperada

| Capa | Cobertura objetivo |
|---|---|
| `core/crypto/` | 100% |
| `core/services/` | 100% |
| `core/models/` | 100% |
| `infrastructure/storage/` | 90%+ |
| `cli/commands/` | 80%+ (restante son prompts) |
