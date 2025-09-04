export type SubscriberCallback<T = any> = (data: T) => void;

export type WSType = {
    socket: WebSocket | null;
    connected: boolean;
    messages: any[];
    _subscribers: Record<string, SubscriberCallback[]>;
    connect(url?: string): void;
    subscribe(key: string, callback: SubscriberCallback): () => void;
    disconnect(): void;
}

export type PlayerType = {
    id: number;
    name: string;
    image: string;
    uid: string;
};

export type signStatusType = {
    status: 'success' | 'error';
    player: PlayerType;
    error?: string;
};
