# Módulo de Clientes - Cronos

## Descripción
Este módulo implementa la gestión completa de clientes con los casos de uso especificados, utilizando Zustand para el manejo de estado, Zod para validaciones y React Hook Form para los formularios.

## Casos de Uso Implementados

### CU1: Crear Cliente
- **Descripción**: Registrar un nuevo cliente con su moneda e información básica
- **Componente**: `ClientForm` (modo creación)
- **Validaciones**: Nombre requerido, email válido (opcional), moneda requerida

### CU2: Editar Cliente
- **Descripción**: Modificar nombre, moneda o datos de contacto
- **Componente**: `ClientForm` (modo edición)
- **Funcionalidad**: Pre-carga datos existentes, valida cambios

### CU3: Eliminar Cliente
- **Descripción**: Borrar cliente y sus proyectos asociados
- **Componente**: `ClientList` (modal de confirmación)
- **Seguridad**: Confirmación requerida antes de eliminar

### CU4: Ver Detalle de Cliente
- **Descripción**: Mostrar proyectos, tareas y facturas vinculadas
- **Componente**: `ClientDetail`
- **Información**: Datos completos + resumen de actividad (preparado para futuros módulos)

## Arquitectura

### Store (Zustand)
- **Archivo**: `store.ts`
- **Estado**: clientes, cliente seleccionado, loading, errores
- **Acciones**: CRUD completo + gestión de estado de UI
- **Hooks personalizados**: `useClientActions`, `useClientState`

### Tipos y Validaciones (Zod)
- **Archivo**: `types.ts`
- **Schemas**: `createClientSchema`, `updateClientSchema`, `clientSchema`
- **Tipos**: `CreateClientData`, `UpdateClientData`, `ClientType`
- **Constantes**: `CURRENCY_OPTIONS` con monedas comunes

### Componentes

#### ClientForm
- **Funcionalidad**: Crear y editar clientes
- **Validaciones**: En tiempo real con Zod + React Hook Form
- **Estados**: Loading, errores, reseteo automático

#### ClientList
- **Funcionalidad**: Lista paginada con acciones CRUD
- **Características**: 
  - Vista de tarjetas responsiva
  - Acciones rápidas (ver, editar, eliminar)
  - Modal de confirmación para eliminación
  - Estado vacío con mensaje amigable

#### ClientDetail
- **Funcionalidad**: Vista completa del cliente
- **Secciones**:
  - Información básica
  - Datos de contacto
  - Metadatos del sistema
  - Resumen de actividad (preparado para integración)

### Módulo Principal
- **Archivo**: `ClientsModule.tsx`
- **Funcionalidad**: Orchestación de vistas y navegación
- **Estados**: list, create, edit, detail
- **UI**: Breadcrumb, header dinámico, indicadores de casos de uso implementados

## Tecnologías Utilizadas

- **Zustand**: Manejo de estado global liviano
- **Zod**: Validaciones de schema con tipos TypeScript
- **React Hook Form**: Formularios performantes con validación
- **@hookform/resolvers**: Integración Zod + React Hook Form
- **TailwindCSS**: Estilos siguiendo el design system del proyecto

## Uso

```tsx
import { ClientsModule } from './modules/clients';

function App() {
  return <ClientsModule />;
}
```

## Estructura de Archivos

```
src/modules/clients/
├── ClientsModule.tsx      # Componente principal
├── store.ts              # Store Zustand
├── types.ts              # Tipos y schemas Zod
├── index.ts              # Exportaciones
├── components/
│   ├── ClientForm.tsx    # Formulario crear/editar
│   ├── ClientList.tsx    # Lista de clientes
│   ├── ClientDetail.tsx  # Vista de detalle
│   └── index.ts          # Exportaciones componentes
└── README.md             # Esta documentación
```

## Próximos Pasos

1. **Integración con Backend**: Reemplazar simulaciones por llamadas a API real
2. **Persistencia**: Conectar con base de datos SQLite (Drizzle ORM ya disponible)
3. **Relaciones**: Implementar vínculos con proyectos, tareas y facturas
4. **Búsqueda y Filtros**: Añadir funcionalidad de búsqueda en la lista
5. **Exportación**: Implementar exportación de datos de clientes
6. **Validaciones Avanzadas**: Agregar validaciones de negocio específicas

## Notas de Implementación

- Los IDs se generan con `crypto.randomUUID()` (temporal, usar backend en producción)
- Las monedas están predefinidas pero son extensibles
- Los formularios manejan estados de loading y error de forma consistente
- El diseño sigue las clases CSS personalizadas del proyecto (`cronos-*`)
- Todos los componentes son TypeScript strict mode compatible