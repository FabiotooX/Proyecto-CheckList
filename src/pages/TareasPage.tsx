import React, { useMemo } from 'react';
import { TaskForm } from '../components/TaskForm';
import { SortBar, SortField, SortDirection } from '../components/SortBar';
import { TaskItem } from '../components/TaskItem';
import { Task } from '../context/TaskContext';

interface TareasPageProps {
    tasks: Task[];
    sortBy: SortField;
    setSortBy: (val: SortField) => void;
    sortDir: SortDirection;
    setSortDir: (val: SortDirection) => void;
}

export const TareasPage = ({ tasks, sortBy, setSortBy, sortDir, setSortDir }: TareasPageProps) => {
    const pendingTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="title">Mis Tareas</h2>
                <p className="subtitle">Organiza tu día y mantén la productividad.</p>
            </div>

            <TaskForm />

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Pendientes ({pendingTasks.length})</h3>
                <SortBar
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortDir={sortDir}
                    onDirChange={setSortDir}
                />
            </div>

            {pendingTasks.length === 0 ? (
                <div className="text-center py-12 bg-indigo-50/50 rounded-lg border border-dashed border-indigo-200">
                    <p className="text-indigo-400">¡Todo listo! No tienes tareas pendientes.</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {pendingTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};
