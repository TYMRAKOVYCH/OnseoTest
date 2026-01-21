import {Container, Graphics, type Size} from "pixi.js";

export enum ShipType {
    EMPTY,
    FULL
}

export class Ship extends Container {
    private readonly _type: ShipType;
    private _queuePosX: number = 0;

    constructor(sceneSize: Size, type: ShipType) {
        super();
        this._type = type;
        this.initialize(sceneSize);
    }

    public getType(): ShipType {
        return this._type;
    }

    public setQueuePosition(x: number) {
        this._queuePosX = x;
    }

    public getQueuePosition() {
        return this._queuePosX;
    }

    public process(): void {
        const ship = this.children[0] as Graphics;
        const color = this._type === ShipType.FULL ? '#1099bb' : '#2fff00';
        ship.fill({color: color});
    }

    private initialize(sceneSize: Size): void {
        const shipWeight = sceneSize.width / 20;
        const shipHeight = sceneSize.height / 20;
        const graphics = new Graphics();
        const color = this._type === ShipType.FULL ? '#ff0000' : '#2fff00';
        const shipRect = graphics.rect(0, 0, shipWeight, shipHeight).fill({color: color, alpha: this._type}).stroke({
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