import React from 'react';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../context/TaskContext';

export const CompletadasPage = ({ tasks }: { tasks: Task[] }) => {
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="title text-indigo-600">Tareas Completadas</h2>
                <p className="subtitle">Historial de tus logros.</p>
            </div>

            {completedTasks.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    Aún no has completado ninguna tarea.
                </div>
            ) : (
                <div className="opacity-75">
                    {completedTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};
