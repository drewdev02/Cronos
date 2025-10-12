import { create } from 'zustand';
import { ProjectType, CreateProjectData, UpdateProjectData, ProjectSummary } from './types';
import { ProjectStatus } from '../../types';
import { persist, createJSONStorage } from 'zustand/middleware'


interface ProjectStore {
    // State
    projects: ProjectType[];
    loading: boolean;
    error: string | null;

    // Actions
    createProject: (data: CreateProjectData) => Promise<ProjectType>;
    updateProject: (id: string, data: Partial<UpdateProjectData>) => Promise<ProjectType>;
    archiveProject: (id: string) => Promise<void>;
    activateProject: (id: string) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProject: (id: string) => ProjectType | undefined;
    getProjectsByClient: (clientId: string) => ProjectType[];
    getActiveProjects: () => ProjectType[];
    getArchivedProjects: () => ProjectType[];
    getProjectSummary: (id: string) => Promise<ProjectSummary>;

    // Utility actions
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set, get) => ({
            // Initial state
            projects: [],
            loading: false,
            error: null,

            // Create project (CU5)
            createProject: async (data: CreateProjectData) => {
                set({ loading: true, error: null });

                try {
                    // Simulate API call
                    const newProject: ProjectType = {
                        id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        ...data,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };

                    set(state => ({
                        projects: [...state.projects, newProject],
                        loading: false
                    }));

                    return newProject;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al crear proyecto';
                    set({ error: errorMessage, loading: false });
                    throw new Error(errorMessage);
                }
            },

            // Update project (CU6)
            updateProject: async (id: string, data: Partial<UpdateProjectData>) => {
                set({ loading: true, error: null });

                try {
                    const { projects } = get();
                    const projectIndex = projects.findIndex(p => p.id === id);

                    if (projectIndex === -1) {
                        throw new Error('Proyecto no encontrado');
                    }

                    const updatedProject: ProjectType = {
                        ...projects[projectIndex],
                        ...data,
                        updatedAt: new Date().toISOString()
                    };

                    const updatedProjects = [...projects];
                    updatedProjects[projectIndex] = updatedProject;

                    set({
                        projects: updatedProjects,
                        loading: false
                    });

                    return updatedProject;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al actualizar proyecto';
                    set({ error: errorMessage, loading: false });
                    throw new Error(errorMessage);
                }
            },

            // Archive project (CU7)
            archiveProject: async (id: string) => {
                await get().updateProject(id, { status: ProjectStatus.Archived });
            },

            // Activate project
            activateProject: async (id: string) => {
                await get().updateProject(id, { status: ProjectStatus.Active });
            },

            // Delete project
            deleteProject: async (id: string) => {
                set({ loading: true, error: null });

                try {
                    const { projects } = get();
                    const filteredProjects = projects.filter(p => p.id !== id);

                    set({
                        projects: filteredProjects,
                        loading: false
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al eliminar proyecto';
                    set({ error: errorMessage, loading: false });
                    throw new Error(errorMessage);
                }
            },

            // Get project by ID
            getProject: (id: string) => {
                const { projects } = get();
                return projects.find(p => p.id === id);
            },

            // Get projects by client
            getProjectsByClient: (clientId: string) => {
                const { projects } = get();
                return projects.filter(p => p.clientId === clientId);
            },

            // Get active projects
            getActiveProjects: () => {
                const { projects } = get();
                return projects.filter(p => p.status === ProjectStatus.Active);
            },

            // Get archived projects
            getArchivedProjects: () => {
                const { projects } = get();
                return projects.filter(p => p.status === ProjectStatus.Archived);
            },

            // Get project summary (CU8)
            getProjectSummary: async (id: string): Promise<ProjectSummary> => {
                set({ loading: true, error: null });

                try {
                    const project = get().getProject(id);
                    if (!project) {
                        throw new Error('Proyecto no encontrado');
                    }

                    // TODO: Get actual data from tasks and time entries stores
                    // For now, return mock data
                    const summary: ProjectSummary = {
                        id: project.id,
                        name: project.name,
                        client: {
                            id: project.clientId,
                            name: 'Cliente Ejemplo', // TODO: Get from client store
                            currency: 'USD' // TODO: Get from client store
                        },
                        hourlyRate: project.hourlyRate,
                        status: project.status,
                        totalHours: 0, // TODO: Calculate from time entries
                        totalTasks: 0, // TODO: Get from tasks store
                        completedTasks: 0, // TODO: Get from tasks store
                        estimatedCost: 0, // TODO: Calculate based on tasks
                        actualCost: 0, // TODO: Calculate from time entries
                        createdAt: project.createdAt
                    };

                    set({ loading: false });
                    return summary;
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Error al obtener resumen del proyecto';
                    set({ error: errorMessage, loading: false });
                    throw new Error(errorMessage);
                }
            },

            // Utility actions
            setLoading: (loading: boolean) => set({ loading }),
            setError: (error: string | null) => set({ error }),
            clearError: () => set({ error: null })
        }),
        {
            name: 'cronos-projects',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                projects: state.projects
            })
        }
    ));