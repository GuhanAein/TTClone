import { useState } from 'react';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay } from 'date-fns';
import { Check, Plus, Flame, Trophy, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { habitAPI } from '../services/api';
import type { Habit } from '../types';
import ConfirmationModal from './ConfirmationModal';

export default function HabitTracker() {
    const [isCreating, setIsCreating] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [habitToDelete, setHabitToDelete] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: habits = [] } = useQuery({
        queryKey: ['habits'],
        queryFn: async () => {
            const response = await habitAPI.getAll();
            return response.data as Habit[];
        },
    });

    const createHabitMutation = useMutation({
        mutationFn: (name: string) => habitAPI.create({ name, color: 'bg-blue-500', icon: 'check' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            setIsCreating(false);
            setNewHabitName('');
        },
    });

    const toggleHabitMutation = useMutation({
        mutationFn: ({ id, date }: { id: number; date: string }) => habitAPI.toggle(id, date),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
        },
    });

    const deleteHabitMutation = useMutation({
        mutationFn: (id: number) => habitAPI.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            setHabitToDelete(null);
        },
    });

    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            createHabitMutation.mutate(newHabitName);
        }
    };

    const calculateStreak = (habit: Habit) => {
        // Simple streak calculation logic (placeholder)
        // In a real app, this would be calculated on the backend or with more complex logic
        return habit.completedDates.length;
    };

    return (
        <div className="h-full p-8 bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Habits</h2>
                        <p className="text-gray-500 dark:text-gray-400">Build better routines, one day at a time.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        <span>New Habit</span>
                    </button>
                </div>

                {/* Create Habit Form */}
                {isCreating && (
                    <div className="mb-8 card p-4">
                        <form onSubmit={handleCreate} className="flex gap-4">
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                placeholder="Enter habit name..."
                                className="input flex-1"
                                autoFocus
                            />
                            <button type="submit" className="btn btn-primary">Create</button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-none">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Flame className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Total Streaks</p>
                            <p className="text-3xl font-bold">
                                {habits.reduce((acc, h) => acc + calculateStreak(h), 0)}
                            </p>
                        </div>
                    </div>
                    <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-none">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Check className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Completed</p>
                            <p className="text-3xl font-bold">148</p>
                        </div>
                    </div>
                    <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white border-none">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Trophy className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Perfect Days</p>
                            <p className="text-3xl font-bold">8</p>
                        </div>
                    </div>
                </div>

                {/* Habits Grid */}
                <div className="card overflow-hidden">
                    <div className="grid grid-cols-[250px_1fr] border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-4 font-semibold text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                            Habit Name
                        </div>
                        <div className="grid grid-cols-7">
                            {weekDays.map(day => (
                                <div key={day.toString()} className="p-4 text-center">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                                        {format(day, 'EEE')}
                                    </p>
                                    <p className={`text-sm font-bold ${isSameDay(day, today) ? 'text-primary-600' : 'text-gray-900 dark:text-white'}`}>
                                        {format(day, 'd')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {habits.map(habit => (
                            <div key={habit.id} className="grid grid-cols-[250px_1fr] group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="p-4 flex items-center justify-between border-r border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                                        <span className="font-medium text-gray-900 dark:text-gray-200">{habit.name}</span>
                                    </div>
                                    <button
                                        onClick={() => setHabitToDelete(habit.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-7">
                                    {weekDays.map(day => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const isCompleted = habit.completedDates.includes(dateStr);
                                        const isFuture = day > today;

                                        return (
                                            <div key={day.toString()} className="p-3 flex items-center justify-center border-l border-gray-100 dark:border-gray-800 first:border-l-0">
                                                <button
                                                    disabled={isFuture}
                                                    onClick={() => toggleHabitMutation.mutate({ id: habit.id, date: dateStr })}
                                                    className={`
                                                        w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                                                        ${isCompleted
                                                            ? `${habit.color} text-white shadow-lg shadow-${habit.color.replace('bg-', '')}/30 scale-100`
                                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 scale-90'
                                                        }
                                                        ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                                    `}
                                                >
                                                    <Check className={`w-6 h-6 transition-transform duration-300 ${isCompleted ? 'scale-100' : 'scale-0'}`} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!habitToDelete}
                onClose={() => setHabitToDelete(null)}
                onConfirm={() => habitToDelete && deleteHabitMutation.mutate(habitToDelete)}
                title="Delete Habit"
                message="Are you sure you want to delete this habit? This action cannot be undone."
                confirmText="Delete"
                isDanger
            />
        </div>
    );
}
