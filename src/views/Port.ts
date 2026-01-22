import {Container, Graphics, type Size} from "pixi.js";
import {Pier, PierState, PierType} from "./Pier";
import {ShipType} from "./Ship";

export class Port extends Container {
    private _portEntryCoordinates = {x: 0, y: 0};
    private _isLocked = false;
    private _piers: Pier[] = [];

    constructor(sceneSize: Size) {
        super();
        this.initialize(sceneSize)
    }

    public getAvailablePier(shipType: ShipType): Pier | undefined {
        const pierType = shipType === ShipType.FULL ? PierType.EMPTY : PierType.FULL;
        const availablePorts = this._piers.filter((pier) => {
            return pier.getPierState() === PierState.AVAILABLE && pier.getPierType() === pierType;
        });
        if (availablePorts.length) {
            return availablePorts[Math.floor((Math.random() * availablePorts.length))];
        }
        return undefined;
    }

    public isEntranceLocked(): boolean {
        return this._isLocked;
    }

    public lockEntrance(): void {
        this._isLocked = true;
    }

    public lockPier(pier: Pier) {
        pier.setPierState(PierState.IN_PROGRESS)
    }

    public ulockPier(pier: Pier) {
        pier.setPierState(PierState.AVAILABLE);
        pier.changePierType();
    }

    public unlockEntrance(): void {
        this._isLocked = false;
    }

    public getEntrancePosition(): { x: number, y: number } {
        return this._portEntryCoordinates;
    }

    private initialize(sceneSize: Size) {
        this.initPortEntrance(sceneSize);

        const pierHeight = sceneSize.height / 5;
        const pierWidth = sceneSize.height / 10;
        let pierY = pierWidth / 3;
        for (let i = 0; i < 4; i++) {
            const pier = new Pier(pierWidth, pierHeight);
            pier.position.y = pierY;
            this._piers.push(pier)
            this.addChild(pier);
            pierY += pierHeight + pierWidth / 3;
        }
    }

    private initPortEntrance(sceneSize: Size): void {
        const graphics = new Graphics();
        const posX = sceneSize.width / 3;
        const posTopY = sceneSize.height / 2 - sceneSize.height / 6;
        graphics.moveTo(posX, 0);
        graphics.lineTo(posX, posTopY);

        const posBottomY = sceneSize.height / 2 + sceneSize.height / 6;
        this._portEntryCoordinates.x = posX;
        this._portEntryCoordinates.y = posTopY + (posBottomY - posTopY) / 2;

        graphics.moveTo(posX, sceneSize.height);
        graphics.lineTo(posX, posBottomY);
        graphics.stroke({
            color: '#ffc800',
            alpha: 1,
            width: 10
        });
        this.addChild(graphics);
    }
}