export default function ClientsModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Módulo de Clientes</h1>
        <p className="text-text-secondary mb-6">
          Gestión completa de clientes con sus proyectos, tareas y facturas asociadas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Funcionalidades */}
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Crear, editar, eliminar cliente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Ver detalle de cliente
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Historial de proyectos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Resumen de facturas
              </li>
            </ul>
          </div>

          {/* Casos de Uso */}
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><span className="text-blue-600 font-mono">CU1:</span> Crear cliente</li>
              <li><span className="text-blue-600 font-mono">CU2:</span> Editar cliente</li>
              <li><span className="text-blue-600 font-mono">CU3:</span> Eliminar cliente</li>
              <li><span className="text-blue-600 font-mono">CU4:</span> Ver detalle de cliente</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nuevo Cliente</button>
          <button className="cronos-btn-secondary">Ver Todos</button>
          <button className="cronos-btn-secondary">Importar Clientes</button>
        </div>
      </div>
    </div>
  )
}