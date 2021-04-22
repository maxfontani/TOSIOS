export type GameState = 'waiting' | 'lobby' | 'game';
export type GameMode = 'deathmatch' | 'team deathmatch';
export type Teams = 'Red' | 'Blue';
export type WallCollisionType = 'full' | 'none';
export type PlayerAbility = 'shoot' | 'invisibility' | 'charge'
export type PlayerDirection = 'up' | 'down' | 'left' | 'right';
export type IconColor = 'red' | 'blue' | 'green' | 'yellow';


/**
 * Represent the initial parameters of a Map
 */

export interface IMapItem {
    name: string;
    playersScale: number[];
    maxPlayers: number;
}

/**
 * Represent the initial parameters of a Player
 */
export interface IPlayerOptions {
    playerName?: string;
    playerEmoji: string;
    playerAbility: PlayerAbility;
}

/**
 * Represent the initial parameters of a Room
 */
export interface IRoomOptions {
    playerName?: string;
    playerEmoji: string;
    playerAbility: PlayerAbility;
    roomName: string;
    roomMapName: string;
    roomMaxPlayers: number;
    mode: GameMode;
}