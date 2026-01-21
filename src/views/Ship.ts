import {Container, Graphics, type Size, Ticker, TickerPlugin} from "pixi.js";
import {Tween} from "@tweenjs/tween.js";
import type {Pier} from "./Pier";

export enum ShipState   {
    INACTIVE,
    WAIT_ENTER,
    IN_PROGRESS,
    WAIT_EXIT
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

    public getType(): ShipType{
        return this._type;
    }

    public getState(): ShipState{
        return this._state;
    }

    public setState(state: ShipState): void{
        this._state = state;
    }

    public process(): void {
        const ship = this.children[0] as Graphics;
        const color = this._type === ShipType.FULL ? '#1099bb' : '#2fff00';
        ship.fill( { color: color });
    }

    private initialize(sceneSize: Size): void {
        const shipWeight = sceneSize.width / 20;
        const shipHeight = sceneSize.height / 20;
        const graphics = new Graphics();
        const color = this._type === ShipType.FULL ? '#ff0000' : '#2fff00';
        const shipRect = graphics.rect(0, 0, shipWeight, shipHeight).fill({ color: color, alpha: this._type }).stroke({
            width: 4,
            color: color
        });
        this.position.x = sceneSize.width;
        const offset = sceneSize.height / 5;
        this.position.y = this._type === ShipType.FULL ? sceneSize.height / 2 + offset : sceneSize.height / 2 - offset;
        this.pivot.y = shipHeight / 2;
        this.addChild(shipRect);
    }
}