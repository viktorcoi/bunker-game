import {PlayerType, WSType} from "../../types";

interface WSClientType extends WSType {
    send: {
        message(key: string, value: any): void;
        singIn(player: Partial<PlayerType>): void;
    };
}

export interface ClientStoreTypes {
    player: Partial<PlayerType>;
    players: PlayerType[];
    ws: WSClientType;
    updatePlayer(player: PlayerType): void;
    updatePlayers(players: PlayerType[]): void;
}
