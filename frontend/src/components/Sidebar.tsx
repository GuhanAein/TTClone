import { Calendar, Clock, Inbox, List as ListIcon, LogOut, Moon, Sun, User, CalendarDays, LayoutGrid, Activity, Timer, Search, CheckSquare, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { TaskList } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

interface SidebarProps {
    selectedView: 'today' | 'next7days' | 'overdue' | 'all' | 'calendar' | 'matrix' | 'habits' | 'focus' | number;
    onViewChange: (view: 'today' | 'next7days' | 'overdue' | 'all' | 'calendar' | 'matrix' | 'habits' | 'focus' | number) => void;
    taskLists: TaskList[];
}

export default function Sidebar({ selectedView, onViewChange, taskLists }: SidebarProps) {
    const { user, logout } = useAuth();
    const { darkMode, toggleDarkMode } = useTheme();
    const [listsCollapsed, setListsCollapsed] = useState(false);

    // Determine active module based on selectedView
    const isTaskView = ['today', 'next7days', 'overdue', 'all'].includes(selectedView as string) || typeof selectedView === 'number';
    const activeModule = isTaskView ? 'tasks' : selectedView;

    const smartLists = [
        { id: 'all', label: 'Inbox', icon: Inbox, color: 'text-blue-500' },
        { id: 'today', label: 'Today', icon: Calendar, color: 'text-green-500' },
        { id: 'next7days', label: 'Next 7 Days', icon: CalendarDays, color: 'text-purple-500' },
        { id: 'overdue', label: 'Overdue', icon: Clock, color: 'text-red-500' },
    ];

    const modules = [
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'matrix', label: 'Eisenhower', icon: LayoutGrid },
        { id: 'habits', label: 'Habits', icon: Activity },
        { id: 'focus', label: 'Focus', icon: Timer },
    ];

    const handleModuleClick = (moduleId: string) => {
        if (moduleId === 'tasks') {
            onViewChange('today');
        } else {
            onViewChange(moduleId as any);
        }
    };

    return (
        <div className="flex h-full">
            {/* Module Strip (Leftmost) */}
            <div className="w-[70px] flex flex-col items-center py-6 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-20">
                {/* User Avatar */}
                <div className="mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg shadow-primary-500/20 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:opacity-90 transition-opacity">
                        {user?.name?.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                    </div>
                </div>

                {/* Modules */}
                <div className="flex-1 flex flex-col gap-4 w-full px-2">
                    {modules.map((module) => {
                        const Icon = module.icon;
                        const isActive = activeModule === module.id;
                        return (
                            <button
                                key={module.id}
                                onClick={() => handleModuleClick(module.id)}
                                className={`w-full aspect-square flex items-center justify-center rounded-2xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                                    : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
                                    }`}
                                title={module.label}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-r-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-4 w-full px-2">
                    <button
                        onClick={toggleDarkMode}
                        className="w-full aspect-square flex items-center justify-center rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-500 transition-all"
                    >
                        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={logout}
                        className="w-full aspect-square flex items-center justify-center rounded-2xl text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-all"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* List Panel (Secondary Sidebar) - Only visible for Tasks */}
            {activeModule === 'tasks' && (
                <div className="w-60 bg-[#FAFAFA] dark:bg-[#18181b] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full animate-in slide-in-from-left-5 duration-200">
                    {/* Search */}
                    <div className="p-4">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-white dark:bg-gray-800 border-none rounded-xl py-2 pl-9 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-primary-500/20 placeholder-gray-400 dark:text-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
                        {/* Smart Lists */}
                        <div className="space-y-1">
                            {smartLists.map((item) => {
                                const Icon = item.icon;
                                const isActive = selectedView === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onViewChange(item.id as any)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className={`w-4.5 h-4.5 ${item.color}`} />
                                        <span>{item.label}</span>
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Lists Section */}
                        <div>
                            <div
                                className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
                                onClick={() => setListsCollapsed(!listsCollapsed)}
                            >
                                <span>Lists</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${listsCollapsed ? '-rotate-90' : ''}`} />
                            </div>

                            {!listsCollapsed && (
                                <div className="space-y-1 mt-1">
                                    {taskLists.map((list) => {
                                        const isActive = selectedView === list.id;
                                        return (
                                            <button
                                                key={list.id}
                                                onClick={() => onViewChange(list.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <ListIcon className="w-4.5 h-4.5 text-gray-400" />
                                                <span className="flex-1 text-left truncate">{list.name}</span>
                                                {list.taskCount > 0 && (
                                                    <span className="text-xs text-gray-400">{list.taskCount}</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <div className="w-4.5 h-4.5 flex items-center justify-center border border-dashed border-gray-400 rounded">
                                            <span className="text-xs">+</span>
                                        </div>
                                        <span>Add List</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
