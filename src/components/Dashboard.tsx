export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="cronos-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Cronos Dashboard</h1>
            <p className="text-text-secondary mt-1">Tema oscuro con acentos verdes</p>
          </div>
          <div className="flex gap-3">
            <button className="cronos-btn-secondary">Configuración</button>
            <button className="cronos-btn-primary">Nueva Tarea</button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="cronos-card cronos-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Productividad</p>
              <p className="text-2xl font-bold text-cronos-500">89.2%</p>
            </div>
            <div className="w-12 h-12 bg-cronos-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-cronos-500 rounded-full cronos-glow-green"></div>
            </div>
          </div>
        </div>

        <div className="cronos-card cronos-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Tiempo Total</p>
              <p className="text-2xl font-bold text-blue-600">35h 7m</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full cronos-glow-blue"></div>
            </div>
          </div>
        </div>

        <div className="cronos-card cronos-hover p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Descansos</p>
              <p className="text-2xl font-bold text-orange-500">8h 47m</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full cronos-glow-orange"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="cronos-card p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Actividad Semanal</h3>
          <div className="space-y-3">
            {[
              { day: 'Lunes', value: 85, color: 'cronos-gradient-green' },
              { day: 'Martes', value: 92, color: 'cronos-gradient-blue' },
              { day: 'Miércoles', value: 78, color: 'cronos-gradient-orange' },
              { day: 'Jueves', value: 95, color: 'cronos-gradient-purple' },
              { day: 'Viernes', value: 88, color: 'cronos-gradient-green' },
              { day: 'Sábado', value: 60, color: 'bg-surface-tertiary' },
              { day: 'Domingo', value: 45, color: 'bg-surface-tertiary' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-text-secondary w-16 text-sm">{item.day}</span>
                <div className="flex-1 bg-surface-tertiary rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full ${item.color} transition-all duration-300`}
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-text-primary text-sm w-8">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="cronos-card p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-4">Proyectos Recientes</h3>
          <div className="space-y-3">
            {[
              { name: 'Cronoid App', time: '2h 46m', status: 'success' },
              { name: 'Website Redesign', time: '1h 30m', status: 'warning' },
              { name: 'API Development', time: '3h 15m', status: 'success' },
              { name: 'Database Migration', time: '45m', status: 'info' },
            ].map((project, index) => (
              <div key={index} className="cronos-surface cronos-hover p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      project.status === 'success' ? 'bg-cronos-500' :
                      project.status === 'warning' ? 'bg-orange-500' :
                      project.status === 'info' ? 'bg-blue-600' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-text-primary font-medium">{project.name}</span>
                  </div>
                  <span className="text-text-secondary text-sm">{project.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Center */}
      <div className="cronos-card p-6 mt-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Centro de Acciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="cronos-btn-primary text-center py-4">
            <div className="text-lg font-semibold">Iniciar Timer</div>
            <div className="text-sm opacity-80">Comenzar sesión</div>
          </button>
          <button className="cronos-btn-secondary text-center py-4">
            <div className="text-lg font-semibold">Ver Reportes</div>
            <div className="text-sm opacity-80">Análisis detallado</div>
          </button>
          <button className="cronos-btn-secondary text-center py-4">
            <div className="text-lg font-semibold">Configurar</div>
            <div className="text-sm opacity-80">Ajustes del sistema</div>
          </button>
          <button className="cronos-btn-secondary text-center py-4">
            <div className="text-lg font-semibold">Exportar</div>
            <div className="text-sm opacity-80">Datos en CSV</div>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="mt-6 space-y-3">
        <div className="cronos-success p-4 rounded-lg">
          <p className="font-medium">¡Sesión completada!</p>
          <p className="text-sm mt-1 opacity-90">Has completado 2 horas de trabajo productivo.</p>
        </div>
        
        <div className="cronos-info p-4 rounded-lg">
          <p className="font-medium">Recordatorio</p>
          <p className="text-sm mt-1 opacity-90">Tu descanso programado comenzará en 15 minutos.</p>
        </div>
      </div>
    </div>
  )
}