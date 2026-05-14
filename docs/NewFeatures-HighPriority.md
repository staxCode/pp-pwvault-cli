# Alta prioridad — Cambios realizados

Los tres items de alta prioridad de [`NewFeatures.md`](NewFeatures.md) han sido implementados. A continuación se detalla cada cambio.

---

## 1. Tests automatizados

### Archivos creados

```
src/__tests__/
├── core/
│   ├── crypto/
│   │   ├── key.service.test.ts
│   │   ├── encrypt.service.test.ts
│   │   └── decrypt.service.test.ts
│   └── services/
│       └── vault.service.test.ts
├── infrastructure/
│   ├── storage/
│   │   └── vault.repository.test.ts
│   ├── clipboard/
│   │   └── clipboard.service.test.ts
│   └── filesystem/
│       └── hidden.service.test.ts
└── integration/
    ├── crypto-roundtrip.test.ts
    └── vault-flow.test.ts
```

### Resultado actual

```
Test Suites: 9 passed, 9 total
Tests:       45 passed, 45 total
```

### Stack

| Herramienta | Versión |
|---|---|
| Jest | ^30.4.2 |
| ts-jest | ^29.4.9 |

### Comandos

```bash
npm test            # Ejecutar todas las pruebas
npm run test:watch  # Modo watch
```

### Detalle por suite

| Suite | Tests | Propósito |
|---|---|---|
| `key.service.test` | 6 | `generateSalt` (longitud, unicidad), `deriveKey` (longitud, consistencia, sensibilidad) |
| `encrypt.service.test` | 3 | Formato de salida, sin texto plano, IV único |
| `decrypt.service.test` | 3 | Roundtrip correcto, tag alterado, clave incorrecta |
| `vault.service.test` | 12 | CRUD puro: crear, agregar (inmutabilidad, UUID), buscar (case-insensitive), listar |
| `vault.repository.test` | 4 | `readVault`, `saveVault`, `vaultExists` con mock de `fs` |
| `clipboard.service.test` | 4 | `clip` en Win, `pbcopy` en macOS, `xclip` en Linux, trim |
| `hidden.service.test` | 4 | `attrib +h` en Win, no-op en Linux/macOS, manejo de error |
| `crypto-roundtrip.test` | 3 | Integración: cifrar/descifrar vault completo, contraseña incorrecta, IV único |
| `vault-flow.test` | 2 | Integración: crear → agregar → listar → buscar |

---

## 2. Portapapeles multiplataforma

### Archivo modificado

`src/infrastructure/clipboard/clipboard.service.ts`

### Comportamiento

| SO | Comando |
|---|---|
| Windows | `echo <texto> \| clip` |
| macOS | `echo <texto> \| pbcopy` |
| Linux | `echo <texto> \| xclip -selection clipboard` |

Se eliminó `clipboardy` por ser ESM-only incompatible con Jest en modo CommonJS.

### Test

`src/__tests__/infrastructure/clipboard/clipboard.service.test.ts` — mockea `os.platform()` y `execSync` para verificar el comando correcto según el SO.

---

## 3. Ocultar vault en Linux/macOS

### Archivo modificado

`src/infrastructure/filesystem/hidden.service.ts`

### Comportamiento

| SO | Acción |
|---|---|
| Windows | Ejecuta `attrib +h "<ruta>"` |
| Linux | No-op (el directorio `~/.pwvault/` ya empieza con `.`, oculto por convención Unix) |
| macOS | No-op (misma convención) |

Se agregó detección de SO con `os.platform()`.

### Test

`src/__tests__/infrastructure/filesystem/hidden.service.test.ts` — mockea `os.platform()` y `execSync` para verificar comportamiento correcto en cada plataforma.
