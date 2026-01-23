import {Container, Graphics, type Size} from "pixi.js";
import {IShip, ShipType} from "./IShip";

export class RedShip extends Container implements IShip {
    private _queuePosX: number = 0;

    constructor(sceneSize: Size) {
        super();
        this.initialize(sceneSize);
    }

    public getType(): ShipType {
        return ShipType.FULL;
    }

    public getCurrentPosition(): { x: number; y: number } {
        return this.position;
    }

    public setQueuePosition(x: number): void {
        this._queuePosX = x;
    }

    public getQueuePosition(): number {
        return this._queuePosX;
    }

    public getWidth(): number {
        return this.width;
    }

    public dispose(): void {
        this.destroy(true);
    }

    public process(): void {
        const ship = this.children[0] as Graphics;
        ship.fill({color: '#1099bb'});
    }

    private initialize(sceneSize: Size): void {
        const shipWeight = sceneSize.width / 20;
        const shipHeight = sceneSize.height / 20;
        const graphics = new Graphics();
        const shipRect = graphics.rect(0, 0, shipWeight, shipHeight).fill({color: '#ff0000', alpha: 1}).stroke({
            width: 4,
            color: '#ff0000'
        });
        this.position.x = sceneSize.width;
        this.position.y = sceneSize.height / 2 + sceneSize.height / 5;
        this.pivot.y = shipHeight / 2;
        this.addChild(shipRect);
    }
}