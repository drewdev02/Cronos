# Cronos - Timer Application
Una aplicación de temporizadores moderna construida con Electron, React, TypeScript y Tailwind CSS.

## 🚀 Características

- ⏱️ Múltiples temporizadores simultáneos
- 🎨 Interfaz moderna y responsiva
- 💾 Persistencia de datos local
- 🔔 Notificaciones del sistema
- 📊 Estadísticas de uso
- 🌙 Modo oscuro/claro

## 🛠️ Tecnologías

- **Electron** - Framework para aplicaciones de escritorio
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Herramienta de build y desarrollo
- **Zustand** - Gestión de estado
- **Shadcn/ui** - Componentes de UI

## 📥 Instalación

### Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/username/cronos.git
cd cronos

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Construir para Producción

```bash
# Construir la aplicación
npm run build

# Construir y crear instaladores
npm run dist
```

## 🔄 CI/CD y Releases

Este proyecto incluye un pipeline completo de CI/CD usando GitHub Actions.

### Crear un Release

```bash
# Para versión patch (1.0.0 -> 1.0.1)
npm run release:patch

# Para versión minor (1.0.0 -> 1.1.0)
npm run release:minor

# Para versión major (1.0.0 -> 2.0.0)
npm run release:major
```

### Pre-releases

```bash
# Desde la rama develop
npm run pre-release
```

Para más información sobre el CI/CD, consulta la [documentación completa](docs/CICD.md).

## 📋 Scripts Disponibles

```bash
npm run dev          # Ejecutar en modo desarrollo
npm run build        # Construir la aplicación
npm run dist         # Construir y crear instaladores
npm run lint         # Ejecutar linter
npm run preview      # Vista previa de la build
npm run release      # Crear un release oficial
npm run pre-release  # Crear un pre-release
```

## 🏗️ Estructura del Proyecto

```
cronos/
├── electron/           # Código del proceso principal de Electron
├── src/               # Código fuente de React
│   ├── components/    # Componentes reutilizables
│   ├── modules/       # Módulos de funcionalidad
│   ├── stores/        # Gestión de estado
│   └── types/         # Definiciones de tipos
├── scripts/           # Scripts de automatización
├── docs/              # Documentación
└── .github/           # Workflows de CI/CD
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 🔧 Configuración Técnica

### ESLint Configuration

Para desarrollo en producción, se recomienda actualizar la configuración para habilitar reglas de lint conscientes del tipo:

- Configurar la propiedad `parserOptions` de nivel superior así:

```js
export default {
  // otras reglas...
  parserOptions: {
    ecmaVersion: 'latest', 
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Reemplazar `plugin:@typescript-eslint/recommended` por `plugin:@typescript-eslint/recommended-type-checked`
- Opcionalmente agregar `plugin:@typescript-eslint/stylistic-type-checked`
