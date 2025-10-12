import { useState } from 'react';
import { ProjectForm, ProjectList, ProjectDetail } from './components';
import { ProjectType } from './types';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';
type FilterMode = 'all' | 'active' | 'archived';

export default function ProjectsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  // CU5: Crear proyecto
  const handleCreateProject = () => {
    setSelectedProject(null);
    setViewMode('create');
  };

  // CU6: Editar proyecto
  const handleEditProject = (project: ProjectType) => {
    setSelectedProject(project);
    setViewMode('edit');
  };

  // CU8: Ver resumen de proyecto
  const handleViewProject = (project: ProjectType) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  const handleSuccess = () => {
    setViewMode('list');
    setSelectedProject(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedProject(null);
  };

  const getTitle = () => {
    switch (viewMode) {
      case 'create':
        return 'Crear Nuevo Proyecto';
      case 'edit':
        return `Editar Proyecto: ${selectedProject?.name}`;
      case 'detail':
        return `Resumen de Proyecto: ${selectedProject?.name}`;
      default:
        return 'Gestión de Proyectos';
    }
  };

  const getDescription = () => {
    switch (viewMode) {
      case 'create':
        return 'Complete el formulario para crear un nuevo proyecto y asociarlo a un cliente.';
      case 'edit':
        return 'Modifique los datos del proyecto según sea necesario.';
      case 'detail':
        return 'Resumen detallado del proyecto con estadísticas y progreso.';
      default:
        return 'Administración de proyectos con seguimiento de progreso y resúmenes detallados.';
    }
  };

  return (
    <div className="p-6">
      <div className="cronos-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">{getTitle()}</h1>
            <p className="text-text-secondary">{getDescription()}</p>
          </div>

          {viewMode === 'list' && (
            <div className="flex gap-3">
              <button 
                onClick={handleCreateProject}
                className="cronos-btn-primary"
              >
                Nuevo Proyecto
              </button>
            </div>
          )}
        </div>

        {/* Filter buttons for list view */}
        {viewMode === 'list' && (
          <div className="mb-6">
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-4 py-2 rounded transition-colors ${
                  filterMode === 'all' 
                    ? 'bg-cronos-500 text-white' 
                    : 'cronos-btn-secondary'
                }`}
              >
                Todos los Proyectos
              </button>
              <button
                onClick={() => setFilterMode('active')}
                className={`px-4 py-2 rounded transition-colors ${
                  filterMode === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'cronos-btn-secondary'
                }`}
              >
                Proyectos Activos
              </button>
              <button
                onClick={() => setFilterMode('archived')}
                className={`px-4 py-2 rounded transition-colors ${
                  filterMode === 'archived' 
                    ? 'bg-gray-500 text-white' 
                    : 'cronos-btn-secondary'
                }`}
              >
                Proyectos Archivados
              </button>
            </div>
          </div>
        )}

        {/* Use Cases Information Panel */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="cronos-surface p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                  Crear, editar, archivar proyecto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                  Ver resumen por proyecto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                  Asignar tareas al proyecto
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                  Seguimiento de tiempo
                </li>
              </ul>
            </div>

            <div className="cronos-surface p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso Implementados</h3>
              <ul className="space-y-2 text-text-secondary">
                <li><span className="text-green-600 font-mono">✓ CU5:</span> Crear proyecto</li>
                <li><span className="text-green-600 font-mono">✓ CU6:</span> Editar proyecto</li>
                <li><span className="text-green-600 font-mono">✓ CU7:</span> Archivar proyecto</li>
                <li><span className="text-green-600 font-mono">✓ CU8:</span> Ver resumen por proyecto</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Main content based on view mode */}
      <div>
        {viewMode === 'list' && (
          <ProjectList
            filter={filterMode}
            onEdit={handleEditProject}
            onView={handleViewProject}
          />
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <ProjectForm
            project={selectedProject || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}

        {viewMode === 'detail' && selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onEdit={() => setViewMode('edit')}
            onClose={handleCancel}
          />
        )}
      </div>
    </div>
  );
}