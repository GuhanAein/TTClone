import { Circle, CheckCircle2, Calendar, Flag } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../services/api';
import type { Task } from '../types';
import { format, isToday, isTomorrow } from 'date-fns';

interface TaskItemProps {
    task: Task;
    onClick: () => void;
}

export default function TaskItem({ task, onClick }: TaskItemProps) {
    const queryClient = useQueryClient();

    const toggleTaskMutation = useMutation({
        mutationFn: () => {
            const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
            const taskRequest: any = {
                title: task.title,
                description: task.description,
                notes: task.notes,
                priority: task.priority,
                status: newStatus,
                dueDate: task.dueDate,
                startDate: task.startDate,
                allDay: task.allDay,
                taskListId: task.taskListId,
                parentTaskId: task.parentTaskId,
                tagIds: task.tags.map(t => t.id),
                isRecurring: task.isRecurring,
                recurrenceType: task.recurrenceType,
                recurrenceInterval: task.recurrenceInterval,
                recurrenceEndDate: task.recurrenceEndDate,
                recurrenceDays: task.recurrenceDays,
                sortOrder: task.sortOrder
            };
            return taskAPI.update(task.id, taskRequest);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleTaskMutation.mutate();
    };

    const getPriorityColor = () => {
        switch (task.priority) {
            case 'HIGH': return 'text-red-600';
            case 'MEDIUM': return 'text-yellow-600';
            case 'LOW': return 'text-blue-600';
            default: return 'text-gray-400';
        }
    };

    const isCompleted = task.status === 'COMPLETED';
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM d');
    };

    return (
        <div
            onClick={onClick}
            className={`group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0 ${isCompleted ? 'opacity-60' : ''}`}
        >
            {/* Priority Indicator (Left Border or Dot) */}
            {task.priority !== 'NONE' && (
                <div className={`w-1 h-8 rounded-full ${getPriorityColor().replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity absolute left-0`} />
            )}

            {/* Checkbox */}
            <button
                onClick={handleToggle}
                className={`flex-shrink-0 transition-colors ${getPriorityColor()}`}
            >
                {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                ) : (
                    <Circle className={`w-5 h-5 ${task.priority === 'HIGH' ? 'text-red-500' : task.priority === 'MEDIUM' ? 'text-yellow-500' : task.priority === 'LOW' ? 'text-blue-500' : 'text-gray-300'} hover:fill-current opacity-70 hover:opacity-100`} />
                )}
            </button>

            {/* Title & Description */}
            <div className="flex-1 min-w-0 flex flex-col">
                <span className={`text-sm font-medium text-gray-900 dark:text-white truncate ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </span>
                {task.description && (
                    <span className="text-xs text-gray-500 truncate">{task.description}</span>
                )}
            </div>

            {/* Meta Info (Right Aligned) */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
                {/* Tags */}
                {task.tags.length > 0 && (
                    <div className="flex gap-1">
                        {task.tags.map(tag => (
                            <span key={tag.id} className="text-blue-500">#{tag.name}</span>
                        ))}
                    </div>
                )}

                {/* Due Date */}
                {task.dueDate && (
                    <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-purple-500'}`}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                )}

                {/* Priority Flag (only if not NONE) */}
                {task.priority !== 'NONE' && (
                    <Flag className={`w-3.5 h-3.5 ${getPriorityColor()}`} />
                )}
            </div>
        </div>
    );
}
