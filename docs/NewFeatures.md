# Mejoras y contribución

Guía para contribuir al proyecto e ideas para futuras mejoras.

## Cómo contribuir

1. Haz un fork del repositorio.
2. Crea una rama para tu mejora: `git checkout -b feature/mi-mejora`.
3. Realiza los cambios y asegúrate de que compile: `npm run build`.
4. Envía un pull request describiendo los cambios.

### Desarrollo local

```bash
# Ejecutar en modo desarrollo (sin compilar)
npm run dev init

# Compilar para producción
npm run build
npm start <comando>
```

## Posibles mejoras

### Alta prioridad

- [X] **Soporte multiplataforma para portapapeles** — `clip` (Win), `pbcopy` (macOS), `xclip` (Linux) según detección de SO.
- [X] **Tests automatizados** — Agregar pruebas unitarias con Jest o Vitest para los módulos de cifrado, descifrado y operaciones del vault.
- [X] **Ocultar vault en Linux/macOS** — Detección de SO: en Windows usa `attrib +h`, en Unix no hace falta (el directorio `.pwvault` ya tiene prefijo de punto).

### Media prioridad

- [ ] **Editar y eliminar credenciales** — Comandos `edit <servicio>` y `delete <servicio>` para administrar las credenciales existentes.
- [ ] **Búsqueda difusa** — Agregar un comando `search <término>` que busque en servicio, usuario y notas.
- [ ] **Auto-lock por tiempo** — Implementar el tiempo de auto-lock configurado en `config.json` (actualmente no se usa).
- [ ] **CSV export/import** — Exportar e importar credenciales en formato CSV.
- [ ] **Generador de contraseñas** — Opción para generar una contraseña segura al azar al agregar una credencial.

### Baja prioridad

- [ ] **Backup automático** — Implementar respaldos automáticos del vault antes de modificarlo (la opción ya existe en la configuración).
- [ ] **Sincronización via cloud** — Sincronizar el vault con servicios como Google Drive, Dropbox o un servidor SFTP.
- [ ] **TOTP / 2FA** — Soporte para códigos de autenticación de dos factores (Google Authenticator).
- [ ] **Interfaz TUI** — Una interfaz de terminal más amigable con menús y navegación tipo midnight commander.
- [ ] **Integración con navegadores** — Extensión para Chrome/Firefox que lea del vault local.
- [ ] **CI/CD** — Pipeline de GitHub Actions para lint, test y build automáticos.
- [ ] **Gestión de múltiples vaults** — Soporte para varios perfiles o vaults separados.

## Buenas prácticas

- Seguir el estilo de código existente (TypeScript, sin comentarios superfluos).
- Mantener la seguridad como prioridad: no exponer contraseñas en logs, no almacenar la clave maestra en disco.
- Actualizar esta documentación cuando se agreguen o cambien funcionalidades.
