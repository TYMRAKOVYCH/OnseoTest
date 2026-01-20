import {Container, Graphics, type Size, Ticker, TickerPlugin} from "pixi.js";
import {Tween} from "@tweenjs/tween.js";

export enum ShipState   {
    INACTIVE,
    IN_PROGRESS,
    LEAVE
}

export enum ShipType  {
    EMPTY,
    FULL
}

export class Ship extends Container {
    private _state: ShipState;
    private _type : ShipType;

    constructor(sceneSize: Size, type: ShipType) {
        super();
        this._type = type;
        this._state = ShipState.INACTIVE;
        this.initialize(sceneSize);
    }

    private initialize(sceneSize: Size): void {
        const shipWeight = sceneSize.width / 20;
        const shipHeight = sceneSize.height / 20;
        const offset = sceneSize.height / 5;
        const posX = sceneSize.width / 2;
        const posY = this._type === ShipType.FULL ? sceneSize.height / 2 + offset : sceneSize.height / 2 - offset;
        const graphics = new Graphics();
        const color = this._type === ShipType.FULL ? '#ff0000' : '#2fff00';
        const shipRect = graphics.rect(0, 0, shipWeight, shipHeight).fill({ color: color, alpha: this._state }).stroke({
            width: 4,
            color: color
        });
        this.position.x = posX;
        this.position.y = posY;
        this.pivot.y = shipHeight / 2;
        shipRect.pivot.y = shipHeight / 2;
        this.addChild(shipRect);
    }
}