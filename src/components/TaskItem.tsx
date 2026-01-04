import React, { useState } from 'react';
import { useTask, Task } from '../context/TaskContext';
import { Card } from './ui/Card';

const priorityColors = {
    Alta: 'bg-red-100 text-red-700 border-red-200',
    Media: 'bg-orange-100 text-orange-700 border-orange-200',
    Baja: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const categoryEmojis = {
    Trabajo: '💼',
    Personal: '👤',
    Hogar: '🏠',
    Estudios: '📚',
};

// PROFESOR: Este componente gestiona su propio estado local (editMode) con useState,
// independiente del estado global. Demuestra cómo useState puede coexistir con Context.
export const TaskItem = ({ task }: { task: Task }) => {
    const { toggleComplete, remove, update } = useTask();
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

    // Helper para formatear fechas
    const formatDate = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Check si esta vencida (simple comparacion de dias)
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <Card hover className={`mb-3 transition-colors duration-300 ${task.completed ? 'bg-slate-50 opacity-75' : 'bg-white'} ${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}>
            <div className="flex items-center p-4">
                {/* Checkbox con animación personalizada */}
                <div className="flex items-center mr-4">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="w-5 h-5 cursor-pointer accent-indigo-600 rounded transition-transform active:scale-95"
                    />
                </div>

                <div className="flex-1 min-w-0 mr-4">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                className="input py-1 text-lg font-semibold"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                onBlur={handleSave}
                            />
                            <span className="text-xs text-slate-400 whitespace-nowrap">Enter para guardar</span>
                        </div>
                    ) : (
                        <div onDoubleClick={() => setIsEditing(true)} title="Doble click para editar">
                            <div className="flex items-center gap-2">
                                <h4 className={`font-semibold text-lg truncate transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {task.title}
                                </h4>
                                {isOverdue && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">
                                        ¡VENCIDA!
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`text-xs px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-500 shadow-sm`}>
                                    {categoryEmojis[task.category]} {task.category}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded border shadow-sm ${priorityColors[task.priority]}`}>
                                    {task.priority}
                                </span>
                                {/* PROFESOR: Mostramos la fecha si existe, con icono de calendario */}
                                {task.dueDate && (
                                    <span className={`text-xs px-2 py-0.5 rounded border flex items-center gap-1 ${isOverdue ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-slate-500 border-slate-200'}`}>
                                        📅 {formatDate(task.dueDate)}
                                    </span>
                                )}
                                {task.description && (
                                    <span className="text-xs text-slate-400 truncate hidden sm:inline-block max-w-[200px]">
                                        — {task.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-all"
                        title="Editar"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => {
                            if (window.confirm('¿Borrar esta tarea?')) remove(task.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Eliminar"
                    >
                        🗑️
                    </button>
                </div>
            </div>
        </Card>
    );
};
