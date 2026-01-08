import React, { useState } from 'react';
import { useTask, Task, TaskPriority, TaskCategory } from '../context/TaskContext';

interface TaskDetailProps {
    task: Task;
    onClose: () => void;
}

// PROFESOR: Componente de Detalle para la vista Maestro-Detalle.
// Permite la edición profunda de una tarea y la gestión de comentarios.
export const TaskDetail = ({ task, onClose }: TaskDetailProps) => {
    const { update, addComment, removeComment } = useTask();
    const [newComment, setNewComment] = useState('');

    // Manejadores de cambio directos


    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        update(task.id, { category: e.target.value as TaskCategory });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        update(task.id, { dueDate: e.target.value });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(task.id, newComment);
            setNewComment('');
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-slide-in-right">
            {/* Header del Panel */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight mb-1">{task.title}</h3>
                    <span className="text-xs font-mono text-slate-400">ID: {task.id.slice(0, 8)}</span>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    ✕
                </button>
            </div>

            {/* Cuerpo del Formulario */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">

                {/* Selector de Prioridad */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Prioridad</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Alta', 'Media', 'Baja'].map((p) => (
                            <button
                                key={p}
                                onClick={() => update(task.id, { priority: p as TaskPriority })}
                                className={`
                                    py-2 px-3 rounded-lg text-sm font-medium border transition-all
                                    ${task.priority === p
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                `}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selector de Categoría */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Categoría</label>
                    <select
                        value={task.category}
                        onChange={handleCategoryChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    >
                        <option value="Trabajo">💼 Trabajo</option>
                        <option value="Personal">👤 Personal</option>
                        <option value="Hogar">🏠 Hogar</option>
                        <option value="Estudios">📚 Estudios</option>
                    </select>
                </div>

                {/* Selector de Fecha */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Fecha y Hora Límite</label>
                    <input
                        type="datetime-local"
                        value={task.dueDate ? (task.dueDate.length === 10 ? task.dueDate + 'T00:00' : task.dueDate) : ''}
                        onChange={handleDateChange}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                {/* Sección de Comentarios */}
                <div className="pt-6 border-t border-slate-100">
                    <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 block">
                        Comentarios ({task.comments?.length || 0})
                    </label>

                    <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        {task.comments?.length === 0 && (
                            <p className="text-sm text-slate-400 italic text-center py-4">No hay comentarios aún.</p>
                        )}
                        {task.comments?.map((comment, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 relative group animate-fade-in flex justify-between items-start">
                                <p className="flex-1 pr-2">{comment}</p>
                                <button
                                    onClick={() => removeComment(task.id, idx)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-0.5"
                                    title="Eliminar comentario"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddComment} className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe un problema o nota..."
                            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Enviar
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};
