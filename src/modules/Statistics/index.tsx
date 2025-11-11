import DailyStatistics from "./components/DailyStatistics";
import MonthlyStatistics from "./components/MonthlyStatistics";
import WeeklyStatistics from "./components/WeeklyStatistics";


export default function StatisticsModule() {
  return (
    <div className="h-full max-h-screen overflow-y-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>
      <MonthlyStatistics />
      <WeeklyStatistics />
      <DailyStatistics />
    </div>
  );
}
