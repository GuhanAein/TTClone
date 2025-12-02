import { Plus, Calendar, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../services/api';
import TaskItem from './TaskItem';
import type { Task, TaskRequest } from '../types';
import { format, isToday, isTomorrow, startOfDay } from 'date-fns';

interface TaskListViewProps {
    tasks: Task[];
    isLoading: boolean;
    selectedView: 'today' | 'next7days' | 'overdue' | 'all' | number;
    onTaskClick: (task: Task) => void;
    onRefresh: () => void;
}

export default function TaskListView({ tasks, isLoading, selectedView, onTaskClick, onRefresh }: TaskListViewProps) {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (data: TaskRequest) => taskAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskTitle('');
            onRefresh();
        },
    });

    const handleCreateTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const taskData: TaskRequest = {
            title: newTaskTitle,
            priority: 'NONE',
            status: 'TODO',
            ...(typeof selectedView === 'number' && { taskListId: selectedView }),
            ...(selectedView === 'today' && { dueDate: new Date().toISOString() }),
        };

        createTaskMutation.mutate(taskData);
    };

    const getViewTitle = () => {
        if (typeof selectedView === 'number') return 'List';
        switch (selectedView) {
            case 'today': return 'Today';
            case 'next7days': return 'Next 7 Days';
            case 'overdue': return 'Overdue';
            case 'all': return 'Inbox'; // Or All Tasks
            default: return 'Tasks';
        }
    };

    // Grouping Logic
    const groupedTasks = () => {
        if (selectedView !== 'next7days' && selectedView !== 'all' && typeof selectedView !== 'number') {
            return { 'Tasks': tasks };
        }

        const groups: Record<string, Task[]> = {};
        const today = new Date();

        tasks.forEach(task => {
            let groupName = 'No Date';
            if (task.dueDate) {
                const date = new Date(task.dueDate);
                if (isToday(date)) groupName = 'Today';
                else if (isTomorrow(date)) groupName = 'Tomorrow';
                else if (date < startOfDay(today)) groupName = 'Overdue';
                else groupName = format(date, 'EEE, MMM d');
            } else {
                groupName = 'No Date';
            }

            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(task);
        });

        // Sort keys: Overdue, Today, Tomorrow, then dates, then No Date
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            const order = ['Overdue', 'Today', 'Tomorrow'];
            const indexA = order.indexOf(a);
            const indexB = order.indexOf(b);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;

            if (a === 'No Date') return 1;
            if (b === 'No Date') return -1;

            // Handle date strings for sorting
            try {
                const dateA = new Date(a);
                const dateB = new Date(b);
                if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                    return dateA.getTime() - dateB.getTime();
                }
            } catch (e) {
                // Fallback if date parsing fails for some keys
            }
            return a.localeCompare(b); // Alphabetical sort for other cases
        });

        const sortedGroups: Record<string, Task[]> = {};
        sortedKeys.forEach(key => sortedGroups[key] = groups[key]);
        return sortedGroups;
    };

    const groups = groupedTasks();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="px-8 py-6 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getViewTitle()}
                    </h1>
                    <span className="text-gray-400 text-sm font-medium mt-1">
                        {tasks.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onRefresh}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Calendar className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Add Task Input */}
            <div className="px-8 mb-6">
                <form onSubmit={handleCreateTask} className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500">
                        <Plus className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a task..."
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-12 pr-4 text-base shadow-sm focus:ring-2 focus:ring-primary-500/20 placeholder-gray-400 dark:text-white transition-all"
                    />
                </form>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Inbox className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p>No tasks found</p>
                    </div>
                ) : (
                    Object.entries(groups).map(([groupName, groupTasks]) => (
                        <div key={groupName}>
                            <h3 className={`text-sm font-semibold mb-3 ${groupName === 'Overdue' ? 'text-red-500' :
                                groupName === 'Today' ? 'text-green-500' :
                                    'text-gray-500 dark:text-gray-400'
                                }`}>
                                {groupName} <span className="text-xs font-normal ml-1 text-gray-400">{groupTasks.length}</span>
                            </h3>
                            <div className="space-y-1">
                                {groupTasks.map((task) => (
                                    <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

function Inbox(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    )
}
