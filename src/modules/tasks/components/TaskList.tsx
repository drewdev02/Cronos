import React from 'react';
import { TaskWithProject, TaskStatus, formatTime } from '../types';
import { useTaskStore } from '../store';

interface TaskListProps {
  tasks: TaskWithProject[];
  onEditTask: (task: TaskWithProject) => void;
  onDeleteTask: (taskId: string) => void;
  onStartTimer: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
  onStartTimer
}) => {
  const { timer, completeTask } = useTaskStore();

  const getStatusBadge = (status: TaskStatus) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case TaskStatus.Active:
        return `${baseClasses} bg-green-100 text-green-800`;
      case TaskStatus.Completed:
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case TaskStatus.Paused:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case TaskStatus.Cancelled:
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Active:
        return 'Activa';
      case TaskStatus.Completed:
        return 'Completada';
      case TaskStatus.Paused:
        return 'Pausada';
      case TaskStatus.Cancelled:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="cronos-surface p-8 rounded-lg text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-secondary mb-2">No hay tareas</h3>
        <p className="text-text-muted">Crea tu primera tarea para comenzar a hacer seguimiento del tiempo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="cronos-surface p-4 rounded-lg border border-gray-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-medium text-text-primary">{task.name}</h3>
                <span className={getStatusBadge(task.status)}>
                  {getStatusText(task.status)}
                </span>
                {task.isInvoiced && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Facturada
                  </span>
                )}
                {timer.taskId === task.id && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-cronos-100 text-cronos-800 animate-pulse">
                    En ejecución
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mb-2">
                <span className="font-medium">{task.project.name}</span> - {task.project.client.name}
              </p>
              {task.description && (
                <p className="text-sm text-text-muted">{task.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Tiempo: {formatTime(task.totalTime)}</span>
              </div>
              {task.estimatedHours && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span>Estimado: {task.estimatedHours}h</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>${(task.project.hourlyRate * (task.totalTime / (1000 * 60 * 60))).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {task.status === TaskStatus.Active && (
              <>
                <button
                  onClick={() => onStartTimer(task.id)}
                  disabled={timer.taskId === task.id}
                  className="cronos-btn-primary px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {timer.taskId === task.id ? 'En ejecución' : 'Iniciar Timer'}
                </button>
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  className="cronos-btn-secondary px-3 py-1 text-sm"
                >
                  Completar
                </button>
              </>
            )}
            <button
              onClick={() => onEditTask(task)}
              className="cronos-btn-secondary px-3 py-1 text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="text-red-600 hover:text-red-800 px-3 py-1 text-sm border border-red-200 rounded hover:bg-red-50"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};