import { Texture } from 'pixi.js';
import playerDead1 from './player-dead-1.png';
import playerDead2 from './player-dead-2.png';
import playerDead3 from './player-dead-3.png';
import playerDead4 from './player-dead-4.png';
import playerIdle1 from './player-idle-1.png';
import playerIdle2 from './player-idle-2.png';
import playerIdle3 from './player-idle-3.png';
import playerIdle4 from './player-idle-4.png';
import playerMage from './man-mage.png'
import playerRhino from './rhino.png'
import playerVampire from './man-vampire.png'

// Dead
const playerDeadImages: string[] = [playerDead1, playerDead2, playerDead3, playerDead4];
const playerDeadTextures: Texture[] = [];
for (let i = 0; i < playerDeadImages.length; i++) {
    playerDeadTextures.push(Texture.from(playerDeadImages[i]));
}

// Idle
const playerIdleImages: string[] = [playerIdle1, playerIdle2, playerIdle3, playerIdle4];
const playerIdleTextures: Texture[] = [];
for (let i = 0; i < playerIdleImages.length; i++) {
    playerIdleTextures.push(Texture.from(playerIdleImages[i]));
}

const playerMageTextures: Texture[] = []
playerMageTextures.push(Texture.from(playerMage))

const playerRhinoTextures: Texture[] = []
playerRhinoTextures.push(Texture.from(playerRhino))

const playerVampireTextures: Texture[] = []
playerVampireTextures.push(Texture.from(playerVampire))

export { playerDeadTextures, playerIdleTextures, playerMageTextures, playerRhinoTextures, playerVampireTextures };
