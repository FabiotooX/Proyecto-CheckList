import React from 'react';
import { useTask } from '../context/TaskContext';


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
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Configuración</h2>
                    <p className="text-slate-500 font-medium mt-1">Administra tu cuenta y datos.</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 hidden sm:block">
                    <span className="text-2xl">⚙️</span>
                </div>
            </div>

            <div className="space-y-6">

                {/* EXPORTAR DATOS */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                            <span className="text-2xl">💾</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Copia de Seguridad</h3>
                            <p className="text-sm text-slate-500">Mantén tus datos seguros.</p>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-600 text-sm max-w-lg">
                            Descarga un archivo JSON con todas tus tareas actuales. Puedes usar este archivo para restaurar tu información si limpias el navegador.
                        </p>
                        <button
                            onClick={handleExport}
                            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                        >
                            Descargar Datos
                        </button>
                    </div>
                </div>

                {/* ZONA DE PELIGRO */}
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="p-6 border-b border-red-50 flex items-center gap-4 bg-red-50/30">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-700">Zona de Peligro</h3>
                            <p className="text-sm text-red-400">Acciones irreversibles.</p>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-600 text-sm max-w-lg">
                            Esta acción eliminará <strong className="text-red-600">permanentemente</strong> todas las tareas guardadas en este navegador. No se puede deshacer.
                        </p>
                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de que quieres borrar todo? Se eliminarán todas tus tareas de forma permanente.')) clear();
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 bg-white border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition-all"
                        >
                            Eliminar Todo
                        </button>
                    </div>
                </div>

                <div className="text-center py-8">
                    <p className="font-bold text-slate-300 mb-1">DailyCheck v1.0.0</p>
                    <p className="text-xs text-slate-300">Hecho con ❤️ y React</p>
                </div>
            </div>
        </div>
    );
};
