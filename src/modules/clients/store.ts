import { create } from 'zustand';
import { ClientType, CreateClientData } from './types';

interface ClientsState {
  // Estado
  clients: ClientType[];
  selectedClient: ClientType | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones de gestión de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedClient: (client: ClientType | null) => void;
  
  // Casos de uso - CU1: Crear cliente
  createClient: (data: CreateClientData) => Promise<ClientType>;
  
  // Casos de uso - CU2: Editar cliente
  updateClient: (id: string, data: Partial<CreateClientData>) => Promise<ClientType>;
  
  // Casos de uso - CU3: Eliminar cliente
  deleteClient: (id: string) => Promise<void>;
  
  // Casos de uso - CU4: Ver detalle de cliente
  getClientById: (id: string) => ClientType | null;
  
  // Acciones adicionales
  getAllClients: () => Promise<ClientType[]>;
  clearError: () => void;
}

export const useClientsStore = create<ClientsState>((set, get) => ({
  // Estado inicial
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,
  
  // Acciones de gestión de estado
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setSelectedClient: (client: ClientType | null) => set({ selectedClient: client }),
  clearError: () => set({ error: null }),
  
  // CU1: Crear cliente
  createClient: async (data: CreateClientData): Promise<ClientType> => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      // Generar ID único (en una app real esto vendría del backend)
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const newClient: ClientType = {
        ...data,
        id,
        createdAt: now,
        updatedAt: now
      };
      
      // Simular llamada a API (reemplazar con llamada real)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        clients: [...state.clients, newClient]
      }));
      
      return newClient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear cliente';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  
  // CU2: Editar cliente
  updateClient: async (id: string, data: Partial<CreateClientData>): Promise<ClientType> => {
    const { setLoading, setError, clients } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const existingClient = clients.find(client => client.id === id);
      if (!existingClient) {
        throw new Error('Cliente no encontrado');
      }
      
      const updatedClient: ClientType = {
        ...existingClient,
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        clients: state.clients.map(client => 
          client.id === id ? updatedClient : client
        ),
        selectedClient: state.selectedClient?.id === id ? updatedClient : state.selectedClient
      }));
      
      return updatedClient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar cliente';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  
  // CU3: Eliminar cliente
  deleteClient: async (id: string): Promise<void> => {
    const { setLoading, setError, clients } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      const clientExists = clients.find(client => client.id === id);
      if (!clientExists) {
        throw new Error('Cliente no encontrado');
      }
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        clients: state.clients.filter(client => client.id !== id),
        selectedClient: state.selectedClient?.id === id ? null : state.selectedClient
      }));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar cliente';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  },
  
  // CU4: Ver detalle de cliente
  getClientById: (id: string): ClientType | null => {
    const { clients } = get();
    return clients.find(client => client.id === id) || null;
  },
  
  // Obtener todos los clientes
  getAllClients: async (): Promise<ClientType[]> => {
    const { setLoading, setError } = get();
    
    try {
      setLoading(true);
      setError(null);
      
      // Simular llamada a API para cargar clientes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // En una app real, aquí haríamos fetch de la API
      // Por ahora, retornamos los clientes que ya están en el estado
      const { clients } = get();
      return clients;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar clientes';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }
}));

// Hook personalizado para casos de uso específicos
export const useClientActions = () => {
  const {
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getAllClients,
    setSelectedClient,
    clearError
  } = useClientsStore();
  
  return {
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getAllClients,
    setSelectedClient,
    clearError
  };
};

// Hook para el estado de la UI
export const useClientState = () => {
  const {
    clients,
    selectedClient,
    isLoading,
    error
  } = useClientsStore();
  
  return {
    clients,
    selectedClient,
    isLoading,
    error
  };
};