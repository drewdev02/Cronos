import { useTimers } from "@/stores/timer-store";
import { useProjects } from "@/stores/project-store";
import { useCustomers } from "@/stores/customer-store";
import { useMemo } from "react";

// Helper: get ISO week number and range
function getWeekInfo(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

  // Get start and end dates of the week
  const start = new Date(d);
  start.setUTCDate(d.getUTCDate() - (d.getUTCDay() - 1));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  // Format dates as DD/MM/YYYY
  const format = (dt: Date) => dt.getUTCDate().toString().padStart(2, "0") + "/" + (dt.getUTCMonth() + 1).toString().padStart(2, "0") + "/" + dt.getUTCFullYear();

  return {
    key: `${date.getUTCFullYear()}-W${weekNum}`,
    label: `Semana ${weekNum} (${format(start)} - ${format(end)})`,
  };
}

export function useWeeklyStatisticsData() {
  const timers = useTimers();
  const projects = useProjects();
  const customers = useCustomers();
  const MS_PER_HOUR = 1000 * 60 * 60;

  // Aggregate by week
  const data = useMemo(() => {
    const weekMap: { [key: string]: { week: string; horas: number; dinero: number } } = {};
    timers.forEach(timer => {
      timer.history.forEach(entry => {
        if (!entry.startTime) return;
        const info = getWeekInfo(entry.startTime);
        if (!weekMap[info.key]) {
          weekMap[info.key] = { week: info.label, horas: 0, dinero: 0 };
        }
        const hours = entry.duration >= 0 ? entry.duration / MS_PER_HOUR : 0;
        // Buscar el rate del proyecto
        let rate = 0;
        if (timer.projectId) {
          const project = projects.find(p => p.id === timer.projectId);
          if (project) rate = project.hourlyRate;
        }
        weekMap[info.key].horas += hours;
        weekMap[info.key].dinero += hours * rate;
      });
    });
    // Ordenar por semana
    return Object.values(weekMap).sort((a, b) => a.week.localeCompare(b.week));
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
