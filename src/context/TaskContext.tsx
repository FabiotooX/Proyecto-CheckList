import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type TaskPriority = 'Alta' | 'Media' | 'Baja';
export type TaskCategory = 'Trabajo' | 'Personal' | 'Hogar' | 'Estudios';

// PROFESOR: Extraemos la clave a una constante para evitar "Magic Strings" y facilitar cambios futuros.
const STORAGE_KEY = 'daily_tasks';

export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    createdAt: number;
    completedAt?: number;
}

interface TaskContextType {
    items: Task[];
    add: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => void;
    remove: (id: string) => void;
    toggleComplete: (id: string) => void;
    update: (id: string, updates: Partial<Task>) => void;
    clear: () => void;
    count: number; // Tareas Completadas
    total: number; // Total Tareas
    pendingCount: number; // Tareas Pendientes
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
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Error cargando tareas", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const add = (data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedAt'>) => {
        const newTask: Task = {
            ...data,
            id: crypto.randomUUID(),
            completed: false,
            createdAt: Date.now(),
        };
        setItems(prev => [newTask, ...prev]);
    };

    const remove = (id: string) => {
        setItems(prev => prev.filter(t => t.id !== id));
    };

    const toggleComplete = (id: string) => {
        setItems(prev => prev.map(t => {
            if (t.id === id) {
                const isCompleted = !t.completed;
                return {
                    ...t,
                    completed: isCompleted,
                    completedAt: isCompleted ? Date.now() : undefined
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

    // PROFESOR: Optimizamos los contadores con useMemo.
    // Aunque estas operaciones son rápidas (O(n)), en una lista masiva (ej. 10k tareas) 
    // recalcularlas en cada render innecesario podría afectar el rendimiento.
    // useMemo asegura que solo se recalculen cuando la lista 'items' cambia.
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
