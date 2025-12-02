import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, ChevronRight } from 'lucide-react';

export default function FocusMode() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
    const [progress, setProgress] = useState(100);

    const totalTimeRef = useRef(25 * 60);

    useEffect(() => {
        let interval: any;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    const newTime = prev - 1;
                    setProgress((newTime / totalTimeRef.current) * 100);
                    return newTime;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound or notification here
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(totalTimeRef.current);
        setProgress(100);
    };

    const changeMode = (newMode: 'focus' | 'short-break' | 'long-break') => {
        setMode(newMode);
        setIsActive(false);
        let time = 25 * 60;
        if (newMode === 'short-break') time = 5 * 60;
        if (newMode === 'long-break') time = 15 * 60;

        totalTimeRef.current = time;
        setTimeLeft(time);
        setProgress(100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-md w-full">
                {/* Mode Selector */}
                <div className="flex justify-center mb-12 bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => changeMode('focus')}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'focus'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        Focus
                    </button>
                    <button
                        onClick={() => changeMode('short-break')}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'short-break'
                            ? 'bg-teal-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        Short Break
                    </button>
                    <button
                        onClick={() => changeMode('long-break')}
                        className={`px-6 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'long-break'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                    >
                        Long Break
                    </button>
                </div>

                {/* Timer Circle */}
                <div className="relative w-80 h-80 mx-auto mb-12">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="160"
                            cy="160"
                            r="150"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-gray-200 dark:text-gray-800"
                        />
                        <circle
                            cx="160"
                            cy="160"
                            r="150"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 150}
                            strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
                            className={`transition-all duration-1000 ease-linear ${mode === 'focus' ? 'text-primary-500' :
                                mode === 'short-break' ? 'text-teal-500' : 'text-indigo-500'
                                }`}
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={`mb-4 p-3 rounded-full bg-opacity-10 ${mode === 'focus' ? 'bg-primary-500 text-primary-600' :
                            mode === 'short-break' ? 'bg-teal-500 text-teal-600' : 'bg-indigo-500 text-indigo-600'
                            }`}>
                            {mode === 'focus' ? <Brain className="w-8 h-8" /> : <Coffee className="w-8 h-8" />}
                        </div>
                        <div className="text-7xl font-bold text-gray-900 dark:text-white font-mono tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium uppercase tracking-widest text-sm">
                            {isActive ? 'Running' : 'Paused'}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className={`p-6 rounded-3xl text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all ${mode === 'focus' ? 'bg-primary-600 shadow-primary-600/30' :
                            mode === 'short-break' ? 'bg-teal-600 shadow-teal-600/30' : 'bg-indigo-600 shadow-indigo-600/30'
                            }`}
                    >
                        {isActive ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                    </button>

                    <button className="p-4 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
}
