# Arquitectura del proyecto

## Visión general

PWVault CLI sigue una **arquitectura por capas** simple pero bien definida. Cada módulo tiene una responsabilidad única y se comunica con los demás mediante imports directos. El flujo de datos es unidireccional: `Comandos → Storage → Crypto`.

```
┌─────────────────────────────────────────────────────────┐
│                    entrypoint (index.ts)                │
│                   commander (CLI parser)                │
├─────────────────────────────────────────────────────────┤
│                      commands/                          │
│         init │ add │ list │ get                          │
├───────────────────┬─────────────────────────────────────┤
│     storage/      │              crypto/                │
│  paths │ vault │  │    key │ encrypt │ decrypt          │
│  config           │                                     │
├───────────────────┴─────────────────────────────────────┤
│                    types/ (vault.ts)                    │
├─────────────────────────────────────────────────────────┤
│                    utils/ (hidden.ts)                   │
└─────────────────────────────────────────────────────────┘
```

---

## Detalle de módulos

### 1. Entry point — `src/index.ts`

**Responsabilidad:** Punto de entrada de la CLI. Configura `commander` con el nombre `pwvault` y registra los 4 subcomandos.

**Flujo:**
1. Crea una instancia de `Command`.
2. Asigna nombre, descripción y versión.
3. Registra cada subcomando con su respectivo action handler.
4. Ejecuta `program.parse()` para procesar los argumentos de la terminal.

---

### 2. Capa de comandos — `src/commands/`

Cada archivo exporta una función `async` que funciona como handler del comando. Son las únicas que orquestan la lógica de negocio.

#### `init.ts`
- Crea el directorio `~/.pwvault/` si no existe.
- Oculta la carpeta (Windows).
- Genera el `config.json` por defecto.
- Solicita la contraseña maestra al usuario.
- Genera un salt aleatorio de 16 bytes.
- Deriva la clave AES-256 con Argon2id.
- Crea un vault vacío (`{ version, createdAt, entries: [] }`).
- Cifra el vault y lo guarda en `vault.dat`.

#### `add.ts`
- Desbloquea el vault (solicita contraseña maestra, deriva clave, descifra).
- Solicita: servicio, usuario, contraseña, notas.
- Agrega la entrada al array `entries` con un UUID y timestamps.
- Lee el salt del vault actual y lo re-cifra con la misma clave.

#### `list.ts`
- Desbloquea el vault.
- Recorre `entries` e imprime `[N] servicio` para cada uno.
- Si no hay credenciales, muestra un mensaje.

#### `get.ts`
- Desbloquea el vault.
- Busca el servicio por nombre (case-insensitive).
- Si lo encuentra, imprime servicio, usuario y contraseña.
- Copia la contraseña al portapapeles de Windows mediante `clip`.

---

### 3. Capa de almacenamiento — `src/storage/`

Maneja todo lo relacionado con archivos en disco.

#### `paths.ts`
- Define 3 constantes con `path.join`:
  - `APP_DIR` → `~/.pwvault/`
  - `CONFIG_PATH` → `~/.pwvault/config.json`
  - `VAULT_PATH` → `~/.pwvault/vault.dat`

#### `config.ts`
- `createDefaultConfig()`: Escribe un `config.json` con `vaultPath`, `autoLockMinutes` (5) y `backupEnabled` (true).

#### `vault.ts`
Es el módulo central de persistencia con 4 funciones:

| Función | Descripción |
|---|---|
| `createEmptyVault()` | Devuelve un objeto `Vault` con `version: 1` y sin entradas. |
| `saveVault(data)` | Serializa a JSON y escribe en `vault.dat`. |
| `readVault()` | Lee `vault.dat` y devuelve el objeto parseado. |
| `unlockVault()` | Pide la contraseña maestra, lee el vault, deriva la clave con el salt guardado, descifra y devuelve `{ vault, key }`. |
| `saveEncryptedVault(vault, key, salt)` | Cifra el vault con la clave dada y guarda (salt + iv + tag + data). |

---

### 4. Capa de cifrado — `src/crypto/`

Toda la lógica criptográfica. No depende de ningún otro módulo del proyecto salvo `argon2`.

#### `key.ts`
- **`generateSalt()`**: Genera 16 bytes aleatorios con `crypto.randomBytes`.
- **`deriveKey(masterPassword, salt)`**: Usa `argon2.hash` con:
  - Tipo: `argon2id` (resistente a ataques side-channel y GPU).
  - `raw: true` → devuelve el hash directo (sin encoding).
  - `hashLength: 32` → clave de 256 bits para AES-256.

#### `encrypt.ts`
- **`encrypt(data, key)`**: Cifra un string con AES-256-GCM.
  - Genera un IV aleatorio de 16 bytes.
  - Crea el cifrador con `createCipheriv('aes-256-gcm', key, iv)`.
  - Obtiene el tag de autenticación con `getAuthTag()`.
  - Retorna `{ iv, tag, data }` todo en base64.

#### `decrypt.ts`
- **`decrypt(encryptedData, key)`**: Inverso de `encrypt`.
  - Convierte iv, tag y data de base64 a Buffer.
  - Crea el descifrador con `createDecipheriv`.
  - Setea el tag con `setAuthTag`.
  - Descifra y retorna el string original.

---

### 5. Tipos — `src/types/vault.ts`

```typescript
VaultEntry {
  id: string;        // UUID v4
  service: string;   // Nombre del servicio
  username: string;  // Usuario o email
  password: string;  // Contraseña
  notes?: string;    // Notas opcionales
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

Vault {
  version: number;          // Formato del vault (actual: 1)
  createdAt: string;        // ISO timestamp de creación
  entries: VaultEntry[];    // Array de credenciales
}
```

---

### 6. Utilidades — `src/utils/hidden.ts`

- **`hideFolder(path)`**: Ejecuta `attrib +h "{path}"` en Windows para ocultar la carpeta del vault. Envuelve en try/catch por si el comando no existe.

---

## Arquitectura propuesta a futuro

A medida que el proyecto crezca, se recomienda evolucionar hacia una arquitectura más modular y testeable:

```
src/
├── index.ts                       # Entry point (Commander)
├── cli/
│   ├── commands/                  # Handlers de comandos (delgados)
│   │   ├── init.command.ts
│   │   ├── add.command.ts
│   │   ├── list.command.ts
│   │   ├── get.command.ts
│   │   ├── edit.command.ts        # Futuro
│   │   └── delete.command.ts      # Futuro
│   └── middlewares/               # Futuro: hooks antes/después de comandos
│       └── auth.middleware.ts     # Auto-lock, verificación de master password
├── core/                          # Lógica de negocio pura (sin I/O)
│   ├── services/
│   │   ├── vault.service.ts       # CRUD de credenciales
│   │   └── sync.service.ts        # Futuro: sincronización cloud
│   ├── crypto/
│   │   ├── key.service.ts         # Derivación de clave
│   │   ├── encrypt.service.ts     # Cifrado
│   │   └── decrypt.service.ts     # Descifrado
│   └── models/
│       └── vault.model.ts         # Tipos y validación de datos
├── infrastructure/                # I/O, efectos secundarios
│   ├── storage/
│   │   ├── vault.repository.ts    # Lectura/escritura del archivo vault.dat
│   │   └── config.repository.ts   # Lectura/escritura de config.json
│   ├── clipboard/
│   │   └── clipboard.service.ts   # Abstracción del portapapeles (Windows/macOS/Linux)
│   └── filesystem/
│       └── hidden.service.ts      # Ocultar directorios (SO-detection)
├── shared/
│   ├── constants.ts               # Rutas, valores por defecto
│   └── errors.ts                  # Clases de error personalizadas
└── __tests__/                     # Tests unitarios y de integración
    ├── crypto/
    ├── services/
    └── commands/
```

### Principios de la arquitectura propuesta

| Principio | Descripción |
|---|---|
| **Separación de concerns** | `cli/` solo maneja entrada/salida; `core/` contiene la lógica de negocio pura; `infrastructure/` maneja efectos secundarios (archivos, clipboard, SO). |
| **Inyección de dependencias** | Los servicios reciben sus dependencias (repositorios, servicios de crypto) por constructor o parámetro, facilitando los tests. |
| **Repositorios** | `vault.repository.ts` abstrae el almacenamiento en disco. Se puede intercambiar por una implementación en la nube sin cambiar la lógica de negocio. |
| **Servicios** | Cada servicio tiene una responsabilidad única y funciones sin efectos secundarios (o con efectos controlados). |
| **Tests primero** | La arquitectura está pensada para que cada pieza sea testeable de forma aislada con mocks. |

### Ejemplo de flujo refactorizado

```
Comando (add.command.ts)
  → llamar a vault.service.createEntry(data)
    → vault.service llama a vault.repository.save()
      → vault.repository escribe en disco
    → vault.service devuelve la entrada creada
  → comando imprime confirmación en consola
```

De esta forma, `vault.service.createEntry()` se puede testear sin tocar el disco, mockeando `vault.repository`.
