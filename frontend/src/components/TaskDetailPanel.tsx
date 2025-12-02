import { X, Calendar, Flag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taskAPI } from '../services/api';
import type { Task, TaskRequest } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface TaskDetailPanelProps {
    task: Task;
    onClose: () => void;
    onUpdate: () => void;
}

export default function TaskDetailPanel({ task, onClose, onUpdate }: TaskDetailPanelProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [notes, setNotes] = useState(task.notes || '');
    const [priority, setPriority] = useState(task.priority);
    const [dueDate, setDueDate] = useState(
        task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const queryClient = useQueryClient();

    const updateTaskMutation = useMutation({
        mutationFn: (data: TaskRequest) => taskAPI.update(task.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onUpdate();
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: () => taskAPI.delete(task.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onUpdate();
            onClose(); // Close the panel after deletion
        },
    });

    const handleSave = () => {
        const taskData: TaskRequest = {
            title,
            description,
            notes,
            priority,
            status: task.status,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
            taskListId: task.taskListId,
        };

        updateTaskMutation.mutate(taskData);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteTaskMutation.mutate();
    };

    return (
        <>
            <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Task Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                            placeholder="Task title"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="input min-h-[100px]"
                            placeholder="Add description..."
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Due Date
                        </label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input"
                        />
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Flag className="w-4 h-4 inline mr-2" />
                            Priority
                        </label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                            className="input"
                        >
                            <option value="NONE">None</option>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="input min-h-[150px]"
                            placeholder="Add notes..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <button
                        onClick={handleSave}
                        disabled={updateTaskMutation.isPending}
                        className="btn btn-primary w-full"
                    >
                        {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleteTaskMutation.isPending}
                        className="btn btn-secondary w-full text-red-600 dark:text-red-400"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete Task'}
                    </button>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                confirmText="Delete"
                isDanger
            />
        </>
    );
}
