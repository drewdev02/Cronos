export default function ProjectsModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Módulo de Proyectos</h1>
        <p className="text-text-secondary mb-6">
          Administración de proyectos con seguimiento de progreso y resúmenes detallados.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Crear, editar, archivar proyecto
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Ver resumen por proyecto
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Asignar tareas al proyecto
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Seguimiento de tiempo
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><span className="text-blue-600 font-mono">CU5:</span> Crear proyecto</li>
              <li><span className="text-blue-600 font-mono">CU6:</span> Editar proyecto</li>
              <li><span className="text-blue-600 font-mono">CU7:</span> Archivar proyecto</li>
              <li><span className="text-blue-600 font-mono">CU8:</span> Ver resumen por proyecto</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nuevo Proyecto</button>
          <button className="cronos-btn-secondary">Proyectos Activos</button>
          <button className="cronos-btn-secondary">Archivo</button>
        </div>
      </div>
    </div>
  )
}