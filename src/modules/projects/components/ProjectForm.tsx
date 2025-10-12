import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ProjectType } from '../types';
import { useProjectStore } from '../store';
import { useClientsStore } from '../../clients/store';
import { ProjectStatus } from '../../../types';

// Form-specific schema that matches the form expectations
const projectFormSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  clientId: z.string()
    .min(1, 'Debe seleccionar un cliente'),
  
  hourlyRate: z.number()
    .min(0.01, 'La tarifa por hora debe ser mayor a 0')
    .max(10000, 'La tarifa por hora no puede exceder 10,000'),
  
  description: z.string(),
  
  status: z.nativeEnum(ProjectStatus)
});

// Form data type that matches what the form actually sends
type ProjectFormData = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: ProjectType;
  onSuccess?: (project: ProjectType) => void;
  onCancel?: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const isEditing = !!project;
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createProject, updateProject, error: projectError } = useProjectStore();
  const { clients, isLoading: clientsLoading } = useClientsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: project?.name || '',
      clientId: project?.clientId || '',
      hourlyRate: project?.hourlyRate || 0,
      description: project?.description || '',
      status: project?.status || ProjectStatus.Active
    }
  });

  useEffect(() => {
    if (project) {
      setValue('name', project.name);
      setValue('clientId', project.clientId);
      setValue('hourlyRate', project.hourlyRate);
      setValue('description', project.description || '');
      setValue('status', project.status);
    }
  }, [project, setValue]);

  const onSubmit: SubmitHandler<ProjectFormData> = async (data) => {
    setIsSubmitting(true);
    
    try {
      let result: ProjectType;
      
      if (isEditing && project) {
        result = await updateProject(project.id, data);
      } else {
        result = await createProject(data);
      }
      
      onSuccess?.(result);
      if (!isEditing) {
        reset();
      }
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cronos-card p-6">
      <h2 className="text-xl font-bold text-text-primary mb-6">
        {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </h2>

      {projectError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {projectError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre del proyecto */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            Nombre del Proyecto *
          </label>
          <input
            {...register('name')}
            type="text"
            className="cronos-input w-full"
            placeholder="Ingrese el nombre del proyecto"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Cliente */}
        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-text-primary mb-2">
            Cliente *
          </label>
          <select
            {...register('clientId')}
            className="cronos-input w-full"
            disabled={clientsLoading}
          >
            <option value="">Seleccione un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
          )}
        </div>

        {/* Tarifa por hora */}
        <div>
          <label htmlFor="hourlyRate" className="block text-sm font-medium text-text-primary mb-2">
            Tarifa por Hora *
          </label>
          <input
            {...register('hourlyRate', { valueAsNumber: true })}
            type="number"
            step="0.01"
            min="0.01"
            className="cronos-input w-full"
            placeholder="0.00"
          />
          {errors.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hourlyRate.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
            Descripción
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="cronos-input w-full"
            placeholder="Descripción opcional del proyecto"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Estado (solo en edición) */}
        {isEditing && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
              Estado
            </label>
            <select
              {...register('status')}
              className="cronos-input w-full"
            >
              <option value={ProjectStatus.Active}>Activo</option>
              <option value={ProjectStatus.Archived}>Archivado</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cronos-btn-primary"
          >
            {isSubmitting 
              ? (isEditing ? 'Actualizando...' : 'Creando...') 
              : (isEditing ? 'Actualizar Proyecto' : 'Crear Proyecto')
            }
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cronos-btn-secondary"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}