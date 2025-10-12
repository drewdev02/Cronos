import { NavLink } from 'react-router-dom'

// Iconos SVG simples para cada módulo
const Icons = {
  Clients: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Projects: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Tasks: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  TimeRecords: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Statistics: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Billing: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Reports: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

// Configuración de módulos con sus rutas
const modules = [
  {
    id: 'clients',
    name: 'Clientes',
    description: 'Gestión de clientes',
    path: '/clients',
    icon: Icons.Clients,
    cases: ['CU1', 'CU2', 'CU3', 'CU4']
  },
  {
    id: 'projects', 
    name: 'Proyectos',
    description: 'Administración de proyectos',
    path: '/projects',
    icon: Icons.Projects,
    cases: ['CU5', 'CU6', 'CU7', 'CU8']
  },
  {
    id: 'tasks',
    name: 'Tareas',
    description: 'Control de tareas y cronómetro',
    path: '/tasks',
    icon: Icons.Tasks,
    cases: ['CU9-CU17']
  },
  {
    id: 'time-records',
    name: 'Registros de Tiempo',
    description: 'Historial de tiempo trabajado',
    path: '/time-records',
    icon: Icons.TimeRecords,
    cases: ['CU18', 'CU19', 'CU20', 'CU21']
  },
  {
    id: 'statistics',
    name: 'Filtros y Estadísticas',
    description: 'Análisis y reportes',
    path: '/statistics',
    icon: Icons.Statistics,
    cases: ['CU22-CU27']
  },
  {
    id: 'billing',
    name: 'Facturación',
    description: 'Gestión de facturas',
    path: '/billing',
    icon: Icons.Billing,
    cases: ['CU28-CU36']
  },
  {
    id: 'reports',
    name: 'Reportes y Utilidades',
    description: 'Resúmenes y exportación',
    path: '/reports',
    icon: Icons.Reports,
    cases: ['CU37', 'CU38', 'CU39', 'CU40']
  }
]

export default function Sidebar() {
  return (
    <aside className="w-80 bg-surface border-r border-border-primary flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border-secondary">
        <h1 className="text-xl font-bold text-text-primary">Cronos</h1>
        <p className="text-text-secondary text-sm mt-1">Sistema de Gestión de Tiempo</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 cronos-scrollbar overflow-y-auto">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <NavLink
              key={module.id}
              to={module.path}
              className={({ isActive }) => 
                `group flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-cronos-500 bg-opacity-10 border border-cronos-500 border-opacity-30 text-cronos-500' 
                    : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                }`
              }
            >
              <div className="mt-0.5">
                <Icon />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm group-hover:text-inherit">
                  {module.name}
                </div>
                <div className="text-xs opacity-75 mt-0.5 leading-tight">
                  {module.description}
                </div>
                <div className="text-xs opacity-60 mt-1">
                  Casos: {module.cases.join(', ')}
                </div>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-secondary">
        <div className="cronos-card p-3">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <div className="w-2 h-2 bg-cronos-500 rounded-full animate-pulse"></div>
            <span>Sistema activo</span>
          </div>
          <div className="text-xs text-text-muted mt-1">
            v1.0.0 - Electron + React
          </div>
        </div>
      </div>
    </aside>
  )
}