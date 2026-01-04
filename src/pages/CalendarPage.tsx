import { useState, useMemo } from 'react';
import { useTask, Task } from '../context/TaskContext';
import { Card } from '../components/ui/Card';

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
                // Asegurar formato fecha local
                const dateKey = task.dueDate;
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
        <div className="animate-fade-in space-y-6">
            <Card>
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-700">📅 Calendario de Tareas</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={handlePrevMonth} className="btn btn-secondary px-3 py-1">←</button>
                        <span className="font-semibold text-lg w-32 text-center">{monthNames[month]} {year}</span>
                        <button onClick={handleNextMonth} className="btn btn-secondary px-3 py-1">→</button>
                    </div>
                </div>

                {/* Cabecera Dias Semana */}
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grid Calendario */}
                <div className="grid grid-cols-7">
                    {renderCalendarDays()}
                </div>
            </Card>

            {/* Lista Tareas del Día Seleccionado */}
            {selectedDateStr && (
                <Card className="border-indigo-200 bg-indigo-50/30">
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-slate-700 mb-3">
                            Tareas para el {selectedDateStr}
                        </h3>
                        {selectedDateTasks.length === 0 ? (
                            <p className="text-slate-500 italic">No hay tareas programadas para este día.</p>
                        ) : (
                            <ul className="space-y-2">
                                {selectedDateTasks.map(t => (
                                    <li key={t.id} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm border border-slate-100">
                                        <span className={t.completed ? "text-slate-400" : "text-green-500"}>
                                            {t.completed ? '✓' : '○'}
                                        </span>
                                        <span className={t.completed ? "line-through text-slate-400" : ""}>
                                            {t.title}
                                        </span>
                                        <span className="text-xs text-slate-400 ml-auto bg-slate-100 px-2 py-0.5 rounded">
                                            {t.priority}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
};
