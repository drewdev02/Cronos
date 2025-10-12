export default function ReportsModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Reportes y Utilidades</h1>
        <p className="text-text-secondary mb-6">
          Resúmenes ejecutivos, exportación de datos y herramientas de mantenimiento del sistema.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Ver resumen general
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Exportar reportes de tiempo
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Reportes financieros
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Respaldos y sincronización
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-2 text-text-secondary">
              <li><span className="text-blue-600 font-mono">CU37:</span> Ver resumen general</li>
              <li><span className="text-blue-600 font-mono">CU38:</span> Exportar reportes tiempo</li>
              <li><span className="text-blue-600 font-mono">CU39:</span> Reportes financieros</li>
              <li><span className="text-blue-600 font-mono">CU40:</span> Respaldos/sync</li>
            </ul>
          </div>
        </div>

        {/* Tipos de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-cronos-500 font-semibold mb-2">Reporte de Tiempo</div>
            <div className="text-text-secondary text-sm">Detalle de horas trabajadas por cliente, proyecto y tarea.</div>
            <div className="text-xs text-text-muted mt-2">Formato: PDF, CSV, Excel</div>
          </div>

          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-blue-600 font-semibold mb-2">Reporte Financiero</div>
            <div className="text-text-secondary text-sm">Análisis de ingresos, facturas pagadas y pendientes.</div>
            <div className="text-xs text-text-muted mt-2">Formato: PDF, CSV</div>
          </div>

          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-orange-500 font-semibold mb-2">Reporte de Productividad</div>
            <div className="text-text-secondary text-sm">Métricas de eficiencia y análisis de tendencias.</div>
            <div className="text-xs text-text-muted mt-2">Formato: PDF</div>
          </div>

          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-purple-500 font-semibold mb-2">Resumen Ejecutivo</div>
            <div className="text-text-secondary text-sm">Dashboard consolidado para gerencia.</div>
            <div className="text-xs text-text-muted mt-2">Formato: PDF, Dashboard</div>
          </div>

          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-text-primary font-semibold mb-2">Respaldo de Datos</div>
            <div className="text-text-secondary text-sm">Exportación completa de la base de datos.</div>
            <div className="text-xs text-text-muted mt-2">Formato: SQL, JSON</div>
          </div>

          <div className="cronos-surface cronos-hover p-4 rounded-lg cursor-pointer">
            <div className="text-text-primary font-semibold mb-2">Sincronización</div>
            <div className="text-text-secondary text-sm">Conectar con servicios externos.</div>
            <div className="text-xs text-text-muted mt-2">APIs: Google, Outlook</div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-6 cronos-surface p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <button className="cronos-btn-primary">Generar Reporte Semanal</button>
              <button className="cronos-btn-secondary">Reporte Mensual</button>
            </div>
            <div className="flex gap-3">
              <button className="cronos-btn-secondary">Respaldar Datos</button>
              <button className="cronos-btn-secondary">Configurar Sync</button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nuevo Reporte</button>
          <button className="cronos-btn-secondary">Historial</button>
          <button className="cronos-btn-secondary">Configuración</button>
        </div>
      </div>
    </div>
  )
}