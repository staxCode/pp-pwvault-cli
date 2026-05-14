# Instalación local

Guía para instalar PWVault CLI en tu máquina y usarlo desde cualquier terminal con el comando `pwvault`.

## Requisitos previos

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9 (viene con Node.js)
- Git

## Paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/pwvault-cli.git
cd pwvault-cli
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instala las dependencias de producción (`argon2`, `commander`, `prompts`) y de desarrollo (`typescript`, `ts-node`, etc.).

### 3. Compilar el proyecto

```bash
npm run build
```

Genera los archivos JavaScript en la carpeta `dist/`.

### 4. Instalar globalmente

```bash
npm link
```

Esto crea un enlace simbólico y registra el comando `pwvault` en tu sistema.

### 5. Verificar la instalación

```bash
pwvault --version
# 1.0.0

pwvault --help
# Muestra la ayuda con los comandos disponibles
```

### 6. Inicializar el vault

```bash
pwvault init
```

Sigue las instrucciones en pantalla para crear tu contraseña maestra.

## Uso

Una vez instalado, puedes ejecutar cualquier comando directamente:

```bash
pwvault init           # Inicializar vault
pwvault add            # Agregar credencial
pwvault list           # Listar servicios
pwvault get github     # Obtener credencial "github"
```

## Desinstalar

```bash
# Desde el directorio del proyecto
npm unlink

# Opcional: eliminar el vault y datos locales
rm -rf ~/.pwvault
```

## Notas

- El vault se almacena en `~/.pwvault/vault.dat`.
- La configuración se guarda en `~/.pwvault/config.json`.
- En Windows, la carpeta `~/.pwvault` se oculta automáticamente con `attrib +h`.
