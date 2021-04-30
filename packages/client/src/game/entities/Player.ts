import { Constants, Maths, Models, Types } from '@tosios/common';
import { Container, Graphics, Sprite, Texture, utils } from 'pixi.js';
import { Effects, PlayerLivesSprite, TextSprite } from '../sprites';
import { PlayerTextures, WeaponTextures } from '../assets/images';
import { SmokeConfig, SmokeTexture } from '../assets/particles';
import { BaseEntity } from '.';
import { Emitter } from 'pixi-particles';
import { PlayerAbility } from '@tosios/common/src/types';
import { CHARGE_DURATION } from '@tosios/common/src/constants';

const NAME_OFFSET = 4;
const LIVES_OFFSET = 6;
const HURT_COLOR = 0xff0000;
const HEAL_COLOR = 0x00ff00;
const CHARGE_COLOR = 0x990000;
const BULLET_DELAY_FACTOR = 1.1; // Add 10% to delay as server may lag behind sometimes (rarely)
const SMOKE_DELAY = 3000;
const DEAD_ALPHA = 0.2;
const ZINDEXES = {
    SHADOW: 0,
    WEAPON_BACK: 1,
    PLAYER: 2,
    WEAPON_FRONT: 3,
    INFOS: 4,
};

export class Player extends BaseEntity {
    private _playerId: string = '';

    private _name: string = '';

    private _emoji: string = '';

    private _ability: PlayerAbility = '';

    private _abilityIsActive: boolean = false;

    private _lives: number = 0;

    private _maxLives: number = 0;

    public team?: Types.Teams;

    private _color: string = '#FFFFFF';

    private _kills: number = 0;

    private _rotation: number = 0;

    // Computed
    private _isGhost: boolean = false;

    private _direction: Types.PlayerDirection = 'right';

    private _lastShootAt: number = 0;

    private _lastMoveAt: number = 0;

    private _toX: number = 0;

    private _toY: number = 0;

    private _arrowSprite: Sprite;

    private _nameTextSprite: TextSprite;

    private _emojiTextSprite: TextSprite;

    private _livesSprite: PlayerLivesSprite;

    // private _abilitySprite: AbilitySprite;

    public ack?: number;

    private _shadow: Graphics;

    private _particlesContainer?: Container;

    private _lastSmokeAt: number = 0;

    // Init
    constructor(player: Models.PlayerJSON, isGhost: boolean, particlesContainer?: Container) {
        super({
            x: player.x,
            y: player.y,
            radius: player.radius,
            textures: getTexture(player.lives),
            zIndex: ZINDEXES.PLAYER,
        });

        // Will be used for the dead texture
        this.sprite.visible = false;

        // Arrow
        this._arrowSprite = new Sprite(WeaponTextures.arrow);
        this._arrowSprite.scale.x = 0.3;
        this._arrowSprite.scale.y = 0.3;
        this._arrowSprite.anchor.set(0, 0.5);
        this._arrowSprite.position.set(player.radius, player.radius);
        this._arrowSprite.zIndex = ZINDEXES.PLAYER;
        this._arrowSprite.alpha = 0;
        this.container.addChild(this._arrowSprite);

        // Name
        this._nameTextSprite = new TextSprite(player.name, 8, 0.5, 1);
        this._nameTextSprite.position.set(player.radius, NAME_OFFSET);
        this._nameTextSprite.zIndex = ZINDEXES.INFOS;
        this.container.addChild(this._nameTextSprite);

        // Emoji
        this._emojiTextSprite = new TextSprite(player.emoji, 24, 0, 0);
        this._emojiTextSprite.position.set(2, 4);
        this._emojiTextSprite.zIndex = ZINDEXES.PLAYER;
        this.container.addChild(this._emojiTextSprite);

        // Lives
        this._livesSprite = new PlayerLivesSprite(0.5, 1, 8, player.maxLives, player.lives);
        this._livesSprite.position.set(
            player.radius,
            this._nameTextSprite.y - this._nameTextSprite.height - LIVES_OFFSET,
        );
        this._livesSprite.anchorX = 0.5;
        this._livesSprite.zIndex = ZINDEXES.INFOS;
        this.container.addChild(this._livesSprite);

        // Ability
        // this._abilitySprite = new AbilitySprite(0.5, 1, 25, 8, 0, {single: abilityBarTexture})
        // this._abilitySprite.position.set(player.radius, NAME_OFFSET);
        // this._abilitySprite.anchorX = 0.5;
        // this._abilitySprite.alpha = 0;
        // this._abilitySprite.zIndex = ZINDEXES.INFOS;
        // this.container.addChild(this._abilitySprite);

        // Shadow
        this._shadow = new Graphics();
        this._shadow.zIndex = ZINDEXES.SHADOW;
        this._shadow.pivot.set(0.5);
        this._shadow.beginFill(0x000000, 0.3);
        this._shadow.drawEllipse(player.radius * 0.9, player.radius * 1.85, player.radius * 0.65, player.radius * 0.25);
        this._shadow.endFill();
        this.container.addChild(this._shadow);

        // Sort rendering order
        this.container.sortChildren();

        // Reference to the particles container
        this._particlesContainer = particlesContainer;

        // Player
        this.playerId = player.playerId;
        this.toX = player.x;
        this.toY = player.y;
        this.rotation = player.rotation;
        this.name = player.name;
        this.emoji = player.emoji;
        this.ability = player.ability;
        this.color = player.color;
        this.lives = player.lives;
        this.maxLives = player.maxLives;
        this.kills = player.kills;
        this.team = player.team;
        this.isGhost = isGhost;

        // Ghost
        if (isGhost) {
            this.visible = Constants.DEBUG;
        }
    }

    // Methods
    move(dirX: number, dirY: number, speed: number) {
        const magnitude = Maths.normalize2D(dirX, dirY);
        const speedX = Math.round(Maths.round2Digits(dirX * (speed / magnitude)));
        const speedY = Math.round(Maths.round2Digits(dirY * (speed / magnitude)));

        this.x += speedX;
        this.y += speedY;

        let dir: Types.PlayerDirection

        if (dirX) {
            dirX > 0 ? dir = 'right' : dir = 'left'
        } else {
            dirY > 0 ? dir = 'down' : dir = 'up'
        }

        this.spawnSmoke(dir)
    }

    hurt() {
        Effects.flash(this._emojiTextSprite, HURT_COLOR, utils.string2hex(this.color));
    }

    heal() {
        Effects.flash(this._emojiTextSprite, HEAL_COLOR, utils.string2hex(this.color));
    }

    // chargeTint() {
    //     this.emojiTint = CHARGE_COLOR
    //     setTimeout(() => 
    //         this.emojiTint(utils.string2hex(this.color)), CHARGE_DURATION)
    // }

    hide(duration?: number) {
        Effects.hide(this._emojiTextSprite, duration = Constants.INVIS_DURATION);
    }

    updateTextures() {
        const isAlive = this.lives > 0;
        const isInvisible = this.abilityIsActive && this.ability === 'invisibility'
        const isCharging = this.abilityIsActive && this.ability === 'charge'

        // Sprites' alpha levels
        let currentAlpha = 1;
        this.sprite.textures = PlayerTextures.playerDeadTextures;
        this.sprite.anchor.set(0.5);
        this.sprite.width = this.body.width * 0.75;
        this.sprite.height = this.body.height * 0.75;

        if (!isAlive) {
            this.sprite.visible = true;
            this.sprite.alpha = DEAD_ALPHA;
            this.sprite.play();
            currentAlpha = 0;
        } else {
            this.sprite.stop()
            this.sprite.visible = false;
            currentAlpha = 1;
        }

        if (isAlive && isInvisible) currentAlpha = 0;
        this.emojiTint = isAlive && isCharging ? CHARGE_COLOR : utils.string2hex(this.color);

        this.nameAlpha = currentAlpha;
        this.emojiAlpha = currentAlpha;
        this.livesAlpha = currentAlpha;
    }

    toggleAbilityIsActive(duration: number) {
        this.abilityIsActive = true;
        setTimeout(() => {
            this.abilityIsActive = false;
        }, duration);
    }

    canShoot(): any {
        if (!this.isAlive) {
            return false;
        }
        const now: number = Date.now();
        switch(this._ability) {
            case 'shoot':
                if (now - this.lastShootAt < Constants.BULLET_RATE * BULLET_DELAY_FACTOR) {
                    return false;
                }
                this.lastShootAt = now; 
                return 'shoot';
            case 'invisibility':
                if (now - this.lastShootAt < Constants.INVIS_RATE * BULLET_DELAY_FACTOR) {
                    return false;
                }
                this.lastShootAt = now; 
                return 'invisibility';
            case 'charge':
                if (now - this.lastShootAt < Constants.CHARGE_RATE * BULLET_DELAY_FACTOR) {
                    return false;
                }
                this.lastShootAt = now; 
                return 'charge';  
            default:
                return false;
            }
    }

    canMove(): boolean {
        const now: number = Date.now();
        let moveRate: number = Constants.MOVE_RATE
        if (this.ability === 'charge' && this.abilityIsActive) {
            moveRate = Constants.CHARGE_MOVE_RATE;
        }
        if (now - this.lastMoveAt < moveRate) {
            return false;
        }

        this.lastMoveAt = now;
        return true;
    }

    canBulletHurt(otherPlayerId: string, team?: string): boolean {
        if (!this.isAlive || this.isGhost || this.playerId === otherPlayerId) {
            return false;
        }

        // if (!!team && team === this.team) {
        //     return false;
        // }

        // Bullets can't hurt invisible players
        const delta = Date.now() - this.lastShootAt
        if (this.ability === 'invisibility' && delta < Constants.INVIS_DURATION) {
            return false;
        }

        return true;
    }

    spawnSmoke(dir: Types.PlayerDirection) {
        if (!this._particlesContainer) {
            return;
        }

        if (!this.isAlive) {
            return;
        }

        const timeSinceLastSmoke = Date.now() - this._lastSmokeAt;
        if (timeSinceLastSmoke < SMOKE_DELAY) {
            return;
        }

        let smokePosition = {
            x: this.body.x,
            y: this.body.y,
        }

        switch (dir) {
            case 'up':
                smokePosition.x = this.body.x;
                smokePosition.y = this.body.y + this.body.radius / 2;
                SmokeConfig.startRotation.min = 90; 
                SmokeConfig.startRotation.max = 90;
                break;
            case 'down':
                smokePosition.x = this.body.x;
                smokePosition.y = this.body.y - this.body.radius / 2;
                SmokeConfig.startRotation.min = -90; 
                SmokeConfig.startRotation.max = -90;
                break;
            case 'right':
                smokePosition.x = this.body.x - this.body.radius / 2;
                smokePosition.y = this.body.y;
                SmokeConfig.startRotation.min = 180; 
                SmokeConfig.startRotation.max = 180;
                break;
            case 'left':
                smokePosition.x = this.body.x + this.body.radius / 2;
                smokePosition.y = this.body.y;
                SmokeConfig.startRotation.min = 0; 
                SmokeConfig.startRotation.max = 0;
                break;   
            default:
                break;
        }

        new Emitter(this._particlesContainer, [SmokeTexture], {
            ...SmokeConfig,
            pos: smokePosition,
        }).playOnceAndDestroy();

        this._lastSmokeAt = Date.now();
    }

    // Setters
    set x(x: number) {
        this.container.x = x;
        this.body.x = x;
    }

    set y(y: number) {
        this.container.y = y;
        this.body.y = y;
    }

    set toX(toX: number) {
        this._toX = toX;
    }

    set toY(toY: number) {
        this._toY = toY;
    }

    set playerId(playerId: string) {
        this._playerId = playerId;
    }

    set name(name: string) {
        this._name = name;
        this._nameTextSprite.text = name;
    }

    set emoji(emoji: string) {
        this._emoji = emoji;
        this._emojiTextSprite.text = emoji;
    }

    set nameAlpha(alpha: number) {
        this._nameTextSprite.alpha = alpha;
    }

    set emojiAlpha(alpha: number) {
        this._emojiTextSprite.alpha = alpha;
        this._shadow.alpha = alpha;
    }

    set emojiTint(tintColor: number) {
        this._emojiTextSprite.tint = tintColor;
    }

    set arrowAlpha(alpha: number) {
        this._arrowSprite.alpha = alpha;
    }

    set livesAlpha(alpha: number) {
        this._livesSprite.alpha = alpha;
    }

    // set abilityAlpha(alpha: number) {
    //     this._abilitySprite.alpha = alpha;
    // }

    set ability(ability: PlayerAbility) {
        this._ability = ability;
    }

    set abilityIsActive(value: boolean) {
        this._abilityIsActive = value;
        this.updateTextures();
    }

    set lives(lives: number) {
        if (this._lives === lives) {
            return;
        }

        if (lives > this._lives) {
            this.heal();
        }

        this._lives = lives;
        this._livesSprite.lives = this._lives;
        this.updateTextures();
    }

    set maxLives(maxLives: number) {
        if (this._maxLives === maxLives) {
            return;
        }

        this._maxLives = maxLives;
        this._livesSprite.maxLives = this._maxLives;
        this.updateTextures();
    }

    set color(color: string) {
        if (this._color === color) {
            return;
        }

        this._color = color;

        // FIXME: Tints seem not to be apliable directly on a AnimatedSprite.
        // Therefore, adding a delay fixes the problem for now.
        setTimeout(() => {
            this.sprite.tint = utils.string2hex(color);
            this._arrowSprite.tint = utils.string2hex(color);
        }, 300);
    }

    set kills(kills: number) {
        if (this._kills === kills) {
            return;
        }

        this._kills = kills;
    }

    set rotation(rotation: number) {
        this._direction = getDirection(rotation);

        switch (this._direction) {
            case 'up':
                this._arrowSprite.angle = 0;
                this._arrowSprite.position.set(8,1)
                this._rotation = - (Math.PI / 2)
                break;      
            case 'left':
                this._arrowSprite.angle = -90;
                this._arrowSprite.position.set(0,24)
                this._rotation = Math.PI
                break;
            case 'right':
                this._arrowSprite.angle = 90;
                this._arrowSprite.position.set(32,10)
                this._rotation = 0
                break;
            case 'down':
                this._arrowSprite.angle = 180;
                this._arrowSprite.position.set(22,32)
                this._rotation = Math.PI / 2
                break;
            default:
                break;
        }

        // For smooth rotation remove the this._rotation assignment in the switch above and uncomment the following:
        // this._rotation = rotation;
        // this._arrowSprite.rotation = rotation;

        this.container.sortChildren();
    }

    set isGhost(isGhost: boolean) {
        this._isGhost = isGhost;
    }

    set lastShootAt(lastShootAt: number) {
        this._lastShootAt = lastShootAt;
    }

    set lastMoveAt(lastMoveAt: number) {
        this._lastMoveAt = lastMoveAt;
    }

    // Getters
    get x(): number {
        return this.body.x;
    }

    get y(): number {
        return this.body.y;
    }

    get toX(): number {
        return this._toX;
    }

    get toY(): number {
        return this._toY;
    }

    get playerId() {
        return this._playerId;
    }

    get name() {
        return this._name;
    }

    get ability() {
        return this._ability;
    }

    get abilityIsActive() {
        return this._abilityIsActive;
    }

    get lives() {
        return this._lives;
    }

    get maxLives() {
        return this._maxLives;
    }

    get color() {
        return this._color;
    }

    get kills() {
        return this._kills;
    }

    get rotation() {
        return this._rotation;
    }

    get isGhost() {
        return this._isGhost;
    }

    get lastShootAt() {
        return this._lastShootAt;
    }

    get lastMoveAt() {
        return this._lastMoveAt;
    }

    get isAlive() {
        return this._lives > 0;
    }
}

/**
 * Return a texture depending on the number of lives and emoji.
 */
const getTexture = (lives: number): Texture[] => {
    return PlayerTextures.playerDeadTextures
    // return lives > 0 ? PlayerTextures.playerIdleTextures : PlayerTextures.playerDeadTextures;
};

/**
 * Get a direction given a rotation.
 */
function getDirection(rotation: number): Types.PlayerDirection {

    // Right = 0
    const bottom_right = Math.PI / 4;

    if (Math.abs(rotation) < bottom_right) {
        return 'right';
    }

    if (Math.abs(rotation) > 3 * bottom_right) {
        return 'left';
    }

    if (rotation < 0) {
        return 'up';
    }

    return 'down';
}