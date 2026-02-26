# cronos

An Electron application with React and TypeScript, using `better-sqlite3`, Drizzle ORM, and MobX.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup y Ciclo de Vida de Desarrollo

### Instalar Dependencias

Para iniciar con el desarrollo por primera vez, clona el repositorio e instala todos los paquetes:

```bash
$ npm install
```

---

## 💾 Base de Datos y Migraciones

El proyecto usa **SQLite** local con `better-sqlite3` y **Drizzle ORM** para el esquema.

Debido a que SQLite es un binario nativo que requiere recompilarse para el entorno en el cual se ejecutará (Node local vs Electron), es común que surja un desajuste de versiones (NODE_MODULE_VERSION).

Para solucionar esto y mantener tu base de datos y esquemas en sincronía cuando haces cambios a `schema.ts`, utiliza el siguiente script:

```bash
$ npm run db:sync
```

**¿Qué hace `db:sync`?**

1. Recompila la librería nativa (`better-sqlite3`) para usar temporalmente la versión de Node.js actual.
2. Sincroniza el esquema de Drizzle hacia el archivo SQLite (`npm run db:push`).
3. Recompila nuevamente la librería para Electron a través de `electron-builder` (`npm run postinstall`) resolviendo cualquier error de versión de módulos (NODE_MODULE_VERSION mismatches).

**Otros scripts de Drizzle disponibles:**

- `npm run db:generate`: Para generar archivos de migraciones si prefieres un historial estricto en lugar de `push`.
- `npm run db:studio`: Abre una vista web de configuración y administración de la base de datos local.

---

## 🛠 Entorno de Desarrollo

Para correr la aplicación en forma local utilizando Electron-Vite:

```bash
$ npm run dev
```

Este comando levanta tanto el entorno para el renderizador (React) con auto-recarga, como el compilado automático para el Main Process de Electron.

---

## 📦 Compilación y Producción

Una vez que el proyecto esté listo, necesitas compilar el código (React, TypeScript y configuraciones de Main) de Electron a código minificado de Producción para después empaquetar los instaladores nativos.

El proceso de empaquetado para el sistema operativo en el cual quieras la aplicación se ejecuta en dos pasos combinados vía NPM (primero el Type Checking y Vite Build, después Electron Builder):

```bash
# Para Windows (.exe)
$ npm run build:win

# Para macOS (.dmg)
$ npm run build:mac

# Para Linux (.AppImage / .deb)
$ npm run build:linux
```

Una vez que se haya terminado, puedes encontrar los compilados dentro de la carpeta `dist/`. No confundir con la compilación interna de Vite generada en `out/`, la cual es solo temporal para la ejecución o durante el proceso de build.
