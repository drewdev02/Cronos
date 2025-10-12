import { useState, useEffect, useCallback } from 'react';
import { useProjectStore } from '../store';
import { useClientsStore } from '../../clients/store';
import { ProjectType, ProjectSummary } from '../types';
import { ProjectStatus } from '../../../types';

interface ProjectListProps {
  onEdit?: (project: ProjectType) => void;
  onView?: (project: ProjectType) => void;
  filter?: 'all' | 'active' | 'archived';
}

export default function ProjectList({ onEdit, onView, filter = 'all' }: ProjectListProps) {
  const [projectSummaries, setProjectSummaries] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const { 
    projects, 
    getActiveProjects, 
    getArchivedProjects, 
    archiveProject, 
    activateProject,
    deleteProject,
    error 
  } = useProjectStore();
  
  const { clients } = useClientsStore();

  // Get filtered projects
  const getFilteredProjects = useCallback(() => {
    switch (filter) {
      case 'active':
        return getActiveProjects();
      case 'archived':
        return getArchivedProjects();
      default:
        return projects;
    }
  }, [filter, getActiveProjects, getArchivedProjects, projects]);

  // Get client info
  const getClientInfo = useCallback((clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? { name: client.name, currency: client.currency } : { name: 'Cliente no encontrado', currency: 'USD' };
  }, [clients]);

  // Create project summaries with mock data for now
  useEffect(() => {
    const createSummaries = async () => {
      setLoading(true);
      const filteredProjects = getFilteredProjects();
      
      const summaries: ProjectSummary[] = filteredProjects.map(project => {
        const clientInfo = getClientInfo(project.clientId);
        return {
          id: project.id,
          name: project.name,
          client: {
            id: project.clientId,
            name: clientInfo.name,
            currency: clientInfo.currency
          },
          hourlyRate: project.hourlyRate,
          status: project.status,
          totalHours: Math.random() * 100, // Mock data
          totalTasks: Math.floor(Math.random() * 20), // Mock data
          completedTasks: Math.floor(Math.random() * 15), // Mock data
          estimatedCost: Math.random() * 10000, // Mock data
          actualCost: Math.random() * 8000, // Mock data
          createdAt: project.createdAt
        };
      });
      
      setProjectSummaries(summaries);
      setLoading(false);
    };

    createSummaries();
  }, [projects, clients, filter, getFilteredProjects, getClientInfo]);

  const handleArchive = async (projectId: string) => {
    if (window.confirm('¿Está seguro de que desea archivar este proyecto?')) {
      try {
        await archiveProject(projectId);
      } catch (error) {
        console.error('Error al archivar proyecto:', error);
      }
    }
  };

  const handleActivate = async (projectId: string) => {
    try {
      await activateProject(projectId);
    } catch (error) {
      console.error('Error al activar proyecto:', error);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proyecto? Esta acción no se puede deshacer.')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        console.error('Error al eliminar proyecto:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="cronos-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-text-secondary">Cargando proyectos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cronos-card p-6">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Error al cargar proyectos: {error}
        </div>
      </div>
    );
  }

  if (projectSummaries.length === 0) {
    return (
      <div className="cronos-card p-6">
        <div className="text-center py-8">
          <div className="text-text-secondary mb-4">
            {filter === 'active' && 'No hay proyectos activos'}
            {filter === 'archived' && 'No hay proyectos archivados'}
            {filter === 'all' && 'No hay proyectos registrados'}
          </div>
          <p className="text-sm text-text-muted">
            {filter === 'all' && 'Cree su primer proyecto para comenzar'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projectSummaries.map((project) => (
        <div key={project.id} className="cronos-card p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-text-primary">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === ProjectStatus.Active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status === ProjectStatus.Active ? 'Activo' : 'Archivado'}
                </span>
              </div>
              
              <div className="text-text-secondary mb-3">
                <p><strong>Cliente:</strong> {project.client.name}</p>
                <p><strong>Tarifa:</strong> {project.hourlyRate.toFixed(2)} {project.client.currency}/hora</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">Total Horas</span>
                  <p className="font-medium text-text-primary">{project.totalHours.toFixed(1)}h</p>
                </div>
                <div>
                  <span className="text-text-muted">Tareas</span>
                  <p className="font-medium text-text-primary">{project.completedTasks}/{project.totalTasks}</p>
                </div>
                <div>
                  <span className="text-text-muted">Costo Estimado</span>
                  <p className="font-medium text-text-primary">{project.estimatedCost.toFixed(2)} {project.client.currency}</p>
                </div>
                <div>
                  <span className="text-text-muted">Costo Actual</span>
                  <p className="font-medium text-text-primary">{project.actualCost.toFixed(2)} {project.client.currency}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              {onView && (
                <button
                  onClick={() => onView(projects.find(p => p.id === project.id)!)}
                  className="cronos-btn-secondary text-sm"
                  title="Ver resumen"
                >
                  Ver
                </button>
              )}
              
              {onEdit && (
                <button
                  onClick={() => onEdit(projects.find(p => p.id === project.id)!)}
                  className="cronos-btn-secondary text-sm"
                  title="Editar proyecto"
                >
                  Editar
                </button>
              )}

              {project.status === ProjectStatus.Active ? (
                <button
                  onClick={() => handleArchive(project.id)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                  title="Archivar proyecto"
                >
                  Archivar
                </button>
              ) : (
                <button
                  onClick={() => handleActivate(project.id)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  title="Activar proyecto"
                >
                  Activar
                </button>
              )}

              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                title="Eliminar proyecto"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}