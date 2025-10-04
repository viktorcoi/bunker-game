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
    role: 'player' | 'host';
    ws: any; // Using any for now, will replace with WebSocket from 'ws' in server main.ts
};

export type Avatar = {
    url: string;
    // Potentially add more avatar-related fields here like 'thumbnailUrl' if needed
};

export type ServerState = {
    players: PlayerType[];
    // Add other server-side state here as needed
};

export type signStatusType = {
    status: 'success' | 'error';
    player: PlayerType;
    error?: string;
};

export type CardCategory =
    | "baggage"
    | "hobby"
    | "health"
    | "biology"
    | "fact"
    | "profession"
    | "bunker"
    | "any"; // любая категория на выбор

export type CardTarget =
    | "self" // сам игрок
    | "opponent" // тот, кто голосовал против
    | "any-player" // любой игрок
    | "all-players" // все игроки
    | "all-opponents" // все, кто голосовал против
    | "deck" // из колоды
    | "bunker"; // карты бункера

export type CardEffect =
    | "give-card"
    | "take-card"
    | "discard-card"
    | "swap-cards"
    | "reveal-cards"
    | "draw-cards"
    | "modify-player"
    | "modify-vote"
    | "repeat-effect"
    | "replace-card"
    | "reveal-chosen-category"
    | "make-pregnant"
    | "make-fertile"
    | "modify-player-age"
    | "make-infertile"
    | "modify-player-vote-restriction"
    | "modify-player-vote-immunity"
    | "initiate-revote"
    | "restrict-communication"
    | "modify-target-vote"
    | "negate-opponent-vote";

export type CardWhen =
    | "anytime"
    | "before-vote"
    | "after-vote"
    | "before-vote-after-round"
    | "on-turn";

export interface SpecialConditionCard {
    id: string; // уникальный ID
    name: string; // название карты
    description: string; // текстовое описание (игровое)
    when: CardWhen; // когда можно играть
    effect: CardEffect; // что делает карта
    from?: CardTarget; // откуда забираем
    to?: CardTarget; // кому даём
    category?: CardCategory; // категория карты
    selection?: "forced" | "chosen"; // выбор или обязаловка
    amount?: number; // кол-во карт (если нужно)
    targetVoteMultiplier?: number; // множитель голосов против цели (если нужно)
}
