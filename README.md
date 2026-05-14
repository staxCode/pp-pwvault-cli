# PWVault CLI

Gestor de contraseñas offline para terminal. Almacena todas tus credenciales de forma segura en un archivo cifrado en tu máquina local.

## Características

- **Offline-first** — sin conexión a internet, sin servidores, sin terceros.
- **Cifrado AES-256-GCM** — cada credencial se cifra con un IV único.
- **Derivación de clave con Argon2id** — protección contra ataques de fuerza bruta.
- **Vault oculto** — el directorio `~/.pwvault/` se marca como oculto en Windows.
- **Interfaz visual** — tablas, spinners, colores y recuadros en terminal.
- **Portátil** — escrito en TypeScript, funciona en cualquier sistema con Node.js.

## Requisitos

- Node.js >= 18
- npm >= 9

## Comandos

| Comando | Descripción |
|---|---|
| `init` | Inicializa un nuevo vault. Crea `~/.pwvault/`, configura una contraseña maestra y genera un vault cifrado vacío. |
| `add` | Agrega una nueva credencial. Solicita servicio, usuario, contraseña y notas. |
| `list` | Lista todos los servicios guardados en una tabla formateada. |
| `get <servicio>` | Muestra los datos de una credencial en un recuadro y copia la contraseña al portapapeles. |

### Uso rápido

```bash
# 1. Inicializar el vault
npm run dev init

# 2. Agregar una credencial
npm run dev add

# 3. Listar servicios
npm run dev list

# 4. Obtener una credencial
npm run dev get github
```

## Seguridad

- La **contraseña maestra** se deriva usando **Argon2id** (modo raw) con un salt aleatorio de 16 bytes para producir una clave de 32 bytes.
- El vault se cifra con **AES-256-GCM**, que proporciona autenticación y confidencialidad.
- Cada operación de cifrado genera un **IV (nonce) aleatorio** de 16 bytes.
- El archivo `vault.dat` se almacena en `~/.pwvault/`, un directorio oculto del sistema.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev <cmd>` | Ejecuta un comando en modo desarrollo (ts-node) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start <cmd>` | Ejecuta un comando desde la compilación |
| `npm test` | Ejecuta todas las pruebas |
| `npm run test:watch` | Ejecuta pruebas en modo watch |

## Estructura del proyecto

```
src/
├── index.ts                         # Entry point (Commander)
├── cli/commands/                    # Handlers delgados (solo orquestan)
│   ├── init.command.ts
│   ├── add.command.ts
│   ├── list.command.ts
│   └── get.command.ts
├── core/                            # Lógica de negocio pura
│   ├── services/
│   │   └── vault.service.ts         # CRUD de credenciales
│   ├── crypto/
│   │   ├── key.service.ts           # Derivación Argon2id
│   │   ├── encrypt.service.ts       # Cifrado AES-256-GCM
│   │   └── decrypt.service.ts       # Descifrado AES-256-GCM
│   └── models/
│       └── vault.model.ts           # Tipos Vault, VaultEntry
├── infrastructure/                  # Efectos secundarios (I/O, SO)
│   ├── storage/
│   │   ├── vault.repository.ts      # Lectura/escritura vault.dat
│   │   └── config.repository.ts     # Config por defecto
│   ├── clipboard/
│   │   └── clipboard.service.ts     # Portapapeles
│   └── filesystem/
│       └── hidden.service.ts        # Ocultar directorio
├── shared/
│   ├── constants.ts                 # Rutas del vault
│   └── errors.ts                    # Clases de error
└── __tests__/                       # Tests unitarios e integración
    ├── core/
    ├── infrastructure/
    └── integration/
```

## Dependencias principales

| Paquete | Propósito |
|---|---|
| `commander` | CLI framework |
| `prompts` | Input interactivo |
| `argon2` | Derivación de clave (Argon2id) |
| `chalk` | Colores en terminal |
| `ora` | Spinners animados |
| `cli-table3` | Tablas formateadas |
| `boxen` | Recuadros para resultados |

## Testing

```bash
npm test            # 37 tests, 7 suites
npm run test:watch  # Modo desarrollo continuo
```

Ver [`docs/Testing.md`](docs/Testing.md) para la estrategia detallada.

## Documentación

- [`docs/LocalInstall.md`](docs/LocalInstall.md) — Instalación global con `npm link`
- [`docs/Architecture.md`](docs/Architecture.md) — Arquitectura por capas y propuesta futura
- [`docs/NewFeatures.md`](docs/NewFeatures.md) — Ideas de mejora y contribución
- [`docs/Testing.md`](docs/Testing.md) — Estrategia de pruebas

## Licencia

MIT
