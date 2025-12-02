import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/Sidebar';
import TaskListView from '../components/TaskListView';
import TaskDetailPanel from '../components/TaskDetailPanel';
import CalendarView from '../components/CalendarView';
import MatrixView from '../components/MatrixView';
import HabitTracker from '../components/HabitTracker';
import FocusMode from '../components/FocusMode';
import { taskAPI, taskListAPI } from '../services/api';
import type { Task } from '../types';

export default function Dashboard() {
    const [selectedView, setSelectedView] = useState<'today' | 'next7days' | 'overdue' | 'all' | 'calendar' | 'matrix' | 'habits' | 'focus' | number>('today');
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    // Fetch tasks based on selected view
    const { data: tasks = [], isLoading, refetch } = useQuery({
        queryKey: ['tasks', selectedView],
        queryFn: async () => {
            if (selectedView === 'today') {
                const response = await taskAPI.getToday();
                return response.data;
            } else if (selectedView === 'overdue') {
                const response = await taskAPI.getOverdue();
                return response.data;
            } else if (selectedView === 'all' || selectedView === 'calendar' || selectedView === 'matrix' || selectedView === 'next7days') {
                const response = await taskAPI.getAll();
                // If next7days, we will filter in the component or here. Let's filter here for cleaner data passing.
                if (selectedView === 'next7days') {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const next7 = new Date(today);
                    next7.setDate(today.getDate() + 7);

                    return response.data.filter((task: Task) => {
                        if (!task.dueDate) return false;
                        const d = new Date(task.dueDate);
                        return d >= today && d <= next7;
                    });
                }
                return response.data;
            } else if (typeof selectedView === 'number') {
                const response = await taskAPI.getByList(selectedView);
                return response.data;
            }
            return [];
        },
        enabled: selectedView !== 'habits' && selectedView !== 'focus',
    });

    // Fetch task lists
    const { data: taskLists = [] } = useQuery({
        queryKey: ['taskLists'],
        queryFn: async () => {
            const response = await taskListAPI.getAll();
            return response.data;
        },
    });

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setShowDetailPanel(true);
    };

    const handleTaskUpdate = () => {
        refetch();
        setShowDetailPanel(false);
        setSelectedTask(null);
    };

    const renderMainContent = () => {
        switch (selectedView) {
            case 'calendar':
                return <CalendarView tasks={tasks} onTaskClick={handleTaskClick} />;
            case 'matrix':
                return <MatrixView tasks={tasks} onTaskClick={handleTaskClick} />;
            case 'habits':
                return <HabitTracker />;
            case 'focus':
                return <FocusMode />;
            default:
                return (
                    <TaskListView
                        tasks={tasks}
                        isLoading={isLoading}
                        selectedView={selectedView}
                        onTaskClick={handleTaskClick}
                        onRefresh={refetch}
                    />
                );
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <Sidebar
                selectedView={selectedView}
                onViewChange={setSelectedView}
                taskLists={taskLists}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden relative bg-white dark:bg-gray-900">
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {renderMainContent()}
                </div>

                {/* Task Detail Panel */}
                {showDetailPanel && selectedTask && (
                    <div className="absolute inset-y-0 right-0 w-[400px] bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-gray-200 dark:border-gray-700">
                        <TaskDetailPanel
                            task={selectedTask}
                            onClose={() => {
                                setShowDetailPanel(false);
                                setSelectedTask(null);
                            }}
                            onUpdate={handleTaskUpdate}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
