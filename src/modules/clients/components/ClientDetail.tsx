import { ClientType } from '../types';

interface ClientDetailProps {
  client: ClientType;
  onEdit?: () => void;
  onClose?: () => void;
}

export function ClientDetail({ client, onEdit, onClose }: ClientDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="cronos-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Detalle del Cliente
        </h2>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="cronos-btn-secondary"
            >
              ✏️ Editar
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="cronos-btn-secondary"
            >
              ✕ Cerrar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Información Básica
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre
              </label>
              <p className="text-white font-medium">{client.name}</p>
            </div>

            {client.company && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Empresa
                </label>
                <p className="text-white">{client.company}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Moneda
              </label>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-green-400/20 text-green-400 text-sm rounded border border-green-400/30">
                  {client.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">
            Información de Contacto
          </h3>
          
          <div className="space-y-3">
            {client.email ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a 
                    href={`mailto:${client.email}`}
                    className="text-blue-400 hover:underline"
                  >
                    {client.email}
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-gray-500 italic">No especificado</p>
              </div>
            )}

            {client.phone ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Teléfono
                </label>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a 
                    href={`tel:${client.phone}`}
                    className="text-blue-400 hover:underline"
                  >
                    {client.phone}
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Teléfono
                </label>
                <p className="text-gray-500 italic">No especificado</p>
              </div>
            )}

            {client.address ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Dirección
                </label>
                <p className="text-white whitespace-pre-line">{client.address}</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Dirección
                </label>
                <p className="text-gray-500 italic">No especificada</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadatos */}
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Información del Sistema
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                ID del Cliente
              </label>
              <p className="text-white font-mono text-sm bg-gray-700 px-2 py-1 rounded border border-gray-600">
                {client.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Fecha de Creación
              </label>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <p className="text-white">{formatDate(client.createdAt)}</p>
              </div>
            </div>

            {client.updatedAt && client.updatedAt !== client.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Última Actualización
                </label>
                <div className="flex items-center gap-2">
                  <span>🔄</span>
                  <p className="text-white">{formatDate(client.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de actividad */}
        <div className="bg-gray-800 border border-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">
            Resumen de Actividad
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-400/10 rounded border border-blue-400/20">
                <div className="text-2xl font-bold text-blue-400">0</div>
                <div className="text-sm text-blue-400">Proyectos</div>
              </div>
              <div className="text-center p-3 bg-green-400/10 rounded border border-green-400/20">
                <div className="text-2xl font-bold text-green-400">0</div>
                <div className="text-sm text-green-400">Tareas</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-orange-400/10 rounded border border-orange-400/20">
                <div className="text-2xl font-bold text-orange-400">0</div>
                <div className="text-sm text-orange-400">Facturas</div>
              </div>
              <div className="text-center p-3 bg-purple-400/10 rounded border border-purple-400/20">
                <div className="text-2xl font-bold text-purple-400">{client.currency} 0</div>
                <div className="text-sm text-purple-400">Total Facturado</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-700 rounded text-center border border-gray-600">
              <p className="text-sm text-gray-400">
                📊 Los datos de actividad se mostrarán cuando estén implementados los módulos de proyectos, tareas y facturas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}