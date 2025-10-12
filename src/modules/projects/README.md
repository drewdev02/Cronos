# Módulo de Proyectos

Este módulo implementa la gestión completa de proyectos en la aplicación Cronos, incluyendo los casos de uso CU5-CU8.

## Casos de Uso Implementados

### CU5: Crear Proyecto
- **Descripción**: Asociar proyecto a un cliente y definir tarifa por hora
- **Funcionalidad**: 
  - Formulario de creación con validación usando Zod
  - Selección de cliente desde lista existente
  - Definición de tarifa por hora
  - Descripción opcional del proyecto
  - Estado inicial como "Activo"

### CU6: Editar Proyecto
- **Descripción**: Cambiar tarifa, nombre o estado
- **Funcionalidad**:
  - Formulario de edición pre-populado
  - Modificación de todos los campos del proyecto
  - Cambio de estado (Activo/Archivado)
  - Validación de datos

### CU7: Archivar Proyecto
- **Descripción**: Marcar proyecto como inactivo
- **Funcionalidad**:
  - Botón de archivo en lista y detalle
  - Confirmación antes de archivar
  - Cambio de estado a "Archivado"
  - Posibilidad de reactivar

### CU8: Ver Resumen de Proyecto
- **Descripción**: Mostrar total de horas, costo estimado y tareas
- **Funcionalidad**:
  - Vista detallada con estadísticas
  - Información del cliente asociado
  - Progreso de tareas (mock data)
  - Costos estimados vs reales
  - Historial del proyecto

## Arquitectura

### Componentes

- **ProjectsModule.tsx**: Componente principal con navegación entre vistas
- **ProjectForm.tsx**: Formulario para crear/editar proyectos
- **ProjectList.tsx**: Lista de proyectos con filtros
- **ProjectDetail.tsx**: Vista detallada del resumen del proyecto

### Store (Zustand)

- **useProjectStore**: Gestión de estado global para proyectos
  - CRUD operations
  - Filtros por estado
  - Gestión de errores
  - Estado de carga

### Tipos y Schemas

- **types.ts**: Definición de tipos TypeScript y schemas Zod
- **ProjectType**: Tipo principal del proyecto
- **ProjectSummary**: Tipo extendido para resúmenes
- **CreateProjectData/UpdateProjectData**: Tipos para formularios

## Estructura de Archivos

```
src/modules/projects/
├── ProjectsModule.tsx       # Componente principal
├── index.ts                 # Exports del módulo
├── store.ts                 # Estado global con Zustand
├── types.ts                 # Tipos y schemas
├── README.md               # Esta documentación
└── components/
    ├── index.ts            # Exports de componentes
    ├── ProjectForm.tsx     # Formulario crear/editar
    ├── ProjectList.tsx     # Lista con filtros
    └── ProjectDetail.tsx   # Vista de resumen
```

## Integración

### Dependencias
- Cliente Store: Obtiene lista de clientes para asociar
- React Hook Form + Zod: Validación de formularios
- Zustand: Gestión de estado

### Datos Mock
Actualmente usa datos simulados para:
- Total de horas trabajadas
- Número de tareas y progreso
- Costos estimados vs reales
- Actividad reciente

### Siguientes Pasos
1. Integrar con módulo de tareas para datos reales
2. Integrar con módulo de time-records para horas trabajadas
3. Conectar con backend/API
4. Implementar persistencia de datos
5. Agregar notificaciones de éxito/error

## Uso

```tsx
import { ProjectsModule } from './modules/projects';

function App() {
  return <ProjectsModule />;
}
```

El módulo es completamente auto-contenido y maneja su propio estado de navegación entre las diferentes vistas (lista, crear, editar, detalle).