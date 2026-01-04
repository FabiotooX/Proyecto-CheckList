import React from 'react';
import { useTask } from '../context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const ConfiguracionPage = () => {
    const { clear, items } = useTask();

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "daily_tasks_backup.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h2 className="title">Configuración</h2>
                <p className="subtitle">Gestiona tus datos.</p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestión de Datos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <div>
                                    <h4 className="font-medium">Exportar Tareas</h4>
                                    <p className="text-sm text-slate-500">Descarga una copia de seguridad.</p>
                                </div>
                                <button onClick={handleExport} className="btn border border-slate-300 hover:bg-slate-50">
                                    Descargar JSON
                                </button>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <div>
                                    <h4 className="font-medium text-red-600">Zona de Peligro</h4>
                                    <p className="text-sm text-slate-500">Eliminar todas las tareas permanentemente.</p>
                                </div>
                                <button
                                    onClick={() => {
                                        if (confirm('¿Estás seguro de que quieres borrar todo?')) clear();
                                    }}
                                    className="btn btn-danger"
                                >
                                    Borrar Todo
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-slate-400 mt-8">
                    <p>Daily Task Checklist v1.0.0</p>
                    <p>Proyecto Educativo React Hooks</p>
                </div>
            </div>
        </div>
    );
};
