import { useState, useEffect } from 'react';
import { useTaskStore } from './store';
import { TaskWithProject, TaskStatus } from './types';
import { TaskForm, TaskList, Timer, TimeRecordForm } from './components';
import { useProjectStore } from '../projects/store';
import { useClientsStore } from '../clients/store';

type ModalType = 'create-task' | 'edit-task' | 'add-time' | null;

export default function TasksModule() {
    const {
        tasks,
        createTask,
        updateTask,
        deleteTask,
        startTimer,
        createTimeRecord,
        isLoading,
        error,
        setError
    } = useTaskStore();
    
    const { projects, getProject } = useProjectStore();
    const { clients, getClientById } = useClientsStore();

    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedTask, setSelectedTask] = useState<TaskWithProject | null>(null);
    const [tasksWithProject, setTasksWithProject] = useState<TaskWithProject[]>([]);

    // Load tasks with project info
    useEffect(() => {
        const getTasksWithRealProjectInfo = (): TaskWithProject[] => {
            return tasks.map(task => {
                const project = getProject(task.projectId);
                const client = project ? getClientById(project.clientId) : null;
                
                return {
                    ...task,
                    project: project ? {
                        id: project.id,
                        name: project.name,
                        clientId: project.clientId,
                        client: client ? {
                            id: client.id,
                            name: client.name,
                            currency: client.currency || 'USD'
                        } : {
                            id: 'unknown',
                            name: 'Cliente desconocido',
                            currency: 'USD'
                        },
                        hourlyRate: project.hourlyRate
                    } : {
                        id: 'unknown',
                        name: 'Proyecto desconocido',
                        clientId: 'unknown',
                        client: {
                            id: 'unknown',
                            name: 'Cliente desconocido',
                            currency: 'USD'
                        },
                        hourlyRate: 0
                    },
                    timeRecords: [] // You can implement time records later
                };
            });
        };
        
        setTasksWithProject(getTasksWithRealProjectInfo());
    }, [tasks, projects, clients, getProject, getClientById]);

    const handleCreateTask = async (data: { name: string; projectId: string; description?: string; estimatedHours?: number }) => {
        try {
            await createTask({
                name: data.name,
                projectId: data.projectId,
                description: data.description || '',
                estimatedHours: data.estimatedHours,
                status: TaskStatus.Active
            });
            setActiveModal(null);
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleUpdateTask = async (data: { name?: string; projectId?: string; description?: string; estimatedHours?: number }) => {
        if (!selectedTask) return;
        
        try {
            await updateTask({ id: selectedTask.id, ...data });
            setActiveModal(null);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea? Se eliminarán todos los registros de tiempo asociados.')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleStartTimer = (taskId: string) => {
        startTimer(taskId);
    };

    const handleEditTask = (task: TaskWithProject) => {
        setSelectedTask(task);
        setActiveModal('edit-task');
    };

    const handleAddTimeRecord = async (data: { taskId: string; startTime: string; endTime: string; description?: string }) => {
        try {
            await createTimeRecord({
                taskId: data.taskId,
                startTime: data.startTime,
                endTime: data.endTime,
                description: data.description || ''
            });
            setActiveModal(null);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error adding time record:', error);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedTask(null);
        setError(null);
    };

    return (
        <div className="p-6">
            <div className="cronos-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary mb-2">Gestión de Tareas</h1>
                        <p className="text-text-secondary">
                            Control de tareas con cronómetro integrado y gestión de tiempo en tiempo real.
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveModal('create-task')}
                        className="cronos-btn-primary px-6 py-2"
                    >
                        Nueva Tarea
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-600 hover:text-red-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Timer Section */}
                <div className="mb-6">
                    <Timer />
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-text-primary">Tareas</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveModal('add-time')}
                                className="cronos-btn-secondary px-4 py-2 text-sm"
                                disabled={tasksWithProject.length === 0}
                            >
                                Agregar Tiempo Manual
                            </button>
                        </div>
                    </div>

                    <TaskList
                        tasks={tasksWithProject}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onStartTimer={handleStartTimer}
                    />
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="cronos-surface p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-cronos-500 mb-3">Estadísticas</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Tareas activas:</span>
                                <span className="font-medium">{tasksWithProject.filter(t => t.status === 'active').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Tareas completadas:</span>
                                <span className="font-medium">{tasksWithProject.filter(t => t.status === 'completed').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Total horas:</span>
                                <span className="font-medium">
                                    {(tasksWithProject.reduce((total, task) => total + task.totalTime, 0) / (1000 * 60 * 60)).toFixed(1)}h
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="cronos-surface p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-blue-600 mb-3">Casos de Uso Implementados</h3>
                        <ul className="space-y-1 text-text-secondary text-sm">
                            <li><span className="text-blue-600 font-mono">CU9:</span> ✅ Crear tarea</li>
                            <li><span className="text-blue-600 font-mono">CU10:</span> ✅ Editar tarea</li>
                            <li><span className="text-blue-600 font-mono">CU11:</span> ✅ Eliminar tarea</li>
                            <li><span className="text-blue-600 font-mono">CU12:</span> ✅ Iniciar cronómetro</li>
                            <li><span className="text-blue-600 font-mono">CU13:</span> ✅ Pausar cronómetro</li>
                            <li><span className="text-blue-600 font-mono">CU14:</span> ✅ Reanudar cronómetro</li>
                            <li><span className="text-blue-600 font-mono">CU15:</span> ✅ Finalizar tarea</li>
                            <li><span className="text-blue-600 font-mono">CU16:</span> ✅ Editar tiempo manual</li>
                            <li><span className="text-blue-600 font-mono">CU17:</span> ✅ Asociar a factura</li>
                        </ul>
                    </div>

                    <div className="cronos-surface p-4 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-600 mb-3">Acciones Rápidas</h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveModal('create-task')}
                                className="w-full cronos-btn-primary text-sm py-2"
                            >
                                Nueva Tarea
                            </button>
                            <button
                                onClick={() => setActiveModal('add-time')}
                                disabled={tasksWithProject.length === 0}
                                className="w-full cronos-btn-secondary text-sm py-2 disabled:opacity-50"
                            >
                                Tiempo Manual
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'create-task' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                        <TaskForm
                            onSubmit={handleCreateTask}
                            onCancel={closeModal}
                            isLoading={isLoading}
                            mode="create"
                        />
                    </div>
                </div>
            )}

            {activeModal === 'edit-task' && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                        <TaskForm
                            onSubmit={handleUpdateTask}
                            onCancel={closeModal}
                            isLoading={isLoading}
                            mode="edit"
                            initialData={{
                                name: selectedTask.name,
                                projectId: selectedTask.projectId,
                                description: selectedTask.description,
                                estimatedHours: selectedTask.estimatedHours
                            }}
                        />
                    </div>
                </div>
            )}

            {activeModal === 'add-time' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Seleccionar Tarea</h3>
                            {tasksWithProject.length > 0 ? (
                                <div className="space-y-2 mb-4">
                                    {tasksWithProject.filter(t => t.status === 'active').map(task => (
                                        <button
                                            key={task.id}
                                            onClick={() => setSelectedTask(task)}
                                            className={`w-full text-left p-3 rounded border ${
                                                selectedTask?.id === task.id 
                                                    ? 'border-cronos-500 bg-cronos-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="font-medium">{task.name}</div>
                                            <div className="text-sm text-text-secondary">{task.project.name}</div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-muted">No hay tareas disponibles.</p>
                            )}
                            
                            {selectedTask && (
                                <TimeRecordForm
                                    taskId={selectedTask.id}
                                    onSubmit={handleAddTimeRecord}
                                    onCancel={closeModal}
                                    isLoading={isLoading}
                                />
                            )}
                            
                            {!selectedTask && (
                                <button
                                    onClick={closeModal}
                                    className="cronos-btn-secondary px-6 py-2"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}