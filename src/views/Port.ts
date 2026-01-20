import {Container, Graphics, type Size} from "pixi.js";
import {Pier} from "./Pier";

export class Port extends Container {
    private portEntryCoordinates = { x: 0, y: 0 };
    private _isLocked = false;
    private _piers: Pier[] = [];

    constructor(sceneSize: Size) {
        super();
        this.initialize(sceneSize)
    }

    private initialize(sceneSize: Size) {
        const graphics = new Graphics();

        const posX = sceneSize.width / 3;
        const posTopY = sceneSize.height / 2 - sceneSize.height / 6;
        graphics.moveTo(posX, 0);
        graphics.lineTo(posX, posTopY);

        const posBottomY = sceneSize.height / 2 + sceneSize.height / 6;
        this.portEntryCoordinates.x = posX;
        this.portEntryCoordinates.y = posTopY + (posBottomY - posTopY) / 2;

        graphics.moveTo(posX, sceneSize.height);
        graphics.lineTo(posX, posBottomY);

        graphics.stroke({
            color: '#ffc800',
            alpha: 1,
            width: 10
        });

        this.addChild(graphics);

        const pierHeight = sceneSize.height / 5;
        const pierWidth = sceneSize.height / 10;
        let pierY = pierWidth / 3;

        for (let i = 0; i < 4; i++ ) {
            const pierRect = graphics.rect(0, pierY, pierWidth, pierHeight).fill({ color: '#ffc800', alpha: 0 }).stroke({             // Applies a stroke
                width: 5,
                color: '#ffc800'
            });
            const pier = new Pier(i, pierRect);
            this._piers.push(pier)
            this.addChild(pier);
            pierY += pierHeight + pierWidth / 3;
        }
    }
}