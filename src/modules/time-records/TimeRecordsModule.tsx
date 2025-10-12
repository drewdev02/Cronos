export default function TimeRecordsModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Registros de Tiempo</h1>
        <p className="text-text-secondary mb-6">
          Historial completo de tiempo trabajado con capacidad de edición y análisis.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Registros automáticos del cronómetro
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Editar/eliminar registros
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Listar registros por tarea
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Filtrado y búsqueda
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><span className="text-blue-600 font-mono">CU18:</span> Crear registro automático</li>
              <li><span className="text-blue-600 font-mono">CU19:</span> Editar registro</li>
              <li><span className="text-blue-600 font-mono">CU20:</span> Eliminar registro</li>
              <li><span className="text-blue-600 font-mono">CU21:</span> Listar por tarea</li>
            </ul>
          </div>
        </div>

        {/* Tabla de registros recientes */}
        <div className="mt-6 cronos-surface rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border-secondary">
            <h3 className="text-lg font-semibold text-text-primary">Registros Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-tertiary">
                <tr className="text-text-secondary text-sm">
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Tarea</th>
                  <th className="text-left p-3">Proyecto</th>
                  <th className="text-left p-3">Duración</th>
                  <th className="text-left p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-border-secondary">
                  <td className="p-3">Hoy 14:30</td>
                  <td className="p-3">Desarrollo Frontend</td>
                  <td className="p-3">Cronos App</td>
                  <td className="p-3 text-cronos-500">2h 15m</td>
                  <td className="p-3"><span className="text-cronos-500">Activo</span></td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-3">Hoy 10:00</td>
                  <td className="p-3">Revisión de Código</td>
                  <td className="p-3">Cronos App</td>
                  <td className="p-3">45m</td>
                  <td className="p-3"><span className="text-text-muted">Completado</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nuevo Registro</button>
          <button className="cronos-btn-secondary">Filtrar</button>
          <button className="cronos-btn-secondary">Exportar</button>
        </div>
      </div>
    </div>
  )
}