import { useTimers } from "@/stores/timer-store";
import { useProjects } from "@/stores/project-store";
import { useCustomers } from "@/stores/customer-store";
import { useMemo } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getDayOfWeek(date: Date): string {
  return daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1];
}

export function useDailyStatisticsData() {
  const timers = useTimers();
  const projects = useProjects();
  const customers = useCustomers();

  // Aggregate by day (historial, dinero ajustado por rate del proyecto)
  const data = useMemo(() => {
    const MS_PER_HOUR = 1000 * 60 * 60;
    const result: { [key: string]: { dia: string; horas: number; dinero: number } } = {};
    daysOfWeek.forEach(day => {
      result[day] = { dia: day, horas: 0, dinero: 0 };
    });
    timers.forEach(timer => {
      timer.history.forEach(entry => {
        if (!entry.startTime) return;
        const day = getDayOfWeek(entry.startTime);
        const hours = entry.duration >= 0 ? entry.duration / MS_PER_HOUR : 0;
        result[day].horas += hours;
        // Buscar el proyecto asociado para el rate
        let rate = 0;
        if (timer.projectId) {
          const project = projects.find(p => p.id === timer.projectId);
          if (project) rate = project.hourlyRate;
        }
        // Calcular dinero como horas * rate
        result[day].dinero += hours * rate;
      });
    });
    // Redondeo para mostrar
    return daysOfWeek.map(day => ({
      dia: result[day].dia,
      horas: Math.round(result[day].horas * 100) / 100,
      dinero: Math.round(result[day].dinero * 100) / 100,
    }));
  }, [timers, projects]);

  // Aggregate by client (usa totalTime y ganancias igual que los paneles)
  const dataClientes = useMemo(() => {
    const MS_PER_HOUR = 1000 * 60 * 60;
    const clientMap: { [key: string]: { cliente: string; horas: number; dinero: number } } = {};
    projects.forEach(project => {
      const customer = customers.find(c => c.id === project.customerId);
      const customerName = customer?.companyName || "Unknown";
      if (!clientMap[customerName]) {
        clientMap[customerName] = { cliente: customerName, horas: 0, dinero: 0 };
      }
      timers.forEach(timer => {
        if (timer.projectId === project.id) {
          // Sumar el totalTime del timer
          const horas = timer.totalTime >= 0 ? timer.totalTime / MS_PER_HOUR : 0;
          clientMap[customerName].horas += horas;
          // Calcular dinero: horas * rate del proyecto
          clientMap[customerName].dinero += horas * project.hourlyRate;
        }
      });
    });
    // Redondeo para mostrar
    return Object.values(clientMap).map(obj => ({
      cliente: obj.cliente,
      horas: Math.round(obj.horas * 100) / 100,
      dinero: Math.round(obj.dinero * 100) / 100,
    }));
  }, [projects, customers, timers]);

  return { data, dataClientes };
}
