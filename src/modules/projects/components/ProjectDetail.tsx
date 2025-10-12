import { useState, useEffect } from 'react';
import { ProjectType, ProjectSummary } from '../types';
import { useProjectStore } from '../store';
import { useClientsStore } from '../../clients/store';
import { ProjectStatus } from '../../../types';

interface ProjectDetailProps {
  project: ProjectType;
  onEdit?: () => void;
  onClose?: () => void;
}

export default function ProjectDetail({ project, onEdit, onClose }: ProjectDetailProps) {
  const [summary, setSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const { getProjectSummary, archiveProject, activateProject, error } = useProjectStore();
  const { clients } = useClientsStore();

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        // For now, create mock summary
        const client = clients.find(c => c.id === project.clientId);
        const mockSummary: ProjectSummary = {
          id: project.id,
          name: project.name,
          client: {
            id: project.clientId,
            name: client?.name || 'Cliente no encontrado',
            currency: client?.currency || 'USD'
          },
          hourlyRate: project.hourlyRate,
          status: project.status,
          totalHours: Math.random() * 200 + 50, // Mock data
          totalTasks: Math.floor(Math.random() * 30 + 5), // Mock data
          completedTasks: Math.floor(Math.random() * 20 + 3), // Mock data
          estimatedCost: Math.random() * 15000 + 5000, // Mock data
          actualCost: Math.random() * 12000 + 3000, // Mock data
          createdAt: project.createdAt
        };
        setSummary(mockSummary);
      } catch (error) {
        console.error('Error al cargar resumen:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [project, getProjectSummary, clients]);

  const handleArchive = async () => {
    if (window.confirm('¿Está seguro de que desea archivar este proyecto?')) {
      try {
        await archiveProject(project.id);
      } catch (error) {
        console.error('Error al archivar proyecto:', error);
      }
    }
  };

  const handleActivate = async () => {
    try {
      await activateProject(project.id);
    } catch (error) {
      console.error('Error al activar proyecto:', error);
    }
  };

  if (loading) {
    return (
      <div className="cronos-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-text-secondary">Cargando resumen del proyecto...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cronos-card p-6">
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Error al cargar resumen: {error}
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="cronos-card p-6">
        <div className="text-center py-8">
          <div className="text-text-secondary">No se pudo cargar el resumen del proyecto</div>
        </div>
      </div>
    );
  }

  const progressPercentage = summary.totalTasks > 0 
    ? (summary.completedTasks / summary.totalTasks) * 100 
    : 0;

  return (
    <div className="cronos-card p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-text-primary">{summary.name}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              summary.status === ProjectStatus.Active 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {summary.status === ProjectStatus.Active ? 'Activo' : 'Archivado'}
            </span>
          </div>
          <p className="text-text-secondary">
            <strong>Cliente:</strong> {summary.client.name}
          </p>
          <p className="text-text-secondary">
            <strong>Tarifa:</strong> {summary.hourlyRate.toFixed(2)} {summary.client.currency}/hora
          </p>
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="cronos-btn-secondary"
            >
              Editar
            </button>
          )}
          
          {summary.status === ProjectStatus.Active ? (
            <button
              onClick={handleArchive}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Archivar
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Activar
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="cronos-btn-secondary"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Descripción</h3>
          <p className="text-text-secondary">{project.description}</p>
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="cronos-surface p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-muted mb-1">Total de Horas</h4>
          <p className="text-2xl font-bold text-cronos-500">{summary.totalHours.toFixed(1)}h</p>
        </div>

        <div className="cronos-surface p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-muted mb-1">Progreso de Tareas</h4>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-cronos-500">{summary.completedTasks}/{summary.totalTasks}</p>
            <span className="text-sm text-text-secondary">({progressPercentage.toFixed(1)}%)</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-cronos-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="cronos-surface p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-muted mb-1">Costo Estimado</h4>
          <p className="text-2xl font-bold text-blue-600">
            {summary.estimatedCost.toFixed(2)} {summary.client.currency}
          </p>
        </div>

        <div className="cronos-surface p-4 rounded-lg">
          <h4 className="text-sm font-medium text-text-muted mb-1">Costo Actual</h4>
          <p className="text-2xl font-bold text-green-600">
            {summary.actualCost.toFixed(2)} {summary.client.currency}
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Actividad Reciente</h3>
        <div className="cronos-surface p-4 rounded-lg">
          <div className="text-center py-6 text-text-muted">
            <p>No hay actividad reciente para mostrar</p>
            <p className="text-sm mt-1">Las tareas y registros de tiempo aparecerán aquí</p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="cronos-surface p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-3">Información del Proyecto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Fecha de Creación:</span>
            <p className="font-medium text-text-primary">
              {new Date(summary.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <span className="text-text-muted">ID del Proyecto:</span>
            <p className="font-medium text-text-primary font-mono text-xs">{summary.id}</p>
          </div>
          <div>
            <span className="text-text-muted">Cliente ID:</span>
            <p className="font-medium text-text-primary font-mono text-xs">{summary.client.id}</p>
          </div>
          <div>
            <span className="text-text-muted">Moneda:</span>
            <p className="font-medium text-text-primary">{summary.client.currency}</p>
          </div>
        </div>
      </div>
    </div>
  );
}