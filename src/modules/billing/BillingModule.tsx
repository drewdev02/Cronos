export default function BillingModule() {
  return (
    <div className="p-6">
      <div className="cronos-card p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Módulo de Facturación</h1>
        <p className="text-text-secondary mb-6">
          Sistema completo de facturación con cálculo automático de totales e impuestos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cronos-500 mb-3">Funcionalidades</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Crear, editar, eliminar facturas
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Agregar líneas manuales
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Calcular totales e impuestos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Emitir y registrar pagos
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cronos-500 rounded-full"></div>
                Exportar PDF/CSV
              </li>
            </ul>
          </div>

          <div className="cronos-surface p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso</h3>
            <ul className="space-y-1 text-text-secondary text-sm">
              <li><span className="text-blue-600 font-mono">CU28-CU30:</span> CRUD Facturas</li>
              <li><span className="text-blue-600 font-mono">CU31:</span> Agregar líneas</li>
              <li><span className="text-blue-600 font-mono">CU32:</span> Calcular totales</li>
              <li><span className="text-blue-600 font-mono">CU33:</span> Emitir factura</li>
              <li><span className="text-blue-600 font-mono">CU34:</span> Registrar pago</li>
              <li><span className="text-blue-600 font-mono">CU35:</span> Anular factura</li>
              <li><span className="text-blue-600 font-mono">CU36:</span> Exportar</li>
            </ul>
          </div>
        </div>

        {/* Resumen de facturación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="cronos-surface p-4 rounded-lg">
            <div className="text-lg font-semibold text-cronos-500">$45,280</div>
            <div className="text-text-secondary text-sm">Total Facturado</div>
            <div className="text-xs text-text-muted mt-1">Este mes</div>
          </div>
          <div className="cronos-surface p-4 rounded-lg">
            <div className="text-lg font-semibold text-orange-500">$12,150</div>
            <div className="text-text-secondary text-sm">Pendiente de Pago</div>
            <div className="text-xs text-text-muted mt-1">5 facturas</div>
          </div>
          <div className="cronos-surface p-4 rounded-lg">
            <div className="text-lg font-semibold text-blue-600">$33,130</div>
            <div className="text-text-secondary text-sm">Pagado</div>
            <div className="text-xs text-text-muted mt-1">12 facturas</div>
          </div>
        </div>

        {/* Lista de facturas recientes */}
        <div className="mt-6 cronos-surface rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border-secondary">
            <h3 className="text-lg font-semibold text-text-primary">Facturas Recientes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-tertiary">
                <tr className="text-text-secondary text-sm">
                  <th className="text-left p-3">Factura</th>
                  <th className="text-left p-3">Cliente</th>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Monto</th>
                  <th className="text-left p-3">Estado</th>
                </tr>
              </thead>
              <tbody className="text-text-primary">
                <tr className="border-b border-border-secondary">
                  <td className="p-3 font-mono">#2024-001</td>
                  <td className="p-3">ACME Corp</td>
                  <td className="p-3">12/10/2024</td>
                  <td className="p-3 text-cronos-500">$8,500</td>
                  <td className="p-3"><span className="text-cronos-500">Pagada</span></td>
                </tr>
                <tr className="border-b border-border-secondary">
                  <td className="p-3 font-mono">#2024-002</td>
                  <td className="p-3">TechStart</td>
                  <td className="p-3">10/10/2024</td>
                  <td className="p-3 text-orange-500">$3,200</td>
                  <td className="p-3"><span className="text-orange-500">Pendiente</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="cronos-btn-primary">Nueva Factura</button>
          <button className="cronos-btn-secondary">Ver Todas</button>
          <button className="cronos-btn-secondary">Configurar Impuestos</button>
        </div>
      </div>
    </div>
  )
}