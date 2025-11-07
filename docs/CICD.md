# CI/CD Pipeline - Cronos

Este documento describe el pipeline de CI/CD configurado para automatizar la construcción y distribución de la aplicación Electron Cronos.

## 📋 Descripción General

El pipeline incluye tres workflows principales:

1. **CI (Continuous Integration)** - Pruebas y validación automática
2. **Release** - Generación de versiones oficiales
3. **Pre-release** - Generación de versiones de desarrollo

## 🔄 Workflows

### 1. CI Workflow (`ci.yml`)

**Activadores:**
- Push a ramas `main` o `develop`
- Pull requests hacia `main` o `develop`

**Funciones:**
- Ejecuta linting
- Construye la aplicación
- Verifica que la construcción funcione en todos los SO

### 2. Release Workflow (`release.yml`)

**Activadores:**
- Push de tags con formato `v*.*.*` (ej: `v1.0.0`)
- Ejecución manual desde GitHub Actions

**Funciones:**
- Construye la aplicación para Windows, macOS y Linux
- Crea instaladores para cada plataforma
- Publica automáticamente un release en GitHub
- Soporta code signing (requiere configuración de secretos)

### 3. Pre-release Workflow (`pre-release.yml`)

**Activadores:**
- Push a rama `develop`
- Ejecución manual

**Funciones:**
- Construye versiones de desarrollo
- Crea pre-releases automáticamente
- Útil para testing antes de releases oficiales

## 🚀 Uso

### Crear un Release Oficial

#### Método 1: Usando scripts (Recomendado)
```bash
# Para versión patch (1.0.0 -> 1.0.1)
npm run release:patch

# Para versión minor (1.0.0 -> 1.1.0)
npm run release:minor

# Para versión major (1.0.0 -> 2.0.0)
npm run release:major
```

#### Método 2: Manual
```bash
# 1. Asegúrate de estar en la rama main
git checkout main
git pull origin main

# 2. Actualiza la versión
npm version patch|minor|major

# 3. Push del tag
git push origin main --tags
```

### Crear un Pre-release

```bash
# Desde la rama develop
git checkout develop
npm run pre-release
```

### Ejecución Manual

Puedes disparar los workflows manualmente desde:
`GitHub → Actions → [Workflow] → Run workflow`

## 🔐 Configuración de Secretos

Para habilitar code signing, configura estos secretos en GitHub:

### macOS Code Signing
- `MAC_CERTS`: Certificado p12 en base64
- `MAC_CERTS_PASSWORD`: Contraseña del certificado
- `APPLE_ID`: Apple ID para notarización
- `APPLE_ID_PASS`: App-specific password
- `APPLE_TEAM_ID`: Team ID de Apple Developer

### Windows Code Signing
- `WINDOWS_CERTS`: Certificado p12 en base64
- `WINDOWS_CERTS_PASSWORD`: Contraseña del certificado

## 📁 Estructura de Artifacts

Los archivos generados se almacenan en:
```
release/
├── Cronos-1.0.0-mac.dmg
├── Cronos-1.0.0-mac.zip
├── Cronos-1.0.0-win.exe
├── Cronos-1.0.0-linux.AppImage
└── Cronos-1.0.0-linux.deb
```

## 🏗️ Configuración de Build

La configuración de electron-builder está en:
- `package.json` (sección "build")
- `electron-builder.json5`

### Targets por Plataforma

**macOS:**
- DMG installer
- ZIP archive

**Windows:**
- NSIS installer
- Portable executable

**Linux:**
- AppImage
- Debian package

## 🔧 Troubleshooting

### Errores Comunes

1. **Build falla en macOS**
   - Verifica que los certificados estén correctamente configurados
   - Asegúrate de que el Team ID sea correcto

2. **Windows build falla**
   - Verifica los certificados de Windows
   - Comprueba que el certificado no haya expirado

3. **Release no se crea automáticamente**
   - Verifica que el tag tenga el formato correcto (`v1.0.0`)
   - Comprueba que tengas permisos de escritura en el repositorio

### Logs y Debugging

- Ve a GitHub Actions para ver logs detallados
- Cada job muestra output específico para debugging
- Los artifacts están disponibles por 90 días

## 📝 Versionado

Seguimos [Semantic Versioning](https://semver.org/):
- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nuevas funcionalidades compatibles
- **PATCH**: Bug fixes compatibles

## 🤝 Contribución

1. Desarrolla en rama `feature/nueva-funcionalidad`
2. Haz PR hacia `develop`
3. Merge a `develop` dispara pre-release
4. Merge de `develop` a `main` para release oficial