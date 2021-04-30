export const APP_TITLE = 'MOJI WARZ';

// General
export const WS_PORT = 3001;
export const ROOM_NAME = 'game'; // Colyseus Room<T>'s name (no need to change)
export const ROOM_REFRESH = 3000;
export const PLAYERS_REFRESH = 1000;
export const DEBUG = false;

// Game

// The playersScale must be in an accending order
export const MAPS = [
    {
        name: 'neon',
        playersScale: [2, 3, 4],
        maxPlayers: 4
    },
    {        
        name: 'xxl',
        playersScale: [4, 6, 12],
        maxPlayers: 12
    }
];
export const ROOM_PLAYERS_MIN = 2;
export const ROOM_PLAYERS_MAX = 16;
// export const ROOM_PLAYERS_SCALES_4 = [2, 3, 4];
// export const ROOM_PLAYERS_SCALES_16 = [4, 8, 12, 16];
export const ROOM_NAME_MAX = 16;
export const PLAYER_NAME_MAX = 16;
export const LOG_LINES_MAX = 5;
export const LOBBY_DURATION = 1000 * 1; // 1 second
export const GAME_DURATION = 1000 * 90000; // 90 seconds

// Background
export const BACKGROUND_COLOR =  '#270221';

// Tile (rectangle)
export const TILE_SIZE = 32;

// Player (circle)
export const PLAYER_SIZE = 32;
export const PLAYER_SPEED = 32;
export const PLAYER_MAX_LIVES = 3;
export const PLAYER_WEAPON_SIZE = 12; // The bigger, the further away a bullet will be shot from.
export const PLAYER_HEARING_DISTANCE = 256;

// Monster
export const MONSTERS_COUNT = 3;
export const MONSTER_SIZE = 32;
export const MONSTER_SPEED_PATROL = 0.75;
export const MONSTER_SPEED_CHASE = 1.25;
export const MONSTER_SIGHT = 192;
export const MONSTER_LIVES = 3;
export const MONSTER_IDLE_DURATION_MIN = 1000;
export const MONSTER_IDLE_DURATION_MAX = 3000;
export const MONSTER_PATROL_DURATION_MIN = 1000;
export const MONSTER_PATROL_DURATION_MAX = 3000;
export const MONSTER_ATTACK_BACKOFF = 3000;

// Props (rectangle)
export const FLASKS_COUNT = 3;
export const FLASK_SIZE = 24;

// Bullet (circle)
export const BULLET_SIZE = 8;
export const BULLET_SPEED = 8;
export const BULLET_RATE = 2000; // The bigger, the slower. Default 2000.
export const INVIS_RATE = 7000; // Invisibility ability rate. The bigger, the rarer. Default 3000.
export const INVIS_DURATION = 6000; // Invisibility duration. The bigger, the longer. 
export const CHARGE_RATE = 7000; // Charging ability rate. The bigger, the rarer. Default 3000.
export const CHARGE_DURATION = 3000;
export const MOVE_RATE = 500; // The bigger, the slower. 1000 = 1 move/second.
export const CHARGE_MOVE_RATE = 250;
