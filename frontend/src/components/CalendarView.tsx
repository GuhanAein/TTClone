import { useState } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { Task } from '../types';

interface CalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export default function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToToday = () => setCurrentDate(new Date());

    const getTasksForDay = (day: Date) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            return isSameDay(new Date(task.dueDate), day);
        });
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {format(currentDate, 'MMMM yyyy')}
                    </h2>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button onClick={goToToday} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
                            Today
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-colors">
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Week Days Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                    {weekDays.map(day => (
                        <div key={day} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6">
                    {days.map((day, dayIdx) => {
                        const dayTasks = getTasksForDay(day);
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const isDayToday = isToday(day);

                        return (
                            <div
                                key={day.toString()}
                                className={`
                                    min-h-[100px] border-b border-r border-gray-200 dark:border-gray-800 p-2 transition-colors
                                    ${!isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-900'}
                                    ${dayIdx % 7 === 0 ? 'border-l' : ''}
                                    hover:bg-gray-50 dark:hover:bg-gray-800/50
                                `}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`
                                        text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                                        ${isDayToday
                                            ? 'bg-primary-600 text-white'
                                            : isCurrentMonth
                                                ? 'text-gray-700 dark:text-gray-300'
                                                : 'text-gray-400 dark:text-gray-600'
                                        }
                                    `}>
                                        {format(day, dateFormat)}
                                    </span>
                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all">
                                        <Plus className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-30px)]">
                                    {dayTasks.map(task => (
                                        <button
                                            key={task.id}
                                            onClick={() => onTaskClick(task)}
                                            className={`
                                                w-full text-left px-2 py-1 rounded text-xs truncate transition-all
                                                ${task.status === 'COMPLETED'
                                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 line-through'
                                                    : 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800'
                                                }
                                            `}
                                        >
                                            {task.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
