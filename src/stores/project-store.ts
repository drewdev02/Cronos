import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { 
  Project, 
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectFilters, 
  ProjectStatus,
  ProjectWithMetrics,
  ProjectStats,
  ProjectSortBy,
  ProjectSortConfig
} from '@/types/project'
import { useCustomerStore } from './customer-store'

interface ProjectStore {
  // State
  projects: Project[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedProject: Project | null

  // Filters and sorting
  filters: ProjectFilters
  sort: ProjectSortConfig

  // Actions
  addProject: (project: CreateProjectDto) => void
  removeProject: (projectId: string) => void
  updateProject: (projectId: string, updates: UpdateProjectDto) => void

  // Timer management
  addTimerToProject: (projectId: string, timerId: string) => void
  removeTimerFromProject: (projectId: string, timerId: string) => void

  // Selection
  selectProject: (project: Project | null) => void
  getProjectById: (projectId: string) => Project | undefined

  // Search, filter and sort
  setSearchQuery: (query: string) => void
  setFilters: (filters: Partial<ProjectStore['filters']>) => void
  clearFilters: () => void
  setSort: (sort: ProjectSortConfig) => void

  // Bulk actions
  clearAllProjects: () => void
  exportProjects: () => Project[]
  importProjects: (projects: Project[]) => void
  bulkDeleteProjects: (projectIds: string[]) => void
  bulkUpdateStatus: (projectIds: string[], status: ProjectStatus) => void

  // Helper actions
  getFilteredProjects: () => Project[]
  getProjectsWithMetrics: () => ProjectWithMetrics[]
  getProjectsByCustomer: (customerId: string) => Project[]
  getActiveProjects: () => Project[]
  
  // Analytics
  getProjectStats: () => ProjectStats
  calculateProjectMetrics: (projectId: string) => ProjectWithMetrics | null

  // State management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        projects: [],
        isLoading: false,
        error: null,
        searchQuery: '',
        selectedProject: null,
        filters: {},
        sort: {
          sortBy: ProjectSortBy.UPDATED_AT,
          direction: 'desc'
        },

        // Actions
        addProject: (projectData) => {
          const newProject: Project = {
            ...projectData,
            id: crypto.randomUUID(),
            timerIds: [],
            status: projectData.status || ProjectStatus.PLANNING,
            currency: projectData.currency || 'USD',
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          set(
            (state) => ({
              projects: [...state.projects, newProject],
              error: null
            }),
            false,
            'addProject'
          )
        },

        removeProject: (projectId) => {
          set(
            (state) => ({
              projects: state.projects.filter(project => project.id !== projectId),
              selectedProject: state.selectedProject?.id === projectId ? null : state.selectedProject,
              error: null
            }),
            false,
            'removeProject'
          )
        },

        updateProject: (projectId, updates) => {
          set(
            (state) => ({
              ...state,
              projects: state.projects.map(project =>
                project.id === projectId
                  ? { ...project, ...updates, updatedAt: new Date() }
                  : project
              ),
              selectedProject: state.selectedProject?.id === projectId
                ? { ...state.selectedProject, ...updates, updatedAt: new Date() }
                : state.selectedProject,
              error: null
            }),
            false,
            'updateProject'
          )
        },

        // Timer management
        addTimerToProject: (projectId, timerId) => {
          set(
            (state) => ({
              ...state,
              projects: state.projects.map(project =>
                project.id === projectId
                  ? { 
                      ...project, 
                      timerIds: [...project.timerIds.filter(id => id !== timerId), timerId],
                      updatedAt: new Date() 
                    }
                  : project
              ),
              error: null
            }),
            false,
            'addTimerToProject'
          )
        },

        removeTimerFromProject: (projectId, timerId) => {
          set(
            (state) => ({
              ...state,
              projects: state.projects.map(project =>
                project.id === projectId
                  ? { 
                      ...project, 
                      timerIds: project.timerIds.filter(id => id !== timerId),
                      updatedAt: new Date() 
                    }
                  : project
              ),
              error: null
            }),
            false,
            'removeTimerFromProject'
          )
        },

        // Selection
        selectProject: (project) => {
          set(
            { selectedProject: project },
            false,
            'selectProject'
          )
        },

        getProjectById: (projectId) => {
          const { projects } = get()
          return projects.find(p => p.id === projectId)
        },

        // Search, filter and sort
        setSearchQuery: (query) => {
          set(
            { searchQuery: query },
            false,
            'setSearchQuery'
          )
        },

        setFilters: (newFilters) => {
          set(
            (state) => ({
              filters: { ...state.filters, ...newFilters }
            }),
            false,
            'setFilters'
          )
        },

        clearFilters: () => {
          set(
            { filters: {}, searchQuery: '' },
            false,
            'clearFilters'
          )
        },

        setSort: (sort) => {
          set(
            { sort },
            false,
            'setSort'
          )
        },

        // Helper functions
        getFilteredProjects: () => {
          const { projects, searchQuery, filters, sort } = get()
          
          const filteredProjects = projects.filter(project => {
            // Search query filter
            const matchesSearch = !searchQuery ||
              project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))

            // Customer filter
            const matchesCustomer = !filters.customerId || project.customerId === filters.customerId

            // Status filter
            const matchesStatus = !filters.status?.length || filters.status.includes(project.status)

            // Currency filter
            const matchesCurrency = !filters.currency || project.currency === filters.currency

            // Hourly rate range filter
            const matchesHourlyRate = !filters.hourlyRateRange || (
              (!filters.hourlyRateRange.min || project.hourlyRate >= filters.hourlyRateRange.min) &&
              (!filters.hourlyRateRange.max || project.hourlyRate <= filters.hourlyRateRange.max)
            )

            // Date range filter
            const matchesDateRange = !filters.dateRange || (
              (!filters.dateRange.from || !project.startDate || project.startDate >= filters.dateRange.from) &&
              (!filters.dateRange.to || !project.endDate || project.endDate <= filters.dateRange.to)
            )

            // Has active timers filter
            const matchesActiveTimers = filters.hasActiveTimers === undefined || 
              (filters.hasActiveTimers ? project.timerIds.length > 0 : project.timerIds.length === 0)

            return matchesSearch && matchesCustomer && matchesStatus && matchesCurrency && 
                   matchesHourlyRate && matchesDateRange && matchesActiveTimers
          })

          // Apply sorting
          filteredProjects.sort((a, b) => {
            let comparison = 0
            
            switch (sort.sortBy) {
              case ProjectSortBy.NAME:
                comparison = a.name.localeCompare(b.name)
                break
              case ProjectSortBy.STATUS:
                comparison = a.status.localeCompare(b.status)
                break
              case ProjectSortBy.HOURLY_RATE:
                comparison = a.hourlyRate - b.hourlyRate
                break
              case ProjectSortBy.CREATED_AT:
                comparison = a.createdAt.getTime() - b.createdAt.getTime()
                break
              case ProjectSortBy.UPDATED_AT:
              default:
                comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
                break
              case ProjectSortBy.START_DATE:
                if (!a.startDate && !b.startDate) comparison = 0
                else if (!a.startDate) comparison = 1
                else if (!b.startDate) comparison = -1
                else comparison = a.startDate.getTime() - b.startDate.getTime()
                break
              case ProjectSortBy.END_DATE:
                if (!a.endDate && !b.endDate) comparison = 0
                else if (!a.endDate) comparison = 1
                else if (!b.endDate) comparison = -1
                else comparison = a.endDate.getTime() - b.endDate.getTime()
                break
            }

            return sort.direction === 'asc' ? comparison : -comparison
          })

          return filteredProjects
        },

        getProjectsWithMetrics: () => {
          const { projects, calculateProjectMetrics } = get()
          return projects.map(project => calculateProjectMetrics(project.id)).filter(Boolean) as ProjectWithMetrics[]
        },

        getProjectsByCustomer: (customerId) => {
          const { projects } = get()
          return projects.filter(project => project.customerId === customerId)
        },

        getActiveProjects: () => {
          const { projects } = get()
          return projects.filter(project => 
            project.status === ProjectStatus.ACTIVE || project.status === ProjectStatus.PLANNING
          )
        },

        // Analytics
        getProjectStats: () => {
          const { projects } = get()
          const customerStore = useCustomerStore.getState()
          
          const totalProjects = projects.length
          const projectsByStatus = projects.reduce((acc, project) => {
            acc[project.status] = (acc[project.status] || 0) + 1
            return acc
          }, {} as Record<ProjectStatus, number>)

          // Initialize all statuses
          Object.values(ProjectStatus).forEach(status => {
            if (!(status in projectsByStatus)) {
              projectsByStatus[status] = 0
            }
          })

          const totalActiveProjects = projectsByStatus[ProjectStatus.ACTIVE] || 0
          const totalCompletedProjects = projectsByStatus[ProjectStatus.COMPLETED] || 0

          const totalBilled = 0 // Would need billing data
          const totalTimeSpent = 0 // Would need timer data
          const averageHourlyRate = totalProjects > 0 
            ? projects.reduce((sum, p) => sum + p.hourlyRate, 0) / totalProjects 
            : 0

          // Top customers analysis
          interface CustomerProjectData {
            customerId: string
            customerName: string
            projectCount: number
            totalTimeSpent: number
            totalBilled: number
          }

          const customerProjects = projects.reduce((acc, project) => {
            if (!acc[project.customerId]) {
              acc[project.customerId] = {
                customerId: project.customerId,
                customerName: customerStore.getCustomerById(project.customerId)?.companyName || 'Unknown',
                projectCount: 0,
                totalTimeSpent: 0,
                totalBilled: 0
              }
            }
            acc[project.customerId].projectCount++
            return acc
          }, {} as Record<string, CustomerProjectData>)

          const topCustomers = Object.values(customerProjects)
            .sort((a, b) => b.projectCount - a.projectCount)
            .slice(0, 5)

          const stats: ProjectStats = {
            totalProjects,
            projectsByStatus,
            totalTimeSpent,
            totalBilled,
            averageHourlyRate,
            totalActiveProjects,
            totalCompletedProjects,
            topCustomers,
            revenueByMonth: [], // Would need billing data
            projectsWithOvertime: 0, // Would need timer vs estimated comparison
            averageProjectDuration: 0 // Would need completion date analysis
          }

          return stats
        },

        calculateProjectMetrics: (projectId) => {
          const { projects } = get()
          const project = projects.find(p => p.id === projectId)
          if (!project) return null

          // This would integrate with timer store to get real metrics
          // For now, returning basic metrics
          const projectWithMetrics: ProjectWithMetrics = {
            ...project,
            totalTimeSpent: 0,
            totalBilled: 0,
            activeTimersCount: 0,
            completedTimersCount: 0,
            totalTimersCount: project.timerIds.length,
            efficiencyRate: 100,
            profitabilityScore: 85,
            progress: project.status === ProjectStatus.COMPLETED ? 100 : 0,
            isOverBudget: false,
            isOverdue: false,
            needsAttention: false
          }

          return projectWithMetrics
        },

        // Bulk actions
        clearAllProjects: () => {
          set(
            {
              projects: [],
              selectedProject: null,
              searchQuery: '',
              filters: {},
              error: null
            },
            false,
            'clearAllProjects'
          )
        },

        exportProjects: () => {
          const { projects } = get()
          return [...projects]
        },

        importProjects: (projects) => {
          const validProjects = projects.filter(project =>
            project.name &&
            project.customerId &&
            project.hourlyRate &&
            project.currency
          ).map(project => ({
            ...project,
            id: project.id || crypto.randomUUID(),
            timerIds: project.timerIds || [],
            status: project.status || ProjectStatus.PLANNING,
            createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
            updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          }))

          set(
            {
              projects: validProjects,
              error: null
            },
            false,
            'importProjects'
          )
        },

        bulkDeleteProjects: (projectIds) => {
          set(
            (state) => {
              const updatedProjects = state.projects.filter(project => !projectIds.includes(project.id))
              const selectedProjectId = state.selectedProject?.id
              return {
                ...state,
                projects: updatedProjects,
                selectedProject: selectedProjectId && projectIds.includes(selectedProjectId) ? null : state.selectedProject,
                error: null
              }
            },
            false,
            'bulkDeleteProjects'
          )
        },

        bulkUpdateStatus: (projectIds, status) => {
          set(
            (state) => ({
              ...state,
              projects: state.projects.map(project =>
                projectIds.includes(project.id)
                  ? { ...project, status, updatedAt: new Date() }
                  : project
              ),
              error: null
            }),
            false,
            'bulkUpdateStatus'
          )
        },

        // State management
        setLoading: (loading) => {
          set(
            { isLoading: loading },
            false,
            'setLoading'
          )
        },

        setError: (error) => {
          set(
            { error },
            false,
            'setError'
          )
        },
      }),
      {
        name: 'project-store',
        version: 1,
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name)
            if (!str) return null

            try {
              const state = JSON.parse(str)
              // Convert date strings back to Date objects
              if (state.state?.projects) {
                state.state.projects = state.state.projects.map((project: Project) => ({
                  ...project,
                  createdAt: project.createdAt ? new Date(project.createdAt) : new Date(),
                  updatedAt: project.updatedAt ? new Date(project.updatedAt) : new Date(),
                  startDate: project.startDate ? new Date(project.startDate) : undefined,
                  endDate: project.endDate ? new Date(project.endDate) : undefined,
                }))
              }
              if (state.state?.selectedProject) {
                const sp = state.state.selectedProject
                sp.createdAt = new Date(sp.createdAt)
                sp.updatedAt = new Date(sp.updatedAt)
                if (sp.startDate) sp.startDate = new Date(sp.startDate)
                if (sp.endDate) sp.endDate = new Date(sp.endDate)
              }
              return state
            } catch (error) {
              console.error('Error parsing stored project data:', error)
              return null
            }
          },
          setItem: (name, value) => {
            localStorage.setItem(name, JSON.stringify(value))
          },
          removeItem: (name) => {
            localStorage.removeItem(name)
          }
        },
      }
    ),
    {
      name: 'project-store'
    }
  )
)

// Selectors for common use cases
export const useProjects = () => useProjectStore(state => state.projects)

// Action hooks for better performance
export const useAddProject = () => useProjectStore(state => state.addProject)
export const useRemoveProject = () => useProjectStore(state => state.removeProject)
export const useUpdateProject = () => useProjectStore(state => state.updateProject)
export const useSelectProject = () => useProjectStore(state => state.selectProject)
export const useClearAllProjects = () => useProjectStore(state => state.clearAllProjects)

// Timer management hooks
export const useProjectTimers = () => useProjectStore(state => ({
  addTimer: state.addTimerToProject,
  removeTimer: state.removeTimerFromProject
}))

// Complex selectors
export const useSelectedProject = () => useProjectStore(state => state.selectedProject)

export const useProjectById = (projectId: string) =>
  useProjectStore(state => state.getProjectById(projectId))

export const useFilteredProjects = () =>
  useProjectStore(state => state.getFilteredProjects())

export const useProjectsByCustomer = (customerId: string) =>
  useProjectStore(state => state.getProjectsByCustomer(customerId))

export const useActiveProjects = () =>
  useProjectStore(state => state.getActiveProjects())

export const useProjectStats = () =>
  useProjectStore(state => state.getProjectStats())

export const useProjectsWithMetrics = () =>
  useProjectStore(state => state.getProjectsWithMetrics())

// Search and filter hooks
export const useProjectSearch = () => useProjectStore(state => ({
  searchQuery: state.searchQuery,
  setSearchQuery: state.setSearchQuery,
  filters: state.filters,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  sort: state.sort,
  setSort: state.setSort
}))

// Loading and error state hooks
export const useProjectState = () => useProjectStore(state => ({
  isLoading: state.isLoading,
  error: state.error,
  setLoading: state.setLoading,
  setError: state.setError
}))