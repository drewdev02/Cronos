export default function StatisticsModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Filtros y Estadísticas</h1>
        <p className="text-text-secondary mb-6">
          Análisis detallado de productividad con filtros personalizables y métricas avanzadas.
        </p>

        {/* Filtros */}
        <div className="cronos-surface p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-cronos-500 mb-3">Filtros de Análisis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">Período</label>
              <select className="cronos-input w-full">
                <option>Esta semana</option>
                <option>Este mes</option>
                <option>Rango personalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Cliente</label>
              <select className="cronos-input w-full">
                <option>Todos los clientes</option>
                <option>ACME Corp</option>
                <option>TechStart</option>
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-sm mb-2">Proyecto</label>
              <select className="cronos-input w-full">
                <option>Todos los proyectos</option>
                <option>Cronos App</option>
                <option>Website Redesign</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Filtrar por semana, mes o rango
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Estadísticas por cliente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Estadísticas por proyecto
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Estadísticas globales
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-1 text-text-secondary text-sm">
              <li><span className="text-blue-600 font-mono">CU22:</span> Filtrar por semana</li>
              <li><span className="text-blue-600 font-mono">CU23:</span> Filtrar por mes</li>
              <li><span className="text-blue-600 font-mono">CU24:</span> Rango personalizado</li>
              <li><span className="text-blue-600 font-mono">CU25:</span> Stats por cliente</li>
              <li><span className="text-blue-600 font-mono">CU26:</span> Stats por proyecto</li>
              <li><span className="text-blue-600 font-mono">CU27:</span> Stats globales</li>
            </ul>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="cronos-surface p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-cronos-500">142h</div>
            <div className="text-text-secondary text-sm">Tiempo Total</div>
          </div>
          <div className="cronos-surface p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">8.5h</div>
            <div className="text-text-secondary text-sm">Promedio Diario</div>
          </div>
          <div className="cronos-surface p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-500">89%</div>
            <div className="text-text-secondary text-sm">Productividad</div>
          </div>
          <div className="cronos-surface p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-500">12</div>
            <div className="text-text-secondary text-sm">Proyectos</div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Generar Reporte</button>
          <button className="cronos-btn-secondary">Exportar Datos</button>
          <button className="cronos-btn-secondary">Configurar Alertas</button>
        </div>
      </div>
    </div>
  )
}