import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { TareasPage } from './pages/TareasPage';
import { CompletadasPage } from './pages/CompletadasPage';
import { EstadisticasPage } from './pages/EstadisticasPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { CalendarPage } from './pages/CalendarPage';
import { useTask } from './context/TaskContext';
import { SortField, SortDirection } from './components/SortBar';

function App() {
    // HOOK: useState para Enrutamiento Manual
    // PROFESOR: Usamos una variable de estado para decidir qué "Página" renderizar.
    // Esto simula una SPA (Single Page Application) sin librerías externas.
    const [currentPage, setCurrentPage] = useState('tareas');

    // Estados para el ordenamiento
    const [sortBy, setSortBy] = useState<SortField>('createdAt');
    const [sortDir, setSortDir] = useState<SortDirection>('desc');

    const { items } = useTask();

    // HOOK: useMemo para Optimización
    // PROFESOR: La lógica de ordenamiento tiene una complejidad O(N log N).
    // Si tenemos muchas tareas, no queremos reordenarlas cada vez que el usuario navega
    // o cambia algo irrelevante. useMemo guarda (memoriza) el resultado y solo
    // lo recalcula si cambian: 'items', 'sortBy' o 'sortDir'.
    const sortedTasks = useMemo(() => {
        const sorted = [...items]; // Hacemos una copia somera para no mutar el estado original

        sorted.sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'priority':
                    const pMap = { Alta: 3, Media: 2, Baja: 1 };
                    comparison = pMap[a.priority] - pMap[b.priority];
                    break;
                case 'createdAt':
                default:
                    comparison = a.createdAt - b.createdAt;
            }

            return sortDir === 'asc' ? comparison : -comparison;
        });

        return sorted;
    }, [items, sortBy, sortDir]);

    // HOOK: useEffect para Restaurar la Sesión
    // PROFESOR: Leemos el hash de la URL al iniciar para mantener la "página" correcta
    // si el usuario recarga el navegador.
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['tareas', 'calendario', 'completadas', 'estadisticas', 'config'].includes(hash)) {
            setCurrentPage(hash);
        }
    }, []);

    const changePage = (page: string) => {
        setCurrentPage(page);
        window.location.hash = page;
    };

    // Renderizado Condicional de Vistas
    const renderPage = () => {
        switch (currentPage) {
            case 'tareas':
                return <TareasPage
                    tasks={sortedTasks}
                    sortBy={sortBy} setSortBy={setSortBy}
                    sortDir={sortDir} setSortDir={setSortDir}
                />;
            case 'calendario':
                return <CalendarPage />;
            case 'completadas':
                return <CompletadasPage tasks={sortedTasks} />;
            case 'estadisticas':
                return <EstadisticasPage />;
            case 'config':
                return <ConfiguracionPage />;
            default:
                return <TareasPage
                    tasks={sortedTasks}
                    sortBy={sortBy} setSortBy={setSortBy}
                    sortDir={sortDir} setSortDir={setSortDir}
                />;
        }
    };

    return (
        <div className="min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50/50">
            <Header currentPage={currentPage} setPage={changePage} />
            {/* PROFESOR: Usamos 'mx-auto' para centrar el contenido horizontalmente y 'max-w-5xl' para limitar el ancho */}
            <main className="container mx-auto max-w-5xl px-4 animate-fade-in">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
