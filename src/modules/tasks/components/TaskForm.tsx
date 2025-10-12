import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProjectStore } from '../../projects/store';
import { useClientsStore } from '../../clients/store';

// Form-specific schema
const taskFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  projectId: z.string().min(1, 'Debe seleccionar un proyecto'),
  description: z.string().optional(),
  estimatedHours: z.number().min(0).optional()
});

type TaskFormData = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<TaskFormData>;
  mode?: 'create' | 'edit';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  mode = 'create'
}) => {
  const { getActiveProjects } = useProjectStore();
  const { clients } = useClientsStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: initialData || {
      name: '',
      projectId: '',
      description: '',
      estimatedHours: undefined
    }
  });

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    if (mode === 'create') {
      reset();
    }
  };

  // Get active projects with client information
  const activeProjects = getActiveProjects();
  
  // Get client name for each project
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  return (
    <div className="cronos-surface p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {mode === 'create' ? 'Nueva Tarea' : 'Editar Tarea'}
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
            Nombre de la tarea *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
            placeholder="Ingrese el nombre de la tarea"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-text-secondary mb-1">
            Proyecto *
          </label>
          <select
            id="projectId"
            {...register('projectId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
          >
            <option value="">Seleccione un proyecto</option>
            {activeProjects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} - {getClientName(project.clientId)}
              </option>
            ))}
          </select>
          {errors.projectId && (
            <p className="text-red-500 text-sm mt-1">{errors.projectId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
            placeholder="Descripción de la tarea (opcional)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="estimatedHours" className="block text-sm font-medium text-text-secondary mb-1">
            Horas estimadas
          </label>
          <input
            type="number"
            id="estimatedHours"
            step="0.25"
            min="0"
            max="1000"
            {...register('estimatedHours', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
            placeholder="0.0"
          />
          {errors.estimatedHours && (
            <p className="text-red-500 text-sm mt-1">{errors.estimatedHours.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="cronos-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : mode === 'create' ? 'Crear Tarea' : 'Actualizar Tarea'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cronos-btn-secondary px-6 py-2"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};