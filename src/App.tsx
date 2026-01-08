import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage'; // Nueva Vista Principal
import { TareasPage } from './pages/TareasPage';
import { EstadisticasPage } from './pages/EstadisticasPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { CalendarPage } from './pages/CalendarPage';
import { useTask } from './context/TaskContext';
import { SortField, SortDirection } from './components/SortBar';

function App() {
    // ESTADO: Enrutamiento
    // 'principal' (Home), 'tareas', 'calendario', 'estadisticas', 'config'
    const [currentPage, setCurrentPage] = useState('principal');

    const [sortBy, setSortBy] = useState<SortField>('priority');
    const [sortDir, setSortDir] = useState<SortDirection>('desc');

    const { items } = useTask();

    // HOOK: useMemo
    const sortedTasks = useMemo(() => {
        const sorted = [...items];
        sorted.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'dueDate':
                    // Si no tiene fecha, va al final
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['principal', 'tareas', 'calendario', 'estadisticas', 'config'].includes(hash)) {
            setCurrentPage(hash);
        } else if (!hash) {
            // Default a principal
            setCurrentPage('principal');
        }
    }, []);

    const changePage = (page: string) => {
        setCurrentPage(page);
        window.location.hash = page;
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'principal':
                return <HomePage />;
            case 'tareas':
                return <TareasPage
                    tasks={sortedTasks}
                    sortBy={sortBy} setSortBy={setSortBy}
                    sortDir={sortDir} setSortDir={setSortDir}
                    onAdd={() => changePage('principal')}
                />;
            case 'calendario':
                return <CalendarPage />;
            case 'estadisticas':
                return <EstadisticasPage />;
            case 'config':
                return <ConfiguracionPage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900 bg-slate-50/50">
            <Header currentPage={currentPage} setPage={changePage} />
            <main className="container mx-auto max-w-7xl px-4 animate-fade-in">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
