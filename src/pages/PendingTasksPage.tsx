import React, { useMemo, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { TaskDetail } from '../components/TaskDetail';

// PROFESOR: Vista dedicada a "Pendientes" con patrón Maestro-Detalle.
// Utilizamos useMemo para filtrar eficientemente las tareas que no están completadas.
export const PendingTasksPage = () => {
    const { items } = useTask();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    // HOOK: useMemo
    // Filtramos solo las tareas que NO están "completed" (incluye 'pending' e 'in_progress').
    // OJO: Según definimos en Context, 'completed' es el estado final.
    const pendingTasks = useMemo(() => {
        return items.filter(t => t.status !== 'completed');
    }, [items]);

    const selectedTask = useMemo(() =>
        items.find(t => t.id === selectedTaskId),
        [items, selectedTaskId]
    );

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 animate-fade-in">
            {/* LISTA (Maestro) */}
            <div className={`flex-1 overflow-y-auto pr-2 ${selectedTask ? 'hidden md:block' : ''}`}>
                <div className="mb-6">
                    <h2 className="title">Tareas Pendientes</h2>
                    <p className="subtitle">Gestiona tus tareas en curso y por hacer.</p>
                </div>

                {pendingTasks.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No tienes tareas pendientes. ¡Buen trabajo!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {pendingTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => setSelectedTaskId(task.id)}
                                className={`cursor-pointer transform transition-all duration-200 ${selectedTaskId === task.id ? 'scale-[1.02] ring-2 ring-indigo-500 ring-offset-2 rounded-xl' : 'hover:scale-[1.01]'}`}
                            >
                                {/* Reutilizamos TaskItem pero deshabilitamos su interactividad interna si queremos que todo el click seleccione, 
                                    pero TaskItem tiene botones propios. 
                                    Mejor envolvemos TaskItem y dejamos que sus botones funcionen, pero el click en el cuerpo selecciona.
                                    Nota: TaskItem no tiene onClick en el root, así que este div wrapper maneja la selección.
                                */}
                                {/* Reutilizamos TaskItem habilitando interactividad interna.
                                    TaskItem tiene stopPropagation en sus botones, así que el click en el cuerpo selecciona.
                                */}
                                <div>
                                    <TaskItem task={task} />
                                </div>
                                {/* Truco: TaskItem tiene botones interactivos (checkbox, delete). 
                                    Si envolvemos en pointer-events-none, esos botones no funcionarán.
                                    Solución: No usar pointer-events-none, pero manejar el click con cuidado.
                                    O mejor: Renderizamos una versión simplificada o "Card" seleccionable aquí, 
                                    pero el usuario pidió "Pendientes... donde si selecciono una tarea deberia poder cambiar..."
                                    
                                    Vamos a renderizar TaskItem normal. El click en el wrapper selecciona.
                                    TaskItem debe propagar clicks o no detenerlos.
                                */}
                            </div>
                        ))}
                        {/* 
                           Ajuste: TaskItem tiene botones. El wrapper onClick capturará clicks burbujeados.
                           Si el usuario hace click en borrar, se borra y selecciona?
                           Vamos a dejarlo así, si el usuario hace click en cualquier parte de la tarjeta, se selecciona.
                           Excepto si borra. Si borra, se desmonta.
                        */}
                    </div>
                )}
            </div>

            {/* DETALLE (Panel Derecho) */}
            {selectedTask ? (
                <div className="w-full md:w-[400px] h-full">
                    <TaskDetail task={selectedTask} onClose={() => setSelectedTaskId(null)} />
                </div>
            ) : (
                <div className="hidden md:flex w-[400px] items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">Selecciona una tarea para ver detalles</p>
                </div>
            )}
        </div>
    );
};
