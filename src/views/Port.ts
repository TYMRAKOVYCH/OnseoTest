import {Container, Graphics, type Size} from "pixi.js";
import {Pier} from "./Pier";

export class Port extends Container {
    private portEntryCoordinates = { x: 0, topY: 0, bottomY: 0 };
    private piers: Graphics[] = [];

    constructor(sceneSize: Size) {
        super();
        this.initialize(sceneSize)
    }

    private initialize(sceneSize: Size) {
        const graphics = new Graphics();

        const posX = sceneSize.width / 3;
        this.portEntryCoordinates.x = posX;

        const posTopY = sceneSize.height / 2 - sceneSize.height / 6;
        this.portEntryCoordinates.topY = posTopY;

        graphics.moveTo(posX, 0);
        graphics.lineTo(posX, posTopY);

        const posBottomY = sceneSize.height / 2 + sceneSize.height / 6;
        this.portEntryCoordinates.topY = posBottomY;

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
            const pierRect = graphics.rect(0, pierY, pierWidth, pierHeight).fill({ color: '#ffc800', alpha: 1 }).stroke({             // Applies a stroke
                width: 3,
                color: '#ff0000'
            });
            const pier = new Pier(pierRect);
            this.addChild(pier);
            pierY += pierHeight + pierWidth / 3;
        }
    }
}