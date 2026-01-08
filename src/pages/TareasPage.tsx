import React, { useMemo, useState } from 'react';
import { SortBar, SortField, SortDirection } from '../components/SortBar';
import { TaskItem } from '../components/TaskItem';
import { Task, TaskStatus } from '../context/TaskContext';
import { TaskDetail } from '../components/TaskDetail';

interface TareasPageProps {
    tasks: Task[];
    sortBy: SortField;
    setSortBy: (val: SortField) => void;
    sortDir: SortDirection;
    setSortDir: (val: SortDirection) => void;
    onAdd: () => void;
}

// PROFESOR: Vista "Tareas" - Listado Principal
// Implementa Patrón Maestro-Detalle y Filtros Avanzados
export const TareasPage = ({ tasks, sortBy, setSortBy, sortDir, setSortDir, onAdd }: TareasPageProps) => {
    // FILTRO DE ESTADO
    const [statusFilter, setStatusFilter] = React.useState<TaskStatus | 'all'>('all');
    // FILTRO DE FECHA (Nuevo)
    const [dateFilter, setDateFilter] = useState<string>('');

    // ESTADO PARA SELECCIÓN DE TAREA (DETALLE)
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    // HOOK: useMemo para Filtrado Eficiente
    // PROFESOR: Utilizo useMemo aquí para filtrar la lista de tareas.
    // ¿Por qué? Si el componente se re-renderiza por otra razón (ej. input de texto), no queremos filtrar 1000 tareas de nuevo.
    // ¿Cómo funciona? Solo se ejecuta si cambia 'tasks', 'statusFilter' o 'dateFilter'.
    // Rol: Es el corazón de la visualización, determinando qué tareas se muestran al usuario.
    const filteredTasks = useMemo(() => {
        return tasks.filter(t => {
            // Filtro por Estado
            if (statusFilter !== 'all' && t.status !== statusFilter) return false;

            // Filtro por Fecha (si está seleccionada)
            if (dateFilter) {
                // Si la tarea no tiene fecha, la ocultamos (o decidimos politica)
                if (!t.dueDate) return false;
                // Comparamos string YYYY-MM-DD
                const taskDate = new Date(t.dueDate).toISOString().split('T')[0];
                if (taskDate !== dateFilter) return false;
            }

            return true;
        });
    }, [tasks, statusFilter, dateFilter]);

    // Tarea seleccionada para el panel de detalle
    const selectedTask = useMemo(() =>
        tasks.find(t => t.id === selectedTaskId),
        [tasks, selectedTaskId]
    );

    return (
        <div className="animate-fade-in h-[calc(100vh-140px)] flex flex-col max-w-7xl mx-auto w-full">
            <div className="mb-8 flex-shrink-0 flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestión de Tareas</h2>
                    <p className="text-slate-500 font-medium mt-1">Visualiza, filtra y organiza tu trabajo.</p>
                </div>
                {/* BOTON NUEVA TAREA */}
                <button
                    onClick={onAdd}
                    className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200/50 transition-all hover:scale-[1.02] active:scale-95"
                >
                    <span className="text-xl leading-none">+</span> Nueva Tarea
                </button>
            </div>

            {/* BARRA DE HERRAMIENTAS: FILTROS Y ORDEN */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full xl:w-auto">
                    {/* FILTROS DE ESTADO */}
                    <div className="flex p-1 bg-slate-100/80 rounded-xl gap-1 overflow-x-auto">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'all' ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'pending' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'}`}
                        >
                            Pendientes
                        </button>
                        <button
                            onClick={() => setStatusFilter('in_progress')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'in_progress' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50/50'}`}
                        >
                            En Proceso
                        </button>
                        <button
                            onClick={() => setStatusFilter('completed')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'completed' ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-100' : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50'}`}
                        >
                            Terminadas
                        </button>
                        <button
                            onClick={() => setStatusFilter('expired')}
                            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'expired' ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-100' : 'text-slate-500 hover:text-red-600 hover:bg-red-50/50'}`}
                        >
                            Vencidas
                        </button>
                    </div>

                    {/* FILTRO FECHA */}
                    <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha:</span>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="text-sm font-medium text-slate-700 border-none p-0 focus:ring-0 cursor-pointer outline-none bg-transparent"
                        />
                        {dateFilter && (
                            <button onClick={() => setDateFilter('')} className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-shrink-0 flex items-center justify-between sm:justify-end gap-4">
                    {/* BOTON MOVIL NUEVA TAREA */}
                    <button
                        onClick={onAdd}
                        className="sm:hidden flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full font-bold shadow-xl shadow-indigo-300 active:scale-90 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>

                    <SortBar
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        sortDir={sortDir}
                        onDirChange={setSortDir}
                    />
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL: LISTA + DETALLE */}
            <div className="flex-1 flex gap-6 overflow-hidden relative">

                {/* LISTA (IZQUIERDA) */}
                <div className={`flex-1 overflow-y-auto px-4 py-2 custom-scrollbar transition-all duration-300 ${selectedTask ? 'hidden lg:block' : 'w-full'} -mx-2`}>
                    <div className="flex items-center justify-between mb-3 sticky top-0 bg-slate-50/95 backdrop-blur z-10 py-2 border-b border-slate-200/50 mx-1">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
                            {statusFilter === 'all' ? 'Todas' :
                                statusFilter === 'pending' ? 'Pendientes' :
                                    statusFilter === 'in_progress' ? 'En Curso' :
                                        statusFilter === 'completed' ? 'Completadas' : 'Vencidas'}

                            {dateFilter && (
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] border border-indigo-200">
                                    {new Date(dateFilter).toLocaleDateString()}
                                </span>
                            )}

                            <span className="ml-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{filteredTasks.length}</span>
                        </h3>
                    </div>

                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-slate-200 mx-4 lg:mx-0 flex flex-col items-center justify-center">
                            <span className="text-5xl mb-4 opacity-50 filter grayscale text-indigo-200">🔍</span>
                            <h3 className="text-lg font-bold text-slate-600 mb-1">No se encontraron tareas</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                {dateFilter ? 'Prueba cambiando la fecha o el estado seleccionado.' : '¡Todo limpio! Crea una nueva tarea para empezar.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 pb-20 px-1">
                            {filteredTasks.map(task => (
                                <div
                                    key={task.id}
                                    onClick={() => setSelectedTaskId(task.id)}
                                    className={`
                                        cursor-pointer transform transition-all duration-200
                                        ${selectedTaskId === task.id
                                            ? 'ring-2 ring-indigo-500 ring-offset-2 rounded-xl scale-[1.01] shadow-lg'
                                            : 'hover:scale-[1.01] hover:shadow-md'}
                                    `}
                                >
                                    {/* Pasamos pointer-events-auto a los hijos interactivos dentro de TaskItem, 
                                        pero aquí el contenedor maneja la selección */}
                                    <TaskItem task={task} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DETALLE (DERECHA - PANEL DESLIZANTE/FIJO) */}
                {selectedTask ? (
                    <div className="absolute inset-0 z-20 lg:static lg:z-0 lg:w-[450px] lg:flex-shrink-0 h-full animate-slide-in-right">
                        <TaskDetail task={selectedTask} onClose={() => setSelectedTaskId(null)} />
                    </div>
                ) : (
                    <div className="hidden lg:flex w-[450px] flex-shrink-0 flex-col items-center justify-center bg-white/50 rounded-2xl border-2 border-dashed border-slate-200 m-4 opacity-50">
                        <span className="text-6xl mb-4 opacity-20">👆</span>
                        <p className="text-slate-400 font-medium text-center px-8">Selecciona una tarea de la lista para ver sus detalles, editarla o añadir comentarios.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
