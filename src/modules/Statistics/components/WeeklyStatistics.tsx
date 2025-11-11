


import { StatisticsBar } from "./StatisticsBar";
import { useWeeklyStatisticsData } from "../hooks/useWeeklyStatisticsData";

export default function WeeklyStatistics() {
  const { data, dataClientes } = useWeeklyStatisticsData();

  return (
    <section className="h-full max-h-screen overflow-y-auto px-2 py-4">
      <h2 className="mb-4 text-lg font-bold">Weekly Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatisticsBar
          title="Hours per week"
          data={data}
          xKey="week"
          yKey="horas"
          color="#3b82f6"
          label="Hours"
        />
        <StatisticsBar
          title="Money per week"
          data={data}
          xKey="week"
          yKey="dinero"
          color="#10b981"
          label="Money"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatisticsBar
          title="Hours per client"
          data={dataClientes}
          xKey="cliente"
          yKey="horas"
          color="#6366f1"
          label="Hours"
        />
        <StatisticsBar
          title="Money per client"
          data={dataClientes}
          xKey="cliente"
          yKey="dinero"
          color="#f59e42"
          label="Money"
        />
      </div>
    </section>
  );
}
