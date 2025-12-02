import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
    private client: Client | null = null;
    private connected = false;

    connect(_userId: string, onTaskUpdate: (message: any) => void) {
        if (this.connected) {
            return;
        }

        this.client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
            console.log('WebSocket connected');
            this.connected = true;

            // Subscribe to user-specific task updates
            this.client?.subscribe(`/user/queue/tasks`, (message) => {
                const data = JSON.parse(message.body);
                onTaskUpdate(data);
            });
        };

        this.client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
        };

        this.client.onWebSocketClose = () => {
            console.log('WebSocket disconnected');
            this.connected = false;
        };

        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.connected = false;
        }
    }

    isConnected() {
        return this.connected;
    }
}

export const wsService = new WebSocketService();
