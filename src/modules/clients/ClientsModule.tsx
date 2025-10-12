import { useState } from 'react';
import { ClientForm, ClientList, ClientDetail } from './components';
import { ClientType } from './types';
import { useClientState } from './store';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

export default function ClientsModule() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingClient, setEditingClient] = useState<ClientType | null>(null);
  const { selectedClient } = useClientState();

  const handleCreateClient = () => {
    setEditingClient(null);
    setViewMode('create');
  };

  const handleEditClient = (client: ClientType) => {
    setEditingClient(client);
    setViewMode('edit');
  };

  const handleClientSelect = () => {
    // El cliente ya se guarda en el store cuando se selecciona
    setViewMode('detail');
  };

  const handleFormSuccess = () => {
    setViewMode('list');
    setEditingClient(null);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setEditingClient(null);
  };

  const handleCloseDetail = () => {
    setViewMode('list');
  };

  const handleEditFromDetail = () => {
    if (selectedClient) {
      setEditingClient(selectedClient);
      setViewMode('edit');
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
        return (
          <ClientForm
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        );

      case 'edit':
        return (
          <ClientForm
            initialData={editingClient || undefined}
            isEditing={true}
            clientId={editingClient?.id}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        );

      case 'detail':
        return selectedClient ? (
          <ClientDetail
            client={selectedClient}
            onEdit={handleEditFromDetail}
            onClose={handleCloseDetail}
          />
        ) : (
          <div className="cronos-card p-6">
            <p className="text-text-secondary">No hay cliente seleccionado</p>
          </div>
        );

      case 'list':
      default:
        return (
          <ClientList
            onClientSelect={handleClientSelect}
            onEditClient={handleEditClient}
          />
        );
    }
  };

  return (
    <div className="p-6">
      {/* Header con navegación */}
      <div className="cronos-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Módulo de Clientes
            </h1>
            <p className="text-gray-400">
              Gestión completa de clientes con sus proyectos, tareas y facturas asociadas.
            </p>
          </div>

          {viewMode === 'list' && (
            <button
              onClick={handleCreateClient}
              className="cronos-btn-primary"
            >
              + Nuevo Cliente
            </button>
          )}
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <button
            onClick={() => setViewMode('list')}
            className={`hover:text-green-400 ${viewMode === 'list' ? 'text-green-400 font-medium' : ''}`}
          >
            Lista de Clientes
          </button>

          {viewMode !== 'list' && (
            <>
              <span>/</span>
              <span className="text-green-400 font-medium">
                {viewMode === 'create' && 'Nuevo Cliente'}
                {viewMode === 'edit' && `Editar: ${editingClient?.name}`}
                {viewMode === 'detail' && `Detalle: ${selectedClient?.name}`}
              </span>
            </>
          )}
        </div>

        {/* Casos de uso implementados */}
        {viewMode === 'list' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium text-green-400">CU1: Crear Cliente</div>
              <div className="text-xs text-gray-400">Implementado</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium text-blue-400">CU2: Editar Cliente</div>
              <div className="text-xs text-gray-400">Implementado</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium text-orange-400">CU3: Eliminar Cliente</div>
              <div className="text-xs text-gray-400">Implementado</div>
            </div>

            <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm font-medium text-purple-400">CU4: Ver Detalle</div>
              <div className="text-xs text-gray-400">Implementado</div>
            </div>
          </div>
        )}
      </div>

      {/* Contenido principal */}
      {renderContent()}
    </div>
  );
}