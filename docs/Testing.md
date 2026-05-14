# Testing

Estrategia de pruebas para PWVault CLI.

## Stack

| Herramienta | Propósito |
|---|---|
| **Jest** | Framework de pruebas unitarias y de integración |
| **ts-jest** | Compilar TypeScript sobre la marcha en los tests |

## Estado actual

```
Test Suites: 9 passed, 9 total
Tests:       45 passed, 45 total
```

## Estructura de tests

Los tests siguen la misma arquitectura que el código fuente:

```
src/
└── __tests__/
    ├── core/
    │   ├── crypto/
    │   │   ├── key.service.test.ts          # 6 tests
    │   │   ├── encrypt.service.test.ts      # 3 tests
    │   │   └── decrypt.service.test.ts      # 3 tests
    │   └── services/
    │       └── vault.service.test.ts        # 12 tests
    ├── infrastructure/
    │   ├── storage/
    │   │   └── vault.repository.test.ts     # 4 tests
    │   ├── clipboard/
    │   │   └── clipboard.service.test.ts    # 4 tests
    │   └── filesystem/
    │       └── hidden.service.test.ts       # 4 tests
    └── integration/
        ├── crypto-roundtrip.test.ts         # 3 tests
        └── vault-flow.test.ts              # 2 tests
```

## Pirámide de pruebas

```
        ╱╲
       ╱  ╲
      ╱ E2E ╲          <- 1. Flujo completo: init → add → list → get
     ╱────────╲
    ╱  Integr.  ╲       <- 2. crypto-roundtrip + vault-flow
   ╱──────────────╲
  ╱   Unitarias     ╲    <- 3. Cada módulo de forma aislada (36 tests)
 ╱────────────────────╲
```

---

## Pruebas unitarias

### `core/crypto/key.service.test.ts`

| Test | Descripción |
|---|---|
| `generateSalt` genera un buffer de 16 bytes | Verifica tipo y longitud |
| `generateSalt` genera valores distintos | Unicidad del salt |
| `deriveKey` genera una clave de 32 bytes | Clave AES-256 |
| `deriveKey` mismo resultado con misma password + salt | Determinismo |
| `deriveKey` distinto resultado con distinto salt | Sensibilidad al salt |
| `deriveKey` distinto resultado con distinta password | Sensibilidad a password |

### `core/crypto/encrypt.service.test.ts`

| Test | Descripción |
|---|---|
| retorna iv, tag y data en base64 | Formato de salida |
| no contiene el texto plano en la salida | Confidencialidad |
| produce distinto iv en cada llamada | IV único |

### `core/crypto/decrypt.service.test.ts`

| Test | Descripción |
|---|---|
| descifra correctamente un mensaje cifrado | Roundtrip |
| lanza error si el tag no coincide | Integridad |
| lanza error si la clave es incorrecta | Clave errónea |

### `core/services/vault.service.test.ts`

| Test | Descripción |
|---|---|
| `createEmptyVault` retorna vault sin entradas | Estado inicial |
| `createEmptyVault` asigna versión correcta | `version === 1` |
| `createEmptyVault` asigna createdAt ISO | Formato timestamp |
| `addEntry` agrega una entrada | Insercion |
| `addEntry` asigna id UUID | Formato identificador |
| `addEntry` no muta el vault original | Inmutabilidad |
| `addEntry` asigna createdAt y updatedAt | Timestamps |
| `addEntry` agrega múltiples entradas | Insercion múltiple |
| `addEntry` guarda notas opcionales | Campo opcional |
| `addEntry` deja notes undefined si no se provee | Ausencia de opcional |
| `findEntry` encuentra por nombre exacto | Búsqueda exacta |
| `findEntry` es case-insensitive | Búsqueda sin importar mayúsculas |
| `findEntry` retorna undefined si no existe | No encontrado |
| `listEntries` retorna todas las entradas | Listado completo |
| `listEntries` retorna array vacío si no hay | Vault vacío |

### `infrastructure/storage/vault.repository.test.ts`

(Uso de `jest.mock('fs')`)

| Test | Descripción |
|---|---|
| `readVault` retorna un EncryptedVault válido | Lectura correcta |
| `readVault` lanza error si vault.dat no existe | Archivo faltante |
| `saveVault` escribe el archivo en disco | Escritura correcta |
| `vaultExists` true si existe | Existencia positiva |
| `vaultExists` false si no existe | Existencia negativa |

### `infrastructure/clipboard/clipboard.service.test.ts`

(Uso de `jest.mock('child_process')` y `jest.mock('os')`)

| Test | Descripción |
|---|---|
| usa `clip` en Windows | Win32 |
| usa `pbcopy` en macOS | Darwin |
| usa `xclip` en Linux | Linux |
| limpia espacios al inicio y final | Trim |

### `infrastructure/filesystem/hidden.service.test.ts`

(Uso de `jest.mock('child_process')` y `jest.mock('os')`)

| Test | Descripción |
|---|---|
| ejecuta `attrib +h` en Windows | Win32 |
| no hace nada en Linux | Linux (no-op) |
| no hace nada en macOS | Darwin (no-op) |
| no lanza error si `attrib` falla | Manejo de excepción |

---

## Pruebas de integración

### `crypto-roundtrip.test.ts`

- Cifrar y descifrar un vault completo con múltiples entradas.
- Verificar fallo con contraseña incorrecta.
- Verificar que dos cifrados del mismo contenido tengan IV distintos.

### `vault-flow.test.ts`

- Crear vault vacío.
- Agregar N entradas.
- Listar entradas y verificar cantidad.
- Buscar entrada por servicio (case-insensitive).
- Verificar que buscar un servicio inexistente retorne undefined.
- Agregar más entradas no afecta datos anteriores.

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

Scripts en `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch"
}
```

## Mocking de dependencias

| Dependencia | Se mockea en | Método |
|---|---|---|
| `fs` | `vault.repository.test.ts` | `jest.mock('fs')` |
| `child_process` | `clipboard.service.test.ts`, `hidden.service.test.ts` | `jest.mock('child_process')` |
| `os` | `clipboard.service.test.ts`, `hidden.service.test.ts` | `jest.mock('os')` |

## Cobertura

| Capa | Tests | Cobertura |
|---|---|---|
| `core/crypto/` | 12 | 100% |
| `core/services/` | 15 | 100% |
| `infrastructure/storage/` | 5 | 95%+ |
| `infrastructure/clipboard/` | 4 | 100% |
| `infrastructure/filesystem/` | 4 | 100% |
| Integración | 5 | — |
| **Total** | **45** | — |
