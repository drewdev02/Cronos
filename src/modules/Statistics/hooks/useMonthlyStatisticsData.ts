import { useTimers } from "@/stores/timer-store";
import { useProjects } from "@/stores/project-store";
import { useCustomers } from "@/stores/customer-store";
import { useMemo } from "react";

// Helper: get month key (YYYY-MM)
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth();
  return `${year}-${monthNames[month]}`;
}

export function useMonthlyStatisticsData() {
  const timers = useTimers();
  const projects = useProjects();
  const customers = useCustomers();
  const MS_PER_HOUR = 1000 * 60 * 60;

  // Aggregate by month (usa totalTime y rate del proyecto, agrupando por mes de updatedAt)
  const data = useMemo(() => {
    const MS_PER_HOUR = 1000 * 60 * 60;
    const monthMap: { [key: string]: { month: string; horas: number; dinero: number } } = {};
    timers.forEach(timer => {
      if (!timer.updatedAt) return;
      const monthKey = getMonthKey(timer.updatedAt);
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, horas: 0, dinero: 0 };
      }
      const horas = timer.totalTime >= 0 ? timer.totalTime / MS_PER_HOUR : 0;
      let rate = 0;
      if (timer.projectId) {
        const project = projects.find(p => p.id === timer.projectId);
        if (project) rate = project.hourlyRate;
      }
      monthMap[monthKey].horas += horas;
      monthMap[monthKey].dinero += horas * rate;
    });
    // Redondeo y orden
    return Object.values(monthMap)
      .map(obj => {
        // obj.month es "YYYY-NombreMes"
        const [year, mesNombre] = obj.month.split("-");
        return {
          month: `${mesNombre} ${year}`,
          horas: Math.round(obj.horas * 100) / 100,
          dinero: Math.round(obj.dinero * 100) / 100,
        };
      })
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [timers, projects]);

  // Aggregate by client (usa totalTime y ganancias igual que los paneles)
  const dataClientes = useMemo(() => {
    const clientMap: { [key: string]: { cliente: string; horas: number; dinero: number } } = {};
    projects.forEach(project => {
      const customer = customers.find(c => c.id === project.customerId);
      const customerName = customer?.companyName || "Unknown";
      if (!clientMap[customerName]) {
        clientMap[customerName] = { cliente: customerName, horas: 0, dinero: 0 };
      }
      timers.forEach(timer => {
        if (timer.projectId === project.id) {
          const horas = timer.totalTime >= 0 ? timer.totalTime / MS_PER_HOUR : 0;
          clientMap[customerName].horas += horas;
          clientMap[customerName].dinero += horas * project.hourlyRate;
        }
      });
    });
    return Object.values(clientMap).map(obj => ({
      cliente: obj.cliente,
      horas: Math.round(obj.horas * 100) / 100,
      dinero: Math.round(obj.dinero * 100) / 100,
    }));
  }, [projects, customers, timers]);

  return { data, dataClientes };
}
