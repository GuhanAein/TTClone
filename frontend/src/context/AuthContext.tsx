import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import { wsService } from '../services/websocket';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('accessToken');
        if (token) {
            authAPI
                .getCurrentUser()
                .then((response) => {
                    setUser(response.data);
                    // Connect WebSocket
                    wsService.connect(response.data.id.toString(), handleTaskUpdate);
                })
                .catch(() => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }

        return () => {
            wsService.disconnect();
        };
    }, []);

    const handleTaskUpdate = (message: any) => {
        console.log('Task update received:', message);
        // Handle real-time task updates
        // You can dispatch events or update state here
    };

    const login = async (email: string, password: string) => {
        const response = await authAPI.login({ email, password });
        const data: AuthResponse = response.data;

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);

        // Connect WebSocket
        wsService.connect(data.user.id.toString(), handleTaskUpdate);
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await authAPI.register({ name, email, password });
        const data: AuthResponse = response.data;

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);

        // Connect WebSocket
        wsService.connect(data.user.id.toString(), handleTaskUpdate);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        wsService.disconnect();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
