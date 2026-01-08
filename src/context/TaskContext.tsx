import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskCategory = 'Trabajo' | 'Personal' | 'Hogar' | 'Estudios';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'expired'; // NUEVO ESTADO: expired

// PROFESOR: Extraemos la clave a una constante para evitar "Magic Strings" y facilitar cambios futuros.
const STORAGE_KEY = 'daily_tasks';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean; // Mantenemos retrocompatibilidad
    status: TaskStatus;
    comments: string[];
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string; // Ahora soportará formato ISO completo o fecha parcial
    createdAt: number;
    completedAt?: number;
}

interface TaskContextType {
    items: Task[];
    add: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'status' | 'comments'>) => void;
    remove: (id: string) => void;
    toggleComplete: (id: string) => void;
    updateStatus: (id: string, status: TaskStatus) => void;
    addComment: (id: string, comment: string) => void;
    removeComment: (id: string, index: number) => void;
    update: (id: string, updates: Partial<Task>) => void;
    clear: () => void;
    count: number;
    total: number;
    pendingCount: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask debe ser usado dentro de un TaskProvider');
    }
    return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {

    const [items, setItems] = useState<Task[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((t: any) => ({
                    ...t,
                    status: t.status || (t.completed ? 'completed' : 'pending'),
                    comments: t.comments || []
                }));
            }
            return [];
        } catch (e) {
            console.error("Error cargando tareas", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // CHECK DE VENCIMIENTO (Intervalo)
    useEffect(() => {
        const checkExpired = () => {
            const now = new Date();
            setItems(prevItems => {
                let hasChanges = false;
                const newItems = prevItems.map(task => {
                    // Si ya está completada o vencida, no hacemos nada
                    if (task.status === 'completed' || task.status === 'expired') return task;

                    if (task.dueDate) {
                        const dueDate = new Date(task.dueDate);

                        // Si la fecha guardada es solo YYYY-MM-DD (longitud 10), asumimos fin del día para no marcarla vencida prematuramente?
                        // O el usuario dijo "si tiene de fecha limite hasta hoy a las 11 de la noche".
                        // Si es datetime-local, será precisa.

                        // NOTA: Si es INPUT TYPE DATE, el string es "2023-01-01" -> new Date("2023-01-01") es UTC o local dependiendo del navegador,
                        // pero generalmente es a las 00:00. Si queremos que dure todo el dia, habria que comparar contra mañana a las 00:00?
                        // O simplemente, si usamos datetime-local, el usuario pone la hora.
                        // Para compatibilidad con tareas viejas (solo fecha), asumimos que vencen al FINAL del dia (23:59:59).

                        let effectiveDueDate = dueDate;
                        if (task.dueDate.length === 10) { // Formato YYYY-MM-DD
                            // Crear fecha a las 23:59:59 del día dado
                            const parts = task.dueDate.split('-');
                            effectiveDueDate = new Date(+parts[0], +parts[1] - 1, +parts[2], 23, 59, 59);
                        }

                        if (effectiveDueDate < now) {
                            hasChanges = true;
                            // PROFESOR: Expiracion automatica
                            return { ...task, status: 'expired' as TaskStatus };
                        }
                    }
                    return task;
                });
                return hasChanges ? newItems : prevItems;
            });
        };

        // Chequear al montar y cada minuto
        checkExpired();
        const interval = setInterval(checkExpired, 60000);
        return () => clearInterval(interval);
    }, []);

    const add = (data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt' | 'status' | 'comments'>) => {
        const newTask: Task = {
            ...data,
            id: crypto.randomUUID(),
            completed: false,
            status: 'pending',
            comments: [],
            createdAt: Date.now(),
        };
        setItems(prev => [newTask, ...prev]);
    };

    const remove = (id: string) => {
        setItems(prev => prev.filter(t => t.id !== id));
    };

    const toggleComplete = (id: string) => {
        // PROFESOR: Aquí utilizamos la lógica de actualización inmutable del estado.
        // Recorremos el array con .map() para crear una NUEVA copia del array modificado.
        // Esto es crucial en React para que detecte el cambio y re-renderice.
        // Además, sincronizamos el 'status' con el booleano 'completed' para mantener coherencia.
        setItems(prev => prev.map(t => {
            if (t.id === id) {
                const isCompleted = !t.completed;
                return {
                    ...t,
                    completed: isCompleted,
                    status: isCompleted ? 'completed' : 'pending',
                    completedAt: isCompleted ? Date.now() : undefined
                };
            }
            return t;
        }));
    };

    // NUEVA FUNCION: Actualizar estado explícitamente
    const updateStatus = (id: string, status: TaskStatus) => {
        setItems(prev => prev.map(t => {
            if (t.id === id) {
                const isCompleted = status === 'completed';
                return {
                    ...t,
                    status,
                    completed: isCompleted,
                    completedAt: isCompleted && !t.completed ? Date.now() : (status !== 'completed' ? undefined : t.completedAt)
                };
            }
            return t;
        }));
    };

    // NUEVA FUNCION: Añadir comentarios
    const addComment = (id: string, comment: string) => {
        setItems(prev => prev.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    comments: [...(t.comments || []), comment]
                };
            }
            return t;
        }));
    };

    // ELIMINAR COMENTARIO
    const removeComment = (id: string, index: number) => {
        setItems(prev => prev.map(t => {
            if (t.id === id) {
                const newComments = [...(t.comments || [])];
                newComments.splice(index, 1);
                return {
                    ...t,
                    comments: newComments
                };
            }
            return t;
        }));
    };

    const update = (id: string, updates: Partial<Task>) => {
        setItems(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const clear = () => {
        setItems([]);
    };

    // PROFESOR: Implementación del hook useMemo.
    // ¿Por qué? Calcular estadísticas (totales, completadas) en cada render puede ser costoso si la lista es enorme.
    // ¿Cómo funciona? React "memoriza" el resultado de esta función y solo lo recalcula si la dependencia [items] cambia.
    // Rol: Provee metadatos rápidos a toda la app sin re-ejecutar lógica innecesaria.
    const counters = useMemo(() => {
        const total = items.length;
        const count = items.filter(t => t.completed).length;
        const pendingCount = total - count;
        return { total, count, pendingCount };
    }, [items]);

    return (
        <TaskContext.Provider value={{
            items,
            add,
            remove,
            toggleComplete,
            updateStatus,
            addComment,
            removeComment,
            update,
            clear,
            count: counters.count,
            total: counters.total,
            pendingCount: counters.pendingCount
        }}>
            {children}
        </TaskContext.Provider>
    );
};
