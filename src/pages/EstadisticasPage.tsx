import React, { useMemo } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { useTask } from '../context/TaskContext';

export const EstadisticasPage = () => {
    const { items, total, count } = useTask();

    const stats = useMemo(() => {
        const byPriority = { Alta: 0, Media: 0, Baja: 0 };
        const byCategory = { Trabajo: 0, Personal: 0, Hogar: 0, Estudios: 0 };

        items.forEach(t => {
            if (t.completed) return; // Solo contamos pendientes para carga de trabajo actual
            byPriority[t.priority]++;
            byCategory[t.category]++;
        });

        return { byPriority, byCategory };
    }, [items]);

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="title">Estadísticas</h2>
                <p className="subtitle">Resumen de tu productividad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-indigo-600 text-white">
                    <CardContent>
                        <div className="text-4xl font-bold mb-1">{count}</div>
                        <div className="text-indigo-100">Tareas Completadas</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="text-4xl font-bold mb-1 text-slate-800">{total}</div>
                        <div className="text-slate-500">Total de Tareas Creadas</div>
                    </CardContent>
                </Card>
            </div>

            <h3 className="font-semibold text-lg mb-4">Tareas Pendientes por Categoría</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(stats.byCategory).map(([cat, val]) => (
                    <Card key={cat} className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-slate-700">{val}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wide">{cat}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
