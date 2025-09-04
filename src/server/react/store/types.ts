import {PlayerType, signStatusType, WSType} from "../../../types";

interface WSServerType extends WSType {
    send: {
        message(key: string, value: any): void;
        players(): void;
        signStatus(uid: string, data: signStatusType): void;
    };
}

export interface ServerStoreTypes {
    ip: string;
    players: PlayerType[];
    ws: WSServerType;
    setIp(ip: string): void;
    addPlayer(player: PlayerType): void;
    removePlayer(uid: string): void;
}
