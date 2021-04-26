import { AnimatedSprite, Graphics, Sprite, Texture } from 'pixi.js';
import { Constants, Geometry } from '@tosios/common';
import { AnchorContainer } from './AnchorContainer';

export default class AbilitySprite extends AnchorContainer {
    // private _body: Geometry.RectangleBody;

    private _sprite: Sprite | AnimatedSprite;

    private _boundaries?: Graphics;

    constructor(
        anchorX: number,
        anchorY: number,
        // x: number,
        // y: number,
        width: number,
        height: number,
        rotation: number = 0,
        texture: { single?: Texture; array?: Texture[] },
    ) {
        super(anchorX, anchorY);

        // Body
        // this._body = new Geometry.RectangleBody(x, y, width, height);

        // Sprite
        if (texture.single) {
            this._sprite = new Sprite(texture.single);
        } else {
            this._sprite = new AnimatedSprite(texture.array || [], true);
            (this._sprite as AnimatedSprite).animationSpeed = 0.1;
            (this._sprite as AnimatedSprite).play();
        }

        // Add the boundaries BEFORE scaling the sprite
        if (Constants.DEBUG) {
            this._boundaries = new Graphics();
            this._boundaries.lineStyle(0.5, 0xff00ff);
            this._boundaries.drawRect(0, 0, this._sprite.width, this._sprite.height);
            this._boundaries.endFill();
            this._sprite.addChild(this._boundaries);
        }

        this._sprite.width = width;
        this._sprite.height = height;
        this._sprite.rotation = rotation;
        this.addChild(this._sprite);
        // this._sprite.position.set(x, y);
    }

    // Setters


    // Getters
    // get body() {
    //     return this._body;
    // }

    get sprite() {
        return this._sprite;
    }

}
