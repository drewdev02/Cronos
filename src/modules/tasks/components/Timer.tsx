import React, { useEffect } from 'react';
import { useTaskStore } from '../store';
import { TimerStatus } from '../types';

export const Timer: React.FC = () => {
  const { 
    timer, 
    getTimerState, 
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer,
    refreshTimer
  } = useTaskStore();

  const timerState = getTimerState();

  // Update timer every second when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timer.status === TimerStatus.Running) {
      interval = setInterval(() => {
        refreshTimer();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer.status, refreshTimer]);

  const handleStart = () => {
    if (!timer.taskId) {
      // TODO: Show task selection modal
      alert('Selecciona una tarea primero');
      return;
    }
    startTimer(timer.taskId);
  };

  const handlePause = () => {
    pauseTimer();
  };

  const handleResume = () => {
    resumeTimer();
  };

  const handleStop = () => {
    stopTimer();
  };

  const getStatusColor = () => {
    switch (timer.status) {
      case TimerStatus.Running:
        return 'text-green-600';
      case TimerStatus.Paused:
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (timer.status) {
      case TimerStatus.Running:
        return 'En ejecución';
      case TimerStatus.Paused:
        return 'Pausado';
      default:
        return 'Detenido';
    }
  };

  return (
    <div className="cronos-surface p-6 rounded-lg text-center">
      <div className={`text-4xl font-mono font-bold mb-2 ${getStatusColor()}`}>
        {timerState.formattedTime}
      </div>
      
      <div className="text-sm text-text-muted mb-4">
        Estado: <span className={getStatusColor()}>{getStatusText()}</span>
      </div>

      {timerState.task && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium text-text-primary">{timerState.task.name}</p>
          <p className="text-xs text-text-secondary">
            {timerState.task.project.name} - {timerState.task.project.client.name}
          </p>
        </div>
      )}

      <div className="flex justify-center gap-3 mb-4">
        {timer.status === TimerStatus.Stopped && (
          <button
            onClick={handleStart}
            className="cronos-btn-primary px-6 py-2"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a2 2 0 012-2h2a2 2 0 012 2v2M12 8V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2h8z" />
              </svg>
              Iniciar
            </div>
          </button>
        )}

        {timer.status === TimerStatus.Running && (
          <>
            <button
              onClick={handlePause}
              className="cronos-btn-secondary px-6 py-2"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
                Pausar
              </div>
            </button>
            <button
              onClick={handleStop}
              className="text-red-600 hover:text-red-800 px-6 py-2 border border-red-200 rounded hover:bg-red-50"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                Finalizar
              </div>
            </button>
          </>
        )}

        {timer.status === TimerStatus.Paused && (
          <>
            <button
              onClick={handleResume}
              className="cronos-btn-primary px-6 py-2"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a2 2 0 012-2h2a2 2 0 012 2v2M12 8V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2h8z" />
                </svg>
                Reanudar
              </div>
            </button>
            <button
              onClick={handleStop}
              className="text-red-600 hover:text-red-800 px-6 py-2 border border-red-200 rounded hover:bg-red-50"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                </svg>
                Finalizar
              </div>
            </button>
          </>
        )}
      </div>

      {!timerState.task && timer.status === TimerStatus.Stopped && (
        <p className="text-sm text-text-muted">
          Selecciona una tarea de la lista para comenzar a cronometrar el tiempo
        </p>
      )}
    </div>
  );
};