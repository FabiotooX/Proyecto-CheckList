import { TaskForm } from '../components/TaskForm';

// PÁGINA PRINCIPAL
// Objetivo: Permitir añadir nuevas tareas rápidamente.
// Solo contiene el formulario de creación.
export const HomePage = () => {
    return (
        <div className="animate-fade-in max-w-2xl mx-auto pt-10">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 mb-3">
                    🚀 Tu Centro de Productividad
                </h1>
                <p className="text-slate-500 text-lg">
                    Comienza tu día definiendo tus objetivos. Añade una tarea para empezar.
                </p>
            </div>

            <TaskForm />
        </div>
    );
};
