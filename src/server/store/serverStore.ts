import { PlayerType, ServerState } from "../../types";
import { WebSocket } from 'ws';

class ServerStore {
    private state: ServerState = {
        players: [],
    };

    public getPlayers(): PlayerType[] {
        return this.state.players;
    }

    public addPlayer(player: Omit<PlayerType, 'id' | 'role' | 'ws'>, ws: WebSocket): PlayerType {
        const newPlayer: PlayerType = {
            ...player,
            id: this.state.players.length > 0 ? Math.max(...this.state.players.map(p => p.id)) + 1 : 1,
            role: this.state.players.length === 0 ? 'host' : 'player',
            ws: ws,
        };
        this.state.players.push(newPlayer);
        return newPlayer;
    };

    public removePlayer(uid: string): void {
        this.state.players = this.state.players.filter(player => player.uid !== uid);
    };

    public getPlayerByUid(uid: string): PlayerType | undefined {
        return this.state.players.find(player => player.uid === uid);
    };

    public getPlayerById(id: number): PlayerType | undefined {
        return this.state.players.find(player => player.id === id);
    };

    public setHost(id: number): boolean {
        const newHost = this.getPlayerById(id);
        if (newHost) {
            this.state.players.forEach(player => {
                player.role = (player.id === id) ? 'host' : 'player';
            });
            return true;
        }
        return false;
    };

    public updatePlayerWs(uid: string, newWs: WebSocket): void {
        const player = this.getPlayerByUid(uid);
        if (player) {
            player.ws = newWs;
        }
    };

    public getHost(): PlayerType | undefined {
        return this.state.players.find(player => player.role === 'host');
    };

    public updatePlayerImage(uid: string, imageUrl: string): void {
        const player = this.getPlayerByUid(uid);
        if (player) {
            player.image = imageUrl;
        }
    };

    public removePlayerByWs(ws: WebSocket): void {
        this.state.players = this.state.players.filter(player => player.ws !== ws);
    };
}

export const serverStore = new ServerStore();
