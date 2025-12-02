import { useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Check } from 'lucide-react';
import { taskAPI } from '../services/api';
import type { Task, TaskRequest } from '../types';

interface MatrixViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
}

export default function MatrixView({ tasks, onTaskClick }: MatrixViewProps) {
    const [addingToQuadrant, setAddingToQuadrant] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const queryClient = useQueryClient();

    const createTaskMutation = useMutation({
        mutationFn: (data: TaskRequest) => taskAPI.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setNewTaskTitle('');
            setAddingToQuadrant(null);
        },
    });

    const handleCreateTask = (priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE') => {
        if (!newTaskTitle.trim()) return;

        const taskData: TaskRequest = {
            title: newTaskTitle,
            priority: priority,
            status: 'TODO',
            dueDate: new Date().toISOString(), // Default to today for matrix tasks? Or maybe no due date? Let's stick to no due date or today. Users usually matrix for today/active stuff. Let's leave it empty unless specified, but for now empty is fine, or maybe today.
            // Actually, matrix is often for "Do First" which implies urgency.
            // Let's just set priority.
        };

        createTaskMutation.mutate(taskData);
    };

    const handleKeyDown = (e: React.KeyboardEvent, priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE') => {
        if (e.key === 'Enter') {
            handleCreateTask(priority);
        } else if (e.key === 'Escape') {
            setAddingToQuadrant(null);
            setNewTaskTitle('');
        }
    };

    const quadrants = useMemo(() => {
        const q1: Task[] = []; // Urgent & Important (High Priority)
        const q2: Task[] = []; // Not Urgent & Important (Medium Priority)
        const q3: Task[] = []; // Urgent & Not Important (Low Priority)
        const q4: Task[] = []; // Not Urgent & Not Important (None Priority)

        tasks.forEach(task => {
            if (task.status === 'COMPLETED') return;

            // Mapping priorities to quadrants
            switch (task.priority) {
                case 'HIGH':
                    q1.push(task);
                    break;
                case 'MEDIUM':
                    q2.push(task);
                    break;
                case 'LOW':
                    q3.push(task);
                    break;
                default:
                    q4.push(task);
            }
        });

        return { q1, q2, q3, q4 };
    }, [tasks]);

    const Quadrant = ({
        id,
        title,
        subtitle,
        color,
        tasks,
        priority,
        className
    }: {
        id: string,
        title: string,
        subtitle: string,
        color: string,
        tasks: Task[],
        priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE',
        className?: string
    }) => (
        <div className={`flex flex-col h-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden ${className}`}>
            <div className={`p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center ${color} bg-opacity-10 dark:bg-opacity-20`}>
                <div>
                    <h3 className={`font-bold ${color}`}>{title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white dark:bg-gray-900 ${color}`}>
                    {tasks.length}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 mt-1.5 rounded-full ${color}`} />
                            <span className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                {task.title}
                            </span>
                        </div>
                    </div>
                ))}

                {addingToQuadrant === id ? (
                    <div className="p-2 bg-white dark:bg-gray-900 rounded-xl border border-primary-500 shadow-sm">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Task title..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, priority)}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0 mb-2 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setAddingToQuadrant(null);
                                    setNewTaskTitle('');
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleCreateTask(priority)}
                                className="p-1 bg-primary-600 hover:bg-primary-700 rounded text-white"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setAddingToQuadrant(id);
                            setNewTaskTitle('');
                        }}
                        className="w-full py-2 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Task</span>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="h-full p-6 grid grid-cols-2 grid-rows-2 gap-6 bg-white dark:bg-gray-900">
            <Quadrant
                id="q1"
                title="Do First"
                subtitle="Urgent & Important"
                color="text-red-600"
                priority="HIGH"
                tasks={quadrants.q1}
                className="bg-red-50/30 dark:bg-red-900/10"
            />
            <Quadrant
                id="q2"
                title="Schedule"
                subtitle="Not Urgent & Important"
                color="text-blue-600"
                priority="MEDIUM"
                tasks={quadrants.q2}
                className="bg-blue-50/30 dark:bg-blue-900/10"
            />
            <Quadrant
                id="q3"
                title="Delegate"
                subtitle="Urgent & Not Important"
                color="text-amber-600"
                priority="LOW"
                tasks={quadrants.q3}
                className="bg-amber-50/30 dark:bg-amber-900/10"
            />
            <Quadrant
                id="q4"
                title="Eliminate"
                subtitle="Not Urgent & Not Important"
                color="text-gray-600"
                priority="NONE"
                tasks={quadrants.q4}
                className="bg-gray-50/30 dark:bg-gray-900/10"
            />
        </div>
    );
}
