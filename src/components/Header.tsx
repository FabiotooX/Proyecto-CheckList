import { useTask } from '../context/TaskContext';

interface HeaderProps {
    currentPage: string;
    setPage: (page: string) => void;
}

export const Header = ({ currentPage, setPage }: HeaderProps) => {
    const { count, total } = useTask();
    const progress = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 mb-8 shadow-sm transition-all duration-300">
            <div className="container mx-auto h-16 flex items-center justify-between px-4">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => setPage('principal')}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all group-hover:scale-105">
                        ✓
                    </div>
                    <div>
                        <h1 className="font-bold text-xl text-slate-800 tracking-tight leading-none group-hover:text-indigo-600 transition-colors">DailyCheck</h1>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Proyecto 2º DAW</span>
                    </div>
                </div>

                <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg">
                    <NavBtn label="Principal" id="principal" active={currentPage === 'principal'} onClick={setPage} />
                    <NavBtn label="Tareas" id="tareas" active={currentPage === 'tareas'} onClick={setPage} />
                    <NavBtn label="Calendario" id="calendario" active={currentPage === 'calendario'} onClick={setPage} />
                    <NavBtn label="Estadísticas" id="estadisticas" active={currentPage === 'estadisticas'} onClick={setPage} />
                    <NavBtn label="⚙️" id="config" active={currentPage === 'config'} onClick={setPage} icon />
                </nav>

                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-200">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Tu Progreso</span>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 text-lg">{count}</span>
                            <span className="text-slate-400 text-sm">/ {total}</span>
                        </div>
                    </div>
                    <div className="relative w-10 h-10 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                className="text-slate-100"
                                strokeWidth="3"
                                stroke="currentColor"
                                fill="transparent"
                                r="18"
                                cx="20"
                                cy="20"
                            />
                            <circle
                                className="text-indigo-500 transition-all duration-1000 ease-out"
                                strokeWidth="3"
                                strokeDasharray={113}
                                strokeDashoffset={113 - (113 * progress) / 100}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="18"
                                cx="20"
                                cy="20"
                            />
                        </svg>
                        <span className="absolute text-[10px] font-bold text-indigo-600">{progress}%</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

const NavBtn = ({ label, id, active, onClick, icon = false }: { label: string, id: string, active: boolean, onClick: (id: string) => void, icon?: boolean }) => (
    <button
        onClick={() => onClick(id)}
        className={`
      ${icon ? 'px-3' : 'px-4'} py-1.5 rounded-md font-medium text-sm transition-all duration-200
      ${active
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
    `}
    >
        {label}
    </button>
);
