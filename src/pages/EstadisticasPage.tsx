import { useMemo } from 'react';

import { useTask } from '../context/TaskContext';

export const EstadisticasPage = () => {
    const { items } = useTask();

    // Caluculamos estadísticas detalladas
    const stats = useMemo(() => {
        const counts = {
            total: items.length,
            pending: 0,
            inProgress: 0,
            completed: 0
        };
        const byPriority = { Alta: 0, Media: 0, Baja: 0 };
        const byCategory = { Trabajo: 0, Personal: 0, Hogar: 0, Estudios: 0 };

        items.forEach(t => {
            // Conteos por estado
            if (t.status === 'completed') counts.completed++;
            else if (t.status === 'in_progress') counts.inProgress++;
            else counts.pending++;

            // Conteos adicionales (solo para activas o todas? En este caso todas para métricas globales)
            // Si queremos solo pendientes para prioridad/categoría:
            if (!t.completed) {
                byPriority[t.priority]++;
                byCategory[t.category]++;
            }
        });

        return { counts, byPriority, byCategory };
    }, [items]);

    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Estadísticas</h2>
                    <p className="text-slate-500 font-medium mt-1">Tu productividad en números.</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 hidden sm:block">
                    <span className="text-2xl">📊</span>
                </div>
            </div>

            {/* KPI CARDS CON GRADIENTES */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 transform transition-transform hover:scale-105">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <span className="text-xl">📝</span>
                        </div>
                    </div>
                    <div className="text-4xl font-black mb-1">{stats.counts.total}</div>
                    <div className="text-indigo-100 font-medium text-sm">Total Tareas</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transform transition-transform hover:scale-105 border-l-4 border-l-slate-400">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <span className="text-xl">⏳</span>
                        </div>
                    </div>
                    <div className="text-4xl font-black text-slate-700 mb-1">{stats.counts.pending}</div>
                    <div className="text-slate-500 font-medium text-sm">Pendientes</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transform transition-transform hover:scale-105 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                            <span className="text-xl">🏃</span>
                        </div>
                    </div>
                    <div className="text-4xl font-black text-blue-700 mb-1">{stats.counts.inProgress}</div>
                    <div className="text-blue-500 font-medium text-sm">En Proceso</div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transform transition-transform hover:scale-105 border-l-4 border-l-emerald-500">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <span className="text-xl">✅</span>
                        </div>
                    </div>
                    <div className="text-4xl font-black text-emerald-700 mb-1">{stats.counts.completed}</div>
                    <div className="text-emerald-500 font-medium text-sm">Completadas</div>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span>⚡</span> Carga de Trabajo Activa
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {Object.entries(stats.byCategory).map(([cat, val]) => (
                    <div key={cat} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                            {cat === 'Trabajo' ? '💼' : cat === 'Personal' ? '👤' : cat === 'Hogar' ? '🏠' : '🎓'}
                        </div>
                        <div className="text-3xl font-bold text-slate-800 mb-1">{val}</div>
                        <div className="text-sm text-slate-500 font-bold uppercase tracking-wider">{cat}</div>
                    </div>
                ))}
            </div>

            {/* Barra de Progreso General */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <h4 className="font-bold text-slate-700">Progreso Global</h4>
                    <span className="text-2xl font-black text-indigo-600">
                        {stats.counts.total > 0 ? Math.round((stats.counts.completed / stats.counts.total) * 100) : 0}%
                    </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out"
                        style={{ width: `${stats.counts.total > 0 ? (stats.counts.completed / stats.counts.total) * 100 : 0}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
