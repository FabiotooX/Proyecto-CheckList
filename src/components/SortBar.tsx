

export type SortField = 'createdAt' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

interface SortBarProps {
    sortBy: SortField;
    onSortChange: (field: SortField) => void;
    sortDir: SortDirection;
    onDirChange: (dir: SortDirection) => void;
}

export const SortBar = ({ sortBy, onSortChange, sortDir, onDirChange }: SortBarProps) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500 hidden sm:inline">Ordenar:</span>
                <div className="relative">
                    <select
                        className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg pl-3 pr-8 py-1.5 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:bg-slate-50 transition-colors"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as SortField)}
                    >
                        <option value="priority">Prioridad</option>
                        <option value="dueDate">Fecha Vencimiento</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>

            <div className="flex bg-white rounded-lg border border-slate-200 p-0.5 shadow-sm">
                <button
                    onClick={() => onDirChange('asc')}
                    className={`px-2 py-1 rounded-md text-sm font-bold transition-all ${sortDir === 'asc' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    title="Ascendente"
                >
                    ↑
                </button>
                <div className="w-px bg-slate-200 my-1"></div>
                <button
                    onClick={() => onDirChange('desc')}
                    className={`px-2 py-1 rounded-md text-sm font-bold transition-all ${sortDir === 'desc' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    title="Descendente"
                >
                    ↓
                </button>
            </div>
        </div>
    );
};
