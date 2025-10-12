import { useState, useEffect } from 'react';
import { useClientActions, useClientState } from '../store';
import { ClientType } from '../types';

interface ClientListProps {
  onClientSelect?: (client: ClientType) => void;
  onEditClient?: (client: ClientType) => void;
}

export function ClientList({ onClientSelect, onEditClient }: ClientListProps) {
  const { getAllClients, deleteClient, setSelectedClient } = useClientActions();
  const { clients, isLoading, error } = useClientState();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    getAllClients();
  }, [getAllClients]);

  const handleDelete = async (clientId: string) => {
    try {
      await deleteClient(clientId);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const handleSelectClient = (client: ClientType) => {
    setSelectedClient(client);
    onClientSelect?.(client);
  };

  if (isLoading && clients.length === 0) {
    return (
      <div className="cronos-card p-6">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            Cargando clientes...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cronos-card p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="cronos-card p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            No hay clientes registrados
          </h3>
          <p className="text-gray-400">
            Comienza creando tu primer cliente para gestionar proyectos y tareas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cronos-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Lista de Clientes ({clients.length})
        </h2>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div 
            key={client.id} 
            className="bg-gray-800 border border-gray-700 p-4 rounded-lg hover:border-green-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white">
                    {client.name}
                  </h3>
                  <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs rounded border border-green-400/30">
                    {client.currency}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                  {client.email && (
                    <div className="flex items-center gap-1">
                      <span>📧</span>
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <span>📞</span>
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.company && (
                    <div className="flex items-center gap-1">
                      <span>🏢</span>
                      <span>{client.company}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    <span>Creado: {new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleSelectClient(client)}
                  className="px-3 py-1 text-green-400 hover:bg-green-400/10 rounded transition-colors"
                  title="Ver detalle"
                >
                  👁️
                </button>
                
                <button
                  onClick={() => onEditClient?.(client)}
                  className="px-3 py-1 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                  title="Editar cliente"
                >
                  ✏️
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(client.id)}
                  className="px-3 py-1 text-orange-400 hover:bg-orange-400/10 rounded transition-colors"
                  title="Eliminar cliente"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer 
              y también eliminará todos los proyectos asociados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 disabled:opacity-50 text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}