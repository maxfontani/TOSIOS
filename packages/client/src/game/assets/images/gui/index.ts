import { Texture } from 'pixi.js';
import heartEmpty from './heart-empty.png';
import heartFull from './heart-full.png';
import abilityBar from './ability-bar.png'

const crosshairIco = require('./crosshair.ico');

const heartEmptyTexture = Texture.from(heartEmpty);
const heartFullTexture = Texture.from(heartFull);
const abilityBarTexture = Texture.from(abilityBar)

export { crosshairIco, heartEmptyTexture, heartFullTexture, abilityBarTexture};
