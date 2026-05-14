# PWVault CLI

Gestor de contraseñas offline para terminal. Almacena todas tus credenciales de forma segura en un archivo cifrado en tu máquina local.

## Características

- **Offline-first** — sin conexión a internet, sin servidores, sin terceros.
- **Cifrado AES-256-GCM** — cada credencial se cifra con un IV único.
- **Derivación de clave con Argon2id** — protección contra ataques de fuerza bruta.
- **Vault oculto** — el directorio `~/.pwvault/` se marca como oculto en Windows.
- **Portátil** — escrito en TypeScript, funciona en cualquier sistema con Node.js.

## Requisitos

- Node.js >= 18
- npm >= 9

## Comandos

| Comando | Descripción |
|---|---|
| `init` | Inicializa un nuevo vault. Crea `~/.pwvault/`, configura una contraseña maestra y genera un vault cifrado vacío. |
| `add` | Agrega una nueva credencial. Solicita servicio, usuario, contraseña y notas. |
| `list` | Lista todos los servicios guardados en el vault. |
| `get <servicio>` | Muestra los datos de una credencial y copia la contraseña al portapapeles. |

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
- Cada operación de cifrado genera un **IV (nonce) aleatorio** de 12 bytes.
- El archivo `vault.dat` se almacena en `~/.pwvault/`, un directorio oculto del sistema.

## Estructura del proyecto

```
src/
├── index.ts            # Punto de entrada (Commander)
├── commands/
│   ├── init.ts         # Inicializar vault
│   ├── add.ts          # Agregar credencial
│   ├── list.ts         # Listar servicios
│   └── get.ts          # Obtener credencial
├── crypto/
│   ├── key.ts          # Derivación con Argon2id
│   ├── encrypt.ts      # Cifrado AES-256-GCM
│   └── decrypt.ts      # Descifrado AES-256-GCM
├── storage/
│   ├── paths.ts        # Rutas del vault
│   ├── vault.ts        # Lectura/escritura del vault
│   └── config.ts       # Configuración por defecto
├── types/
│   └── vault.ts        # Tipos VaultEntry y Vault
└── utils/
    └── hidden.ts       # Ocultar directorio en Windows
```

## Build

```bash
npm run build
npm start <comando>
```

## Licencia

MIT
