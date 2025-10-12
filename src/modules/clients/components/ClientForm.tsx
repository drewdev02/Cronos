import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientSchema, CreateClientData, CURRENCY_OPTIONS } from '../types';
import { useClientActions, useClientState } from '../store';

interface ClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<CreateClientData>;
  isEditing?: boolean;
  clientId?: string;
}

export function ClientForm({ 
  onSuccess, 
  onCancel, 
  initialData, 
  isEditing = false,
  clientId 
}: ClientFormProps) {
  const { createClient, updateClient } = useClientActions();
  const { isLoading, error } = useClientState();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateClientData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      currency: initialData?.currency || 'USD',
      address: initialData?.address || '',
      company: initialData?.company || ''
    }
  });

  const onSubmit = async (data: CreateClientData) => {
    try {
      if (isEditing && clientId) {
        await updateClient(clientId, data);
      } else {
        await createClient(data);
      }
      
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <div className="cronos-card p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Nombre del cliente */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Nombre del Cliente *
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 ${
              errors.name ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Ingrese el nombre del cliente"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="ejemplo@email.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="+1 234 567 8900"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Empresa */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
            Empresa
          </label>
          <input
            id="company"
            type="text"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 ${
              errors.company ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Nombre de la empresa"
            {...register('company')}
          />
          {errors.company && (
            <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>
          )}
        </div>

        {/* Moneda */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-300 mb-1">
            Moneda *
          </label>
          <select
            id="currency"
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white ${
              errors.currency ? 'border-red-500' : 'border-gray-600'
            }`}
            {...register('currency')}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
          {errors.currency && (
            <p className="text-red-400 text-sm mt-1">{errors.currency.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
            Dirección
          </label>
          <textarea
            id="address"
            rows={3}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-white placeholder-gray-500 resize-none ${
              errors.address ? 'border-red-500' : 'border-gray-600'
            }`}
            placeholder="Dirección completa del cliente"
            {...register('address')}
          />
          {errors.address && (
            <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="cronos-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEditing ? 'Guardando...' : 'Creando...'}
              </span>
            ) : (
              isEditing ? 'Guardar Cambios' : 'Crear Cliente'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting || isLoading}
            className="cronos-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}