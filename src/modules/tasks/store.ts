import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  TaskType,
  TaskWithProject,
  CreateTaskData,
  UpdateTaskData,
  TimeRecordType,
  CreateTimeRecordData,
  UpdateTimeRecordData,
  TimerState,
  TimerStateWithTask,
  TimerStatus,
  TaskStatus,
  formatTime,
  calculateElapsedTime
} from './types';

interface TaskStore {
  // State
  tasks: TaskType[];
  timeRecords: TimeRecordType[];
  timer: TimerState;
  isLoading: boolean;
  error: string | null;

  // Task CRUD operations
  createTask: (data: CreateTaskData) => Promise<TaskType>;
  updateTask: (data: UpdateTaskData) => Promise<TaskType>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => TaskType | undefined;
  getTasksWithProject: () => TaskWithProject[];
  getTasksByProject: (projectId: string) => TaskType[];

  // Time record operations
  createTimeRecord: (data: CreateTimeRecordData) => Promise<TimeRecordType>;
  updateTimeRecord: (data: UpdateTimeRecordData) => Promise<TimeRecordType>;
  deleteTimeRecord: (id: string) => Promise<void>;
  getTimeRecordsByTask: (taskId: string) => TimeRecordType[];

  // Timer operations (CU12, CU13, CU14)
  startTimer: (taskId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  getTimerState: () => TimerStateWithTask;

  // Task completion and manual time editing (CU15, CU16)
  completeTask: (taskId: string) => Promise<TaskType>;
  updateTaskTime: (taskId: string, totalTime: number) => Promise<TaskType>;

  // Billing association (CU17)
  associateTaskWithInvoice: (taskId: string, invoiceId: string) => Promise<TaskType>;
  removeTaskFromInvoice: (taskId: string) => Promise<TaskType>;

  // Utility methods
  calculateTaskTotalTime: (taskId: string) => number;
  updateTaskTotalTime: (taskId: string) => void;
  refreshTimer: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Mock data for development - replace with actual API calls
const mockProjects = [
  {
    id: '1',
    name: 'Proyecto Web',
    clientId: '1',
    client: { id: '1', name: 'Cliente ABC', currency: 'USD' },
    hourlyRate: 50
  }
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tasks: [],
      timeRecords: [],
      timer: {
        status: TimerStatus.Stopped,
        elapsedTime: 0
      },
      isLoading: false,
      error: null,

  // Task CRUD operations
  createTask: async (data: CreateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask: TaskType = {
        id: uuidv4(),
        ...data,
        totalTime: 0,
        status: data.status || TaskStatus.Active,
        isInvoiced: false,
        createdAt: new Date().toISOString()
      };

      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));

      return newTask;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTask: async (data: UpdateTaskData) => {
    set({ isLoading: true, error: null });
    try {
      const { id, ...updateData } = data;
      
      set(state => ({
        tasks: state.tasks.map(task =>
          task.id === id
            ? { ...task, ...updateData, updatedAt: new Date().toISOString() }
            : task
        ),
        isLoading: false
      }));

      const updatedTask = get().tasks.find(task => task.id === id);
      if (!updatedTask) throw new Error('Task not found');
      
      return updatedTask;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Stop timer if this task is currently running
      const state = get();
      if (state.timer.taskId === id) {
        get().stopTimer();
      }

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
        timeRecords: state.timeRecords.filter(record => record.taskId !== id),
        isLoading: false
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting task';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getTask: (id: string) => {
    return get().tasks.find(task => task.id === id);
  },

  getTasksWithProject: () => {
    const { tasks } = get();
    return tasks.map(task => ({
      ...task,
      project: mockProjects[0], // Replace with actual project lookup
      timeRecords: get().getTimeRecordsByTask(task.id)
    }));
  },

  getTasksByProject: (projectId: string) => {
    return get().tasks.filter(task => task.projectId === projectId);
  },

  // Time record operations
  createTimeRecord: async (data: CreateTimeRecordData) => {
    set({ isLoading: true, error: null });
    try {
      const startTime = new Date(data.startTime);
      const endTime = new Date(data.endTime);
      const duration = endTime.getTime() - startTime.getTime();

      if (duration < 0) {
        throw new Error('End time must be after start time');
      }

      const newRecord: TimeRecordType = {
        id: uuidv4(),
        ...data,
        duration,
        createdAt: new Date().toISOString()
      };

      set(state => ({
        timeRecords: [...state.timeRecords, newRecord],
        isLoading: false
      }));

      // Update task total time
      get().updateTaskTotalTime(data.taskId);

      return newRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating time record';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateTimeRecord: async (data: UpdateTimeRecordData) => {
    set({ isLoading: true, error: null });
    try {
      const { id, ...updateData } = data;
      
      set(state => {
        const recordIndex = state.timeRecords.findIndex(record => record.id === id);
        if (recordIndex === -1) throw new Error('Time record not found');

        const existingRecord = state.timeRecords[recordIndex];
        const updatedRecord = { ...existingRecord, ...updateData, updatedAt: new Date().toISOString() };

        // Recalculate duration if start or end time changed
        if (updateData.startTime || updateData.endTime) {
          const startTime = new Date(updateData.startTime || existingRecord.startTime);
          const endTime = new Date(updateData.endTime || existingRecord.endTime || Date.now());
          updatedRecord.duration = endTime.getTime() - startTime.getTime();
        }

        const newTimeRecords = [...state.timeRecords];
        newTimeRecords[recordIndex] = updatedRecord;

        return {
          timeRecords: newTimeRecords,
          isLoading: false
        };
      });

      const updatedRecord = get().timeRecords.find(record => record.id === id);
      if (!updatedRecord) throw new Error('Time record not found');

      // Update task total time
      get().updateTaskTotalTime(updatedRecord.taskId);

      return updatedRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating time record';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteTimeRecord: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const record = get().timeRecords.find(r => r.id === id);
      if (!record) throw new Error('Time record not found');

      set(state => ({
        timeRecords: state.timeRecords.filter(record => record.id !== id),
        isLoading: false
      }));

      // Update task total time
      get().updateTaskTotalTime(record.taskId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting time record';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  getTimeRecordsByTask: (taskId: string) => {
    return get().timeRecords.filter(record => record.taskId === taskId);
  },

  // Timer operations
  startTimer: (taskId: string) => {
    const state = get();
    
    // Stop current timer if running
    if (state.timer.status === TimerStatus.Running) {
      get().stopTimer();
    }

    const now = new Date().toISOString();
    set({
      timer: {
        status: TimerStatus.Running,
        taskId,
        startTime: now,
        elapsedTime: 0,
        lastUpdateTime: now
      }
    });
  },

  pauseTimer: () => {
    const state = get();
    if (state.timer.status !== TimerStatus.Running) return;

    const now = new Date().toISOString();
    const elapsed = state.timer.startTime 
      ? calculateElapsedTime(state.timer.startTime, now)
      : 0;

    set({
      timer: {
        ...state.timer,
        status: TimerStatus.Paused,
        elapsedTime: state.timer.elapsedTime + elapsed,
        lastUpdateTime: now
      }
    });
  },

  resumeTimer: () => {
    const state = get();
    if (state.timer.status !== TimerStatus.Paused) return;

    const now = new Date().toISOString();
    set({
      timer: {
        ...state.timer,
        status: TimerStatus.Running,
        startTime: now,
        lastUpdateTime: now
      }
    });
  },

  stopTimer: () => {
    const state = get();
    if (state.timer.status === TimerStatus.Stopped) return;

    const now = new Date().toISOString();
    let totalElapsed = state.timer.elapsedTime;

    if (state.timer.status === TimerStatus.Running && state.timer.startTime) {
      totalElapsed += calculateElapsedTime(state.timer.startTime, now);
    }

    // Create time record if there was actual time elapsed
    if (totalElapsed > 0 && state.timer.taskId) {
      const startTime = new Date(Date.now() - totalElapsed).toISOString();
      get().createTimeRecord({
        taskId: state.timer.taskId,
        startTime,
        endTime: now,
        description: 'Timer session'
      });
    }

    set({
      timer: {
        status: TimerStatus.Stopped,
        elapsedTime: 0
      }
    });
  },

  getTimerState: () => {
    const state = get();
    let currentElapsed = state.timer.elapsedTime;

    if (state.timer.status === TimerStatus.Running && state.timer.startTime) {
      currentElapsed += calculateElapsedTime(state.timer.startTime);
    }

    const task = state.timer.taskId ? get().getTasksWithProject().find(t => t.id === state.timer.taskId) : undefined;

    return {
      ...state.timer,
      task,
      formattedTime: formatTime(currentElapsed)
    };
  },

  // Task completion and manual time editing
  completeTask: async (taskId: string) => {
    const state = get();
    
    // Stop timer if this task is currently running
    if (state.timer.taskId === taskId) {
      get().stopTimer();
    }

    return get().updateTask({
      id: taskId,
      status: TaskStatus.Completed,
      completedAt: new Date().toISOString()
    });
  },

  updateTaskTime: async (taskId: string, totalTime: number) => {
    return get().updateTask({
      id: taskId,
      totalTime
    });
  },

  // Billing association
  associateTaskWithInvoice: async (taskId: string, invoiceId: string) => {
    return get().updateTask({
      id: taskId,
      isInvoiced: true,
      invoiceId
    });
  },

  removeTaskFromInvoice: async (taskId: string) => {
    return get().updateTask({
      id: taskId,
      isInvoiced: false,
      invoiceId: undefined
    });
  },

  // Utility methods
  calculateTaskTotalTime: (taskId: string) => {
    const records = get().getTimeRecordsByTask(taskId);
    return records.reduce((total, record) => total + record.duration, 0);
  },

  updateTaskTotalTime: (taskId: string) => {
    const totalTime = get().calculateTaskTotalTime(taskId);
    get().updateTask({ id: taskId, totalTime });
  },

  refreshTimer: () => {
    const state = get();
    if (state.timer.status === TimerStatus.Running) {
      set({
        timer: {
          ...state.timer,
          lastUpdateTime: new Date().toISOString()
        }
      });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}),
{
  name: 'cronos-tasks-storage',
  storage: createJSONStorage(() => localStorage),
  // Don't persist timer state as it should reset on app restart
  partialize: (state) => ({
    tasks: state.tasks,
    timeRecords: state.timeRecords,
    // Reset timer state on reload
    timer: {
      status: TimerStatus.Stopped,
      elapsedTime: 0
    },
    isLoading: false,
    error: null
  })
}
));