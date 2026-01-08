import { useState, useMemo } from 'react';
import { useTask, Task } from '../context/TaskContext';


export const CalendarPage = () => {
    const { items } = useTask();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDateTasks, setSelectedDateTasks] = useState<Task[]>([]);
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

    // Helpers para navegación de fechas
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Domingo

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    // Ajustar para que la semana empiece en Lunes (0) en vez de Domingo (0 en JS)
    // En JS getDay(): 0=Dom, 1=Lun. Queremos 0=Lun ... 6=Dom
    let startDay = getFirstDayOfMonth(year, month) - 1;
    if (startDay === -1) startDay = 6;

    // Mapear tareas por fecha (YYYY-MM-DD)
    const tasksByDate = useMemo(() => {
        const map: Record<string, Task[]> = {};
        items.forEach(task => {
            if (task.dueDate) {
                // Asegurar formato fecha YYYY-MM-DD para el calendario
                // Si viene con hora (T), cortamos. Si no, tomamos tal cual.
                const dateKey = task.dueDate.split('T')[0];
                if (!map[dateKey]) map[dateKey] = [];
                map[dateKey].push(task);
            }
        });
        return map;
    }, [items]);

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const handleDayClick = (day: number) => {
        // Construir string YYYY-MM-DD
        // Nota: El input type="date" usa formato YYYY-MM-DD con ceros a la izquierda
        const monthStr = (month + 1).toString().padStart(2, '0');
        const dayStr = day.toString().padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;

        setSelectedDateStr(dateKey);
        setSelectedDateTasks(tasksByDate[dateKey] || []);
    };

    // Renderizado del Grid
    const renderCalendarDays = () => {
        // const totalSlots = startDay + daysInMonth; // Variable no usada eliminada
        // const rows = Math.ceil(totalSlots / 7); // Variable no usada eliminada
        const days = [];

        // Relleno inicial
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-slate-50 border border-slate-100/50"></div>);
        }

        // Días del mes
        for (let d = 1; d <= daysInMonth; d++) {
            const monthStr = (month + 1).toString().padStart(2, '0');
            const dayStr = d.toString().padStart(2, '0');
            const dateKey = `${year}-${monthStr}-${dayStr}`;
            const tasks = tasksByDate[dateKey] || [];
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const isSelected = selectedDateStr === dateKey;

            days.push(
                <div
                    key={d}
                    onClick={() => handleDayClick(d)}
                    className={`h-24 border border-slate-100 p-1 relative cursor-pointer transition-colors hover:bg-indigo-50/50 flex flex-col items-start
                        ${isToday ? 'bg-indigo-50 font-bold text-indigo-700' : 'bg-white'}
                        ${isSelected ? 'ring-2 ring-inset ring-indigo-400' : ''}
                    `}
                >
                    <span className={`text-sm w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-200' : ''}`}>
                        {d}
                    </span>

                    {/* Indicadores de Tareas */}
                    <div className="flex flex-col gap-0.5 w-full overflow-hidden">
                        {tasks.map(t => (
                            <div key={t.id} className={`text-[10px] px-1 rounded truncate w-full
                                ${t.completed ? 'bg-slate-100 text-slate-400 line-through' : 'bg-indigo-100 text-indigo-700'}
                            `}>
                                {t.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="animate-fade-in space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Calendario</h2>
                    <p className="text-slate-500 font-medium mt-1">Organiza tus tiempos.</p>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 hidden sm:block">
                    <span className="text-2xl">📅</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h2 className="text-2xl font-bold text-indigo-900 capitalize">
                        {monthNames[month]} <span className="text-indigo-400 font-light">{year}</span>
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                {/* Cabecera Dias Semana */}
                <div className="grid grid-cols-7 bg-slate-50/80 border-b border-slate-200/60">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid Calendario */}
                <div className="grid grid-cols-7 bg-slate-100 gap-[1px]">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Lista Tareas del Día Seleccionado */}
            {selectedDateStr && (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100/50 overflow-hidden animate-slide-in-up">
                    <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center gap-3">
                        <div className="bg-indigo-200 text-indigo-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                            {new Date(selectedDateStr as string).getDate()}
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900">Tareas del Día</h3>
                            <p className="text-xs text-indigo-600 font-medium opacity-75">{new Date(selectedDateStr as string).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

                        </div>
                    </div>

                    <div className="p-4">
                        {selectedDateTasks.length === 0 ? (
                            <div className="text-center py-8 opacity-50">
                                <span className="text-4xl block mb-2">🏖️</span>
                                <p className="text-slate-500 font-medium">¡Día libre! No hay tareas para hoy.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedDateTasks.map(t => (
                                    <div key={t.id} className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">

                                        <div className={`p-2 rounded-lg ${t.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {t.completed ? '✓' : '○'}
                                        </div>

                                        <div className="flex-1">
                                            <p className={`font-semibold ${t.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                {t.title}
                                            </p>
                                        </div>

                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                                            ${t.priority === 'Alta' ? 'bg-red-50 text-red-600' :
                                                t.priority === 'Media' ? 'bg-orange-50 text-orange-600' :
                                                    'bg-emerald-50 text-emerald-600'}`}>
                                            {t.priority}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
