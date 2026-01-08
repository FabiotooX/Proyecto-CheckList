import React, { useState } from 'react';
import { useTask, Task } from '../context/TaskContext';

// PROFESOR: Este componente gestiona su propio estado local (editMode) con useState,
// independiente del estado global. Demuestra cómo useState puede coexistir con Context.
export const TaskItem = ({ task }: { task: Task }) => {
    // HOOK: useTask (Context)
    const { remove, update, updateStatus } = useTask();
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);

    const handleSave = () => {
        if (editTitle.trim()) {
            update(task.id, { title: editTitle });
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setEditTitle(task.title);
            setIsEditing(false);
        }
    };

    // Check si esta vencida (Calculo legacy o visual si se quiere enfatizar, pero ahora el status manda)
    // PROFESOR: Ahora confiamos más en el status 'expired', pero mantenemos el check visual por si acaso.
    const isOverdue = task.status === 'expired' || (task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date());

    // PRIORIDAD VISUAL: Colores y Bordes
    const priorityConfig = {
        Alta: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-l-red-500', badge: 'bg-red-100 text-red-700' },
        Media: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700' },
        Baja: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700' }
    };

    const pStyle = priorityConfig[task.priority];

    // Manejo del cambio de estado (Select nativo)
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // e.stopPropagation() ya está en el contenedor padre si es necesario
        e.stopPropagation();
        const newStatus = e.target.value as any;
        updateStatus(task.id, newStatus);
    };

    // FORMATEAR FECHA Y HORA
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // Si el string original tiene hora (T), mostramos hora.
        // Simple heuristica: longitud > 10 implica hora (YYYY-MM-DDTHH:mm)
        const hasTime = dateStr.includes('T') || dateStr.length > 10;

        if (hasTime) {
            return date.toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        }
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div
            className={`
                group flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm
                transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                border-l-[6px] ${task.status === 'expired' ? 'border-l-red-500' : pStyle.border}
                ${task.status === 'completed' ? 'opacity-60 bg-slate-50 grayscale-[0.5]' : ''}
                ${task.status === 'expired' ? 'bg-red-50/50' : ''}
            `}
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        >
            {/* SELECTOR DE ESTADO (TEXTO) */}
            <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <select
                        value={task.status}
                        onChange={handleStatusChange}
                        className={`
                            appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold ring-1 ring-inset shadow-sm transition-all
                            focus:ring-2 focus:ring-indigo-500 hover:ring-2
                            ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
                                task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 ring-blue-200' :
                                    task.status === 'expired' ? 'bg-red-50 text-red-700 ring-red-200' :
                                        'bg-slate-50 text-slate-600 ring-slate-200'}
                        `}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Proceso</option>
                        <option value="completed">Finalizada</option>
                        <option value="expired">Vencida</option>
                    </select>
                    {/* Flecha custom */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="flex items-center gap-2 mb-1">
                        <input
                            className="w-full border-b-2 border-indigo-500 bg-transparent text-base font-bold text-slate-800 focus:outline-none py-0.5"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            onBlur={handleSave}
                        />
                    </div>
                ) : (
                    <div className="flex items-start justify-between mb-1.5">
                        <h3 className={`font-bold text-slate-800 text-base leading-tight truncate ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                        </h3>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500">
                    {/* CATEGORÍA */}
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <span className="text-sm leading-none">
                            {task.category === 'Trabajo' ? '💼' :
                                task.category === 'Personal' ? '👤' :
                                    task.category === 'Hogar' ? '🏠' : '🎓'}
                        </span>
                        <span className="font-semibold text-slate-600">
                            {task.category}
                        </span>
                    </div>

                    {/* PRIORIDAD (BADGE) */}
                    <span className={`px-2 py-1 rounded-md font-bold uppercase tracking-wider border text-[10px] ${pStyle.badge} ${pStyle.border.replace('border-l', 'border')}`}>
                        {task.priority}
                    </span>

                    {/* FECHA LIMITE */}
                    {task.dueDate && (
                        <div className={`flex items-center gap-1.5 font-medium px-2 py-1 rounded-md border ${isOverdue ? 'text-red-600 bg-red-50 border-red-100' : 'text-slate-500 bg-slate-50 border-slate-100'}`}>
                            <span className="text-sm leading-none">📅</span>
                            <span>{formatDate(task.dueDate)}</span>
                            {isOverdue && <span className="text-[10px] font-extrabold uppercase bg-red-200 text-red-700 px-1 rounded ml-1">!</span>}
                        </div>
                    )}

                    {/* COMENTARIOS */}
                    {task.comments?.length > 0 && (
                        <span className="text-xs px-2 py-1 rounded-md border bg-indigo-50 text-indigo-600 border-indigo-100 flex items-center gap-1 font-bold">
                            💬 {task.comments.length}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
                    title="Editar"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('¿Borrar esta tarea?')) remove(task.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Eliminar"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </div>
    );
};
