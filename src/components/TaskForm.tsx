import React, { useState } from 'react';
import { useTask, TaskPriority, TaskCategory } from '../context/TaskContext';
import { Card, CardContent } from './ui/Card';

export const TaskForm = () => {
    const { add } = useTask();

    // HOOK: useState para Formularios Controlados
    // PROFESOR: Cada input está vinculado a un estado local.
    // Esto es el patrón "Controlled Components" de React.
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState(''); // Opcional
    // PROFESOR: Nuevo estado para la fecha de vencimiento (Gamechanger)
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<TaskPriority>('Media');
    const [category, setCategory] = useState<TaskCategory>('Personal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // Evitamos que la página se recargue
        if (!title.trim()) return;

        // Acción del Contexto
        add({
            title,
            description: desc,
            priority,
            category,
            dueDate: dueDate // Enviamos la fecha al contexto
        });

        // Reset del formulario
        setTitle('');
        setDesc('');
        setDueDate('');
        setPriority('Media');
        setCategory('Personal');
    };

    return (
        <Card className="mb-8 border-indigo-100 shadow-indigo-100/50">
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <label className="label">¿Qué tienes pendiente hoy?</label>
                            <input
                                className="input text-lg font-medium placeholder:font-normal placeholder:text-slate-300 border-slate-200 focus:border-indigo-400 focus:ring-indigo-100"
                                placeholder="Ej: Estudiar React Hooks..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/4">
                            <label className="label">Categoría</label>
                            <select
                                className="select border-slate-200"
                                value={category}
                                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                            >
                                <option value="Trabajo">💼 Trabajo</option>
                                <option value="Personal">👤 Personal</option>
                                <option value="Hogar">🏠 Hogar</option>
                                <option value="Estudios">📚 Estudios</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label text-xs uppercase tracking-wider text-slate-500 font-semibold opacity-75">Prioridad</label>
                            <select
                                className="select text-sm py-2 border-slate-200 text-slate-600"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                            >
                                <option value="Alta">🔴 Alta</option>
                                <option value="Media">🟠 Media</option>
                                <option value="Baja">🟢 Baja</option>
                            </select>
                        </div>
                        <div>
                            {/* PROFESOR: Input type="date" nativo de HTML5 para seleccionar fechas */}
                            <label className="label text-xs uppercase tracking-wider text-slate-500 font-semibold opacity-75">Fecha Límite</label>
                            <input
                                type="date"
                                className="input border-slate-200 text-slate-600"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="btn btn-primary px-8 py-2.5 shadow-indigo-200 hover:shadow-indigo-300 w-full md:w-auto">
                            <span className="mr-2 text-lg">+</span> Añadir Tarea
                        </button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
