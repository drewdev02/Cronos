import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schema for time records
const timeRecordFormSchema = z.object({
  startTime: z.string().min(1, 'Hora de inicio es requerida'),
  endTime: z.string().min(1, 'Hora de fin es requerida'),
  description: z.string().optional()
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'La hora de fin debe ser posterior a la hora de inicio',
  path: ['endTime']
});

type TimeRecordFormData = z.infer<typeof timeRecordFormSchema>;

interface TimeRecordFormProps {
  taskId: string;
  onSubmit: (data: TimeRecordFormData & { taskId: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<TimeRecordFormData>;
  mode?: 'create' | 'edit';
}

export const TimeRecordForm: React.FC<TimeRecordFormProps> = ({
  taskId,
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
  mode = 'create'
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TimeRecordFormData>({
    resolver: zodResolver(timeRecordFormSchema),
    defaultValues: initialData || {
      startTime: '',
      endTime: '',
      description: ''
    }
  });

  const handleFormSubmit = (data: TimeRecordFormData) => {
    onSubmit({ ...data, taskId });
    if (mode === 'create') {
      reset();
    }
  };

  // Get current date in YYYY-MM-DD format for date input max
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="cronos-surface p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        {mode === 'create' ? 'Agregar Tiempo Manual' : 'Editar Tiempo'}
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-text-secondary mb-1">
              Hora de inicio *
            </label>
            <input
              type="datetime-local"
              id="startTime"
              max={`${today}T23:59`}
              {...register('startTime')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-text-secondary mb-1">
              Hora de fin *
            </label>
            <input
              type="datetime-local"
              id="endTime"
              max={`${today}T23:59`}
              {...register('endTime')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cronos-500 focus:border-transparent"
            />
            {errors.endTime && (
              <p className="text-red-500 text-sm mt-1">{errors.endTime.message}</p>
            )}
          </div>
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
            placeholder="Descripción del trabajo realizado (opcional)"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="cronos-btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : mode === 'create' ? 'Agregar Tiempo' : 'Actualizar Tiempo'}
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