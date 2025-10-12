export default function TasksModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Módulo de Tareas</h1>
        <p className="text-text-secondary mb-6">
          Control de tareas con cronómetro integrado y gestión de tiempo en tiempo real.
        </p>

        {/* Cronómetro Principal */}
        <div className="cronos-surface p-6 rounded-lg mb-6 text-center">
          <div className="text-4xl font-mono font-bold text-cronos-500 mb-4">00:00:00</div>
          <div className="flex justify-center gap-3">
            <button className="cronos-btn-primary px-6">Iniciar</button>
            <button className="cronos-btn-secondary px-6">Pausar</button>
            <button className="cronos-btn-secondary px-6">Finalizar</button>
          </div>
          <p className="text-text-muted text-sm mt-3">Tarea actual: Desarrollo Frontend</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Crear, editar, eliminar tareas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Cronómetro (iniciar, pausar, reanudar)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Editar tiempo manual
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Asociar tarea a factura
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-1 text-text-secondary text-sm">
              <li><span className="text-blue-600 font-mono">CU9-CU11:</span> CRUD Tareas</li>
              <li><span className="text-blue-600 font-mono">CU12:</span> Iniciar cronómetro</li>
              <li><span className="text-blue-600 font-mono">CU13:</span> Pausar cronómetro</li>
              <li><span className="text-blue-600 font-mono">CU14:</span> Reanudar cronómetro</li>
              <li><span className="text-blue-600 font-mono">CU15:</span> Finalizar tarea</li>
              <li><span className="text-blue-600 font-mono">CU16:</span> Editar tiempo manual</li>
              <li><span className="text-blue-600 font-mono">CU17:</span> Asociar a factura</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nueva Tarea</button>
          <button className="cronos-btn-secondary">Ver Historial</button>
          <button className="cronos-btn-secondary">Configurar Timer</button>
        </div>
      </div>
    </div>
  )
}